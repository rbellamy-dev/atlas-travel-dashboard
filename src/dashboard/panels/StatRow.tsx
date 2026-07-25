import { MetricCard } from '@/components/travel/metric-card'
import { PanelError } from '@/components/travel/panel-error'
import { useMetrics } from '../hooks'

const gridClass = 'grid h-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-2'

export function StatRow() {
  const { data, status, retry } = useMetrics()

  if (status === 'error') {
    return <PanelError message="Couldn't load your stats." onRetry={retry} />
  }

  if (status === 'loading') {
    return (
      <div className={gridClass}>
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCard key={i} label="" value={0} loading />
        ))}
      </div>
    )
  }

  return (
    <div className={gridClass}>
      {data.map((m, i) => (
        <MetricCard
          key={m.id}
          className="animate-cell-reveal"
          style={{ animationDelay: `${140 + i * 60}ms` }}
          {...m}
        />
      ))}
    </div>
  )
}
