import { Button } from '@/components/ui/button'
import { useTheme } from '../useTheme'
import { Compass, Sun, Moon } from 'lucide-react'

export function TopBar() {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-icon bg-primary-tint">
            <Compass className="size-4 text-primary" aria-hidden="true" />
          </span>
          <span className="font-display text-[17px] font-semibold tracking-[-0.01em] text-foreground-strong">
            Atlas
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  )
}
