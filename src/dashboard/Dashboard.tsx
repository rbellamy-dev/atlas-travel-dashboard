import * as React from 'react'
import { TopBar } from './panels/TopBar'
import { OpsBoard } from './panels/OpsBoard'
import { StatRow } from './panels/StatRow'
import { TripFeed } from './panels/TripFeed'
import { GoalPanel } from './panels/GoalPanel'
import { PanelBoundary } from './panels/PanelBoundary'

const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})
const dateFmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

function ClockReadout() {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="hidden text-right sm:block" aria-hidden="true">
      <p className="eyebrow mb-1">{dateFmt.format(now)}</p>
      <p className="font-tabular font-mono text-lg font-medium text-foreground-strong">
        {timeFmt.format(now)}
      </p>
    </div>
  )
}

export function Dashboard() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <TopBar />

      <main id="main" className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 animate-fade-slide-up">
          <div>
            <p className="eyebrow mb-2">Trip ops</p>
            <h1 className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground-strong">
              Where every trip stands
            </h1>
          </div>
          <ClockReadout />
        </header>

        <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="animate-fade-slide-up" style={{ animationDelay: '60ms' }}>
            <PanelBoundary name="Operations">
              <OpsBoard />
            </PanelBoundary>
          </div>
          <div className="animate-fade-slide-up" style={{ animationDelay: '140ms' }}>
            <PanelBoundary name="Stats">
              <StatRow />
            </PanelBoundary>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <div className="animate-fade-slide-up" style={{ animationDelay: '220ms' }}>
            <PanelBoundary name="Trips">
              <TripFeed />
            </PanelBoundary>
          </div>
          <aside
            aria-label="Goal"
            className="animate-fade-slide-up self-start lg:sticky lg:top-20"
            style={{ animationDelay: '300ms' }}
          >
            <PanelBoundary name="Goal">
              <GoalPanel />
            </PanelBoundary>
          </aside>
        </div>
      </main>
    </div>
  )
}
