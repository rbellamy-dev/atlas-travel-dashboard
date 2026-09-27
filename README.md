# Atlas — Travel Dashboard

A travel-operations dashboard built entirely from its own token-driven component library. Flight-ops-dark aesthetic, dual-theme (dark/light), built with Vite + React 19 + Tailwind v4 + shadcn/ui (new-york) + Storybook 8.

**Live:** [dashboard](https://atlas-travel-dashboard.vercel.app/) · [Storybook](https://atlas-travel-storybook.vercel.app/)

One repo, one set of tokens, two outputs: the component library (documented in Storybook) and the dashboard that consumes it.

`product.md` is the brief and `design.md` is the design spec with the reasoning behind each value. Both were created before any code. Token values live in one file, `src/tokens.json`; `npm run tokens` generates `src/tokens.css` (for the app and Storybook) and `src/tokens.ts` (for Storybook's own UI theme and the Design Tokens page) from it. `dev`, `build`, `storybook` and `build-storybook` all regenerate on start. If you edit `tokens.json` while a dev server is running, run `npm run tokens` to pick up the change.

## Run it

```bash
npm install
npm run dev            # the dashboard — http://localhost:5173
npm run storybook      # the component library docs — http://localhost:6006
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server for the dashboard app |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run storybook` | Storybook dev server |
| `npm run build-storybook` | Production Storybook build → `storybook-static/` |
| `npm run tokens` | Regenerate `tokens.css` + `tokens.ts` from `tokens.json` |
| `npm run check:tokens` | Fail if the generated files are stale or were hand-edited |

## Structure

```
src/
├── App.tsx                # renders the assembled dashboard
├── tokens.json             # design tokens — the one file to edit
├── tokens.css              # generated: @theme + :root token blocks
├── tokens.ts               # generated: same tokens as JS, for Storybook
├── index.css               # imports tokens.css + base styles and motion layer
├── components/
│   ├── ui/                 # shadcn primitives (Button, Card, Badge, Input, Tabs, Progress, Skeleton)
│   └── travel/              # domain components (MetricCard, TripCard, BudgetRing, IconContainer, EmptyState, PanelError)
├── dashboard/                # the app layer — types, mock data, hooks, panels
│   └── panels/               # TopBar, OpsBoard, StatRow, TripFeed, GoalPanel, PanelBoundary
└── stories/                  # Storybook stories, one per component + Foundation/Design Tokens + Introduction
```

Components are presentational (props in, no fetching); all data lives in `src/dashboard/`. Swap `dashboard/hooks.ts` for real API calls later — nothing else needs to change.
