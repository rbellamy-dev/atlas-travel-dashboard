import { BudgetRing } from '@/components/travel/budget-ring'
import { PanelError } from '@/components/travel/panel-error'
import { useTravelGoal } from '../hooks'
import { nextDeparture } from '../data'
import { Plane } from 'lucide-react'

export function GoalPanel() {
  const { data, status, retry } = useTravelGoal()

  if (status === 'error') {
    return <PanelError message="Couldn't load your travel goal." onRetry={retry} />
  }

  return (
    <div className="flex flex-col gap-4">
      <BudgetRing
        label={status === 'loading' ? '' : data.title}
        current={data.current}
        target={data.target}
        unit={data.unit}
        accent={data.accent}
        loading={status === 'loading'}
      />

      <div className="rounded-card border border-border bg-card p-4">
        <p className="eyebrow mb-2">Next departure</p>
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-icon bg-primary-tint">
            <Plane className="size-4 text-primary" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-semibold text-foreground-strong">
              {nextDeparture.destination}
            </p>
            <p className="font-tabular truncate font-mono text-[11px] text-foreground-muted">
              {nextDeparture.flightCode} · {nextDeparture.date}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
