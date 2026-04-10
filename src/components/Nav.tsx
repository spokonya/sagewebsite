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
          ? "border-b border-surface-border bg-bg/[0.92]"
          : "border-b border-transparent bg-bg/[0.4]"
      }`}
      style={{
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)"
      }}
    >
      <Link
        href="#hero"
        className="font-display text-[26px] font-normal lowercase tracking-[2px] text-text-primary focus-ring rounded-sm"
      >
        sage
      </Link>
      <div className="flex items-center gap-7">
        <Link
          href="#hero"
          className="hidden text-[13px] font-normal text-text-secondary transition-colors duration-300 hover:text-text-primary nav:inline focus-ring rounded-sm"
        >
          Home
        </Link>
        <Link
          href="#waitlist"
          className="hidden text-[13px] font-normal text-text-secondary transition-colors duration-300 hover:text-text-primary nav:inline focus-ring rounded-sm"
        >
          Waitlist
        </Link>
        <Link
          href="#contact"
          className="hidden text-[13px] font-normal text-text-secondary transition-colors duration-300 hover:text-text-primary nav:inline focus-ring rounded-sm"
        >
          Contact
        </Link>
        <Link
          href="#waitlist"
          className="btn btn-secondary px-[22px] py-[9px] text-[13px] min-w-[48px] min-h-[48px] nav:min-w-0 nav:min-h-0"
        >
          Get early access
        </Link>
      </div>
    </nav>
  );
}
