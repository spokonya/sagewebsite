import { NextResponse } from "next/server";
import { getSupabaseAnon, getSupabaseServiceRole } from "@/lib/supabase";

export async function POST(req: Request) {
  const supabase = getSupabaseServiceRole() ?? getSupabaseAnon();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 503 }
    );
  }

  let body: { email?: string; name?: string | null; message?: string | null; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, name, message, source } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { error } = await supabase.from("waitlist").upsert(
    {
      email: email.trim().toLowerCase(),
      name: name ?? null,
      message: message ?? null,
      source: source ?? "cta"
    },
    { onConflict: "email" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
