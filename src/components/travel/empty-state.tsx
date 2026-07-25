import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  message: string
  action?: { label: string; onClick: () => void }
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, message, action, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      <div className="flex size-11 items-center justify-center rounded-icon bg-card-raised">
        <Icon className="size-5 text-foreground-muted" aria-hidden="true" />
      </div>
      <p className="max-w-[280px] text-sm text-foreground-body">{message}</p>
      {action && (
        <Button size="sm" variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  ),
)
EmptyState.displayName = 'EmptyState'
