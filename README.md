# Atlas — Travel Dashboard

A travel-analytics component library and standalone dashboard. Flight-ops-dark aesthetic, dual-theme (dark/light), built with Vite + React 19 + Tailwind v4 + shadcn/ui (new-york) + Storybook 8.

See [`product.md`](./product.md) for the brief and [`design.md`](./design.md) for the full token spec.

## Quick start

```bash
npm install
npm run dev            # the live dashboard app — http://localhost:5173
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
