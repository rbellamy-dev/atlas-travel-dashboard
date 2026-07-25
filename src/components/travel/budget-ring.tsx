import * as React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { accentVar, type Accent } from './icon-container'

export interface BudgetRingProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  current: number
  target: number
  unit?: string
  accent?: Accent
  size?: number
  loading?: boolean
}

const RADIUS = 46
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export const BudgetRing = React.forwardRef<HTMLDivElement, BudgetRingProps>(
  ({ className, label, current, target, unit, accent = 'cyan', size = 148, loading, ...props }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn('flex flex-col items-center gap-3 rounded-card border border-border bg-card-raised p-5', className)}
          {...props}
        >
          <Skeleton className="rounded-full" style={{ width: size, height: size }} />
          <Skeleton className="h-3 w-24" />
        </div>
      )
    }

    const pct = Math.min(100, Math.max(0, Math.round((current / target) * 100)))
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE
    const glow = accentVar[accent]

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center gap-3 rounded-card border border-border bg-card-raised p-5', className)}
        {...props}
      >
        <div
          className="relative animate-ring-glow"
          style={{ width: size, height: size, ['--ring-glow' as string]: glow }}
        >
          <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={label}
          >
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              strokeWidth="7"
              className="stroke-border"
            />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              style={{
                stroke: glow,
                transition: `stroke-dashoffset var(--dur-slow) var(--ease-out-expo)`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-tabular font-mono text-2xl font-semibold text-foreground-strong">
              {pct}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="eyebrow">{label}</p>
          <p className="font-tabular mt-0.5 text-xs text-foreground-muted">
            {current.toLocaleString('en-US')} / {target.toLocaleString('en-US')}
            {unit ? ` ${unit}` : ''}
          </p>
        </div>
      </div>
    )
  },
)
BudgetRing.displayName = 'BudgetRing'
