/**
 * DOC LAYOUT
 *
 * Building blocks for the design-system pages in Storybook (Foundation/*, Components/Overview).
 * Same structure as the design_system scaffold's page-layout — PageHeader, Section, Note,
 * link cards — but styled with Atlas semantic tokens, so the pages follow the toolbar's
 * dark/light switch like every other story.
 */
import type { ReactNode } from 'react'
import { linkTo } from '@storybook/addon-links'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/** Full-bleed page wrapper. Use with `parameters: { layout: 'fullscreen' }`. */
export function DocPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background px-5 py-10 text-foreground-body sm:px-10">
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  )
}

/** Top of every page — eyebrow, title and short intro. */
export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <header className="mb-10 border-b border-border pb-8">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="font-display text-display-lg text-foreground-strong sm:text-display-xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-body text-foreground-body">{description}</p>
    </header>
  )
}

/** Groups related content under a heading. */
export function Section({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('mb-12', className)}>
      <div className="mb-5">
        <h2 className="font-display text-heading text-foreground-strong">{title}</h2>
        {description && <p className="mt-1 max-w-3xl text-body-sm text-foreground-muted">{description}</p>}
      </div>
      {children}
    </section>
  )
}

/** Sub-heading inside a Section (e.g. one colour group). */
export function GroupTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-body-sm font-semibold capitalize text-foreground">{title}</h3>
      {description && <p className="text-body-sm text-foreground-muted">{description}</p>}
    </div>
  )
}

/** Callout for guidance — the scaffold's "Note for students", in Atlas amber. */
export function Note({ title = 'Note', children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="rounded-card border border-amber/30 bg-amber-tint p-4 text-body-sm text-foreground-body">
      <p className="mb-1 font-medium text-amber">{title}</p>
      <div>{children}</div>
    </aside>
  )
}

/** Inline token / class name. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-chip bg-card-raised px-1.5 py-0.5 font-mono text-[12px] text-foreground">
      {children}
    </code>
  )
}

/** Card that navigates to another story, e.g. `to="Foundation/Primitives"`. */
export function LinkCard({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <button
      type="button"
      onClick={linkTo(to)}
      className="group flex w-full items-center justify-between gap-4 rounded-card border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-card-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="min-w-0">
        <p className="font-medium text-foreground-strong">{title}</p>
        <p className="mt-1 text-body-sm text-foreground-muted">{description}</p>
      </div>
      <ArrowRight
        className="size-4 shrink-0 text-foreground-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden="true"
      />
    </button>
  )
}
