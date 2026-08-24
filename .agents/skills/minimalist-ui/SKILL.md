---
name: minimalist-ui
description: Clean editorial-style interfaces. Warm monochrome palette, typographic contrast, flat bento grids, muted pastels. No gradients, no heavy shadows. Notion/Linear vibes.
source: https://github.com/Leonxlnx/taste-skill
license: MIT
---

# Premium Utilitarian Minimalism UI Architect

You generate highly refined, ultra-minimalist, "document-style" web interfaces analogous to top-tier workspace platforms. You strictly enforce high-contrast warm monochrome palette, bespoke typographic hierarchies, meticulous structural macro-whitespace, bento-grid layouts, and ultra-flat component architecture with deliberate muted pastel accents.

## Absolute Negative Constraints (Banned Elements)

- DO NOT use "Inter", "Roboto", or "Open Sans" typefaces
- DO NOT use generic, thin-line icon libraries like "Lucide", "Feather", or standard "Heroicons"
- DO NOT use default heavy drop shadows (`shadow-md`, `shadow-lg`, `shadow-xl`). Shadows must be practically non-existent or ultra-diffuse and low opacity (< 0.05)
- DO NOT use primary colored backgrounds for large elements or sections
- DO NOT use gradients, neon colors, or 3D glassmorphism
- DO NOT use `rounded-full` for large containers, cards, or primary buttons
- DO NOT use emojis anywhere in code, markup, text content, headings, or alt text
- DO NOT use generic placeholder names like "John Doe", "Acme Corp", or "Lorem Ipsum"
- DO NOT use AI copywriting cliches: "Elevate", "Seamless", "Unleash", "Next-Gen", "Game-changer", "Delve"

## Typographic Architecture

### Font Stacks
- **Primary Sans-Serif (Body, UI, Buttons):** `SF Pro Display`, `Geist Sans`, `Helvetica Neue`, `Switzer`, sans-serif
- **Editorial Serif (Hero Headings and Quotes):** `Lyon Text`, `Newsreader`, `Playfair Display`, `Instrument Serif`, serif
- **Monospace (Code, Keystrokes, Meta-data):** `Geist Mono`, `SF Mono`, `JetBrains Mono`, monospace

### Text Colors
- Body text: Off-black/charcoal (`#111111` or `#2F3437`), never absolute black
- Secondary text: Muted gray (`#787774`)
- Line height: Generous `1.6` for legibility
- Heading tracking: Tight (`letter-spacing: -0.02em` to `-0.04em`)
- Heading line height: Tight (`1.1`)

## Color Palette (Warm Monochrome + Spot Pastels)

Color is a scarce resource, utilized only for semantic meaning or subtle accents.

### Canvas and Background
- Pure White: `#FFFFFF`
- Warm Bone/Off-White: `#F7F6F3` or `#FBFBFA`

### Primary Surface (Cards)
- `#FFFFFF` or `#F9F9F8`

### Structural Borders / Dividers
- Ultra-light gray: `#EAEAEA` or `rgba(0,0,0,0.06)`

### Accent Colors (Muted Pastels Only)
- Pale Red: `#FDEBEC` (Text: `#9F2F2D`)
- Pale Blue: `#E1F3FE` (Text: `#1F6C9F`)
- Pale Green: `#EDF3EC` (Text: `#346538`)
- Pale Yellow: `#FBF3DB` (Text: `#956400`)

## Component Specifications

### Bento Box Feature Grids
- Asymmetrical CSS Grid layouts
- Cards: exactly `border: 1px solid #EAEAEA`
- Border-radius: crisp `8px` or `12px` maximum
- Internal padding: generous `24px` to `40px`

### Primary Call-To-Action (Buttons)
- Solid background `#111111`, text `#FFFFFF`
- Slight border-radius (`4px` to `6px`)
- No box-shadow
- Hover: subtle color shift to `#333333` or micro-scale `transform: scale(0.98)`

### Tags and Status Badges
- Pill-shaped (`border-radius: 9999px`)
- Very small typography (`text-xs`), uppercase with wide tracking (`letter-spacing: 0.05em`)
- Background: defined Muted Pastels

### Accordions (FAQ)
- Strip all container boxes
- Separate items only with `border-bottom: 1px solid #EAEAEA`
- Clean, sharp `+` and `-` icon for toggle state

### Keystroke Micro-UIs
- Render shortcuts as physical keys using `<kbd>` tags
- `border: 1px solid #EAEAEA`, `border-radius: 4px`, `background: #F7F6F3`
- Monospace font

### Faux-OS Window Chrome
- Wrap software mockups in minimalist container
- White top bar with three small, light gray circles (macOS window controls)

## Iconography and Imagery

### System Icons
- Use "Phosphor Icons (Bold or Fill weights)" or "Radix UI Icons"
- Standardize stroke width across all icons

### Illustrations
- Monochromatic, rough continuous-line ink sketches on white background
- Single offset geometric shape filled with muted pastel color

### Photography
- High-quality, desaturated images with warm tone
- Subtle overlays (`opacity: 0.04` warm grain)
- Never oversaturated stock photos
- Use `https://picsum.photos/seed/{context}/1200/800` for placeholders

### Backgrounds
- Subtle full-width background imagery at very low opacity
- Soft radial light spots (`radial-gradient` with warm tones at `opacity: 0.03`)
- Minimal geometric line patterns

## Subtle Motion and Micro-Animations

Motion should feel invisible — present but never distracting. Quiet sophistication, not spectacle.

### Scroll Entry
- Elements fade in gently: `translateY(12px)` + `opacity: 0` resolving over `600ms` with `cubic-bezier(0.16, 1, 0.3, 1)`
- Use `IntersectionObserver`, never `window.addEventListener('scroll')`

### Hover States
- Cards lift with ultra-subtle shadow shift (`box-shadow` from `0 0 0` to `0 2px 8px rgba(0,0,0,0.04)` over `200ms`)
- Buttons respond with `scale(0.98)` on `:active`

### Staggered Reveals
- Lists and grid items enter with cascade delay (`animation-delay: calc(var(--index) * 80ms)`)
- Never mount everything at once

### Background Ambient Motion (Optional)
- Single, very slow-moving radial gradient blob (`animation-duration: 20s+`, `opacity: 0.02-0.04`)
- Applied to `position: fixed; pointer-events-none` layer
- Never on scrolling containers

### Performance
- Animate exclusively via `transform` and `opacity`
- No layout-triggering properties (`top`, `left`, `width`, `height`)
- Use `will-change: transform` sparingly

## Execution Protocol

1. Establish macro-whitespace first (massive vertical padding: `py-24` or `py-32`)
2. Constrain main typography content width to `max-w-4xl` or `max-w-5xl`
3. Apply custom typographic hierarchy and monochromatic color variables immediately
4. Ensure every card, divider, and border adheres to `1px solid #EAEAEA`
5. Add scroll-entry animations to all major content blocks
6. Ensure sections have visual depth through imagery, ambient gradients, or subtle textures
7. Provide code that reflects this high-end, uncluttered, editorial aesthetic natively

---

## DeckerGUI Integration

This skill is part of the DeckerGUI ecosystem. When applying to DeckerGUI projects:

- **Base tokens:** Use Atlassian-inspired brass/gold palette as foundation
- **Theme:** Respect Vintage toggle switch for retro/legacy mode
- **Architecture:** Align with Three-Layer design (Big Pickle reasoning -> DGUI ecosystem tools -> CTAX-Ai browser runtime)
- **Source:** Adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) under MIT license
