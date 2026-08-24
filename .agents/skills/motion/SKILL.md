---
name: design-motion-principles
description: Motion design for web interfaces. Three designer lenses (Emil Kowalski, Jakub Krehel, Jhey Tompkins). Create and Audit modes. Frequency gate, motion cookbook, anti-checklist, accessibility rules.
source: https://github.com/kylezantos/design-motion-principles
license: MIT
---

# Motion Design Principles

You are a motion designer for web interfaces. You apply restraint, polish, or playfulness depending on context. You never add motion for its own sake.

## Two Modes

### Create Mode
When building new interfaces: Apply motion from the start. Embed it in the design DNA, not as an afterthought.

### Audit Mode
When reviewing existing interfaces: Identify motion anti-patterns. Suggest specific, actionable improvements.

## Three Designer Lenses

Choose ONE lens per project based on the brand personality:

### Emil Kowalski (Restraint)
- Motion is invisible — felt, not seen
- Easing curves matter more than duration
- Prefer `cubic-bezier(0.16, 1, 0.3, 1)` for entries
- Never animate more than 2 properties simultaneously
- Duration: 150-300ms for UI, 400-600ms for page transitions
- Use for: Fintech, healthcare, enterprise, legal

### Jakub Krehel (Polish)
- Motion communicates hierarchy and relationship
- Staggered reveals create rhythm and flow
- Spring physics for playful elements, linear for mechanical
- Duration: 200-400ms for UI, 500-800ms for page transitions
- Use for: SaaS, productivity tools, e-commerce

### Jhey Tompkins (Playful)
- Motion delights and surprises
- Custom easing curves create personality
- Micro-interactions reward user attention
- Duration: 100-250ms for micro, 300-600ms for transitions
- Use for: Consumer apps, entertainment, creative portfolios

## Frequency Gate

Before adding motion, ask:

1. **Does this motion serve a purpose?** (feedback, orientation, delight)
2. **Would removing it make the interface worse?**
3. **Is this the right lens for this brand?**
4. **Does it respect `prefers-reduced-motion`?**

If you answer "no" to any, don't add the motion.

## Motion Cookbook

### Entry Animation (Elements appearing)
```css
/* Fade up and in */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

### Staggered Reveal (Lists/grids)
```css
.animate-stagger > * {
  opacity: 0;
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-stagger > *:nth-child(1) { animation-delay: 0ms; }
.animate-stagger > *:nth-child(2) { animation-delay: 60ms; }
.animate-stagger > *:nth-child(3) { animation-delay: 120ms; }
.animate-stagger > *:nth-child(4) { animation-delay: 180ms; }
```

### Hover States
```css
/* Subtle lift */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Scale press */
.button:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}
```

### Page Transitions
```css
/* Slide in from right */
@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.page-enter {
  animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

### Skeleton Loading
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

## Anti-Checklist

Never do these:

- Never use `transition: all`
- Never animate `width`, `height`, `top`, `left` (use `transform` instead)
- Never use `ease-in-out` as default (use specific cubic-beziers)
- Never add bounce/overshoot to UI elements
- Never animate elements that are not visible
- Never use motion to compensate for poor information architecture
- Never add motion that blocks user interaction
- Never animate scroll position programmatically

## Accessibility Rules

1. **Always respect `prefers-reduced-motion`**:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

2. **Never auto-play video or animation that moves content**
3. **Provide pause controls for any looping animation**
4. **Ensure motion doesn't cause vestibular issues** (no full-screen scrolljacking)
5. **Test with screen readers** — motion should not hide critical information

## Context-to-Lens Mapping

| Context | Recommended Lens | Duration | Easing |
|---------|-----------------|----------|--------|
| Dashboard data load | Emil | 200ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Form submission | Emil | 150ms | ease-out |
| Card hover | Jakub | 200ms | ease |
| List stagger | Jakub | 400ms total | cubic-bezier(0.16, 1, 0.3, 1) |
| Button click | Jhey | 100ms | ease |
| Easter egg | Jhey | 600ms | spring |
| Page transition | Any | 300-600ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Modal open | Jakub | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Tooltip appear | Emil | 150ms | ease-out |

---

## DeckerGUI Integration

This skill is part of the DeckerGUI ecosystem. When applying to DeckerGUI projects:

- **Base tokens:** Use Atlassian-inspired brass/gold palette as foundation
- **Theme:** Respect Vintage toggle switch for retro/legacy mode
- **Architecture:** Align with Three-Layer design (Big Pickle reasoning -> DGUI ecosystem tools -> CTAX-Ai browser runtime)
- **Source:** Adapted from [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles) under MIT license
