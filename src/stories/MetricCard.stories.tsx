import type { Meta, StoryObj } from '@storybook/react'
import { MetricCard } from '@/components/travel/metric-card'

const meta: Meta<typeof MetricCard> = {
  title: 'Travel/MetricCard',
  component: MetricCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    trend: { control: 'select', options: ['up', 'down', 'neutral', undefined] },
    accent: { control: 'select', options: [false, true, 'amber', 'violet'] },
  },
}
export default meta
type Story = StoryObj<typeof MetricCard>

export const Default: Story = {
  args: { label: 'Active Trips', value: 4, trend: 'up', trendLabel: '+1' },
  render: (args) => <MetricCard className="w-[180px]" {...args} />,
}

export const Loading: Story = {
  args: { label: 'Active Trips', value: 4, loading: true },
  render: (args) => <MetricCard className="w-[180px]" {...args} />,
}

export const AccentRoles: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-3">
      <MetricCard className="w-[160px]" label="On-Time" value={92} unit="%" accent="cyan" />
      <MetricCard className="w-[160px]" label="Delayed" value={1} accent="amber" />
      <MetricCard className="w-[160px]" label="Upcoming" value={2} accent="violet" />
    </div>
  ),
}

export const EdgeData: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard className="w-[180px]" label="Miles Traveled" value={38240} trend="up" trendLabel="8%" />
      <MetricCard className="w-[180px]" label="Zero Trips" value={0} trend="neutral" />
    </div>
  ),
}
