# State patterns — Loading / Empty / Error / Edge

Real dashboards spend most of their life in non-happy-path states. Every data-driven component treats these as first-class, and every one gets a story. This is where a component library earns trust — the reference has none of these, so it's the most common thing to get wrong.

## Loading — skeletons

Reuse the existing `shimmerSweep` keyframe from the motion layer. Add the shadcn `Skeleton` primitive (`npx shadcn add skeleton`) or a tiny local one, and give each data component a skeleton variant matching its own layout (same padding/shape, so there's no layout shift when data arrives):

```tsx
function MetricCardSkeleton({ className, ref }: …) {
  return (
    <div ref={ref} className={cn('rounded-card border border-border bg-card-raised px-[15px] py-[14px]', className)}>
      <Skeleton className="h-3 w-16 mb-2" />        {/* label */}
      <Skeleton className="h-6 w-24" />             {/* value */}
    </div>
  )
}
```
Drive it with a `loading?: boolean` prop that short-circuits the render (see `component-patterns.md`).

## Empty — no data yet

Per-collection empty variants: an icon, a one-line message, and an optional CTA. Keep copy specific and encouraging ("No workouts logged yet — add your first" beats "No data"). A shared `<EmptyState icon message action />` used by every list/feed keeps it consistent. The dashboard also needs a **first-run empty** composition (everything empty at once).

## Error — inline + boundary

Two pieces:
- **Inline error card** — a `<PanelError message onRetry />` with a retry button. Message says what failed and how to recover; no apologies, no stack traces.
- **Per-panel React error boundary** — a small class component wrapping each dashboard panel so a thrown error is contained and the rest of the dashboard survives. Its fallback is the inline error card; retry resets the boundary. (See `dashboard-composition.md`.)

## Edge data — handle, don't crash

- **Zero / negative** values format correctly (no `NaN`, no broken bars).
- **Huge numbers** get compact formatting (`Intl.NumberFormat` compact) + `tabular-nums`.
- **Long text** truncates (`truncate` + `min-w-0` on the flex child), never overflows.
- **Over-100% progress** clamps (`Math.min(100, …)`), as the reference's ProgressRing does.
- **Missing optional fields** render nothing, not "undefined".

## Stories

Every data-driven component ships these stories so each state is visible and testable in isolation:

```tsx
export const Default: Story = { args: { … } }
export const Loading: Story = { args: { loading: true } }
export const Empty:   Story = { render: () => <EmptyState … /> }
export const Error:   Story = { render: () => <PanelError message="Couldn't load metrics" onRetry={() => {}} /> }
export const EdgeData: Story = { render: () => (/* zero, huge, long, >100% side by side */) }
```

The a11y addon audits these states too (an empty state still needs a landmark/label; an error card's retry needs a name), so give them the same care as the happy path.
