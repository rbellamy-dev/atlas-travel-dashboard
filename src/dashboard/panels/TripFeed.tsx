import * as React from 'react'
import { TripCard } from '@/components/travel/trip-card'
import { EmptyState } from '@/components/travel/empty-state'
import { PanelError } from '@/components/travel/panel-error'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useTrips } from '../hooks'
import type { TripFilter } from '../types'
import { Plane, Search } from 'lucide-react'

const filters: { value: TripFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'in-transit', label: 'In-Transit' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'completed', label: 'Completed' },
]

export function TripFeed() {
  const { data, status, retry } = useTrips()
  const [filter, setFilter] = React.useState<TripFilter>('all')
  const [query, setQuery] = React.useState('')

  const filtered = data.filter((t) => {
    const matchesFilter = filter === 'all' || t.status === filter
    const matchesQuery = t.destination.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })

  return (
    <section aria-labelledby="trips-heading">
      <div className="mb-4 flex items-baseline gap-2.5">
        <h2
          id="trips-heading"
          className="font-display text-xl font-semibold tracking-[-0.01em] text-foreground-strong"
        >
          Trips
        </h2>
        {status === 'success' && data.length > 0 && (
          <span className="font-tabular font-mono text-[11px] text-foreground-muted">
            {filtered.length} / {data.length}
          </span>
        )}
      </div>

      {status === 'error' ? (
        <PanelError message="Couldn't load your trips." onRetry={retry} />
      ) : status === 'loading' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <TripCard key={i} loading destination="" country="" startDate="" endDate="" status="upcoming" travelers={0} budgetUsed={0} budgetTotal={1} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          icon={Plane}
          message="No trips booked yet. Add your first trip to see it here."
          action={{ label: 'Add a trip', onClick: () => {} }}
        />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Status filter — a single-select segmented control (toggle buttons),
                not a tablist: there are no tabpanels, so aria tab semantics would
                dangle. aria-pressed conveys the active state to assistive tech. */}
            <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:overflow-visible sm:px-0">
              <div
                role="group"
                aria-label="Filter trips by status"
                className="inline-flex h-11 w-max items-center gap-1 rounded-lg bg-muted p-[3px] sm:w-fit"
              >
                {filters.map((f) => {
                  const active = filter === f.value
                  return (
                    <button
                      key={f.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(f.value)}
                      className={cn(
                        'relative inline-flex h-[calc(100%-1px)] items-center justify-center whitespace-nowrap rounded-md border border-transparent px-3 py-1 text-sm font-medium text-muted-foreground transition-all',
                        'hover:text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                        active && 'border-input bg-background text-foreground shadow-sm',
                      )}
                    >
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground-muted" />
              <Input
                placeholder="Search destination…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
                aria-label="Search trips by destination"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Search} message={`No trips match "${query || filter}".`} />
          ) : (
            <div key={filter} className="grid gap-4 sm:grid-cols-2">
              {filtered.map((trip, i) => (
                <TripCard
                  key={trip.id}
                  className="animate-cell-reveal"
                  style={{ animationDelay: `${Math.min(i, 7) * 60}ms` }}
                  {...trip}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
