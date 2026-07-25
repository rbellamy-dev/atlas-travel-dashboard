import * as React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import type { Accent } from './icon-container'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const accentText: Record<Accent, string> = {
  cyan: 'text-primary',
  amber: 'text-amber',
  violet: 'text-violet',
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

function useCountUp(target: number, durationMs = 900) {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = React.useState(0)
  const startRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    // Reduced motion: skip the per-frame rAF loop (and its re-renders) entirely.
    if (reduced) {
      setValue(target)
      return
    }
    let raf: number
    startRef.current = null
    const step = (t: number) => {
      if (startRef.current === null) startRef.current = t
      const elapsed = t - startRef.current
      const progress = Math.min(1, elapsed / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs, reduced])

  return value
}

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: number
  unit?: string
  precision?: number
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  accent?: boolean | Accent
  loading?: boolean
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    { className, label, value, unit, precision = 0, trend, trendLabel, accent, loading, ...props },
    ref,
  ) => {
    const animated = useCountUp(value)

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-card border border-border bg-card-raised px-4 py-3.5',
            className,
          )}
          {...props}
        >
          <Skeleton className="mb-2.5 h-2.5 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      )
    }

    const accentColor = accent === true ? 'cyan' : accent || null
    const valueColor = accentColor ? accentText[accentColor] : 'text-foreground-strong'
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
    const trendColor =
      trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-destructive' : 'text-foreground-muted'

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-card border border-border bg-card-raised px-4 py-3.5 transition-all duration-[var(--dur-base)] hover:-translate-y-0.5 hover:border-primary/30',
          className,
        )}
        {...props}
      >
        <p className="eyebrow mb-1.5 truncate">{label}</p>
        <div className="flex items-end justify-between gap-2">
          <p
            className={cn(
              'font-tabular font-mono text-[26px] font-semibold tracking-[-0.02em]',
              valueColor,
            )}
          >
            {animated.toLocaleString('en-US', { maximumFractionDigits: precision })}
            {unit && <span className="ml-0.5 text-[15px] font-normal text-foreground-muted">{unit}</span>}
          </p>
          {trend && (
            <span
              role="img"
              className={cn('flex items-center gap-0.5 pb-1 text-xs font-medium', trendColor)}
              aria-label={trendLabel ? `trend ${trend}: ${trendLabel}` : `trend ${trend}`}
            >
              <TrendIcon className="size-3.5" aria-hidden="true" />
              {trendLabel}
            </span>
          )}
        </div>
      </div>
    )
  },
)
MetricCard.displayName = 'MetricCard'
