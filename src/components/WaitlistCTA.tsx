"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EmailField } from "@/components/EmailField";

const easeSage = [0.16, 1, 0.3, 1] as const;

export function WaitlistCTA() {
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
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  async function submit() {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setShakeKey((k) => k + 1);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source: "cta" })
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
      id="waitlist"
      className="relative z-[1] flex scroll-mt-[88px] items-center justify-center py-[clamp(64px,10vh,120px)] text-center"
    >
      <div className="mx-auto w-full max-w-container px-6 nav:px-10">
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center"
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.h2
            variants={staggerItem}
            className="mb-4 font-serif text-[clamp(32px,4.5vw,56px)] font-light leading-tight tracking-[-0.5px] text-text-primary"
          >
            Your thoughts deserve
            <br />
            a place to{" "}
            <em className="italic text-accent-secondary">breathe</em>
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="mb-10 max-w-lg text-[16px] font-light leading-[1.75] text-text-secondary"
          >
            Join the waitlist for early access. We&apos;ll let you know the
            moment Sage is ready.
          </motion.p>
          <motion.div
            variants={staggerItem}
            className="flex w-full flex-col items-center gap-3"
          >
            {success ? (
              <motion.div
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0 : 0.6, ease: easeSage }}
                className="flex items-center gap-3 rounded-full border border-accent bg-accent-dim px-8 py-4 text-accent"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                You&apos;re on the list — we&apos;ll be in touch.
              </motion.div>
            ) : (
              <>
                <EmailField
                  id="email-cta"
                  value={email}
                  onChange={setEmail}
                  onSubmit={submit}
                  placeholder="Enter your email"
                  disabled={loading}
                  loading={loading}
                  shakeKey={shakeKey}
                />
                {loading && (
                  <span className="sr-only" aria-live="polite">
                    Submitting
                  </span>
                )}
              </>
            )}
            <p className="mt-2 text-[13px] font-light text-text-tertiary">
              No spam, ever. Unsubscribe anytime.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
