# Content & data modeling + the source docs

The boundary that keeps the library reusable: **components are presentational** (props in, no fetching); **all data lives in the app layer** (`src/dashboard/`). This file covers the two source-of-truth docs, the typed model, mock hooks, and formatting.

## The two source docs (written in Workflow step 2)

### `product.md` — the brief
The durable record of the interview, so future sessions/agents don't re-ask. Also doubles as the `impeccable` skill's `PRODUCT.md` context (case-insensitive, project root) — so include the fields impeccable expects: a `register` line and a short users/brand/tone section.

```md
# {Project} — Product brief
register: product   # a dashboard is product UI (design serves the product), not a marketing page

## Users & brand
Who uses it, their context, the brand tone (e.g. "precise, calm, data-dense"), and any anti-references.
## What & who
One-line purpose. Target audience. The domain.
## Dashboard
Screens/panels the standalone app surfaces (KPI row, feed, goal panel, side rail), scaled to the chosen level.
## Component inventory
The domain components + which shadcn primitives back them, with accent-role assignments.
## Data model
The domain entities and their fields (source for src/dashboard/types.ts).
## Deploy
Vercel targets for app + Storybook (or "skip").
```

`design.md` (the token spec) similarly serves as impeccable's `DESIGN.md`.

### `design.md` — the token spec
See `token-system.md` for its full shape. Everything visual derives from it.

Both are written **before** generation and are one-way: docs → generated files, never reverse.

## Typed domain model — `src/dashboard/types.ts`

The single source of data shapes, taken from `product.md`'s Data model section:

```ts
export interface Metric { id: string; label: string; value: number; unit?: string; trend?: 'up'|'down'|'neutral'; accent?: Accent }
export interface Workout { id: string; name: string; type: WorkoutType; durationMin: number; calories?: number; date: string }
export interface Goal { id: string; title: string; current: number; target: number; unit?: string; accent?: Accent }
```
Components consume these (or primitive props derived from them). Keep the types in the app layer — the library components take generic props, not domain entities, where practical, so they stay reusable.

## Realistic mock data — `src/dashboard/data.ts`

Believable domain content, **never lorem**. Real-looking names, plausible numbers, a sensible date range. This is what sells the demo. A handful of records per collection is enough; a tiny generator is fine for volume but static data is simpler and dependency-free.

## Swap-ready hooks — `src/dashboard/hooks.ts`

Panels call hooks, not fetch. Return mock now; the shape is ready for a real API later. Crucially, they can **simulate loading and error** so the live dashboard actually renders those states:

```ts
type Async<T> = { data: T; status: 'loading'|'error'|'success' }

export function useMetrics(): Async<Metric[]> {
  const [state, setState] = React.useState<Async<Metric[]>>({ data: [], status: 'loading' })
  React.useEffect(() => {
    const t = setTimeout(() => setState({ data: mockMetrics, status: 'success' }), 400) // simulate latency
    return () => clearTimeout(t)
  }, [])
  return state
}
```
When wiring a real backend later, only `hooks.ts` changes — panels, components, and stories are untouched. That's the payoff of the boundary.

## Formatting — `src/dashboard/format.ts`

Consistent numbers/dates/units via `Intl`, and always `tabular-nums` on aligned figures:

```ts
export const num = new Intl.NumberFormat('en-US')
export const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
export const pct = (n: number) => `${Math.round(n)}%`
export const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
```
Handles the edge cases from `state-patterns.md` (huge numbers → compact, etc.) in one place.
