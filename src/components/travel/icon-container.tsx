import * as React from 'react'
import { cn } from '@/lib/utils'

export type Accent = 'cyan' | 'amber' | 'violet'

// CSS var references, not literal hex — resolve live against the current theme
// (each of these is redefined under :root[data-theme='light'] in index.css).
export const accentVar: Record<Accent, string> = {
  cyan: 'var(--primary)',
  amber: 'var(--amber)',
  violet: 'var(--violet)',
}

const containerVariants: Record<Accent, string> = {
  cyan: 'bg-primary-tint [&_svg]:stroke-primary',
  amber: 'bg-amber-tint [&_svg]:stroke-amber',
  violet: 'bg-violet-tint [&_svg]:stroke-violet',
}

export interface IconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: Accent
  size?: 'sm' | 'md' | 'lg'
}

const sizeVariants: Record<NonNullable<IconContainerProps['size']>, string> = {
  sm: 'size-7 [&_svg]:size-3.5',
  md: 'size-9 [&_svg]:size-4',
  lg: 'size-11 [&_svg]:size-5',
}

export const IconContainer = React.forwardRef<HTMLDivElement, IconContainerProps>(
  ({ className, accent = 'cyan', size = 'md', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-icon',
        containerVariants[accent],
        sizeVariants[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
IconContainer.displayName = 'IconContainer'
