import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCw } from 'lucide-react'

export interface PanelErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string
  onRetry?: () => void
}

export const PanelError = React.forwardRef<HTMLDivElement, PanelErrorProps>(
  ({ className, message, onRetry, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-card border border-border bg-card px-6 py-10 text-center',
        className,
      )}
      {...props}
    >
      <AlertTriangle className="size-6 text-destructive" aria-hidden="true" />
      <p className="max-w-[280px] text-sm text-foreground-body">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RotateCw className="size-3.5" aria-hidden="true" />
          Retry
        </Button>
      )}
    </div>
  ),
)
PanelError.displayName = 'PanelError'
