# Atlas — Product brief
register: product   # a dashboard is product UI (design serves the product), not a marketing page

## Users & brand
Frequent travelers and travel-ops coordinators who track several trips at once — flights, spend, and status — and want a glanceable, console-like read on "what's happening right now." Brand tone: precise, calm, data-dense, a little bit "flight radar" — confident readouts, not cutesy travel-blog warmth. Anti-reference: pastel vacation-brochure dashboards.

## What & who
Atlas is a travel-analytics dashboard: it surfaces trip status, spend, and travel stats across a traveler's active and upcoming trips. Audience: people juggling 3-6 trips a year (business + leisure) who want one screen for "where am I in each trip, and what's it costing."

## Dashboard
Standard level — KPI row + main trip feed + a goal/progress panel, scaled up slightly with a status-filter rail:
- **Top bar** — logo and theme toggle.
- **Ops board** — hero readout: next departure with a progress bar, plus delayed/upcoming callouts.
- **Stat row** — 4 KPI tiles: Active Trips, YTD Spend, Miles Traveled, Avg Trip Length.
- **Trip feed** — list of `TripCard`s (destination, dates, status, budget-used bar), filterable by status via `Tabs` (All / Upcoming / In-Transit / Delayed / Completed) and a search `Input`.
- **Goal panel (side rail)** — `BudgetRing` showing annual travel-budget usage as a circular progress ring, plus a compact "next departure" callout.

## Component inventory

**UI primitives** (shadcn new-york): `button`, `card`, `badge`, `input`, `tabs`, `progress`, `skeleton`.

**Domain components** (`src/components/travel/`):
| Component | Backed by | Accent usage |
|---|---|---|
| `IconContainer` | — | owns the shared `Accent` union: `cyan` (primary) \| `amber` \| `violet` |
| `MetricCard` | skeleton | numeral tinted by accent role, trend arrow |
| `TripCard` | badge, progress, skeleton | status badge + budget bar (`upcoming`→violet, `in-transit`→cyan, `delayed`→amber, `completed`→muted) |
| `BudgetRing` | skeleton | SVG progress ring, accent-driven glow (`cyan` default) |
| `EmptyState` | button | shared across all empty collections |
| `PanelError` | button | shared inline error + retry |

**States.** Components own Default + Loading; panels own Empty + Error via `EmptyState` / `PanelError`.

**Stories.** One per component, grouped under `Components/UI`, `Components/Travel` and `Components/Recipes`, with a `Components/Overview` index. `Foundation/` holds the token pages: Overview, Primitives and Semantics.

## Data model
See `design.md` for tokens; entities live in `src/dashboard/types.ts`:
- `Trip` — id, destination, country, startDate, endDate, status (`upcoming`\|`in-transit`\|`delayed`\|`completed`), travelers, budgetUsed, budgetTotal, flightCode?
- `Metric` — id, label, value, unit?, trend?, accent?
- `TravelGoal` — id, title, current, target, unit?, accent?

Mock data: 6 trips spanning all four statuses (e.g. Lisbon, Tokyo, Vancouver, Nairobi, Reykjavík, Singapore) with realistic dates, flight codes, and budgets; one annual `TravelGoal` (e.g. "2026 travel budget" or "countries visited").
