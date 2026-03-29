"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PhoneMockup } from "@/components/PhoneMockup";

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const phoneY = useTransform(scrollY, (y) => (reduce ? 0 : -y * 0.3));

  const container = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduce ? 0 : 0.1,
          delayChildren: reduce ? 0 : 0.2
        }
      }
    }),
    [reduce]
  );

  const item = useMemo(
    () => ({
      hidden: reduce
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduce ? 0 : 0.8,
          ease: [0.16, 1, 0.3, 1] as const
        }
      }
    }),
    [reduce]
  );

  return (
    <section
      id="hero"
      className="relative z-[1] flex min-h-screen max-[500px]:min-h-0 scroll-mt-[88px] items-center py-20 max-[500px]:py-[80px] min-[501px]:py-[100px]"
    >
      <div className="mx-auto w-full max-w-container px-6 nav:px-10">
        <div className="grid grid-cols-1 items-center gap-12 nav:grid-cols-2 nav:gap-20">
          <motion.div
            className="max-w-xl"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={item}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-2 pr-3.5 text-xs font-normal text-dust-dim"
            >
              <span
                className="tag-dot-blink h-1.5 w-1.5 rounded-full bg-sage shadow-[0_0_6px_rgba(148,168,126,0.25)]"
                aria-hidden
              />
              Coming soon on iOS
            </motion.div>
            <motion.h1
              variants={item}
              className="font-serif text-[clamp(40px,5.5vw,72px)] font-light leading-[1.05] tracking-[-1px] text-dust"
            >
              Speak your mind.
              <br />
              <em className="font-light italic text-dusk">Watch it come alive.</em>
            </motion.h1>
            <motion.p
              variants={item}
              className="mb-9 mt-6 max-w-[420px] text-[17px] font-light leading-[1.75] text-dust-dim"
            >
              A voice-first second brain that transcribes, connects, and
              resurfaces your ideas — so the thoughts that matter never fade.
            </motion.p>
            <motion.div variants={item}>
              <Link
                href="#waitlist"
                className="inline-block rounded-full bg-sage px-8 py-3 text-sm font-medium text-bg transition-all duration-300 ease-sage hover:-translate-y-px hover:bg-sage-hover hover:shadow-[0_6px_24px_rgba(148,168,126,0.25)]"
              >
                Join the waitlist
              </Link>
            </motion.div>
          </motion.div>

          <div className="flex justify-center nav:justify-end">
            <motion.div style={{ y: phoneY }} className="will-change-transform">
              <motion.div
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 100, damping: 20 }
                }
              >
                <PhoneMockup />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
