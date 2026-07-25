import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { IconContainer } from './icon-container'
import { MapPin, Users, Plane, Clock, AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react'

export type TripStatus = 'upcoming' | 'in-transit' | 'delayed' | 'completed'

const statusMeta: Record<
  TripStatus,
  { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  upcoming: {
    label: 'Upcoming',
    badgeClass: 'bg-violet-tint text-violet border-transparent',
    icon: CalendarClock,
  },
  'in-transit': {
    label: 'In-Transit',
    badgeClass: 'bg-primary-tint text-primary border-transparent',
    icon: Plane,
  },
  delayed: {
    label: 'Delayed',
    badgeClass: 'bg-amber-tint text-amber border-transparent',
    icon: AlertTriangle,
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-card text-foreground-muted border-border',
    icon: CheckCircle2,
  },
}

export interface TripCardProps extends React.HTMLAttributes<HTMLDivElement> {
  destination: string
  country: string
  startDate: string
  endDate: string
  status: TripStatus
  travelers: number
  budgetUsed: number
  budgetTotal: number
  flightCode?: string
  loading?: boolean
}

export const TripCard = React.forwardRef<HTMLDivElement, TripCardProps>(
  (
    {
      className,
      destination,
      country,
      startDate,
      endDate,
      status,
      travelers,
      budgetUsed,
      budgetTotal,
      flightCode,
      loading,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn('rounded-card border border-border bg-card p-4', className)}
          {...props}
        >
          <div className="mb-3 flex items-center gap-3">
            <Skeleton className="size-9 rounded-icon" />
            <div className="flex-1">
              <Skeleton className="mb-1.5 h-3.5 w-32" />
              <Skeleton className="h-2.5 w-20" />
            </div>
            <Skeleton className="h-5 w-20 rounded-pill" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-pill" />
        </div>
      )
    }

    const meta = statusMeta[status]
    const StatusIcon = meta.icon
    const pct = Math.min(100, Math.max(0, Math.round((budgetUsed / budgetTotal) * 100)))
    const accent = status === 'upcoming' ? 'violet' : status === 'delayed' ? 'amber' : 'cyan'

    return (
      <div
        ref={ref}
        className={cn(
          'group rounded-card border border-border bg-card p-4 transition-all duration-[var(--dur-base)] hover:-translate-y-0.5 hover:border-primary/30',
          className,
        )}
        {...props}
      >
        <div className="mb-3 flex items-start gap-3">
          <IconContainer accent={accent} size="md">
            <MapPin aria-hidden="true" />
          </IconContainer>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[15px] font-semibold text-foreground-strong">
              {destination}
            </p>
            <p className="truncate text-xs text-foreground-muted">{country}</p>
          </div>
          <Badge className={cn('gap-1 shrink-0', meta.badgeClass)}>
            <StatusIcon className="size-3" aria-hidden="true" />
            {meta.label}
          </Badge>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-muted">
          <span className="flex items-center gap-1 font-tabular">
            <Clock className="size-3" aria-hidden="true" />
            {startDate} – {endDate}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3" aria-hidden="true" />
            {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
          </span>
          {flightCode && <span className="font-mono text-[11px] tracking-wide">{flightCode}</span>}
        </div>

        <div className="flex items-center gap-2">
          <Progress value={pct} className="h-1.5 flex-1" aria-label={`Budget used: ${pct}%`} />
          <span className="font-tabular w-9 shrink-0 text-right text-[11px] text-foreground-muted">
            {pct}%
          </span>
        </div>
      </div>
    )
  },
)
TripCard.displayName = 'TripCard'
