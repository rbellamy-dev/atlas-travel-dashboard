# Design tokens — Atlas

Reference direction: **modern flight-ops dark** — near-black canvas, map/console feel, electric cyan accent; like a flight-tracker or logistics-ops dashboard. Theme mode: **both** (dark default, light available). Motion: **rich**.

Values live in `src/tokens.json` (run `npm run tokens` to regenerate the CSS); this file holds the reasoning behind them. Colors come in two layers: **primitives** — the raw palette, named by hue and lightness — and **semantic** roles, each pointing at a primitive. Components only use semantic roles. Storybook's `Foundation/Primitives` and `Foundation/Semantics` pages show both.

## Palette (primitives)
Theme-independent. Steps run from 25 (lightest) to 975 (darkest).
| Hue    | Steps | Used for |
|--------|-------|----------|
| ink    | white, 25, 50, 75, 100, 200, 300, 500, 600, 700, 800, 850, 900, 925, 950, 975 | surfaces and text in both themes (cool blue-grey) |
| cyan   | 300, 400, 600, 700 | brand, focus, "in-transit" |
| amber  | 400, 700, 750 | "delayed" — 750 is 700 darkened so light-mode badge text clears AA |
| violet | 400, 600 | "upcoming" |
| red    | 400, 600 | errors |

## Palette (semantic, dark — default)
| Token              | Primitive | Value    | Role |
|--------------------|-----------|----------|------|
| background         | ink-950   | #0a0e14  | app canvas |
| foreground         | ink-75    | #eef4f9  | primary text |
| foreground-strong  | ink-25    | #f8fbfd  | headings / hero numerals |
| foreground-body    | ink-300   | #b8c4cf  | body text |
| foreground-muted   | ink-500   | #828e9a  | captions/labels (AA on card & card-raised) |
| card               | ink-900   | #12181f  | card surface |
| card-raised        | ink-850   | #1a2129  | raised surface (KPI tiles, icon chips) |
| border / input     | ink-800   | #263140  | hairlines (decorative, not a WCAG-3:1 boundary) |
| primary            | cyan-400  | #22d3ee  | brand / CTA / "in-transit" status |
| primary-foreground | ink-950   | #0a0e14  | text on primary |
| primary-tint       | cyan-400 @ 10% | rgba(34,211,238,.10) | icon chip and badge bg |
| ring               | cyan-300  | #67e8f9  | focus ring |
| destructive        | red-400   | #f87171  | errors |

## Palette (semantic, light)
| Token              | Primitive | Value    | Role |
|--------------------|-----------|----------|------|
| background         | ink-50    | #f4f7fa  | app canvas |
| foreground         | ink-925   | #0d1420  | primary text |
| foreground-strong  | ink-975   | #060a10  | headings / hero numerals |
| foreground-body    | ink-700   | #414c59  | body text |
| foreground-muted   | ink-600   | #5f6a78  | captions/labels |
| card               | white     | #ffffff  | card surface |
| card-raised        | ink-100   | #eef2f6  | raised surface |
| border / input     | ink-200   | #d7dee6  | hairlines |
| primary            | cyan-700  | #0e7490  | brand / CTA / "in-transit" status (darkened for AA on white) |
| primary-foreground | white     | #ffffff  | text on primary |
| primary-tint       | cyan-700 @ 12% | rgba(14,116,144,.12) | icon chip and badge bg |
| ring               | cyan-600  | #0891b2  | focus ring |
| destructive        | red-600   | #dc2626  | errors |

## Accent roles (color + a second signifier — never color alone)
| Role       | Token  | Dark value | Light value | Tint (dark / light)              | Pairs with |
|------------|--------|-----------|-------------|-----------------------------------|------------|
| primary    | cyan   | #22d3ee   | #0e7490     | rgba(34,211,238,.10) / rgba(14,116,144,.12) | Plane icon, "in-transit" |
| alert      | amber  | #fbbf24   | #a94d08     | rgba(251,191,36,.10) / rgba(180,83,9,.12)   | AlertTriangle icon, "delayed" |
| upcoming   | violet | #a78bfa   | #7c3aed     | rgba(167,139,250,.10) / rgba(124,58,237,.12) | CalendarClock icon, "upcoming" |

Contrast-gated: amber/violet/cyan text on `card` (dark #12181f) all clear ≥6.5:1; primary on `card`/`background` clears ≥9:1 in both themes; `foreground-muted` clears WCAG AA (≥4.5:1) on `background`/`card`/`card-raised` in both themes (the eyebrow labels on the raised MetricCard surface are the tightest case, ≥4.8:1); `primary-foreground` on `primary` clears ≥5:1 in both themes. Hairline `border` is intentionally low-contrast (decorative divider, not an essential-only boundary) — matches the convention in the reference token system.

Light-mode tints are 12% — the strongest that keeps status-badge text (each accent on its own tint, over `card`) at AA: cyan 4.54:1, amber 4.75:1, violet 4.77:1. Go higher and the badge text needs a darker color.

Borders default to `border` through a rule in `@layer base`, so component states override it: status badges and inactive tabs are borderless, trip and metric cards get a `primary/30` border on hover, inputs turn `ring` on focus and `destructive` when invalid.

## Typography
- **Display**: `Space Grotesk` (600/500) — headings, hero KPI numerals. Geometric, technical, reads like an instrument readout at large sizes.
- **Body**: `Inter` (400/500/600) — UI text, labels, body copy.
- **Mono**: `JetBrains Mono` (400/500/600) — flight codes, dates, timestamps, eyebrow labels, tabular figures. Also carries hero data numerals (KPI values, the ops-board destination readout, the budget-ring percentage) at 600 — data stays in the mono role at any size, never the display face.

| Role        | Font    | Size / LH / LS         | Weight |
|-------------|---------|-------------------------|--------|
| display-xl  | display | 44px / 1.05 / -0.02em   | 600 |
| display-lg  | display | 30px / 1.1  / -0.02em   | 600 |
| heading     | display | 20px / 1.2  / -0.01em   | 600 |
| body        | body    | 15px / 1.5  / 0         | 400 |
| body-sm     | body    | 13px / 1.45 / 0         | 400 |
| label       | mono    | 11px / 1.3  / 0.06em (uppercase) | 500 |
| numeral     | mono    | 15px / 1.3  / 0 (tabular-nums)   | 500 |

## Spacing / Radius / Shadows
4px base scale — Tailwind's default steps (sp1=4, sp2=8, sp3=12, sp4=16, sp5=24, sp6=32, sp7=48, sp8=64; sp4 = `p-4`).

Radius (tighter than a wellness/consumer app — instrument-panel feel): `card` 14px, `btn` 10px, `icon` 12px, `chip` 6px, `pill` 9999px.

Shadows:
- `shadow-cyan`: `0 4px 14px rgba(34,211,238,.22)`
- `shadow-cyan-hover`: `0 8px 24px rgba(34,211,238,.32)`

## Motion layer — rich
- Easings: `--ease-out-expo: cubic-bezier(.16,1,.3,1)` — the only easing in the system; every entrance/reveal settles without overshoot, no bounce/elastic curves.
- Durations: `--dur-fast: 150ms`, `--dur-base: 260ms`, `--dur-slow: 480ms`, `--dur-stagger: 60ms` (per-item entrance delay step).
- Keyframes: `fadeSlideUp` (panel/card entrance, 16px → 0), `glowPulse` (accent-driven opacity pulse on a pre-blurred halo arc behind the budget ring — compositor-only; replaces an earlier per-frame `drop-shadow` filter for smoother always-on motion), `shimmerSweep` (skeleton loading), `cellReveal` (trip-card list stagger), `countUp` (rAF numeral easing, not a CSS keyframe but part of the motion contract; short-circuits to the final value under reduced motion), `badgePop` (status badge scale-in on mount, `ease-out-expo` like everything else).
- `prefers-reduced-motion: reduce` guard is mandatory — disables `fadeSlideUp`/`cellReveal`/`badgePop` translate+scale (keep opacity only), stops `glowPulse` pulsing (static halo at 0.6 opacity), and skips the `countUp` rAF loop (numerals render at their final value).
