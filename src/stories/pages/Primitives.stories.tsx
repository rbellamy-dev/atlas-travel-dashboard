import type { Meta, StoryObj } from '@storybook/react'

import { motion, palette, spacing } from '@/tokens'
import { Code, DocPage, GroupTitle, Note, PageHeader, Section } from '../docs/doc-layout'

const meta: Meta = {
  title: 'Foundation/Primitives',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

/** camelCase -> kebab-case, matching how build-tokens names CSS vars. */
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const hueNotes: Record<string, string> = {
  gray: 'neutral text in both themes, so colour only appears where it means something. White and black (never pure) sit here too.',
  slate: 'light-mode surfaces, with a trace of teal.',
  teal: 'dark-mode surfaces, and the brand accent: 300 on dark, 650 on light.',
  blue: 'upcoming trips.',
  coral: 'the only warm hue: delayed trips and errors, so a problem is the first thing you see.',
}

/** Group palette keys by hue: 'teal-950' -> 'teal'. White and black belong with the grays. */
const paletteGroups = Object.entries(palette).reduce<Record<string, [string, string][]>>((groups, [name, value]) => {
  const hue = name === 'white' || name === 'black' ? 'gray' : name.replace(/-\d+$/, '')
  ;(groups[hue] ??= []).push([name, value])
  return groups
}, {})

const durations = Object.entries(motion).filter(([k]) => k.startsWith('dur'))
const easings = Object.entries(motion).filter(([k]) => k.startsWith('ease'))

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Reads the CSS var, so this is what the browser actually resolves. */}
      <div className="h-14 rounded-icon border border-border" style={{ background: `var(--${name})` }} />
      <div className="min-w-0">
        <p className="truncate font-mono text-[12px] text-foreground">--{name}</p>
        <p className="font-mono text-[11px] text-foreground-muted">{value}</p>
      </div>
    </div>
  )
}

function MotionCard({ name, value, kind }: { name: string; value: string; kind: 'ease' | 'duration' }) {
  // Hover to play: the dot crosses the track with this easing (600ms) or this duration (ease-out-expo).
  const timing =
    kind === 'ease'
      ? { transitionTimingFunction: `var(--${name})`, transitionDuration: '600ms' }
      : { transitionDuration: `var(--${name})`, transitionTimingFunction: 'var(--ease-out-expo)' }
  return (
    <div className="group rounded-card border border-border bg-card p-4">
      <div className="relative h-6 rounded-pill bg-card-raised">
        <div
          className="absolute top-1 left-1 size-4 rounded-full bg-primary transition-[left] group-hover:left-[calc(100%-1.25rem)]"
          style={timing}
        />
      </div>
      <p className="mt-3 font-mono text-[12px] text-foreground">--{name}</p>
      <p className="font-mono text-[11px] text-foreground-muted">{value}</p>
    </div>
  )
}

export const Primitives: Story = {
  render: () => (
    <DocPage>
      <PageHeader
        eyebrow="Foundation · Layer 1"
        title="Primitives"
        description="Raw values, named by what they are. They're the same in both themes. Components never use them directly. Semantic tokens point at them instead."
      />

      <p className="-mt-4 mb-10 text-body-sm text-foreground-muted">
        Source: <Code>tokens.json → primitives</Code> · generated into <Code>src/primitives.css</Code>
      </p>

      <Section title="Color" description="The palette, grouped by hue and numbered by lightness (25 lightest, 975 darkest).">
        <div className="flex flex-col gap-8">
          {Object.entries(paletteGroups).map(([hue, swatches]) => (
            <div key={hue}>
              <GroupTitle title={hue} description={hueNotes[hue]} />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {swatches.map(([name, value]) => (
                  <Swatch key={name} name={name} value={value} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Spacing"
        description={
          <>
            Atlas uses Tailwind&apos;s default 4px scale, so spacing isn&apos;t emitted as CSS variables. These are the
            steps in use. For example, <Code>sp4</Code> is <Code>p-4</Code>.
          </>
        }
      >
        <div className="flex flex-col gap-2">
          {Object.entries(spacing).map(([name, px]) => (
            <div key={name} className="grid grid-cols-[3rem_7rem_1fr] items-center gap-3">
              <span className="font-mono text-[12px] text-foreground">{name}</span>
              <span className="font-mono text-[11px] text-foreground-muted">
                {px}px · p-{px / 4}
              </span>
              <div className="h-3 rounded-chip bg-primary" style={{ width: px }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Motion" description="One easing curve for everything, and four durations. Hover a card to play it.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {easings.map(([k, v]) => (
            <MotionCard key={k} name={kebab(k)} value={v} kind="ease" />
          ))}
          {durations.map(([k, v]) => (
            <MotionCard key={k} name={kebab(k)} value={v} kind="duration" />
          ))}
        </div>
      </Section>

      <Note title="Not here yet">
        Typography, radius and shadows don&apos;t have a primitive layer yet: Atlas names them by role
        (<Code>--radius-card</Code>, <Code>--text-heading</Code>), so they&apos;re on the Semantics page.
      </Note>
    </DocPage>
  ),
}
