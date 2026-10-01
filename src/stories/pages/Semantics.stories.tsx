import type { Meta, StoryObj } from '@storybook/react'

import { colorAliases, colors, colorSources, fonts, radius, shadows, typeScale, type ColorKey } from '@/tokens'
import { Code, DocPage, GroupTitle, Note, PageHeader, Section } from '../docs/doc-layout'

const meta: Meta = {
  title: 'Foundation/Semantics',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

/** camelCase -> kebab-case, matching how build-tokens names CSS vars and utilities. */
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/** Reading order for the colour roles. Anything not listed lands in "Other", so new colours still show. */
const colorGroups: { title: string; description: string; keys: string[] }[] = [
  { title: 'Surfaces', description: 'page, cards and the lines between them', keys: ['background', 'card', 'cardRaised', 'border', 'input'] },
  { title: 'Text', description: 'strongest to quietest', keys: ['foregroundStrong', 'foreground', 'foregroundBody', 'foregroundMuted'] },
  { title: 'Brand', description: 'primary actions, focus and highlights', keys: ['primary', 'primaryForeground', 'primaryTint', 'ring'] },
  { title: 'Status', description: 'trip states and errors — each with a tint for badges', keys: ['amber', 'amberTint', 'violet', 'violetTint', 'destructive'] },
]
{
  const listed = colorGroups.flatMap((g) => g.keys)
  const other = Object.keys(colors.dark).filter((k) => !listed.includes(k))
  if (other.length) colorGroups.push({ title: 'Other', description: 'not yet grouped on this page', keys: other })
}

/** One theme's swatch, drawn on that theme's background so tints read correctly. */
function ThemeSwatch({ mode, name }: { mode: 'dark' | 'light'; name: ColorKey }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="rounded-icon p-1.5" style={{ background: colors[mode].background, boxShadow: `inset 0 0 0 1px ${colors[mode].border}` }}>
        <div className="size-8 rounded-chip" style={{ background: colors[mode][name] }} />
      </div>
      <div className="min-w-0">
        <p className="truncate font-mono text-[11px] text-foreground">→ {colorSources[mode][name]}</p>
        <p className="truncate font-mono text-[11px] text-foreground-muted">{colors[mode][name]}</p>
      </div>
    </div>
  )
}

function ColorRow({ name }: { name: ColorKey }) {
  return (
    <div className="grid gap-3 border-b border-border py-3 last:border-b-0 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
      <div className="min-w-0">
        <p className="font-mono text-body-sm text-foreground-strong">--{kebab(name)}</p>
        <p className="font-mono text-[11px] text-foreground-muted">bg-{kebab(name)} · text-{kebab(name)}</p>
      </div>
      <ThemeSwatch mode="dark" name={name} />
      <ThemeSwatch mode="light" name={name} />
    </div>
  )
}

export const Semantics: Story = {
  render: () => (
    <DocPage>
      <PageHeader
        eyebrow="Foundation · Layer 2"
        title="Semantics"
        description="Values named by their job, not their value. Components use these — through Tailwind utilities like bg-card and rounded-card — so a theme or palette change never touches component code."
      />

      <Section title="How a name travels" description="Each colour is a CSS variable, a Tailwind utility, and a pointer to a primitive.">
        <div className="flex flex-wrap items-center gap-2 font-mono text-body-sm">
          <span className="rounded-chip border border-border bg-card px-2.5 py-1.5 text-foreground-muted">--cyan-400</span>
          <span className="text-foreground-muted">→</span>
          <span className="rounded-chip border border-primary/40 bg-primary-tint px-2.5 py-1.5 text-primary">--primary</span>
          <span className="text-foreground-muted">→</span>
          <span className="rounded-chip border border-border bg-card px-2.5 py-1.5 text-foreground">bg-primary · text-primary · border-primary</span>
        </div>
      </Section>

      <Section
        title="Color"
        description="Each role has a dark and a light value; the arrow shows the primitive it points at. Tints are the primitive at 10–12% opacity."
      >
        <div className="mb-2 hidden gap-3 px-0 sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <span className="eyebrow">Token</span>
          <span className="eyebrow">Dark</span>
          <span className="eyebrow">Light</span>
        </div>
        <div className="flex flex-col gap-8">
          {colorGroups.map((group) => (
            <div key={group.title}>
              <GroupTitle title={group.title} description={group.description} />
              <div className="rounded-card border border-border bg-card px-4">
                {group.keys.map((k) => (
                  <ColorRow key={k} name={k as ColorKey} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="shadcn aliases"
        description="Extra colour names shadcn/ui components expect. They map onto the roles above — not a second palette."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(colorAliases).map(([alias, target]) => (
            <div key={alias} className="flex items-center justify-between gap-3 rounded-chip border border-border bg-card px-3 py-2 font-mono text-[12px]">
              <span className="text-foreground">{kebab(alias)}</span>
              <span className="text-foreground-muted">→ {kebab(target)}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography" description="Each role sets size, line height, tracking and weight together, plus one of three font families.">
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {Object.entries(fonts).map(([role, stack]) => (
            <div key={role} className="rounded-card border border-border bg-card p-4">
              <p className="truncate text-heading text-foreground-strong" style={{ fontFamily: `var(--font-${role})` }}>
                Gate B12
              </p>
              <p className="mt-2 font-mono text-[12px] text-foreground">font-{role}</p>
              <p className="truncate font-mono text-[11px] text-foreground-muted">{stack}</p>
            </div>
          ))}
        </div>
        <div className="rounded-card border border-border bg-card px-4">
          {Object.entries(typeScale).map(([role, t]) => {
            const name = kebab(role)
            return (
              <div key={role} className="grid gap-2 border-b border-border py-4 last:border-b-0 sm:grid-cols-[13rem_1fr] sm:items-baseline">
                <div>
                  <p className="font-mono text-[12px] text-foreground">text-{name}</p>
                  <p className="font-mono text-[11px] text-foreground-muted">
                    {t.size} · {t.weight} · {t.lh} · font-{t.font}
                  </p>
                </div>
                <p
                  className="truncate text-foreground-strong"
                  style={{
                    fontFamily: `var(--font-${t.font})`,
                    fontSize: `var(--text-${name})`,
                    lineHeight: `var(--text-${name}--line-height)`,
                    letterSpacing: `var(--text-${name}--letter-spacing)`,
                    fontWeight: `var(--text-${name}--font-weight)`,
                  }}
                >
                  Flight AT 204 — Gate B12
                </p>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="Radius" description="Named by what they round.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Object.entries(radius).map(([role, value]) => (
            <div key={role} className="flex flex-col items-start gap-3 rounded-card border border-border bg-card p-4">
              <div className="size-14 border-2 border-primary bg-primary-tint" style={{ borderRadius: `var(--radius-${kebab(role)})` }} />
              <div>
                <p className="font-mono text-[12px] text-foreground">rounded-{kebab(role)}</p>
                <p className="font-mono text-[11px] text-foreground-muted">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadow" description="Cyan glows for primary actions, rather than grey elevation.">
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(shadows).map(([role, value]) => (
            <div key={role} className="flex items-center gap-5 rounded-card border border-border bg-card p-5">
              <div className="size-14 shrink-0 rounded-btn bg-primary" style={{ boxShadow: `var(--shadow-${kebab(role)})` }} />
              <div className="min-w-0">
                <p className="font-mono text-[12px] text-foreground">shadow-{kebab(role)}</p>
                <p className="truncate font-mono text-[11px] text-foreground-muted" title={value}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Note title="Rule of thumb">
        Components use names from this page — <Code>bg-card</Code>, <Code>text-foreground-muted</Code>,{' '}
        <Code>rounded-card</Code> — never <Code>--cyan-400</Code> or a hex value. If a component needs something that
        isn&apos;t here, add a role in <Code>tokens.json</Code> first.
      </Note>
    </DocPage>
  ),
}
