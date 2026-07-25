import type { Meta, StoryObj } from '@storybook/react'
import { MetricCard } from '@/components/travel/metric-card'
import { mockMetrics } from '@/dashboard/data'

const meta: Meta = {
  title: 'Recipes/StatRow',
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj

export const StatRow: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {mockMetrics.map((m) => (
        <MetricCard key={m.id} {...m} />
      ))}
    </div>
  ),
}
