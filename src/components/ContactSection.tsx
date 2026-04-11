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
      className="relative z-[1] flex scroll-mt-[88px] items-center py-[clamp(64px,10vh,120px)]"
    >
      <div className="mx-auto w-full max-w-container px-6 nav:px-10">
        <div className="grid grid-cols-1 items-center gap-[clamp(48px,8vw,80px)] nav:grid-cols-2">
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-lg"
          >
            <motion.h2
              variants={staggerItem}
              className="mb-4 font-serif text-[clamp(28px,3.5vw,44px)] font-light leading-snug text-text-primary"
            >
              Get in touch,
              <br />
              <em className="italic text-accent-secondary">or get in line</em>
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mb-10 text-[16px] font-light leading-[1.75] text-text-secondary"
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
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-dim text-accent"
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
                  className="text-[15px] font-light text-text-secondary transition-colors hover:text-text-primary focus-ring rounded-sm"
                >
                  hello@sage.app
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-dim text-accent"
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
                <span className="text-[15px] font-light text-text-secondary">
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
              className="interactive-card p-8 min-[501px]:p-10"
            >
              {success ? (
                <motion.p
                  initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.6, ease: easeSage }}
                  className="flex items-center justify-center gap-2 rounded-md border border-accent bg-accent-dim px-4 py-4 text-center text-accent"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Sent! We&apos;ll get back to you soon.
                </motion.p>
              ) : (
                <div className="flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-normal uppercase tracking-wide text-text-tertiary"
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
                      className="w-full border-b border-surface-border bg-transparent px-2 py-3 text-[15px] font-light text-text-primary placeholder:text-text-tertiary outline-none transition-colors duration-300 ease-sage focus:border-accent disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block text-xs font-normal uppercase tracking-wide text-text-tertiary"
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
                      className="w-full resize-y border-b border-surface-border bg-transparent px-2 py-3 text-[15px] font-light text-text-primary placeholder:text-text-tertiary outline-none transition-colors duration-300 ease-sage focus:border-accent disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email-contact"
                      className="mb-2 block text-xs font-normal uppercase tracking-wide text-text-tertiary"
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
