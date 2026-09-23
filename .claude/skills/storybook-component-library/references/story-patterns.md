# Story patterns

One `*.stories.tsx` per component. Stories are the source of truth for docs, demos, interaction tests, and a11y checks — write them well and they do quadruple duty (see `testing.md`).

## Anatomy

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MetricCard } from '@/components/fitness/metric-card'

const meta: Meta<typeof MetricCard> = {
  title: 'Fitness/MetricCard',            // namespaced by layer: UI/* or {Domain}/*
  component: MetricCard,
  tags: ['autodocs'],                     // opt into the autodocs page
  parameters: { layout: 'centered' },     // centered | padded | fullscreen
  argTypes: {
    trend:  { control: 'select', options: ['up', 'down', 'neutral', undefined] },
    accent: { control: 'select', options: [false, true, 'blue', 'amber', 'violet', 'coral'] },
  },
}
export default meta
type Story = StoryObj<typeof MetricCard>

export const Default: Story = { args: { label: 'Steps', value: 8241, trend: 'up' } }

export const AccentRoles: Story = {   // render-fn for composed showcases
  render: () => (
    <div className="grid grid-cols-3 gap-3 w-[460px]">
      {/* one card per accent role, plus a tiny mono caption describing the demo */}
    </div>
  ),
}
```

Patterns:
- A `Default` args-based story + several `render`-based stories (grids, all-variants, edge cases). Add a small `font-mono text-[10px] text-foreground-muted` caption to render stories that explains what's being shown.
- **State stories are mandatory** for data-driven components: `Loading`, `Empty`, `Error` alongside `Default` (see `state-patterns.md`).
- Stories may pin fixed widths (`w-[340px]`) — that's display only; the component itself stays fluid.

## Play functions (interactive components)

Add a `play` **only where an interaction is worth demoing** (a Sheet opening, a card expanding) — it runs live in the Interactions panel (and is picked up by the test-runner if the user added one). Don't write one per component; that's busywork for a demo. `@storybook/test` is already installed, so plays cost nothing extra.

```tsx
import { within, userEvent, expect } from '@storybook/test'

export const Expands: Story = {
  args: { name: 'Upper Body Push', type: 'strength', duration: '48 min' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole('button', { name: /upper body push/i })
    await userEvent.click(card)
    await expect(card).toHaveAttribute('aria-expanded', 'true')
  },
}
```

Cover: Sheet open → assert content visible; Tabs → assert panel switch; expandable card → assert `aria-expanded`; toggle group → assert pressed state.

## Foundation story — `DesignTokens.stories.tsx`

`title: 'Foundation/Design Tokens'`, `parameters.layout: 'fullscreen'`, **no `component`, no autodocs tag**, a single `export const AllTokens` with `name: 'All Tokens'`. It imports `{ colors, fonts, radius, shadows, spacing, typeScale } from '@/tokens'` and renders swatch grids, a type-scale ramp, radius boxes, shadow cards, and a spacing bar chart with inline styles reading the same CSS vars. A local `<Section>` helper draws the brand eyebrow header. Pinned first via `preview.tsx` `storySort`.

## Recipes (optional, small)

If the user wants to show composition inside Storybook, add 1–2 `Recipes/*` stories (e.g. `Recipes/StatRow`, `Recipes/GoalPanel`) showing 2–3 components combined. Keep them documentation-scale. **Do not** build a full-page dashboard story — the standalone app owns the assembled dashboard.

## storySort

In `preview.tsx`: `storySort: { order: ['Foundation', ['Design Tokens'], 'UI', '{Domain}', 'Recipes', '*'] }` so the sidebar reads foundation → primitives → domain → recipes.
