"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EmailField } from "@/components/EmailField";

const easeSage = [0.16, 1, 0.3, 1] as const;

export function ContactSection() {
  const reduce = useReducedMotion();

  const staggerParent = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduce ? 0 : 0.08,
          delayChildren: 0
        }
      }
    }),
    [reduce]
  );

  const staggerItem = useMemo(
    () => ({
      hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0 : 0.8, ease: easeSage }
      }
    }),
    [reduce]
  );
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  async function submitContact() {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setShakeKey((k) => k + 1);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          name: name.trim() || null,
          message: message.trim() || null
        })
      });
      if (!res.ok) {
        setShakeKey((k) => k + 1);
        return;
      }
      setSuccess(true);
    } catch {
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="relative z-[1] flex min-h-screen max-[500px]:min-h-0 scroll-mt-[88px] items-center py-20 max-[500px]:py-[80px] min-[501px]:py-[100px]"
    >
      <div className="mx-auto w-full max-w-container px-6 nav:px-10">
        <div className="grid grid-cols-1 gap-12 nav:grid-cols-2 nav:gap-20">
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-lg"
          >
            <motion.h2
              variants={staggerItem}
              className="mb-4 font-serif text-[clamp(28px,3.5vw,44px)] font-light leading-snug text-dust"
            >
              Get in touch,
              <br />
              <em className="italic text-dusk">or get in line</em>
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mb-10 text-[15px] font-light leading-[1.75] text-dust-dim"
            >
              Have a question, want to collaborate, or just want to say hello?
              Drop us a note. Or sign up below to save your spot on the
              waitlist.
            </motion.p>
            <motion.div
              variants={staggerItem}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={20}
                    height={20}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <Link
                  href="mailto:hello@sage.app"
                  className="text-[15px] font-light text-dust-dim transition-colors hover:text-dust"
                >
                  hello@sage.app
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={20}
                    height={20}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-[15px] font-light text-dust-dim">
                  Boston, MA
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.div
              variants={staggerItem}
              className="rounded-lg border border-line bg-bg-raised p-8 min-[501px]:p-10"
            >
              {success ? (
                <motion.p
                  initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: easeSage }}
                  className="rounded-sm border border-line-active bg-sage-soft px-4 py-4 text-center text-sage"
                >
                  Sent! We&apos;ll get back to you soon.
                </motion.p>
              ) : (
                <div className="flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-normal uppercase tracking-wide text-dust-ghost"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      disabled={loading}
                      className="w-full rounded-sm border border-line bg-surface px-[18px] py-3.5 text-sm font-light text-dust placeholder:text-dust-ghost outline-none transition-shadow duration-300 ease-sage focus:border-line-active focus:ring-[3px] focus:ring-sage-soft disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block text-xs font-normal uppercase tracking-wide text-dust-ghost"
                    >
                      Message (optional)
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind..."
                      disabled={loading}
                      rows={4}
                      className="w-full resize-y rounded-sm border border-line bg-surface px-[18px] py-3.5 text-sm font-light text-dust placeholder:text-dust-ghost outline-none transition-shadow duration-300 ease-sage focus:border-line-active focus:ring-[3px] focus:ring-sage-soft disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email-contact"
                      className="mb-2 block text-xs font-normal uppercase tracking-wide text-dust-ghost"
                    >
                      Email
                    </label>
                    <EmailField
                      id="email-contact"
                      value={email}
                      onChange={setEmail}
                      onSubmit={submitContact}
                      placeholder="you@email.com"
                      disabled={loading}
                      loading={loading}
                      shakeKey={shakeKey}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
