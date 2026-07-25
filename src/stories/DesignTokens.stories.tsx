import type { Meta, StoryObj } from '@storybook/react'
import { colors, fonts, radius, shadows, spacing, typeScale } from '@/tokens'

const meta: Meta = {
  title: 'Foundation/Design Tokens',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <p className="eyebrow mb-3">{title}</p>
      {children}
    </section>
  )
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-card border border-border"
        style={{ background: value }}
      />
      <div>
        <p className="font-mono text-[11px] text-foreground">{name}</p>
        <p className="font-mono text-[10px] text-foreground-muted">{value}</p>
      </div>
    </div>
  )
}

export const AllTokens: Story = {
  name: 'All Tokens',
  render: () => (
    <div className="min-h-dvh bg-background p-8 text-foreground">
      <h1 className="mb-1 font-display text-3xl font-semibold text-foreground-strong">
        Atlas — Design Tokens
      </h1>
      <p className="mb-10 text-sm text-foreground-muted">
        Generated from design.md. Flight-ops dark, dual-theme (dark shown here).
      </p>

      <Section title="Surfaces & Text — dark">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Object.entries(colors.dark).map(([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </div>
      </Section>

      <Section title="Surfaces & Text — light">
        <div className="grid grid-cols-2 gap-4 rounded-card bg-white p-4 sm:grid-cols-4 lg:grid-cols-6">
          {Object.entries(colors.light).map(([name, value]) => (
            <div key={name} className="flex flex-col gap-2">
              <div className="h-16 w-full rounded-card border" style={{ background: value, borderColor: colors.light.border }} />
              <div>
                <p className="font-mono text-[11px]" style={{ color: colors.light.foreground }}>{name}</p>
                <p className="font-mono text-[10px]" style={{ color: colors.light.foregroundMuted }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-4">
          {Object.entries(typeScale).map(([name, role]) => (
            <div key={name} className="flex items-baseline gap-4 border-b border-border pb-3">
              <span className="w-28 shrink-0 font-mono text-[10px] text-foreground-muted">{name}</span>
              <span
                style={{
                  fontFamily: fonts[role.font],
                  fontSize: role.size,
                  fontWeight: role.weight,
                  letterSpacing: role.ls,
                }}
              >
                Flight AT 204 — Gate B12
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex flex-wrap gap-4">
          {Object.entries(radius).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div
                className="size-16 border border-primary/40 bg-primary-tint"
                style={{ borderRadius: value }}
              />
              <span className="font-mono text-[10px] text-foreground-muted">{name} · {value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadows">
        <div className="flex flex-wrap gap-6">
          {Object.entries(shadows).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <div className="size-16 rounded-card bg-card-raised" style={{ boxShadow: value }} />
              <span className="font-mono text-[10px] text-foreground-muted">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing (8px scale)">
        <div className="flex items-end gap-2">
          {Object.entries(spacing).map(([name, value]) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className="w-4 bg-primary" style={{ height: value }} />
              <span className="font-mono text-[9px] text-foreground-muted">{name}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
}
