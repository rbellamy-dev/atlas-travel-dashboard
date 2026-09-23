# Atlas — Travel Dashboard

A travel-analytics component library and standalone dashboard. Flight-ops-dark aesthetic, dual-theme (dark/light), built with Vite + React 19 + Tailwind v4 + shadcn/ui (new-york) + Storybook 8.

**Live:** [dashboard](https://atlas-travel-dashboard.vercel.app/) · [Storybook](https://atlas-travel-storybook.vercel.app/)

This repo holds two things: **the demo**, and **the spec that generated it**.

| | Where | What it is |
|---|---|---|
| The demo | `src/` | A working dashboard plus the component library behind it |
| The spec | [`.claude/skills/storybook-component-library/`](./.claude/skills/storybook-component-library/) | The generator this was built from — run it to make your own |

`product.md` is the brief, `design.md` is the token spec. Both were written before any code; `index.css` and `tokens.ts` are derived from `design.md`.

## Run the demo

```bash
npm install
npm run dev            # the dashboard — http://localhost:5173
npm run storybook      # the component library docs — http://localhost:6006
```

## Run the generator

The spec is a [Claude Code skill](https://docs.claude.com/en/docs/claude-code/skills). Open this repo in Claude Code and it loads automatically as a project skill — ask for a component library and it'll scaffold one for your own brand and domain.

To use it outside this repo, copy it into your personal skills directory:

```bash
cp -R .claude/skills/storybook-component-library ~/.claude/skills/
```

[`SKILL.md`](./.claude/skills/storybook-component-library/SKILL.md) holds the workflow, the rules, and the scoping tiers that cap how many components get built. `references/` covers the token system, component and story patterns, the four-state rule, the data model, and why the test bar is deliberately thin.

It's readable on its own — you don't need Claude Code to get the argument.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server for the dashboard app |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run storybook` | Storybook dev server |
| `npm run build-storybook` | Production Storybook build → `storybook-static/` |
| `npm run check:tokens` | Assert `index.css` and `tokens.ts` hold the same values |

## Structure

```
src/
├── App.tsx                # renders the assembled dashboard
├── index.css               # design tokens (generated from design.md) + motion layer
├── tokens.ts                # same tokens as JS, for the Foundation story
├── components/
│   ├── ui/                 # shadcn primitives (Button, Card, Badge, Input, Tabs, Progress, Skeleton)
│   └── travel/              # domain components (MetricCard, TripCard, BudgetRing, IconContainer, EmptyState, PanelError)
├── dashboard/                # the app layer — types, mock data, hooks, panels
│   └── panels/               # TopBar, OpsBoard, StatRow, TripFeed, GoalPanel, PanelBoundary
└── stories/                  # Storybook stories, one per component + Foundation/Design Tokens + Introduction
```

Components are presentational (props in, no fetching); all data lives in `src/dashboard/`. Swap `dashboard/hooks.ts` for real API calls later — nothing else needs to change.
