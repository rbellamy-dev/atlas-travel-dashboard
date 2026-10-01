import type { Meta, StoryObj } from '@storybook/react'

import { Code, DocPage, LinkCard, Note, PageHeader, Section } from '../docs/doc-layout'

const meta: Meta = {
  title: 'Foundation/Overview',
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const layers = [
  {
    step: '1',
    title: 'Primitives',
    body: 'Raw, fixed values named by what they are. The same in both themes.',
    example: '--cyan-400: #22d3ee',
  },
  {
    step: '2',
    title: 'Semantics',
    body: 'Values named by their job. Each points at a primitive, with a dark and a light value.',
    example: '--primary: var(--cyan-400)',
  },
  {
    step: '3',
    title: 'Components',
    body: 'Style themselves with semantic Tailwind utilities — never primitives or hex.',
    example: '<Button> → bg-primary text-primary-foreground',
  },
]

const pipeline = [
  { file: 'src/tokens.json', role: 'The one file you edit' },
  { file: 'npm run tokens', role: 'Generates the rest' },
  { file: 'primitives.css + semantics.css', role: 'App and Storybook styles' },
  { file: 'tokens.ts', role: 'Storybook theme and these pages' },
]

export const Overview: Story = {
  render: () => (
    <DocPage>
      <PageHeader
        eyebrow="Atlas design system"
        title="Overview"
        description="How Atlas's tokens and components fit together. Start with the two token layers, then see the components that use them."
      />

      <Section title="How the layers relate" description="Two token layers, then components that consume them.">
        <div className="grid gap-4 md:grid-cols-3">
          {layers.map((layer) => (
            <div key={layer.title} className="flex flex-col rounded-card border border-border bg-card p-5">
              <p className="eyebrow mb-2">Layer {layer.step}</p>
              <p className="font-display text-heading text-foreground-strong">{layer.title}</p>
              <p className="mt-2 flex-1 text-body-sm">{layer.body}</p>
              <code className="mt-4 block truncate rounded-chip bg-card-raised px-2 py-1.5 font-mono text-[12px] text-primary" title={layer.example}>
                {layer.example}
              </code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Where tokens come from" description="One source file; everything else is generated from it.">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((item, i) => (
            <li key={item.file} className="relative rounded-card border border-border bg-card p-4">
              <span className="font-mono text-label text-foreground-muted">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-1 font-mono text-body-sm text-foreground-strong">{item.file}</p>
              <p className="mt-1 text-body-sm text-foreground-muted">{item.role}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Explore">
        <div className="grid gap-3 md:grid-cols-3">
          <LinkCard title="Primitives" description="Palette, spacing scale and motion" to="Foundation/Primitives" />
          <LinkCard title="Semantics" description="Colour roles per theme, type scale, radius, shadows" to="Foundation/Semantics" />
          <LinkCard title="Components" description="UI, Travel and Recipes — and how they use tokens" to="Components/Overview" />
        </div>
      </Section>

      <Note title="Tip">
        Use the theme switcher in the toolbar to see the light values. Semantic tokens change with it;
        primitives don&apos;t. To change a value, edit <Code>src/tokens.json</Code> and run{' '}
        <Code>npm run tokens</Code>.
      </Note>
    </DocPage>
  ),
}
