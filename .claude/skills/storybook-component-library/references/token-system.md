# Token system — `design.md` → `index.css` + `tokens.ts` + `theme.ts`

The design tokens are the spine of the whole project. There is **one source of truth, `design.md`**, and three generated files that must never be hand-synced. This file explains the architecture, the emit targets, theming, and the contrast gate.

## Why one source, three outputs

Tailwind utilities and CSS need the tokens as CSS custom properties (`index.css`). Stories and the Foundation page need them as JS objects (`tokens.ts`). Storybook's own chrome needs them as a theme object (`.storybook/theme.ts`). If you edit these independently they drift — the reference already did (chrome `#101010` vs canvas `#0d1117`). So: fill in `design.md`, then generate all three.

## `design.md` shape

A human-readable spec. Tables for each token group, plus the motion layer:

```md
# Design tokens — {Project}

## Palette (semantic, {theme})
| Token            | Value     | Role |
| background       | #0d1117   | app canvas |
| foreground       | #f0f6fc   | primary text |
| foreground-body  | #c9d1d9   | body text |
| foreground-muted | #8b949e   | captions/labels |
| card             | #161b22   | card surface |
| card-raised      | #21262d   | raised surface |
| border / input   | #30363d   | hairlines |
| primary          | #00d992   | brand / CTA |
| primary-foreground | #0d1117 | text on primary |
| ring             | #2fd6a1   | focus ring |
| destructive      | #ef4444   | errors |

## Accent roles (color + a second signifier — never color alone)
| Role     | Token  | Value   | Tint (.08)          | Pairs with |
| primary  | green  | #00d992 | rgba(0,217,146,.08) | ✓ / dumbbell |
| info     | blue   | #539df5 | rgba(83,157,245,.08)| activity icon |
| warning  | amber  | #ffa42b | rgba(255,164,43,.08)| flame icon |
| recovery | violet | #a78bfa | rgba(167,139,250,.08)| moon icon |
| intensity| coral  | #fb7185 | rgba(251,113,133,.08)| heart icon |

## Typography
Fonts: display / body / mono (with weights). Type scale table (role → size/weight/lh/ls).

## Spacing / Radius / Shadows
8px base scale; radius (card 16 / btn 12 / icon 13 / chip 6 / pill). Shadow set incl. brand glow.

## Motion layer
Easings (e.g. --ease-out-expo cubic-bezier(.16,1,.3,1)), duration scale, named keyframes
(fadeSlideUp, ringGlow, shimmerSweep, cellReveal, sheet slide, backdrop fade).
```

## Emit target 1 — `src/index.css`

Structure, in order (this ordering matters for Tailwind v4):

```css
@import "tailwindcss";

/* 1. STATIC tokens → become Tailwind utilities. Defining --color-green here is
      what makes text-green / bg-green / border-green exist. */
@theme {
  /* fonts: EXAMPLE ONLY — replace with this project's chosen trio (see "Fonts" above) */
  --font-display: 'Figtree', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --color-green: #00d992; --color-green-dark: #10b981; --color-green-soft: #2fd6a1;
  --radius-card: 1rem; --radius-btn: .75rem; --radius-icon: .8125rem; --radius-chip: .375rem; --radius-pill: 9999px;
  --shadow-green: 0 4px 14px rgba(0,217,146,.25);
  --shadow-green-hover: 0 8px 22px rgba(0,217,146,.35);
}

/* 2. SEMANTIC aliases → map utility names to runtime vars (themeable at use-site). */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-foreground-strong: var(--foreground-strong);
  --color-foreground-body: var(--foreground-body);
  --color-foreground-muted: var(--foreground-muted);
  --color-card: var(--card);
  --color-card-raised: var(--card-raised);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-tint: var(--primary-tint);
  --color-blue: var(--blue);   --color-blue-tint: var(--blue-tint);
  --color-amber: var(--amber); --color-amber-tint: var(--amber-tint);
  --color-violet: var(--violet); --color-violet-tint: var(--violet-tint);
  --color-coral: var(--coral); --color-coral-tint: var(--coral-tint);
  --color-destructive: var(--destructive);
  --color-border: var(--border); --color-input: var(--input); --color-ring: var(--ring);
}

/* 3. VALUES. Single theme → just :root. Theming → :root (light) + [data-theme="dark"] (see below). */
:root {
  --background: #0d1117; --foreground: #f0f6fc; --foreground-strong: #f6fbff;
  --foreground-body: #c9d1d9; --foreground-muted: #8b949e;
  --card: #161b22; --card-raised: #21262d;
  --primary: #00d992; --primary-foreground: #0d1117; --primary-tint: rgba(0,217,146,.08);
  --blue: #539df5; --blue-tint: rgba(83,157,245,.08);
  --amber: #ffa42b; --amber-tint: rgba(255,164,43,.08);
  --violet: #a78bfa; --violet-tint: rgba(167,139,250,.08);
  --coral: #fb7185; --coral-tint: rgba(251,113,133,.08);
  --destructive: #ef4444; --border: #30363d; --input: #30363d; --ring: #2fd6a1;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

/* 4. Base styles + keyframes (motion layer): body/heading fonts, .eyebrow, .reveal,
      keyframes (fadeSlideUp, ringGlow, shimmerSweep, cellReveal, sheet slide/backdrop),
      range-input styling, and the mandatory prefers-reduced-motion guard. */
```

**Accent glow via variable** (so a violet ring glows violet, not green) — drive the glow color from a var the component sets:
```css
@keyframes ringGlow {
  0%,100% { filter: drop-shadow(0 0 2px color-mix(in srgb, var(--ring-glow, #00d992) 25%, transparent)); }
  50%     { filter: drop-shadow(0 0 9px color-mix(in srgb, var(--ring-glow, #00d992) 70%, transparent)); }
}
```

## Emit target 2 — `src/tokens.ts`

Same values as JS objects, for the Foundation story + any programmatic consumer. Header it `// generated from design.md — do not hand-edit`. Exports: `colors` (brand + accent roles + tints + surfaces + text), `fonts`, `radius`, `shadows`, `spacing` (sp1…), `typeScale` (named roles `{size,weight,lh,ls}`), `type ColorKey`.

## Emit target 3 — `.storybook/theme.ts`

`create({ base: 'dark'|'light', brandTitle, colorPrimary, appBg, appContentBg, appBorderColor, fontBase, fontCode, textColor, ... })` using the **same** palette values. Derive `appBg`/`appContentBg` from `card`/`background`, `colorPrimary` from `primary`, etc.

## Where the design comes from (the reference + palette inputs)

The direction always comes from what the **user** gives you — a reference and a palette. Do **not** pull from other installed design-system skills.

**Reference (required):** a URL, screenshot, or written description. From it, derive the non-color tokens — font trio (display/body/mono), type scale, radius + shadow scales, spacing, overall feel (soft vs sharp, dense vs airy). If the reference is a live URL or image, read it directly; if it's a description, translate it faithfully.

**Fonts — choose per project, never default (important):** pick a **display** face with character for headings/numerals, a highly **readable body** face, and a **mono** face for data/labels/eyebrows — a trio that matches the reference's personality. Every project should get different type; the Figtree / IBM Plex Sans / IBM Plex Mono used in the `@theme` example below and in the reference build are a **worked example, not a house font**. Reusing them makes every generated library look the same — the exact thing to avoid. Prefer widely-available, self-hostable faces (Google Fonts / Fontsource); load them per the perf notes in `component-patterns.md` (self-host or preload, `font-display: swap`, subset). Record the chosen fonts in `design.md` so `index.css` / `tokens.ts` / `theme.ts` all emit them.

**Palette:** two paths —
- **User provides it** → take their hexes/names and slot them into the semantic token set (map their brand color → `--primary`, pick surfaces/text/border to match, assign accent roles). Fill any gaps (e.g. they gave a brand color but no surfaces) and tell them what you added.
- **You generate it** → derive a cohesive palette from the reference: a semantic surface/text ramp, a primary, and the accent roles. Aim for the reference's mood.

Either way, run the contrast gate below before emitting, and write the final palette into `design.md` so it's recorded.

## Theming (when theme mode = both)

When theme mode = both, `design.md` carries **light + dark values per semantic token**, and `index.css` step 3 becomes:
```css
:root { /* light values */ }
@media (prefers-color-scheme: dark) { :root { /* dark values */ } }
:root[data-theme="light"] { /* light values — wins over media query */ }
:root[data-theme="dark"]  { /* dark values  — wins over media query */ }
```
Wire Storybook's switcher in `preview.tsx`:
```ts
import { withThemeByDataAttribute } from '@storybook/addon-themes'
export const decorators = [ withThemeByDataAttribute({
  themes: { light: 'light', dark: 'dark' }, defaultTheme: 'dark', attributeName: 'data-theme',
}) ]
```
The app ships a toggle that sets `data-theme` on `<html>`, persists to `localStorage`, and reads `prefers-color-scheme` for the initial value.

## Contrast gate (a11y — do this BEFORE emitting)

Every text-on-surface and accent-on-surface pair must meet **WCAG AA**: 4.5:1 for body text, 3:1 for large text / UI + borders. Reuse the math in `~/.claude/color-palettes-toolkit/`. Check at minimum: foreground/-body/-muted on background/card/card-raised, primary-foreground on primary, each accent on card, border on card. **If theming, check both themes** — a pair can pass dark and fail light. A failing pair is nudged (lighten/darken) or flagged to the user; it is never emitted as-is.
