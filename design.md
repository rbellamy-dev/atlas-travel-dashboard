# Design tokens — Atlas

Reference direction: **calm ops console** — a deep teal-black canvas, a seafoam accent for what's moving, and coral reserved for what's wrong; like a modern flight-tracker or logistics-ops dashboard, quieter than the usual neon-on-black. Theme mode: **both** (dark default, light available). Motion: **rich**.

Values live in `src/tokens.json` (run `npm run tokens` to regenerate the CSS); this file holds the reasoning behind them. Colors come in two layers: **primitives** — the raw palette, named by hue and lightness — and **semantic** roles, each pointing at a primitive. Components only use semantic roles. Storybook's `Foundation/Primitives` and `Foundation/Semantics` pages show both.

## Why these colors
Atlas started as near-black with electric cyan, amber and violet: three equally loud accents competing for attention. The redesign ranks them instead.

- **Color only where it means something.** Text is neutral gray in both themes; surfaces are teal-tinted but quiet. Hue is spent on status, so a colored thing is always telling you something.
- **Coral is the only warm hue.** Everything else is cool (teal, blue, gray), so a delay is the first thing the eye lands on. Errors share it: both mean "something needs attention."
- **One accent leads.** Seafoam (`teal-300`) carries brand, progress and "in transit"; blue is calmer, for "upcoming"; "completed" stays neutral.
- **Glow is a hint, not neon.** The budget ring's halo breathes between 15% and 35%, and button shadows are soft, so the dashboard reads as a product rather than a console.

The accents come from one palette ([coolors.co/114b5f-028090-e4fde1-456990-f45b69](https://coolors.co/114b5f-028090-e4fde1-456990-f45b69)); the other teal, blue and coral steps are OKLab mixes of those colors with black or white, tuned so every text pair clears WCAG AA. The re-theme changed `tokens.json` only: no component's colors changed, because components only reference roles.

## Palette (primitives)
Theme-independent. Steps run from 25 (lightest) to 975 (darkest).
| Hue   | Steps | Used for |
|-------|-------|----------|
| gray  | white, 25, 200, 400, 600, 700, 950, black | text in both themes (neutral, so colour only means status); black is #08090a, never pure |
| slate | 25, 50, 200 | light-mode surfaces, a trace of teal |
| teal  | 300, 600, 650, 700, 800, 850, 900, 950 | dark-mode surfaces; brand accent (300 on dark, 650 on light) |
| blue  | 300, 500 | "upcoming" |
| coral | 400, 700 | "delayed" and errors — 700 is 400 deepened for text on white |

## Palette (semantic, dark — default)
| Token              | Primitive | Value    | Role |
|--------------------|-----------|----------|------|
| background         | teal-950  | #011017  | app canvas |
| foreground         | gray-25   | #f8f9fa  | primary text |
| foreground-strong  | white     | #ffffff  | headings / hero numerals |
| foreground-body    | gray-200  | #c9ced1  | body text |
| foreground-muted   | gray-400  | #9aa1a6  | captions/labels (5.6:1 on card-raised) |
| card               | teal-900  | #041f29  | card surface |
| card-raised        | teal-850  | #072d3a  | raised surface (KPI tiles, icon chips) |
| border / input     | teal-800  | #2c5e6e  | hairlines (decorative, not a WCAG-3:1 boundary) |
| primary            | teal-300  | #3ddfd4  | brand / CTA / "in-transit" status |
| primary-foreground | teal-950  | #011017  | text on primary |
| primary-tint       | teal-300 @ 12% | rgba(61,223,212,.12) | icon chip and badge bg |
| ring               | teal-300  | #3ddfd4  | focus ring |
| destructive        | coral-400 | #f45b69  | errors |

## Palette (semantic, light)
| Token              | Primitive | Value    | Role |
|--------------------|-----------|----------|------|
| background         | slate-25  | #f5f7f8  | app canvas |
| foreground         | gray-950  | #0f1214  | primary text |
| foreground-strong  | black     | #08090a  | headings / hero numerals |
| foreground-body    | gray-700  | #3a3f42  | body text |
| foreground-muted   | gray-600  | #555c61  | captions/labels (6.0:1 on card-raised) |
| card               | white     | #ffffff  | card surface |
| card-raised        | slate-50  | #eef1f3  | raised surface |
| border / input     | slate-200 | #d8e0e4  | hairlines |
| primary            | teal-650  | #0c6a7c  | brand / CTA / "in-transit" status (teal-600 deepened for AA on its tint) |
| primary-foreground | white     | #ffffff  | text on primary |
| primary-tint       | teal-650 @ 10% | rgba(12,106,124,.10) | icon chip and badge bg |
| ring               | teal-600  | #028090  | focus ring (3:1 is enough for a non-text outline) |
| destructive        | coral-700 | #a33a44  | errors |

## Accent roles (color + a second signifier — never color alone)
| Role     | Token   | Dark value | Light value | Tint (dark / light) | Pairs with |
|----------|---------|-----------|-------------|---------------------|------------|
| primary  | primary | #3ddfd4   | #0c6a7c     | 12% / 10%           | Plane icon, "in-transit" |
| warning  | warning | #f45b69   | #a33a44     | coral-400 @ 10% (both) | AlertTriangle icon, "delayed" |
| info     | info    | #8cbaf7   | #456990     | 12% / 10%           | CalendarClock icon, "upcoming" |

Contrast-gated, measured on the badge itself (each accent on its own tint, over `card`): dark — primary 8.2:1, warning 4.7:1, info 7.0:1; light — primary 5.4:1 (4.8:1 even over `card-raised`), warning 5.8:1, info 5.0:1. Tints were capped to hold those: a 14% coral tint would drop dark-mode "Delayed" to 4.45:1, and the palette's own teal (#028090) is only 4.67:1 on plain white, so light mode uses teal-650. `foreground-muted` clears AA on every surface in both themes; `primary-foreground` on `primary` clears 11.7:1 (dark) and 6.2:1 (light). Hairline `border` is intentionally low-contrast (decorative divider, not an essential-only boundary).

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

Shadows (soft — a hint of the accent, not a neon glow). Their colour references the palette like any role, so a glow follows `teal-300` if it changes; the generator rejects a raw `rgba()` here:
- `shadow-glow`: `0 2px 8px {teal300 @ 12%}` → `rgba(61,223,212,.12)`
- `shadow-glow-hover`: `0 4px 14px {teal300 @ 20%}` → `rgba(61,223,212,.2)`

## Motion layer — rich
- Easings: `--ease-out-expo: cubic-bezier(.16,1,.3,1)` — the only easing in the system; every entrance/reveal settles without overshoot, no bounce/elastic curves.
- Durations: `--dur-fast: 150ms`, `--dur-base: 260ms`, `--dur-slow: 480ms`, `--dur-stagger: 60ms` (per-item entrance delay step).
- Keyframes: `fadeSlideUp` (panel/card entrance, 16px → 0), `glowPulse` (accent-driven opacity pulse on a pre-blurred halo arc behind the budget ring — compositor-only; replaces an earlier per-frame `drop-shadow` filter for smoother always-on motion), `shimmerSweep` (skeleton loading), `cellReveal` (trip-card list stagger), `countUp` (rAF numeral easing, not a CSS keyframe but part of the motion contract; short-circuits to the final value under reduced motion), `badgePop` (status badge scale-in on mount, `ease-out-expo` like everything else).
- `prefers-reduced-motion: reduce` guard is mandatory — disables `fadeSlideUp`/`cellReveal`/`badgePop` translate+scale (keep opacity only), stops `glowPulse` pulsing (static halo at 0.6 opacity), and skips the `countUp` rAF loop (numerals render at their final value).
