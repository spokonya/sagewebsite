# Sage Landing Page — Build Spec for Cursor

This spec tells you what to build, how to build it, and what to prioritize. Read `sage-design-tokens.md` for every visual decision (colors, fonts, spacing, components). Read the reference HTML file (`sage-landing-reference.html`) as a visual guide — it's the working prototype.

---

## Overview

Build a production-ready landing page for **Sage**, a voice-first second brain iOS app. The page has three sections (hero with iPhone mockup, waitlist CTA, contact form) and needs to feel premium, immersive, and alive. The static HTML prototype works but needs real interactivity, proper animations, a backend for the waitlist, and production infrastructure.

---

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14+ (App Router)** | SSR, API routes for waitlist, deploys to Vercel in one click |
| Styling | **Tailwind CSS** | Utility-first, matches token-driven design, fast iteration |
| Animation | **Framer Motion** | Scroll-linked animations, spring physics, orchestrated reveals, page load sequences |
| Canvas | **HTML Canvas API** (or optionally **Three.js** for a 3D graph) | Constellation background |
| Forms/Backend | **Supabase** (waitlist table) + **Resend** (confirmation email) | Simple, free tier covers MVP |
| Analytics | **Vercel Analytics** or **PostHog** | Track waitlist conversion |
| Deployment | **Vercel** | Zero-config for Next.js |
| Domain | Connect `sage.app` or whatever domain Ari has | — |

---

## Project structure

```
sage-landing/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Main page component
│   ├── api/
│   │   ├── waitlist/
│   │   │   └── route.ts    # POST: insert email into Supabase
│   │   └── contact/
│   │       └── route.ts    # POST: insert contact + send via Resend
│   └── globals.css         # Tailwind + CSS custom properties from tokens
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── PhoneMockup.tsx     # iPhone with rotating screens
│   ├── WaitlistCTA.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   ├── ConstellationCanvas.tsx  # Background animation
│   ├── GrainOverlay.tsx
│   ├── EmailField.tsx      # Reusable arrow-submit input
│   └── RevealOnScroll.tsx  # Framer Motion scroll wrapper
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── tokens.ts           # Design tokens as TS constants (optional)
├── public/
│   ├── og-image.png        # Open Graph image (1200x630)
│   └── favicon.ico
├── sage-design-tokens.md   # Design source of truth
├── sage-landing-reference.html  # Visual reference prototype
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## What to build (by priority)

### P0 — Ship it (matches current prototype)

1. **Three-section layout** exactly matching the prototype structure and design tokens
2. **iPhone mockup** with 4 rotating screens (Record, Notes, Chat, Graph) auto-advancing every 3.5s with clickable dots
3. **Waitlist email capture** (both CTA section and contact form) — POST to `/api/waitlist`, insert into Supabase `waitlist` table (columns: `id`, `email`, `name`, `message`, `created_at`)
4. **Constellation canvas** background — port the JS from the prototype
5. **Film grain overlay**
6. **Responsive** at 900px and 500px breakpoints
7. **SEO**: meta title, description, OG image, favicon
8. **Deploy to Vercel**

### P1 — Level up (what makes it feel premium)

9. **Framer Motion page load orchestration**: hero left content staggers in (badge → h1 → body → button, 100ms apart), phone floats up with spring physics (`type: "spring", stiffness: 100, damping: 20`), all using `AnimatePresence` and `motion.div`
10. **Scroll-linked phone parallax**: as user scrolls past hero, the phone subtly floats upward at 0.3x scroll speed using `useScroll` + `useTransform`
11. **Scroll-triggered section reveals**: sections 2 and 3 use `whileInView` with staggered children — much cleaner than the manual scroll listener in the prototype
12. **Smooth screen transitions in phone**: instead of opacity swap, use Framer Motion `AnimatePresence` with `mode="wait"` for crossfade + subtle scale
13. **Confirmation email**: after waitlist signup, trigger a Resend email with a branded "You're in" message
14. **Form validation**: inline error states using the dusk color, shake animation on invalid submit
15. **Loading states**: button shows a small spinner SVG during API call, disables double-submit

### P2 — Wow factor (if time permits)

16. **Interactive constellation**: nodes near the cursor gently attract/repel (subtle mouse influence on velocity), making the background feel alive and responsive
17. **3D knowledge graph in phone**: replace the static CSS graph mockup screen with a tiny Three.js force-directed graph rendered in a canvas inside the phone — nodes float and pulse
18. **Lottie animations in phone screens**: replace CSS waveform with a Lottie audio visualizer, replace static chat bubbles with a typing indicator animation
19. **Magnetic button effect**: CTA buttons have a subtle magnetic pull toward cursor on hover (10px max displacement, spring back)
20. **Page transition**: if you later add a /blog or /about, use Framer Motion layout animations for route transitions
21. **Dark/light mode**: the current palette is dark-only, but you could add a cream/warm-white light mode as a toggle (low priority)

---

## Supabase setup

### Table: `waitlist`

```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  message text,
  source text default 'landing',  -- 'cta' or 'contact'
  created_at timestamptz default now()
);

-- Enable RLS
alter table waitlist enable row level security;

-- Only allow inserts from anon (public)
create policy "Allow public inserts" on waitlist
  for insert with check (true);

-- No public reads
create policy "No public reads" on waitlist
  for select using (false);
```

### API route: `/api/waitlist/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { email, name, message, source } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { error } = await supabase
    .from('waitlist')
    .upsert({ email, name, message, source }, { onConflict: 'email' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // TODO: trigger Resend confirmation email here

  return NextResponse.json({ success: true })
}
```

---

## Framer Motion patterns

### RevealOnScroll wrapper

```tsx
'use client'
import { motion } from 'framer-motion'

export function RevealOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
```

### Hero stagger

```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

// Usage:
<motion.div variants={container} initial="hidden" animate="show">
  <motion.div variants={item}>{/* badge */}</motion.div>
  <motion.div variants={item}>{/* h1 */}</motion.div>
  <motion.div variants={item}>{/* body */}</motion.div>
  <motion.div variants={item}>{/* button */}</motion.div>
</motion.div>
```

### Phone parallax

```tsx
const { scrollYProgress } = useScroll()
const phoneY = useTransform(scrollYProgress, [0, 0.3], [0, -60])

<motion.div style={{ y: phoneY }}>
  <PhoneMockup />
</motion.div>
```

---

## Tailwind config

Extend the default config with the design tokens:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#1E1D1A', raised: '#262523' },
        sage: { DEFAULT: '#94A87E', soft: 'rgba(148,168,126,0.10)', glow: 'rgba(148,168,126,0.25)' },
        dusk: { DEFAULT: '#9B8A7A', soft: 'rgba(155,138,122,0.10)' },
        dust: '#D6D6D6',
      },
      fontFamily: {
        display: ['Bagnard Sans', 'serif'],
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        sm: '12px',
        md: '20px',
        lg: '28px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Metadata

```tsx
// app/layout.tsx
export const metadata = {
  title: 'Sage — Your Voice-First Second Brain',
  description: 'Speak your mind. Sage transcribes, connects, and resurfaces your ideas so the thoughts that matter never fade.',
  openGraph: {
    title: 'Sage — Your Voice-First Second Brain',
    description: 'A voice-first second brain that transcribes, connects, and resurfaces your ideas.',
    url: 'https://sage.app',
    siteName: 'Sage',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sage — Your Voice-First Second Brain',
    description: 'Speak your mind. Watch it come alive.',
    images: ['/og-image.png'],
  },
}
```

---

## Copy (final, use as-is)

### Hero
- Badge: "Coming soon on iOS"
- H1: "Speak your mind." / "*Watch it come alive.*" (italic in dusk)
- Body: "A voice-first second brain that transcribes, connects, and resurfaces your ideas — so the thoughts that matter never fade."
- CTA: "Join the waitlist"

### CTA Section
- H2: "Your thoughts deserve" / "a place to *breathe*" (italic in dusk)
- Body: "Join the waitlist for early access. We'll let you know the moment Sage is ready."
- Input placeholder: "Enter your email"
- Field note: "No spam, ever. Unsubscribe anytime."
- Success: "You're on the list — we'll be in touch."

### Contact Section
- H2: "Get in touch," / "*or get in line*" (italic in dusk)
- Body: "Have a question, want to collaborate, or just want to say hello? Drop us a note. Or sign up below to save your spot on the waitlist."
- Contact: hello@sage.app / Boston, MA
- Name placeholder: "Your name"
- Message placeholder: "Tell us what's on your mind..."
- Email placeholder: "you@email.com"
- Success: "Sent! We'll get back to you soon."

### Footer
- Logo: "sage"
- Right: "© 2026" / "Made in Boston"

---

## Environment variables

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
RESEND_API_KEY=
```

---

## How to use these files in Cursor

1. Create a new Next.js project: `npx create-next-app@latest sage-landing --typescript --tailwind --app`
2. Drop `sage-design-tokens.md` and this file (`sage-build-spec.md`) into the project root
3. Drop `sage-landing-reference.html` into `public/` as a visual reference
4. Open Cursor and prompt: **"Read sage-build-spec.md and sage-design-tokens.md. Build the P0 items first, then P1. Use the reference HTML in public/ as the visual target. Start with layout.tsx, globals.css, and the Tailwind config, then build each component."**
5. For each component, you can prompt specifically: **"Build the PhoneMockup component following the design tokens. Port the screen rotation logic from the reference HTML and add Framer Motion AnimatePresence for crossfade transitions."**
6. Wire up Supabase and Resend after the visual build is solid.

---

*Generated from the Sage landing page design session. All design decisions are final unless Ari says otherwise.*
