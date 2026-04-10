import FlowFieldCanvas from "@/components/FlowFieldCanvas";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { WaitlistCTA } from "@/components/WaitlistCTA";

export default function Home() {
  return (
    <>
      <FlowFieldCanvas />
      <GrainOverlay />
      <Nav />
      <main className="relative z-[1] pt-[68px]">
        <Hero />
        <div className="mx-auto h-px w-full max-w-container bg-surface-border my-[clamp(32px,5vh,80px)] opacity-50" aria-hidden />
        <WaitlistCTA />
        <div className="mx-auto h-px w-full max-w-container bg-surface-border my-[clamp(32px,5vh,80px)] opacity-50" aria-hidden />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
