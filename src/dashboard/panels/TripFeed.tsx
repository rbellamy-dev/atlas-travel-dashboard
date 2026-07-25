import * as React from 'react'
import { TripCard } from '@/components/travel/trip-card'
import { EmptyState } from '@/components/travel/empty-state'
import { PanelError } from '@/components/travel/panel-error'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
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
            <Tabs value={filter} onValueChange={(v) => setFilter(v as TripFilter)}>
              <TabsList>
                {filters.map((f) => (
                  <TabsTrigger key={f.value} value={f.value}>
                    {f.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
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
