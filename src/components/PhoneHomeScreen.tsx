"use client";

import dynamic from "next/dynamic";

const BrainVisualization = dynamic(
  () =>
    import("@/components/BrainVisualization").then((m) => ({
      default: m.BrainVisualization,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full bg-black"
        aria-hidden
      />
    ),
  }
);

const SF =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", system-ui, sans-serif';

const secondary = "rgba(235, 235, 245, 0.6)";

function TabBar() {
  return (
    <div
      className="flex h-[43px] shrink-0 border-t border-white/[0.08] bg-black px-1"
      style={{ fontFamily: SF }}
    >
      <div className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-[10px]">
        <svg
          className="h-[22px] w-[22px] text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span className="text-[10px] font-semibold leading-none text-white/[0.95]">
          Home
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-[10px]">
        <svg
          className="h-[22px] w-[22px] text-white/35"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
        <span className="text-[10px] leading-none text-white/35">Notes</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-[10px]">
        <svg
          className="h-[22px] w-[22px] text-white/35"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 14H5.17L4 17.17V4h16v12z" />
        </svg>
        <span className="text-[10px] leading-none text-white/35">Chat</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-end gap-0.5 pb-[10px]">
        <svg
          className="h-[22px] w-[22px] text-white/35"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <circle cx="6" cy="6" r="2" fill="currentColor" stroke="none" />
          <circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" />
          <circle cx="18" cy="6" r="2" fill="currentColor" stroke="none" />
          <path d="M8 7l8 10M16 7L8 17" strokeDasharray="2 2" />
        </svg>
        <span className="text-[10px] leading-none text-white/35">Graph</span>
      </div>
    </div>
  );
}

function TrendingRow({
  primary,
  secondaryTitle,
  meta,
}: {
  primary: string;
  secondaryTitle: string;
  meta: string;
}) {
  return (
    <div
      className="flex w-full items-center gap-2 rounded-2xl border border-white/[0.06] px-[18px] py-4"
      style={{
        fontFamily: SF,
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="min-w-0 flex-1 text-left">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white/[0.94]">
          {primary}
        </p>
        <div className="mt-1 flex items-start gap-1.5">
          <span className="pt-0.5 text-[11px] font-bold text-white/35">↓</span>
          <p className="text-[13px] font-medium leading-snug text-white/[0.88]">
            {secondaryTitle}
          </p>
        </div>
        <p className="mt-1 text-[11px] text-white/[0.42]">{meta}</p>
      </div>
      <span className="shrink-0 text-[11px] font-semibold text-white/28">›</span>
    </div>
  );
}

function InsightCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[18px] p-4"
      style={{
        fontFamily: SF,
        background: "rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </div>
  );
}

export function PhoneHomeScreen() {
  return (
    <div
      className="flex h-full min-h-0 flex-col bg-black text-white"
      style={{ fontFamily: SF }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-5 pb-3 pt-3">
          {/* homeHeader */}
          <header className="px-4 pt-3.5">
            <h1 className="text-[22px] font-bold leading-tight text-white">Sage</h1>
            <p className="mt-0.5 text-[12px]" style={{ color: secondary }}>
              Tony Thomas brain&apos;s today
            </p>
          </header>

          {/* brainSection */}
          <section className="-mt-2 px-0">
            <div
              className="mx-auto h-[220px] w-full overflow-hidden rounded-[24px] bg-black min-[501px]:h-[260px]"
            >
              <div className="h-full w-full">
                <BrainVisualization />
              </div>
            </div>
          </section>

          {/* homeLowerSections */}
          <div className="flex flex-col gap-10 px-4 pb-6">
            {/* trendingContent */}
            <section className="flex flex-col gap-2">
              <h2 className="text-[17px] font-semibold leading-tight text-white/[0.92]">
                Trending connections
                <br />
                today
              </h2>
              <p className="text-[12px]" style={{ color: secondary }}>
                Links where at least one thought was captured today.
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <TrendingRow
                  primary="Launch narrative for the waitlist"
                  secondaryTitle="Voice notes on positioning"
                  meta="Continuation · Strong link"
                />
                <TrendingRow
                  primary="Weekly review — themes"
                  secondaryTitle="Evening reflection"
                  meta="Elaboration · Medium link"
                />
              </div>
            </section>

            {/* HomeInsightsSection */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[17px] font-semibold text-white/[0.9]">Insights</h2>
              <p className="text-[15px] leading-snug" style={{ color: secondary }}>
                A quick read on how your notes cluster, feel, and connect.
              </p>

              <div className="mt-2 flex flex-col gap-4">
                <InsightCard>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#8C7AE0]" aria-hidden>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3l2.4 7.4H22l-6 4.6 2.3 7L12 17.8 5.7 22l2.3-7-6-4.6h7.6L12 3z" />
                        </svg>
                      </span>
                      <span className="text-[15px] font-semibold text-white/[0.92]">
                        Theme mix
                      </span>
                    </div>
                    <span className="text-[12px]" style={{ color: secondary }}>
                      24 notes
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      ["Product", "9"],
                      ["Writing", "7"],
                      ["Health", "5"],
                    ].map(([label, count]) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="w-[100px] text-[11px] font-medium text-white/[0.8]">
                          {label}
                        </span>
                        <div className="h-1 flex-1 rounded-full bg-white/[0.08]" />
                        <span
                          className="w-6 text-right text-[11px] tabular-nums"
                          style={{ color: secondary }}
                        >
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-white/[0.45]">
                    Most capture this week clusters around product and narrative.
                  </p>
                </InsightCard>

                <InsightCard>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[#66BFD9]" aria-hidden>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                      </svg>
                    </span>
                    <span className="text-[15px] font-semibold text-white/[0.92]">
                      Emotional weather
                    </span>
                  </div>
                  <div className="flex h-16 items-end justify-center gap-2 px-2">
                    {[0.35, 0.55, 0.42, 0.7, 0.5].map((h, i) => (
                      <div
                        key={i}
                        className="w-5 rounded-t-md"
                        style={{
                          height: `${h * 100}%`,
                          background: `linear-gradient(to bottom, rgba(115,140,242,0.9), rgba(140,89,191,0.75))`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-white/[0.45]">
                    Tone leans curious with a calmer close to the week.
                  </p>
                </InsightCard>

                <InsightCard>
                  <span className="text-[15px] font-semibold text-white/[0.92]">
                    Cross-theme bridges
                  </span>
                  <p className="mt-2 text-[12px] font-semibold text-[#D4A843]">
                    3 strong bridges
                  </p>
                  <p className="mt-1 text-[12px] text-white/[0.78]">
                    Product ↔ Writing shows the highest overlap in language this
                    month.
                  </p>
                </InsightCard>

                <InsightCard>
                  <span className="text-[15px] font-semibold text-white/[0.92]">
                    Reflect
                  </span>
                  <p className="mt-2 text-[15px] italic leading-snug text-white/[0.85]">
                    What would you ship if you only had one more week?
                  </p>
                  <p className="mt-2 text-[11px] text-white/[0.45]">
                    Pulled from your latest voice note.
                  </p>
                </InsightCard>
              </div>
            </section>
          </div>
        </div>
      </div>
      <TabBar />
    </div>
  );
}
