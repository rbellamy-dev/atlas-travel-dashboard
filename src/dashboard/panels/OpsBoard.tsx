import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { PanelError } from '@/components/travel/panel-error'
import { EmptyState } from '@/components/travel/empty-state'
import { useTrips } from '../hooks'
import { currency } from '../format'
import { AlertTriangle, CalendarClock, Plane } from 'lucide-react'

export function OpsBoard() {
  const { data, status, retry } = useTrips()

  if (status === 'error') {
    return <PanelError message="Couldn't load the ops board." onRetry={retry} />
  }

  if (status === 'loading') {
    return (
      <div className="flex h-full min-h-52 flex-col rounded-card border border-border bg-card p-5 sm:p-6">
        <Skeleton className="mb-4 h-2.5 w-28" />
        <Skeleton className="mb-2.5 h-10 w-44" />
        <Skeleton className="mb-6 h-3 w-56" />
        <Skeleton className="mt-auto h-2 w-full" />
      </div>
    )
  }

  const inTransit = data.find((t) => t.status === 'in-transit')
  const nextUp = data.find((t) => t.status === 'upcoming')
  const delayed = data.find((t) => t.status === 'delayed')
  const featured = inTransit ?? nextUp ?? data[0]

  if (!featured) {
    return <EmptyState icon={Plane} message="No trips on the board yet." />
  }

  const budgetPct = Math.min(
    100,
    Math.max(0, Math.round((featured.budgetUsed / featured.budgetTotal) * 100)),
  )
  const showNextUp = Boolean(nextUp && inTransit)

  return (
    <section
      aria-labelledby="ops-heading"
      className="console-grid relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-card p-5 sm:p-6"
    >
      <div className="relative flex items-center gap-2.5">
        <span className="live-dot" aria-hidden="true" />
        <h2 id="ops-heading" className="eyebrow">
          {inTransit ? 'In transit now' : 'Next departure'}
        </h2>
        {featured.flightCode && (
          <span className="ml-auto font-mono text-[11px] font-medium tracking-[0.06em] text-primary">
            {featured.flightCode}
          </span>
        )}
      </div>

      <div className="relative mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-mono text-[38px] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground-strong sm:text-[44px]">
          {featured.destination}
        </p>
        <span className="text-sm text-foreground-muted">{featured.country}</span>
      </div>
      <p className="font-tabular relative mt-2 font-mono text-xs text-foreground-muted">
        {featured.startDate} – {featured.endDate} · {featured.travelers}{' '}
        {featured.travelers === 1 ? 'traveler' : 'travelers'}
      </p>

      <div className="relative mt-5 flex items-center gap-3">
        <Progress
          value={budgetPct}
          className="h-1 flex-1"
          aria-label={`Trip budget used: ${budgetPct}%`}
        />
        <span className="font-tabular shrink-0 font-mono text-[11px] text-foreground-muted">
          {currency.format(featured.budgetUsed)} / {currency.format(featured.budgetTotal)}
        </span>
      </div>

      {(delayed || showNextUp) && (
        <div className="relative mt-auto pt-6">
          <div className="flex flex-col gap-2.5 border-t border-border pt-4 sm:flex-row sm:items-center sm:gap-6">
            {delayed && (
              <span
                className="flex items-center gap-1.5 text-xs text-foreground-body animate-badge-pop"
                style={{ animationDelay: '420ms' }}
              >
                <AlertTriangle className="size-3.5 text-amber" aria-hidden="true" />
                {delayed.destination}
                <span className="font-mono text-[11px] font-medium text-amber">Delayed</span>
                {delayed.flightCode && (
                  <span className="font-mono text-[11px] text-foreground-muted">
                    {delayed.flightCode}
                  </span>
                )}
              </span>
            )}
            {showNextUp && nextUp && (
              <span
                className="flex items-center gap-1.5 text-xs text-foreground-body animate-badge-pop"
                style={{ animationDelay: '500ms' }}
              >
                <CalendarClock className="size-3.5 text-violet" aria-hidden="true" />
                Next up: {nextUp.destination}
                <span className="font-tabular font-mono text-[11px] text-foreground-muted">
                  {nextUp.startDate}
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
