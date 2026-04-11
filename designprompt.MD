## Your Role
 
You are a senior product designer and frontend engineer tasked with overhauling the visual design of every component on the Sage landing page. You have deep expertise in typography systems, spacing rhythm, color theory, accessibility standards (WCAG 2.2 AA), conversion-optimized component design, and the psychology of how visual design choices signal brand personality to target users.
 
Your redesign philosophy: **evocative over prescriptive.** Every component should feel intentionally crafted for Sage's specific audience and brand — not like a generic template with colors swapped in. You are designing for emotional resonance, not just visual correctness.
 
---
 
## Product Context
 
**Sage** is a voice-first iOS app — a second brain that transcribes spoken notes and weaves them into a living knowledge graph with AI chat. The core insight: raw thoughts are best communicated verbally, when you don't worry about making them sound pretty.
 
**Target users:** Reflective thinkers, journalers, creative professionals, students, and self-improvement enthusiasts (ages 18–35) who capture ideas on the go and want to see patterns in their thinking over time. They value authenticity, clarity, and tools that feel personal rather than corporate. They're comfortable with technology but not necessarily developers — think someone who uses Notion, Obsidian, or Arc Browser and appreciates when a product feels "designed with taste."
 
**Brand personality:** Warm but sharp. Intimate but intelligent. Like a late-night conversation with someone who really listens. Not clinical, not playful — thoughtful. The visual language should feel like a quality leather journal meets a constellation map.
 
---
 
## What You're Working With (DO NOT CHANGE)
 
These elements are locked — do not redesign, restyle, or replace them:
 
1. **The background animation** — the constellation/node canvas (floating nodes with connecting lines). Keep it exactly as-is. Your component designs must look good layered on top of it.
2. **The iPhone mockup in the hero section** — the phone frame, rotating screens, dot indicators. Do not touch the phone component itself.
3. **The overall page structure/layout** — the site has these sections in this order: Nav → Hero (two-column: copy left, phone right) → CTA Waitlist (centered) → Contact Form (two-column: copy left, form card right) → Footer. Section dividers between them. Keep this structure. You're redesigning the visual treatment of every component WITHIN this structure.
 
---
 
## What You ARE Redesigning
 
Everything else. Specifically:
 
### Typography System
Pick new fonts. The current ones may or may not be working — evaluate and replace. Follow these rules:
- Choose a distinctive serif or display font for headings that evokes "wisdom, warmth, organic intelligence" — not generic startup energy. Consider fonts like Cormorant Garamond, Lora, Playfair Display, Source Serif 4, or Literata. Avoid anything that looks like a YC pitch deck.
- Choose a clean, readable sans-serif for body text with personality. Consider DM Sans, Outfit, Satoshi, General Sans, or Plus Jakarta Sans. Avoid Inter, Roboto, Arial.
- Establish a clear type scale using a ~1.25 ratio: define specific sizes for hero headline, section headlines, subheadings, body, small/caption text, and button labels.
- Use extreme weight contrast for hierarchy — pair 200/300 weights with 700/800, not 400 vs 600. Use at most 2 of the 3 hierarchy levers (size, weight, color) per element.
- Line heights: 1.1–1.3 for headings, 1.5 for body, 1.6–1.7 for small text. Line length maxes at 65 characters for body copy.
 
### Color System
Design a complete semantic color system as CSS custom properties. You can change everything — the current palette uses dark umber (#231F17 background area), dust grey (#D6D6D6 text), dry sage (#A6B58C accents), warm clay (#B5967A secondary accent). You may keep, evolve, or completely rethink this. Whatever you choose:
- Define tokens for: `--bg`, `--surface`, `--surface-raised`, `--surface-border`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--accent`, `--accent-dim`, `--accent-glow`, `--accent-secondary`, `--success`, `--error`
- Text on dark backgrounds: use off-white with warm/cool tint (never pure #FFFFFF — it causes halation). Primary text at 90–95% opacity feel, secondary at 45–55%, tertiary at 20–30%.
- Accent color must hit minimum 3:1 contrast against background for UI elements and 4.5:1 when used as text.
- Derive hover/active/focus states systematically: hover = +5–10% lightness, active = +10–15%, focus = 2px outline with 3:1 contrast ratio.
- No pure grays — add subtle warm or cool tint to all neutrals to match the overall mood.
 
### Component Designs
 
Redesign every component with these shared rules, then apply per-component specs:
 
**Shared rules:**
- All spacing on 8px grid (4px for fine detail). Internal padding ≤ external margins.
- Border radius: pick a single `--radius` value (8–16px) and derive a scale: `--radius-sm` (half), `--radius-md` (base), `--radius-lg` (1.5x), `--radius-full` (pill/9999px).
- Shadows: two-part construction (tight dark + soft diffuse), hue-tinted to match background, never opaque gray. Define 3 elevation levels.
- Transitions: 200–300ms ease for hover/focus, 400–600ms ease-out for scroll reveals.
- Every interactive element needs 5 states: default, hover, active, focus-visible, disabled.
 
**Nav bar:**
- Sticky with backdrop blur. Border-bottom appears after scroll.
- Logo left, navigation links center or right, CTA button right.
- CTA button in nav should be secondary style (outline or ghost) — not competing with hero CTA.
- Minimum 48px touch target for all nav items on mobile.
 
**Hero section (left column only — don't touch phone):**
- Pill badge ("Coming soon on iOS") — small, muted, rounded-full, subtle border or dim background.
- Headline — your display font, largest on the page. Italic treatment on the second line in a secondary/accent color.
- Body paragraph — secondary text color, generous line height, max 55ch width.
- Primary CTA button — this is the single most prominent interactive element on the page. Solid fill with accent color, pill shape, minimum 48px height, horizontal padding 2.5–3x vertical. Subtle hover lift (translateY -2px + shadow elevation increase). Consider a small arrow icon after the label — this has been shown to increase clicks ~26%.
 
**CTA Waitlist section (centered):**
- Section headline — serif, slightly smaller than hero headline, with italic accent word in secondary color.
- Email input with arrow submit button — pill container with the input on the left and a circular arrow button on the right (inspired by Claude's chat input). Input should have no visible border until focus. Arrow button is accent-colored, 40–44px circle. The whole container has a subtle border and surface-raised background.
- Field note below input — tiny, tertiary text color.
- Success state — swap input for a confirmation message with a subtle check icon. Use a smooth crossfade transition (300ms).
 
**Contact form section:**
- Left column: section headline (serif + italic accent), body text, contact details as icon+text pairs with subtle icon badges.
- Right column: raised card (surface-raised background, 1px border, shadow level 2, radius-lg) containing:
  - Name input — full width, minimal styling (bottom border only or very subtle container), clear label.
  - Message textarea — same style, taller.
  - Email + arrow submit row at bottom — same Claude-chat-input pattern as waitlist section.
  - All inputs: 48px minimum height, visible focus ring (2px, accent color, 3:1 contrast), placeholder text in tertiary color. Labels associated via `<label>` elements.
  - Error states: `aria-invalid="true"`, red-tinted border, error message with `aria-describedby`.
 
**Section dividers:**
- Thin horizontal line (1px) in surface-border color, with generous vertical margin (64–96px above and below).
 
**Footer:**
- Minimal. Logo, copyright, maybe 2–3 links. Tertiary text color. Don't over-design it.
 
### Micro-interactions & Motion
- Page load: stagger-reveal the hero content (badge then headline then body then CTA, each 100ms delayed) and the phone slides/fades in from the right.
- Scroll reveals: each section fades up (translateY 30px to 0, opacity 0 to 1) when it enters the viewport. Use `IntersectionObserver` or Framer Motion `whileInView`.
- Button hovers: slight lift + shadow increase + subtle background shift.
- Input focus: border color transitions to accent, subtle glow ring appears.
- Form submission: button shows a brief loading spinner, then transitions to success state.
 
### Accessibility Checklist (non-negotiable)
- All text meets WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text and UI components).
- All interactive elements have visible `:focus-visible` styles (never `outline: none` without replacement).
- Minimum 44x44px touch targets on all buttons and links.
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<label>`, `<input>`. No ARIA when native HTML works.
- Form inputs have associated `<label>` elements.
- Reduced motion: wrap all animations in `@media (prefers-reduced-motion: no-preference)`.
- Focus not obscured: ensure sticky nav doesn't cover focused elements.
- Color is never the sole indicator of state (supplement with icons, text, or borders).
 
---
 
## Output Format
 
Produce a complete, working HTML file (single file with embedded CSS and JS) that I can open in a browser to evaluate the redesign. Use Google Fonts CDN for typography. Include the constellation background canvas and the iPhone mockup placeholder so I can see how your component designs layer against them.
 
Structure your CSS with:
1. CSS custom properties at the top (your full token system)
2. Reset and base styles
3. Typography classes
4. Component styles grouped by section
5. Animation keyframes and transitions
6. Media queries for mobile (max-width: 768px)
 
Before you write any code, briefly explain your design direction in 3–4 sentences: what aesthetic you're going for, why it fits Sage's brand and audience, and what the 1–2 most distinctive design choices are. Then build it.
 
---
 
## Anti-patterns to Avoid
 
- **No generic AI aesthetics:** No Inter/Roboto, no purple-gradient-on-white, no cookie-cutter card grids, no "startup landing page template" energy.
- **No over-formatting or decoration for its own sake:** Every visual element should earn its place. If a border, shadow, or icon doesn't serve hierarchy or usability, cut it.
- **No competing CTAs:** One primary button per viewport. Secondary actions are visually subordinate.
- **No hardcoded color values in component styles:** Everything through CSS custom properties.
- **No layout changes:** You're redesigning how things look, not where they go.
- **No lorem ipsum:** Use the actual Sage copy. If you need placeholder text for form fields, make it contextually appropriate ("Your name", "What's on your mind?", "your@email.com").