---
name: taste-design
description: Semantic design system generation. Creates DESIGN.md files with visual atmosphere, color calibration, typographic architecture, component behaviors, layout principles, and motion philosophy. Anti-patterns included.
source: https://github.com/google-labs-code/stitch-skills
license: MIT
---

# Taste Design — Semantic Design System Generator

You generate semantic design systems as DESIGN.md files. You do not write code — you define the visual language that code must follow.

## When to Use

- Starting a new project and need a design foundation
- Existing project has no documented design system
- Onboarding new designers who need visual context
- Ensuring AI-generated code follows consistent design language

## DESIGN.md Structure

Every design system document must contain these sections:

```markdown
# [Project Name] Design System

## 1. Visual Atmosphere
## 2. Color Calibration
## 3. Typographic Architecture
## 4. Component Behaviors
## 5. Layout Principles
## 6. Motion Philosophy
## 7. Anti-Patterns
## 8. Token Reference
```

## 1. Visual Atmosphere

Define the emotional texture of the interface. Use concrete descriptors:

```markdown
## Visual Atmosphere

**Primary Feeling:** [e.g., "Calm precision", "Energetic trust", "Quiet luxury"]

**Texture References:**
- [Physical analogy 1] (e.g., "Matte paper stock")
- [Physical analogy 2] (e.g., "Brushed aluminum")
- [Physical analogy 3] (e.g., "Frosted glass")

**Lighting Quality:**
- [e.g., "Soft diffused, no harsh shadows"]
- [e.g., "Directional with subtle gradients"]

**Depth Model:**
- [e.g., "Flat with minimal elevation", "Layered with z-depth", "Glassmorphic with blur"]
```

## 2. Color Calibration

Define colors with semantic meaning, not just hex values:

```markdown
## Color Calibration

### Semantic Roles
- **Background:** [hex] — The canvas. Never pure white.
- **Surface:** [hex] — Cards, panels, elevated elements
- **Border:** [hex] — Dividers, outlines, structure
- **Text Primary:** [hex] — Headings, body text. Never pure black.
- **Text Secondary:** [hex] — Captions, metadata, timestamps
- **Accent:** [hex] — CTAs, links, active states. Max 15% surface area.
- **Success:** [hex] — Positive feedback, completions
- **Warning:** [hex] — Caution, pending states
- **Error:** [hex] — Destructive actions, failures
- **Info:** [hex] — Neutral information, tips

### Color Relationships
- Background to Surface contrast ratio: [target, e.g., "1.05:1"]
- Text to Background contrast ratio: [target, e.g., "12:1"]
- Accent to Background contrast ratio: [target, e.g., "4.5:1"]
```

## 3. Typographic Architecture

Define type as a system, not individual styles:

```markdown
## Typographic Architecture

### Type Scale
| Token | Size | Line Height | Weight | Use |
|-------|------|-------------|--------|-----|
| `--type-display` | [size] | [lh] | [w] | Hero headings |
| `--type-h1` | [size] | [lh] | [w] | Page titles |
| `--type-h2` | [size] | [lh] | [w] | Section headings |
| `--type-h3` | [size] | [lh] | [w] | Card titles |
| `--type-body` | [size] | [lh] | [w] | Body text |
| `--type-caption` | [size] | [lh] | [w] | Metadata |
| `--type-mono` | [size] | [lh] | [w] | Code, data |

### Font Stacks
- **Primary:** [font family, fallbacks]
- **Secondary:** [font family, fallbacks]
- **Monospace:** [font family, fallbacks]

### Typographic Rules
- Maximum line length: [e.g., "65 characters"]
- Paragraph spacing: [e.g., "1em"]
- Heading alignment: [e.g., "Left-aligned, never centered"]
```

## 4. Component Behaviors

Define how components look, feel, and respond:

```markdown
## Component Behaviors

### Buttons
- **Primary:** [bg], [text], [border-radius], [padding], [hover state]
- **Secondary:** [bg], [text], [border], [hover state]
- **Ghost:** [text], [hover bg], [active state]
- **Disabled:** [opacity], [cursor], [pointer-events]

### Cards
- **Background:** [surface color]
- **Border:** [border style]
- **Border Radius:** [value — consistent across all cards]
- **Shadow:** [elevation model]
- **Hover:** [transform], [shadow change], [duration]

### Inputs
- **Height:** [value]
- **Border:** [style]
- **Focus:** [border-color], [outline], [ring]
- **Error:** [border-color], [text-color]
- **Placeholder:** [color], [opacity]

### Navigation
- **Style:** [e.g., "Fixed top", "Side rail", "Tab bar"]
- **Height:** [value]
- **Active indicator:** [style]
- **Hover:** [background change]
```

## 5. Layout Principles

Define spatial relationships:

```markdown
## Layout Principles

### Grid System
- **Columns:** [e.g., "12-column, 72px gutter"]
- **Max Width:** [e.g., "1200px"]
- **Margin:** [e.g., "24px mobile, 48px desktop"]
- **Breakpoints:** [e.g., "640px, 768px, 1024px, 1280px"]

### Spacing Scale
| Token | Value | Use |
|-------|-------|-----|
| `--space-xs` | 4px | Tight gaps |
| `--space-sm` | 8px | Component internals |
| `--space-md` | 16px | Standard spacing |
| `--space-lg` | 24px | Section gaps |
| `--space-xl` | 32px | Major sections |
| `--space-2xl` | 48px | Page-level spacing |

### Spatial Rules
- Sections separated by: [e.g., "64px minimum"]
- Card internal padding: [e.g., "24px"]
- Element proximity: [e.g., "Related items within 16px"]
- White space: [e.g., "Generous — double what feels right"]
```

## 6. Motion Philosophy

Define when and how to animate:

```markdown
## Motion Philosophy

### Principles
1. Motion communicates [e.g., "hierarchy and relationship"]
2. Duration range: [e.g., "150ms-400ms for UI elements"]
3. Easing: [e.g., "cubic-bezier(0.16, 1, 0.3, 1) for entries"]
4. Always respect `prefers-reduced-motion`

### Motion Map
| Interaction | Property | Duration | Easing |
|-------------|----------|----------|--------|
| Element entry | opacity, transform | 400ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Hover feedback | transform | 200ms | ease |
| Focus ring | box-shadow | 150ms | ease-out |
| Page transition | opacity, transform | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Loading skeleton | background-position | 1.5s | linear (loop) |
```

## 7. Anti-Patterns

What this design system explicitly forbids:

```markdown
## Anti-Patterns

### Never Do
- [e.g., "Use pure black (#000) for text"]
- [e.g., "Center text blocks longer than 2 lines"]
- [e.g., "Use default blue (#3B82F6) as primary"]
- [e.g., "Apply drop shadows to all cards"]
- [e.g., "Use `transition: all`"]
- [e.g., "Animate width/height properties"]

### Always Do
- [e.g., "Use off-black (#1A1A1A) for text"]
- [e.g., "Left-align body text"]
- [e.g., "Use custom accent color"]
- [e.g., "Use subtle elevation changes on hover"]
- [e.g., "Use specific property transitions"]
- [e.g., "Use transform for animations"]
```

## 8. Token Reference

Map all tokens to their values:

```markdown
## Token Reference

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-bg: [hex];
  --color-surface: [hex];
  --color-border: [hex];
  --color-text: [hex];
  --color-text-secondary: [hex];
  --color-accent: [hex];

  /* Typography */
  --type-display: [size]/[lh] [font];
  --type-h1: [size]/[lh] [font];
  --type-body: [size]/[lh] [font];

  /* Spacing */
  --space-xs: [value];
  --space-sm: [value];
  --space-md: [value];
  --space-lg: [value];
  --space-xl: [value];

  /* Elevation */
  --shadow-sm: [value];
  --shadow-md: [value];
  --shadow-lg: [value];

  /* Border Radius */
  --radius-sm: [value];
  --radius-md: [value];
  --radius-lg: [value];
}
```
```

## Generation Process

When creating a DESIGN.md:

1. **Read the brief** — Understand the product, audience, and competitive context
2. **Select archetype** — Choose a visual direction (minimal, bold, editorial, playful)
3. **Define atmosphere** — Set the emotional texture with physical analogies
4. **Calibrate color** — Build from semantic roles, not arbitrary hex values
5. **Architecture type** — Define scale, stacks, and rules
6. **Specify components** — Define behavior, not just appearance
7. **Layout principles** — Set spatial relationships and grid system
8. **Motion philosophy** — Define when and how to animate
9. **Anti-patterns** — Explicitly forbid common mistakes
10. **Token reference** — Map everything to CSS custom properties

---

## DeckerGUI Integration

This skill is part of the DeckerGUI ecosystem. When applying to DeckerGUI projects:

- **Base tokens:** Use Atlassian-inspired brass/gold palette as foundation
- **Theme:** Respect Vintage toggle switch for retro/legacy mode
- **Architecture:** Align with Three-Layer design (Big Pickle reasoning -> DGUI ecosystem tools -> CTAX-Ai browser runtime)
- **Source:** Adapted from [google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills) under MIT license
