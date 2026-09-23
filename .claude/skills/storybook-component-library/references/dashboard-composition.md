# Dashboard composition — the standalone app

`src/App.tsx` renders the **real, deployed dashboard** — the product the components add up to, and the integration test that proves they compose outside Storybook's harness. All app-only code (layout, panels, data, hooks) lives in `src/dashboard/`; `src/components/` stays domain-agnostic and reusable.

**Scale the layout to the chosen level** (see the levels table in SKILL.md):
- **minimal** — a header + a KPI stat row + one simple list. Single column. No side rail, no tabs, no Sheet.
- **standard** — KPI row + a main feed/list + a progress/goal panel. Optional side rail. The two-column grid below.
- **elaborate** — the full picture: multi-panel grid + tabs + a Sheet detail view + a side rail that becomes a drawer on mobile.

The sections below describe the standard/elaborate shape; for minimal, take just the header + `StatRow` + a list and skip the rest.

## Folder layout

```
src/
├── main.tsx            # createRoot(#root).render(<StrictMode><App/></StrictMode>), imports ./index.css
├── App.tsx             # theme provider + <Dashboard/>
└── dashboard/
    ├── Dashboard.tsx   # the responsive layout shell
    ├── panels/         # StatRow, ActivityFeed, GoalPanel, SideRail…
    ├── types.ts        # domain model (see data-modeling.md)
    ├── data.ts         # realistic mock
    ├── hooks.ts        # useX() swap-ready hooks (mock now, API later)
    └── format.ts       # Intl formatters
```

## Layout

Mobile-first responsive grid. A common shape:

```tsx
// Dashboard.tsx
export function Dashboard() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only …">Skip to content</a>
      <TopBar />                          {/* brand + theme toggle */}
      <main id="main" className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6">
        <header><h1 className="…">{title}</h1></header>
        <StatRow />                        {/* KPI row — wraps on mobile */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="grid gap-6">{/* main panels */}</section>
          <SideRail />                     {/* collapses to a Sheet drawer on mobile */}
        </div>
      </main>
    </div>
  )
}
```

Rules:
- **KPI row wraps** (`grid grid-cols-2 sm:grid-cols-4` or flex-wrap), never horizontal-scrolls the body.
- **Side rail → drawer.** On desktop it's a column; on mobile hide it and expose a "Details"/"Menu" button that opens the same content in the Radix **Sheet** primitive. Reuse the component — don't build a second nav.
- Panels are cards from the library, fed by hooks. The dashboard composes; it doesn't restyle components.

## Error boundaries (per panel)

One failing panel must not blank the whole dashboard. Wrap each panel:

```tsx
<PanelBoundary name="Activity"><ActivityFeed /></PanelBoundary>
```
`PanelBoundary` is a small class error boundary that renders the inline error card (see `state-patterns.md`) with a retry that resets the boundary. This is why the app is a real integration test — it exercises failure paths Storybook stories show in isolation.

## Data flow

Panels call hooks, never fetch inline:
```tsx
function StatRow() {
  const { data, status } = useMetrics()
  if (status === 'loading') return <StatRowSkeleton />
  if (status === 'error')   return <PanelError onRetry={…} />
  if (!data.length)         return <EmptyState … />
  return <div className="grid …">{data.map(m => <MetricCard key={m.id} {...m} />)}</div>
}
```
The hooks return mock data now and can simulate `loading`/`error` (see `data-modeling.md`), so the live dashboard actually renders skeletons and error states, not just the happy path.

## Orchestration (motion)

On mount, stagger the panels in with an `animationDelay` ladder (`fadeSlideUp` from the motion layer); scroll-reveal below-the-fold panels with `IntersectionObserver` toggling `.reveal`→`.reveal.in`. If Framer Motion was opted in (off by default), it lives here — layout/gesture animation for the app only. Everything respects `prefers-reduced-motion`.

## Theme toggle

`App.tsx` mounts a small toggle in the top bar that sets `data-theme` on `document.documentElement`, persists to `localStorage`, and initializes from `prefers-color-scheme`. Components already read themeable tokens, so nothing else changes.

## Design elevation — run the `impeccable` skill on the dashboard

A functional grid isn't the goal; the dashboard is the *showcase*. Once the app assembles and builds, run the **`impeccable`** skill's design passes on it to lift it from "works" to "striking." This is where the demo earns attention.

**Passes, in this order** (structure → type → impact → motion):
1. **`layout`** — spacing, visual rhythm, hierarchy, composition. Kills the monotonous even grid; establishes a real focal point and a considered spatial system.
2. **`typeset`** — font pairing, type scale, weight, readability. Makes headings, KPI numerals, and labels feel intentional instead of default.
3. **`bolder`** — amplifies a safe layout into something with character and impact (a hero KPI, a confident header, stronger contrast moments).
4. **`animate`** — purposeful entrance orchestration and micro-interactions (builds on the motion layer already in `index.css`).

**Dial it by level** (respect build time):
- **minimal** → `layout` + `typeset` (clean, well-composed, readable — cheap, high value).
- **standard** → + `bolder` + `animate`.
- **elaborate** → all four; optionally `impeccable overdrive` for one genuinely ambitious moment.

**Scope — critical boundary:** the passes target the **dashboard site only** (`App.tsx` + `src/dashboard/`: layout shell, panels, section composition, the app's own headings/type, entrance motion). They do **not** rewrite the library components in `src/components/` — those stay systematic and token-driven. If a pass wants a bolder component treatment, push it back as a **token or a component variant**, never a one-off style on the dashboard, so the library stays the source of truth.

**Context is already there:** impeccable loads `PRODUCT.md`/`DESIGN.md` (case-insensitive, project root). Your generated `product.md` + `design.md` satisfy this — make sure `product.md` includes a `register: product` line and a short users/brand/tone section (see `data-modeling.md`) so impeccable treats it as product UI (design serves the product), not a marketing page.

**How to run:** invoke the impeccable skill per pass against the app, e.g. `layout src/dashboard`, then `typeset`, then `bolder`, then `animate`. Let each pass edit, then re-verify (`tsc` + `vite build`) before the next. Keep the token discipline: elevated styles resolve through the same semantic tokens so theming survives.

**If `impeccable` isn't installed** in the environment, don't block — apply its principles inline: break the even grid with a clear focal point and deliberate spacing rhythm; set an intentional type scale with real weight contrast (big confident KPI numerals, quiet labels); give the header/hero KPI genuine boldness; and orchestrate a staggered entrance with a few purposeful micro-interactions. Same outcome, done by hand.

**Model:** these passes are the most taste-dependent step in the whole skill — run them on a top-tier model: **Fable 5 or Opus** (or `/fast`). Fable leans creative and is an especially good fit for design elevation. The mechanical scaffold earlier is model-agnostic, but this is where a stronger model visibly separates a striking demo from a generic one.
