# Sage — Design Tokens

These are the locked-in design decisions for the Sage landing page. Use these as the single source of truth. Do not deviate unless explicitly told to.

---

## Colors

### Core palette

| Token | Hex | RGB | Role |
|-------|-----|-----|------|
| `bg` | `#1E1D1A` | `30, 29, 26` | Page background (Graphite warm) |
| `bg-raised` | `#262523` | `38, 37, 35` | Cards, form containers, raised surfaces |
| `surface` | `rgba(214,214,214,0.04)` | — | Input backgrounds, subtle fills |
| `border` | `rgba(214,214,214,0.08)` | — | Default borders, dividers |
| `border-active` | `rgba(148,168,126,0.35)` | — | Focus rings, active states |

### Text

| Token | Value | Role |
|-------|-------|------|
| `text` | `#D6D6D6` | Primary text (Dust grey) |
| `text-dim` | `rgba(214,214,214,0.55)` | Body copy, secondary text |
| `text-ghost` | `rgba(214,214,214,0.25)` | Placeholders, labels, hints |

### Accent: Olive leaf (primary action color)

| Token | Value | Role |
|-------|-------|------|
| `sage` | `#94A87E` | Buttons, icons, links, active indicators |
| `sage-soft` | `rgba(148,168,126,0.10)` | Hover fills, icon backgrounds, selection bg |
| `sage-glow` | `rgba(148,168,126,0.25)` | Box shadows, focus glow |
| `sage-hover` | `#a2b68e` | Button hover state (lighter) |

### Accent: Dusk (italic emphasis)

| Token | Value | Role |
|-------|-------|------|
| `dusk` | `#9B8A7A` | Italic headline words only |
| `dusk-soft` | `rgba(155,138,122,0.10)` | Error state fills (form validation) |

### Error state

- Input error: `box-shadow: 0 0 0 2px rgba(155,138,122,0.4) inset`
- Uses dusk color family, not red

---

## Typography

### Font stack

| Role | Font | Source | Fallback |
|------|------|--------|----------|
| Logo ("sage") | Bagnard Sans | CDNFonts (`fonts.cdnfonts.com/css/bagnard-sans`) | serif |
| Headlines (h1, h2) | Cormorant Garamond | Google Fonts | serif |
| Body / UI | Outfit | Google Fonts | sans-serif |

### Scale

| Element | Font | Weight | Size | Notes |
|---------|------|--------|------|-------|
| Nav logo | Bagnard Sans | 400 | 26px | lowercase, letter-spacing: 2px |
| Hero h1 | Cormorant Garamond | 300 | clamp(40px, 5.5vw, 72px) | letter-spacing: -1px, line-height: 1.05 |
| Section h2 (CTA) | Cormorant Garamond | 300 | clamp(32px, 4.5vw, 56px) | line-height: 1.1 |
| Section h2 (Contact) | Cormorant Garamond | 300 | clamp(28px, 3.5vw, 44px) | line-height: 1.15 |
| Italic emphasis in h1/h2 | Cormorant Garamond | 300 italic | inherits | color: dusk (`#9B8A7A`) |
| Body text | Outfit | 200 | 17px (hero), 16px (sections), 15px (contact) | color: text-dim, line-height: 1.75 |
| Buttons | Outfit | 500 | 13-14px | — |
| Labels / uppercase | Outfit | 400 | 12px | letter-spacing: 1px, uppercase |
| Pill badge | Outfit | 400 | 12px | — |
| Field note | Outfit | 300 | 12px | color: text-ghost |
| Phone mock header | Cormorant Garamond | 400 | 22px | letter-spacing: 1px |
| Footer logo | Bagnard Sans | 400 | 18px | lowercase, letter-spacing: 2px, color: text-ghost |

---

## Spacing & Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 12px | Input fields, small cards |
| `radius-md` | 20px | Medium containers |
| `radius-lg` | 28px | Contact form card |
| Container max-width | 1160px | All sections |
| Container padding | 40px (desktop), 24px (mobile) | — |
| Section padding | 100px 0 (desktop), 80px 0 (mobile) | Vertical rhythm |
| Nav height | 68px | Fixed |

---

## Ambient effects

### Film grain
- SVG noise texture, fixed position, `opacity: 0.12`, covers full viewport
- Purely decorative, pointer-events: none

### Constellation canvas
- 45 floating nodes, 150px connection distance
- Three node types: sage (olive leaf), dusk, white (dust grey)
- Connections: `rgba(148,168,126, alpha)` where alpha fades with distance
- Nodes flicker using sine wave (`0.5 + 0.5 * sin(t * speed + phase)`)
- Larger nodes (r > 1.2) get a radial gradient glow
- Fixed position, covers viewport, z-index: 0

### No floating orbs in current version
- Removed for cleaner look. Can be re-added as Framer Motion animated divs if desired.

---

## Component patterns

### Buttons

**Primary (pill):**
- Background: sage, color: bg, border-radius: 100px
- Hover: translateY(-1px), box-shadow glow, background: sage-hover
- Transition: cubic-bezier(0.16, 1, 0.3, 1)

**No outline/ghost buttons in current version** — only primary pills and arrow-submit buttons.

### Email input (Claude-chat style)
- Container: border-radius 100px, 1px border, surface background
- Input: transparent bg, Outfit 15px weight 300
- Submit: 52px circle button with arrow SVG, no background
- Arrow hover: sage-soft background, arrow translates 2px right
- Focus state: border-active color + 3px sage-soft ring
- Placeholder: text-ghost

### Form card (contact section)
- Background: bg-raised, 1px border, radius-lg, 40px padding
- Labels: 12px uppercase, text-ghost, 1px letter-spacing
- Inputs: radius-sm, 1px border, surface bg, 14px 18px padding
- Email row at bottom uses same Claude-chat arrow pattern

### Success state
- Replaces form (display: none on form, show on success)
- Pill shape, sage-soft background, border-active border, sage text
- Fade-up animation

---

## iPhone mockup

### Physical frame
- Width: 280px, Height: 580px (240x500 on mobile)
- Border-radius: 44px (38px mobile)
- Border: 3px solid rgba(214,214,214,0.15)
- Body background: #111110 (significantly darker than page bg)
- Box shadow: layered (outer glow, deep shadow, inner highlight)

### Notch
- Width: 120px, Height: 32px, background: #080808
- Camera dot: 10px circle, #161514 with subtle border

### Screen
- Inset: 12px from frame edges, border-radius: 34px
- Background: #131210
- Slides are absolutely positioned, fade + scale transition

### Rotating screens (auto-advance every 3.5s)
1. **Record** — "sage" header, pulsing mic circle (2px sage border, keyframe pulse), 9-bar waveform animation, "Listening..." label
2. **Notes** — search bar, 3 note cards with line placeholders and sage tag badges
3. **Chat** — alternating user (sage-soft bg) and AI (surface bg) bubbles with sample text
4. **Graph** — 12 positioned nodes with 18 edge connections, nodes alternate sage/dusk/dim colors

### Dot indicators
- 4 dots below phone, 8px circles
- Active: sage fill + sage-glow box-shadow
- Clickable to manually switch

---

## Page structure

Three full-viewport sections with 1px dividers between them:

### Section 1: Hero
- Two-column grid (1fr 1fr), 80px gap
- Left: pill badge → h1 → body text → CTA button
- Right: iPhone mockup with rotating screens
- Staggered entrance animation (left at 0.2s, phone at 0.5s)

### Section 2: CTA Waitlist
- Centered layout
- h2 with dusk italic → body text → email field with arrow → field note
- Scroll-reveal animation

### Section 3: Contact
- Two-column grid (1fr 1fr), 80px gap
- Left: h2 with dusk italic → body text → contact details (email icon + address, location icon + city)
- Right: raised card with Name input → Message textarea → Email arrow-submit row
- Scroll-reveal animation

### Footer
- Flex row: logo left, copyright + location right
- 36px padding, text-ghost color

---

## Animations

### Page load (hero only)
- `revealUp`: opacity 0→1, translateY 20px→0
- Hero left: 0.2s delay
- Phone: 0.5s delay
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

### Scroll reveal (sections 2 & 3)
- Elements start at opacity: 0, translateY: 24px
- Trigger: element top enters viewport (bounding rect check)
- Stagger: 80ms between siblings
- Easing: cubic-bezier(0.16, 1, 0.3, 1), 0.8s duration

### Micro-interactions
- Buttons: translateY(-1px) + box-shadow on hover
- Arrow buttons: background fill + arrow translateX(2px) on hover
- Phone screen dots: fill + glow transition on active
- Pill badge dot: blink animation (opacity 1→0.3→1, 2.5s)
- Mic circle: pulsing box-shadow ring (2s)
- Waveform bars: staggered height animation (1.2s, 9 bars)

### Nav
- Background opacity transition on scroll (0.4 → 0.92)
- Border appears on scroll

---

## Responsive breakpoints

| Breakpoint | Changes |
|------------|---------|
| ≤ 900px | Hero/contact grids → single column, nav links hidden, container padding 24px |
| ≤ 500px | Phone shrinks to 240x500, section padding 80px, min-height auto |
