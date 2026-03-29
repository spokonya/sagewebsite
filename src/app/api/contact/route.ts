import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAnon, getSupabaseServiceRole } from "@/lib/supabase";

export async function POST(req: Request) {
  const supabase = getSupabaseServiceRole() ?? getSupabaseAnon();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 503 }
    );
  }

  let body: {
    email?: string;
    name?: string | null;
    message?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, name, message } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { error } = await supabase.from("waitlist").upsert(
    {
      email: email.trim().toLowerCase(),
      name: name ?? null,
      message: message ?? null,
      source: "contact"
    },
    { onConflict: "email" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL ?? "hello@sage.app";
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const from = process.env.RESEND_FROM ?? "Sage <onboarding@resend.dev>";
      await resend.emails.send({
        from,
        to: notifyTo,
        subject: "Sage landing — contact form",
        text: `Email: ${email}\nName: ${name ?? "—"}\nMessage: ${message ?? "—"}`
      });
    } catch {
      /* optional notification */
    }
  }

  return NextResponse.json({ success: true });
}
