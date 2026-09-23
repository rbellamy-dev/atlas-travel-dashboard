---
name: storybook-component-library
description: Scaffold a complete, deployable Storybook component library plus a real standalone demo dashboard that consumes the components — Vite + React 19 + Tailwind v4 + shadcn/ui (new-york) + Storybook 8, with a design-token system, per-component stories, accessibility, theming, and Vercel deploy. Use this whenever the user wants to build, scaffold, or generate a component library, a design system in code, a Storybook, a UI kit, a component playground, or a dashboard built from reusable components — even if they don't say "Storybook" by name. Triggers on "storybook component library", "build me a component library", "scaffold a component library / design system", "make a UI kit", "component playground", "storybook", "/component-library", and any request to turn a brand/design system into shippable React components with a demo app.
---

# Storybook Component Library + Demo Dashboard Generator

Scaffold a full, deployable **component library** documented in Storybook, plus a **real standalone dashboard app** that assembles the components into a live product. Works for any brand or domain (fitness, fintech, analytics, e-commerce, dev-tools…).

The reference implementation this skill reproduces is the repo this folder sits in — read its files when you need ground truth (paths in `references/stack-recipe.md`).

## When to invoke

Any request to build a component library, design system in code, UI kit, Storybook, or a dashboard composed of reusable components. The user gives a brand/domain (or points at an existing design system) and wants shippable React components + docs + a demo. If they only want a single one-off page with no reusable component layer, this is probably overkill — use a design-system skill instead.

## The core shape (already decided — don't re-litigate)

- **One Vite + React 19 project, two build targets.** NOT Next.js. Storybook and the app share `src/`. `dist/` (app) and `storybook-static/` (Storybook) both build from the same code.
- **Storybook = component docs** (per-component stories + a Foundation token page). It does **not** carry a full-page dashboard clone.
- **The standalone Vite app (`App.tsx`) = the real dashboard** — the assembled, deployed product, and the integration test for composition outside Storybook.
- **Components are presentational** (props in, no data fetching). All data + composition lives in `src/dashboard/`.
- **Two source-of-truth docs** are generated first and everything else derives from them:
  - `product.md` — the brief (identity, domain, audience, dashboard scope, component inventory, deploy targets).
  - `design.md` — the token spec (palette, type, spacing, radius, shadows, accent roles, motion layer). `index.css` + `tokens.ts` + `.storybook/theme.ts` are all emitted from this one file so they can never drift.

## Inputs — interview the user first

Ask these concisely (batch them, don't interrogate one at a time). Each maps to a concrete decision. Record the answers into `product.md` and `design.md` before generating anything.

1. **Project identity** — name/slug + one-line purpose → package name, titles, output folder `./projects/{id}-{desc}/`.
2. **Domain** — fitness / fintech / analytics / e-commerce / dev-tools / … → domain components, the typed data model, mock data.
3. **Visual reference** *(required)* — ask the user for a reference for the look: a URL, a screenshot, or a written description. The design direction always comes from what the user gives you. Do **not** offer or pull from other installed design-system skills — the user supplies the reference. See `references/token-system.md`.
4. **Palette & type** — ask whether the user wants to **provide** a color palette (hexes / names) or have you **generate one** from the reference. **Either way, also choose the fonts for this project** — a display/body/mono trio that fits the reference's personality. Do **not** reuse the same fonts every time (the reference build's Figtree/IBM Plex are an *example*, not a default). Vary type across projects; see `references/token-system.md`.
5. **Theme mode** — dark only / light only / both → one palette or theme-swapped tokens + a `data-theme` toggle.
6. **Dashboard level** — **minimal / standard / elaborate** (see the table below). This sets how many components you build and how complex the dashboard is — it's the main lever on build time, so default to **standard** and let the user go lighter.
7. **Component set** — the level picks a default set; confirm/adjust it and which shadcn primitives to pull into `ui/`.
8. **Accent roles** — how many roles beyond primary (up to 5: primary + blue/amber/violet/coral). Minimal dashboards often need just 1–2.
9. **Motion** — subtle / rich / off; CSS-first by default (zero-dep). Framer Motion is an opt-in, app-only, and adds weight — skip it unless asked. See `references/component-patterns.md`.
10. **Deploy targets** — Vercel project name(s) for the app and Storybook (or "skip deploy").

### Dashboard levels — component counts

This is a **demo generator**, not a full design system — keep it lean. Pick the smallest level that shows the idea.

| Level | Components (min) | UI primitives | Domain components | Dashboard |
|-------|------------------|---------------|-------------------|-----------|
| **minimal** | **3–5** | Button, Card, Badge | MetricCard + one ListRow | Header + KPI stat row + a simple list. One column. |
| **standard** | **8–10** | Button, Card, Badge, Input, Tabs, Progress | IconContainer, MetricCard, a FeedCard, a GoalCard *or* ProgressRing | KPI row + main feed/list + a progress/goal panel. Optional side rail. |
| **elaborate** | **14–18** | + Sheet, ToggleGroup, Separator, Label | + StreakCalendar/heatmap, SectionCard, a second domain card, a sparkline/chart | Multi-panel + tabs + a Sheet detail view + side rail (drawer on mobile). |

Absolute floor (minimal) is 3 crucial components: **Button, Card, MetricCard** — enough for a KPI dashboard. Everything else is additive. Never generate 40 components "to be complete"; generate what the chosen level needs.

## Workflow

Follow in order. Read the referenced file at each step rather than working from memory.

1. **Interview** — gather the inputs above.
2. **Write `product.md` + `design.md`** — the canonical inputs. See `references/data-modeling.md` for the product/data model shape.
3. **Resolve + contrast-check tokens** — build `design.md` from the user's **reference** + their **palette** (provided or generated by you). **Validate every text/accent-on-surface pair to WCAG AA before emitting anything** (per theme if theming). Then emit `index.css` + `tokens.ts` + `.storybook/theme.ts` from the one spec. See `references/token-system.md`.
4. **Scaffold** — copy `assets/template/` into `./projects/{id}-{desc}/`, fill placeholders. See `references/stack-recipe.md`.
5. **Install + add primitives** — `npm install` (needs `.npmrc` `legacy-peer-deps=true`), then `npx shadcn add …` **only** the primitives the chosen level needs into `ui/`.
6. **Generate the level's components + their states** — presentational, forwardRef + cn, shared `Accent` union, `Record` variant maps; each with Default/Loading/Empty/Error. Build only what the level's table lists. See `references/component-patterns.md` and `references/state-patterns.md`.
7. **Generate the data layer** — `src/dashboard/types.ts` + `data.ts` (realistic mock, never lorem) + swap-ready hooks that can simulate loading/error. See `references/data-modeling.md`.
8. **Generate stories + wire theming** — one story per component (add a play function only where an interaction is worth demoing) and the Foundation `DesignTokens` story; wire the `addon-themes` decorator + app theme toggle. See `references/story-patterns.md`.
9. **Build + elevate the dashboard app** — first assemble `App.tsx` (responsive, per-panel error boundaries, mock hooks). Then run the **`impeccable`** skill's design passes on the dashboard to take it from functional to striking: **`layout` + `typeset` always; add `bolder` + `animate` for standard/elaborate**. Scope the passes to the dashboard site (`App.tsx` + `src/dashboard/`) — **not** the library components. Your `product.md`/`design.md` double as impeccable's `PRODUCT.md`/`DESIGN.md` context, so it stays on-brand. See `references/dashboard-composition.md`.
10. **Audit the dashboard** — run **`impeccable`'s audit pass** on the same scope (`App.tsx` + `src/dashboard/` only): hierarchy, spacing/alignment, contrast, responsive behavior, empty/loading/error states, and copy. Fix whatever it flags before moving on — this is the check that catches what the elevation passes missed, not a rerun of them.
11. **Verify** — `tsc -p tsconfig.app.json --noEmit`, `vite build`, `storybook build`. Manually open dev + storybook. That's the whole test bar — see `references/testing.md` for why heavier tooling is off by default.
12. **Deploy** *(if requested)* — app (`dist/`, framework `vite`) and Storybook (`storybook-static/`, framework `null`) to their Vercel targets; return both URLs.

**Model note:** the scaffold, config, and builds (steps 1–8, 11–12) run fine on any capable model (Sonnet 5 is plenty). The **design-elevation and audit passes in steps 9–10 are taste-heavy and reward the strongest model** — prefer **Fable 5 or Opus** (or `/fast`) for the `impeccable` `bolder`/`animate`/`layout`/audit work; Fable in particular leans creative and is a strong fit for the design elevation. That's what makes the demo look impressive rather than generic. A fine split is Sonnet for the scaffold, Fable/Opus for steps 9–10.

## The stack — locked (do not substitute)

Vite 6 · React 19 · TypeScript ~5.8 · Tailwind **v4** (via `@tailwindcss/vite`, no `tailwind.config.js`) · shadcn/ui **new-york** · Storybook 8 (`@storybook/react-vite`) · lucide-react · Radix primitives · cva + clsx + tailwind-merge. Exact versions and every config file live in `references/stack-recipe.md`.

## References — read on demand

| File | Read when |
|------|-----------|
| `references/stack-recipe.md` | Scaffolding: exact versions, all config files, tsconfigs, `.storybook/`, `vercel.json`, scripts, watch-outs. |
| `references/token-system.md` | Emitting tokens: `index.css` (`@theme`/`@theme inline`/`:root`) + synced `tokens.ts` + theming + contrast validation. |
| `references/component-patterns.md` | Writing components: `ui/` vs domain anatomy, the `Accent` union, `Record` variant maps, motion, a11y. |
| `references/story-patterns.md` | Writing stories: Meta/StoryObj, autodocs, play functions, the Foundation story, Recipes. |
| `references/dashboard-composition.md` | Building `App.tsx`: responsive grid, panels, error boundaries, orchestration. |
| `references/state-patterns.md` | Loading/Empty/Error/edge states as first-class component states + stories. |
| `references/data-modeling.md` | `product.md`/`design.md` shape, typed domain model, mock hooks, formatting utils. |
| `references/testing.md` | The lean test bar (typecheck + builds) and what's deliberately left out for a demo. |

## Rules (why they matter)

- **This is a demo generator — keep it lean and fast.** Build only the chosen level's components; add only the shadcn primitives that level needs; skip test-runner / Vitest / Chromatic / Playwright and Framer Motion unless the user explicitly asks. Install time and build time are the enemy; every extra dep and component costs both.

- **Everything derives from `design.md`.** Tokens are duplicated across `index.css`, `tokens.ts`, and `theme.ts` — hand-editing one is how the reference drifted (chrome `#101010` vs canvas `#0d1117`). Emit all three from the single spec so they stay in lockstep.
- **Components style through semantic tokens only** (`bg-card`, `text-foreground`, `border-border`) — never a raw hex or a static brand var where a themeable token belongs, or light mode and re-theming break.
- **Components stay presentational.** Data fetching in `components/` couples the library to one app and kills reuse. Keep it in `src/dashboard/`.
- **Every data-driven component ships Loading/Empty/Error**, not just the happy path — real dashboards spend most of their life in those states.
- **Accessibility is a baseline, not a feature** — WCAG AA contrast (validated at token time), `:focus-visible` everywhere, ARIA/keyboard on custom interactive components, and no color-only signifiers (pair every accent-coded meaning with an icon or label).
- **Fluid components, fixed only in stories.** Components fill their container (`@container` queries where a card lives in variable-width slots); only stories pin widths for display.

## What this is NOT

- Not Tailwind v3, not a `tailwind.config.js`, not PostCSS. Tailwind v4 via the Vite plugin only.
- Not Next.js / CRA. One Vite SPA project.
- Not a placeholder `App.tsx` — the app must render the real assembled dashboard.
- Not a full-page dashboard *story* inside Storybook — the app owns that; Storybook documents components.
- Not color-only state signifiers; not below WCAG AA contrast.
- Not fixed-width components; not render-blocking font loads.
- Not data-fetching inside `components/`; not hardcoded hex where a themeable token belongs.
