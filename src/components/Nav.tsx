"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[100] flex h-[68px] items-center justify-between px-6 transition-[background-color,border-color] duration-[400ms] ease-sage nav:px-10 ${
        scrolled
          ? "border-b border-line bg-bg/[0.92]"
          : "border-b border-transparent bg-bg/[0.4]"
      }`}
      style={{
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)"
      }}
    >
      <Link
        href="#hero"
        className="font-display text-[26px] font-normal lowercase tracking-[2px] text-dust"
      >
        sage
      </Link>
      <div className="flex items-center gap-7">
        <Link
          href="#hero"
          className="hidden text-[13px] font-normal text-dust-dim transition-colors duration-300 hover:text-dust nav:inline"
        >
          Home
        </Link>
        <Link
          href="#waitlist"
          className="hidden text-[13px] font-normal text-dust-dim transition-colors duration-300 hover:text-dust nav:inline"
        >
          Waitlist
        </Link>
        <Link
          href="#contact"
          className="hidden text-[13px] font-normal text-dust-dim transition-colors duration-300 hover:text-dust nav:inline"
        >
          Contact
        </Link>
        <Link
          href="#waitlist"
          className="rounded-full bg-sage px-[22px] py-[9px] text-[13px] font-medium text-bg shadow-none transition-all duration-300 ease-sage hover:-translate-y-px hover:bg-sage-hover hover:shadow-[0_6px_24px_rgba(148,168,126,0.25)]"
        >
          Get early access
        </Link>
      </div>
    </nav>
  );
}
