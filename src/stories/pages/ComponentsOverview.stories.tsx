import type { Meta, StoryObj } from '@storybook/react'

import { Code, DocPage, LinkCard, Note, PageHeader, Section } from '../docs/doc-layout'

const meta: Meta = {
  title: 'Components/Overview',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

/** Sidebar groups under Components. `to` is each component's story title. */
const groups = [
  {
    title: 'UI',
    description:
      'shadcn/ui primitives, restyled through the semantic tokens. Generic — nothing travel-specific.',
    items: [
      { name: 'Badge', description: 'Short status and category labels', to: 'Components/UI/Badge' },
      { name: 'Button', description: 'Actions — default, secondary, outline, ghost, destructive and link, plus icon sizes', to: 'Components/UI/Button' },
      { name: 'Card', description: 'Surface that panels sit on', to: 'Components/UI/Card' },
      { name: 'Input', description: 'Text field', to: 'Components/UI/Input' },
      { name: 'Progress', description: 'Linear progress bar', to: 'Components/UI/Progress' },
      { name: 'Skeleton', description: 'Loading placeholder', to: 'Components/UI/Skeleton' },
      { name: 'Tabs', description: 'Switch between views of the same panel', to: 'Components/UI/Tabs' },
    ],
  },
  {
    title: 'Travel',
    description: 'Atlas-specific components, built from UI pieces and tokens.',
    items: [
      { name: 'BudgetRing', description: 'Ring showing current against a target', to: 'Components/Travel/BudgetRing' },
      { name: 'EmptyState', description: 'What a panel shows when there is no data, with an optional action', to: 'Components/Travel/EmptyState' },
      { name: 'IconContainer', description: 'Tinted icon tile in cyan, amber or violet', to: 'Components/Travel/IconContainer' },
      { name: 'MetricCard', description: 'Headline number with label, unit and trend', to: 'Components/Travel/MetricCard' },
      { name: 'PanelError', description: 'Error state for a dashboard panel', to: 'Components/Travel/PanelError' },
      { name: 'TripCard', description: 'Trip summary with an upcoming / in-transit / delayed / completed badge', to: 'Components/Travel/TripCard' },
    ],
  },
  {
    title: 'Recipes',
    description: 'Components combined the way the dashboard uses them. Not components themselves.',
    items: [{ name: 'StatRow', description: 'A row of MetricCards, as at the top of the dashboard', to: 'Components/Recipes/StatRow' }],
  },
]

export const Overview: Story = {
  render: () => (
    <DocPage>
      <PageHeader
        eyebrow="Atlas design system"
        title="Components"
        description="Everything the dashboard is built from, in three groups. Each component styles itself with semantic tokens only."
      />

      <Section
        title="How components use tokens"
        description="Components pick from the global semantic set — they don't define their own."
      >
        <div className="grid gap-4 text-body-sm md:grid-cols-2">
          <div className="rounded-card border border-border bg-card p-5">
            <p className="font-medium text-foreground-strong">Through Tailwind utilities</p>
            <p className="mt-2">
              A primary button is <Code>bg-primary text-primary-foreground shadow-cyan</Code>; a card is{' '}
              <Code>bg-card rounded-card border-border</Code>. The mapping lives in the component&apos;s class names —
              not in a separate tokens file.
            </p>
          </div>
          <div className="rounded-card border border-border bg-card p-5">
            <p className="font-medium text-foreground-strong">Never primitives or hex</p>
            <p className="mt-2">
              No <Code>--cyan-400</Code>, no <Code>#22d3ee</Code>, no <Code>bg-cyan-400</Code>. That&apos;s what lets the
              light theme, and any future palette change, work without touching component code.
            </p>
          </div>
        </div>
      </Section>

      {groups.map((group) => (
        <Section key={group.title} title={group.title} description={group.description}>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <LinkCard key={item.name} title={item.name} description={item.description} to={item.to} />
            ))}
          </div>
        </Section>
      ))}

      <Note title="Adding a component">
        Generic and reusable → <Code>src/components/ui</Code>, story title <Code>Components/UI/…</Code>. Travel-specific →{' '}
        <Code>src/components/travel</Code>, <Code>Components/Travel/…</Code>. Add it to this page too.
      </Note>
    </DocPage>
  ),
}
