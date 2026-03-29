"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type EmailFieldProps = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  "aria-label"?: string;
  shakeKey?: number;
};

export function EmailField({
  id,
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  loading,
  "aria-label": ariaLabel,
  shakeKey = 0
}: EmailFieldProps) {
  const reduce = useReducedMotion();
  const [showErrorStyle, setShowErrorStyle] = useState(false);

  useEffect(() => {
    if (shakeKey <= 0) return;
    setShowErrorStyle(true);
    const t = window.setTimeout(() => setShowErrorStyle(false), 1800);
    return () => window.clearTimeout(t);
  }, [shakeKey]);

  const triggerErrorStyle = useCallback(() => {
    setShowErrorStyle(true);
    window.setTimeout(() => setShowErrorStyle(false), 1800);
  }, []);

  const handleInvalid = useCallback(() => {
    triggerErrorStyle();
  }, [triggerErrorStyle]);

  return (
    <motion.div
      animate={
        reduce || !showErrorStyle
          ? undefined
          : { x: [0, -8, 8, -8, 8, 0] }
      }
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`flex max-w-md items-center gap-0 rounded-full border border-line bg-surface py-1 pl-5 pr-1 transition-shadow duration-300 ease-sage focus-within:border-line-active focus-within:ring-[3px] focus-within:ring-sage-soft ${
        showErrorStyle ? "shadow-[inset_0_0_0_2px_rgba(155,138,122,0.4)]" : ""
      }`}
    >
      <input
        id={id}
        type="email"
        autoComplete="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent py-3 pr-2 text-[15px] font-light text-dust placeholder:text-dust-ghost outline-none disabled:opacity-60"
      />
      <button
        type="button"
        onClick={() => {
          if (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            handleInvalid();
            return;
          }
          onSubmit();
        }}
        disabled={disabled || loading}
        aria-label="Submit email"
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-sage transition-all duration-300 ease-sage hover:bg-sage-soft disabled:opacity-50 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-sage hover:[&_svg]:translate-x-0.5"
      >
        {loading ? (
          <motion.svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            animate={reduce ? undefined : { rotate: 360 }}
            transition={
              reduce
                ? undefined
                : { repeat: Infinity, duration: 0.85, ease: "linear" }
            }
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width={22}
            height={22}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>
    </motion.div>
  );
}
