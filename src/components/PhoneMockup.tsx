"use client";

import { PhoneHomeScreen } from "@/components/PhoneHomeScreen";

export function PhoneMockup() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-[500px] w-[240px] overflow-hidden rounded-[38px] border-[2px] border-surface-border bg-phone-body shadow-2 min-[501px]:h-[580px] min-[501px]:w-[280px] min-[501px]:rounded-[44px]"
      >
        <div
          className="absolute left-1/2 top-0 z-10 h-8 w-[120px] -translate-x-1/2 rounded-b-[20px] bg-phone-notch"
          aria-hidden
        >
          <span
            className="absolute left-1/2 top-2.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-surface-border bg-phone-lens"
            aria-hidden
          />
        </div>
        <div className="absolute inset-[6px] overflow-hidden rounded-[32px] bg-black min-[501px]:rounded-[38px]">
          <div className="iphone-screen h-full w-full">
            <PhoneHomeScreen />
          </div>
        </div>
      </div>
    </div>
  );
}
