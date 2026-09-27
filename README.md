# Atlas — Travel Dashboard

A travel-operations dashboard built entirely from its own token-driven component library. Flight-ops-dark aesthetic, dual-theme (dark/light), built with Vite + React 19 + Tailwind v4 + shadcn/ui (new-york) + Storybook 8.

**Live:** [dashboard](https://atlas-travel-dashboard.vercel.app/) · [Storybook](https://atlas-travel-storybook.vercel.app/)

One repo, one set of tokens, two outputs: the component library (documented in Storybook) and the dashboard that consumes it.

`product.md` is the brief, `design.md` is the token spec. Both were written before any code; `index.css` and `tokens.ts` are derived from `design.md`, and `npm run check:tokens` keeps them in sync.

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
| `npm run check:tokens` | Assert `index.css` and `tokens.ts` hold the same values |

## Structure

```
src/
├── App.tsx                # renders the assembled dashboard
├── index.css               # design tokens (derived from design.md) + motion layer
├── tokens.ts                # same tokens as JS, for the Foundation story
├── components/
│   ├── ui/                 # shadcn primitives (Button, Card, Badge, Input, Tabs, Progress, Skeleton)
│   └── travel/              # domain components (MetricCard, TripCard, BudgetRing, IconContainer, EmptyState, PanelError)
├── dashboard/                # the app layer — types, mock data, hooks, panels
│   └── panels/               # TopBar, OpsBoard, StatRow, TripFeed, GoalPanel, PanelBoundary
└── stories/                  # Storybook stories, one per component + Foundation/Design Tokens + Introduction
```

Components are presentational (props in, no fetching); all data lives in `src/dashboard/`. Swap `dashboard/hooks.ts` for real API calls later — nothing else needs to change.
