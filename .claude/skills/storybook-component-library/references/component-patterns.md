# Component patterns

Two layers: `ui/` (shadcn primitives) and `{domain}/` (composed domain widgets). Both style **only through semantic tokens** so theming works. Every component fills its container — fixed widths belong in stories, never in the component.

## Table of contents
1. `ui/` primitives
2. Domain components
3. The shared `Accent` union
4. Motion
5. Accessibility
6. Responsiveness & performance

## 1. `ui/` primitives (shadcn new-york)

Install with `npx shadcn add button card badge input tabs progress sheet …`. Two shapes come out:

- **cva-variant** (`button`, `badge`, `toggle-group`): `const xVariants = cva(base, { variants, defaultVariants })`, props `extends VariantProps<typeof xVariants>`, export both component and the variants fn. Variant class strings reference semantic tokens (`bg-primary text-primary-foreground shadow-green rounded-btn`).
- **forwardRef primitive** (`card`, `input`, `tabs`, `sheet`…): `React.forwardRef<El, Props>(({ className, ...props }, ref) => …)` with `cn('base', className)` + `.displayName`. Multi-part families export all parts (`Card, CardHeader, CardTitle, CardContent, CardFooter`).

Leave shadcn output mostly as-is; only swap any generic tokens for the project's semantic ones (shadcn already emits `bg-card`, `text-foreground`, etc. from `components.json` cssVariables, so this is usually automatic).

## 2. Domain components (`src/components/{domain}/`)

`metric-card.tsx` is the archetype. Anatomy:

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'
import type { Accent } from './icon-container'
import { TrendingUp } from 'lucide-react'   // per-icon import — never namespace

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  accent?: boolean | Accent   // true = primary; a role name colors the numeral
  loading?: boolean           // see state-patterns.md
}

const accentText: Record<Accent, string> = {
  green: 'text-green', blue: 'text-blue', amber: 'text-amber',
  violet: 'text-violet', coral: 'text-coral',
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, label, value, unit, trend, accent, loading, ...props }, ref) => {
    if (loading) return <MetricCardSkeleton ref={ref} className={className} />
    const accentColor = accent === true ? 'green' : accent || null
    const valueColor = accentColor ? accentText[accentColor] : 'text-foreground-strong'
    return (
      <div ref={ref} className={cn('rounded-card border border-border bg-card-raised px-[15px] py-[14px] transition-all hover:-translate-y-[2px]', className)} {...props}>
        {/* label (mono, muted) · value (display, valueColor) · trend */}
      </div>
    )
  },
)
MetricCard.displayName = 'MetricCard'
```

Conventions that matter:
- **Plain `Record` variant maps** keyed on a shared union, not cva, for domain components — they read clearly and one map per concern (color, hover border, icon) is easy to extend. See how `workout-card` maps `WorkoutType → Accent`.
- **Local hooks/helpers for behavior** — e.g. `useCountUp` (rAF ease-out-quart) so numerals animate on mount. Keep them in the component file.
- `forwardRef` + `cn(base, className)` + `.displayName` + single named export.
- Arbitrary Tailwind values are fine (`text-[26px]`, `tracking-[-0.02em]`) but colors always go through tokens.

## 3. The shared `Accent` union

One file, `src/components/{domain}/icon-container.tsx`, owns the palette union every domain component imports:

```tsx
export type Accent = 'green' | 'blue' | 'amber' | 'violet' | 'coral'  // sized to the "accent roles" input (minimal often needs just 1–2)

const variantMap: Record<Accent, string> = {
  green:  'bg-primary-tint [&_svg]:stroke-green',
  blue:   'bg-blue-tint    [&_svg]:stroke-blue',
  amber:  'bg-amber-tint   [&_svg]:stroke-amber',
  violet: 'bg-violet-tint  [&_svg]:stroke-violet',
  coral:  'bg-coral-tint   [&_svg]:stroke-coral',
}
```
Domain components map their domain concepts onto `Accent` (workout type → accent, metric kind → accent). **Never rely on the color alone** to convey meaning — always pair it with the icon or a text label (a11y, §5).

## 4. Motion (three layers, CSS-first by default)

- **Component-intrinsic** (default, zero-dep): mount animations via CSS keyframes + rAF counters, hover lifts, Radix `[data-state]` transitions. All keyframes/easings/durations come from `design.md`'s motion layer, defined once in `index.css`. Interactive behavior (expand/collapse) uses CSS grid-rows height animation + keyboard handling.
- **Storybook**: interactions demoed + tested via play functions (see `story-patterns.md`).
- **App orchestration** (`src/dashboard/`): staggered entrance ladder (`animationDelay`), `IntersectionObserver` scroll-reveal, composed interactions. This is where **opt-in Framer Motion** goes if the user asked for it — scoped to the app, never into the library components (keeps shipped components portable + dependency-light). Off by default.
- **`prefers-reduced-motion` guard is mandatory** in `index.css`; scale motion intensity to the chosen motion level (subtle/rich/off).

## 5. Accessibility (WCAG AA baseline)

- **Focus:** a focus-ring token + `:focus-visible` on every interactive element. Radix covers primitives; custom components declare it.
- **ARIA/keyboard on custom interactive components:** e.g. an expandable card is `role="button" tabIndex={0} aria-expanded` with Enter/Space handlers; a ring is `role="progressbar"` with `aria-valuenow/min/max` + `aria-label`. Icon-only controls get `aria-label`; decorative icons get `aria-hidden`. Form controls use associated `<Label htmlFor>`.
- **No color-only signifiers** (see §3).
- **Animated numerals** expose their *final* value to assistive tech, not every frame.
- Contrast is handled at token time (see `token-system.md`); `addon-a11y` audits every story (see `testing.md`).

## 6. Responsiveness & performance

- **Fluid, not fixed** — components fill their container; only stories pin widths. Use Tailwind v4 **container queries (`@container`)** where a card lives in variable-width slots (narrow rail vs wide panel), `clamp()` type, `min-w-0` + truncation for text.
- **Bundle** — per-icon `lucide` imports (never `import * as Icons`), Tailwind v4 auto-purge. Keep the app bundle in the reference ballpark (~60 kB gzip). Framer (~30–50 kB) stays app-scoped.
- **Fonts** — self-host or preload, `font-display: swap`, subset to used weights, font-metric overrides to avoid CLS (better than the reference's 3× render-blocking `<link>`).
- `will-change` only where it pays (e.g. an animating `stroke-dashoffset`), not blanket.
