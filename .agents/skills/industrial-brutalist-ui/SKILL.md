---
name: industrial-brutalist-ui
description: Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics. Rigid grids, extreme type scale contrast, utilitarian color, analog degradation effects. For data-heavy dashboards, portfolios, or editorial sites.
source: https://github.com/Leonxlnx/taste-skill
license: MIT
---

# Industrial Brutalism and Tactical Telemetry UI

You architect web interfaces that synthesize mid-century Swiss Typographic design, industrial manufacturing manuals, and retro-futuristic aerospace/military terminal interfaces. You master rigid modular grids, extreme typographic scale contrast, purely utilitarian color palettes, and programmatic simulation of analog degradation.

## Visual Archetypes

Choose ONE per project and commit to it. Do not alternate or mix both modes within the same interface.

### Swiss Industrial Print

Derived from 1960s corporate identity systems and heavy machinery blueprints.

- **Characteristics:** High-contrast light modes (newsprint/off-white substrates). Monolithic, heavy sans-serif typography. Unforgiving structural grids outlined by visible dividing lines.
- **Colors:** Off-white substrate (`#F5F0E8`), black ink (`#0A0A0A`), red accent (`#C41E3A`), steel gray (`#6B6B6B`)
- **Typography:** Heavy grotesque sans-serif (Helvetica Neue Bold, Akzidenz-Grotesk), extreme scale contrast
- **Layout:** Rigid modular grid with visible borders, 90-degree corners only, high data density

### Tactical Telemetry

Derived from CRT terminals, radar displays, and military command interfaces.

- **Characteristics:** Dark modes (deep charcoal/black substrates), monospace typography, phosphor glow effects, CRT scanline overlays.
- **Colors:** Deep charcoal (`#0D0D0D`), phosphor green (`#00FF41`), amber warning (`#FFB000`), steel blue (`#4A90D9`)
- **Typography:** Monospace exclusively (JetBrains Mono, Fira Code, IBM Plex Mono), uniform weight, extreme tracking
- **Layout:** Grid-locked with visible scanlines, high information density, minimal whitespace

## Typographic Architecture

Typography is the primary structural and decorative infrastructure. Imagery is secondary.

### Scale System

**Macro-Typography (Headings):**
- Massive, aggressive sizing. `clamp(3rem, 8vw, 8rem)` for primary headings
- Exclusively uppercase
- Tight tracking (`letter-spacing: -0.04em` to `-0.06em`)
- Leading: Standard to tight (`1.2` to `1.4`)

**Micro-Typography (Data/Metadata):**
- Small monospace text (`0.65rem` to `0.75rem`)
- Wide tracking (`letter-spacing: 0.1em` to `0.2em`)
- Exclusively uppercase
- Used for: unit IDs, coordinates, timestamps, navigation labels

### Textural Contrast (Artistic Disruption)

- Classification: High-Contrast Serif
- Optimal Fonts: Playfair Display, EB Garamond, Times New Roman
- Implementation: Used exceedingly sparingly. Heavy post-processing (halftone filters, 1-bit dithering) to degrade vector perfection

## Color System

The color architecture is uncompromising. Gradients, soft drop shadows, and modern translucency are strictly prohibited. Colors simulate physical media or primitive emissive displays.

### Swiss Industrial Print (Light)

| Role | Color | Hex |
|------|-------|-----|
| Substrate | Newsprint Off-White | `#F5F0E8` |
| Primary Ink | Near-Black | `#0A0A0A` |
| Accent | Industrial Red | `#C41E3A` |
| Structural | Steel Gray | `#6B6B6B` |
| Secondary | Graphite | `#3D3D3D` |

### Tactical Telemetry (Dark)

| Role | Color | Hex |
|------|-------|-----|
| Substrate | Deep Charcoal | `#0D0D0D` |
| Primary | Phosphor Green | `#00FF41` |
| Warning | Amber | `#FFB000` |
| Info | Steel Blue | `#4A90D9` |
| Structural | Gunmetal | `#2A2A2A` |

**CRITICAL:** Choose ONE substrate palette per project and use it consistently. Never mix light and dark substrates within the same interface.

## Layout Architecture

Elements do not float; they are anchored precisely to grid tracks and intersections.

### Structural Rules

- **Visible Compartmentalization:** Extensive use of solid borders (`1px` or `2px solid`) to delineate distinct zones. Horizontal rules (`<hr>`) frequently span entire container width.
- **Bimodal Density:** Layouts oscillate between extreme data density (tightly packed monospace metadata) and vast expanses of calculated negative space framing macro-typography.
- **Geometry:** Absolute rejection of `border-radius`. All corners must be exactly 90 degrees to enforce mechanical rigidity.

### Grid System

- **Columns:** 12-column minimum, visible grid lines encouraged
- **Gutters:** Tight (`8px` to `16px`) for data-dense, generous (`32px` to `48px`) for editorial
- **Margins:** Minimal — content should feel like it extends beyond viewport

## UI Components and Symbology

Standard web UI conventions are replaced with utilitarian, industrial graphic elements.

### Syntax Decoration

- Framing: `[ DELIVERY SYSTEMS ]`, `< RE-IND >`
- Directional: `>>>`, `///`, `\\\\`

### Industrial Markers

- Integration of registration (R), copyright (C), and trademark (TM) symbols as structural geometric elements
- Crosshairs (`+`) at grid intersections
- Repeating vertical lines (barcodes)
- Thick horizontal warning stripes
- Randomized string data (`REV 2.6`, `UNIT / D-01`)

### Data Display

- Monospace exclusively for data
- Tables with visible borders and header separators
- Status indicators: `[ ACTIVE ]`, `[ PENDING ]`, `[ OFFLINE ]`
- Timestamps: `YYYY-MM-DD HH:MM:SS` format strictly

## Textural and Post-Processing Effects

To prevent the design from appearing purely digital, simulated analog degradation is engineered via CSS and SVG filters.

### Halftone and 1-Bit Dithering

Transforming continuous-tone images or large serif typography into dot-matrix patterns. Achieved via CSS `mix-blend-mode: multiply` overlays combined with SVG radial dot patterns.

### CRT Scanlines (Tactical Telemetry Only)

Horizontal line overlay using CSS repeating linear gradients:
```css
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1px,
    rgba(0, 0, 0, 0.15) 1px,
    rgba(0, 0, 0, 0.15) 2px
  );
  pointer-events: none;
}
```

### Mechanical Noise

Subtle static grain overlay to simulate paper texture or CRT noise. Applied via fixed pseudo-elements with `pointer-events: none`.

## Execution Protocol

1. **[SELECT]** Choose ONE visual archetype (Swiss Industrial Print or Tactical Telemetry)
2. **[SUBSTRATE]** Set the color palette based on archetype
3. **[TYPOGRAPHY]** Establish macro/micro typographic scale
4. **[GRID]** Build rigid grid with visible compartmentalization
5. **[COMPONENTS]** Apply industrial UI patterns (syntax decoration, markers)
6. **[TEXTURE]** Add analog degradation effects
7. **[OUTPUT]** Deliver pixel-perfect code that feels like a declassified blueprint

## Pre-Output Checklist

- [ ] ONE visual archetype selected and committed to
- [ ] All corners are exactly 90 degrees (no border-radius)
- [ ] No gradients, soft shadows, or modern translucency
- [ ] Typography uses extreme scale contrast (macro vs. micro)
- [ ] Grid is rigid with visible compartmentalization
- [ ] Industrial markers and syntax decoration present
- [ ] Analog degradation effects applied (halftone, scanlines, or noise)
- [ ] All text is uppercase (or monospace for data)
- [ ] Color palette is strictly limited to the chosen archetype
- [ ] Overall impression: "declassified military blueprint", not "modern web app"

---

## DeckerGUI Integration

This skill is part of the DeckerGUI ecosystem. When applying to DeckerGUI projects:

- **Base tokens:** Use Atlassian-inspired brass/gold palette as foundation
- **Theme:** Respect Vintage toggle switch for retro/legacy mode
- **Architecture:** Align with Three-Layer design (Big Pickle reasoning -> DGUI ecosystem tools -> CTAX-Ai browser runtime)
- **Source:** Adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) under MIT license
