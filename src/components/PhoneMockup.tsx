"use client";

import { PhoneHomeScreen } from "@/components/PhoneHomeScreen";

export function PhoneMockup() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-[500px] w-[240px] overflow-hidden rounded-[38px] border-[3px] border-dust/[0.15] bg-phone-body shadow-[0_0_0_1px_rgba(214,214,214,0.04),0_40px_80px_rgba(0,0,0,0.5),0_16px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(214,214,214,0.05)] min-[501px]:h-[580px] min-[501px]:w-[280px] min-[501px]:rounded-[44px]"
      >
        <div
          className="absolute left-1/2 top-0 z-10 h-8 w-[120px] -translate-x-1/2 rounded-b-[20px] bg-phone-notch"
          aria-hidden
        >
          <span
            className="absolute left-1/2 top-2.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-dust/[0.06] bg-phone-lens"
            aria-hidden
          />
        </div>
        <div className="absolute inset-3 overflow-hidden rounded-[34px] bg-black min-[501px]:inset-3">
          <div className="iphone-screen h-full w-full">
            <PhoneHomeScreen />
          </div>
        </div>
      </div>
    </div>
  );
}
