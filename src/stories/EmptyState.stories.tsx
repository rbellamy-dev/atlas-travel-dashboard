import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from '@/components/travel/empty-state'
import { Plane, Search, Wallet } from 'lucide-react'

const meta: Meta<typeof EmptyState> = {
  title: 'Travel/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    icon: { control: false },
  },
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: Plane,
    message: 'No trips booked yet — add your first trip to see it here.',
    action: { label: 'Add a trip', onClick: () => {} },
  },
  render: (args) => <EmptyState className="w-[360px]" {...args} />,
}

export const WithoutAction: Story = {
  args: {
    icon: Search,
    message: 'No trips match this filter.',
  },
  render: (args) => <EmptyState className="w-[360px]" {...args} />,
}

export const AcrossCollections: Story = {
  render: () => (
    <div className="grid gap-3">
      <EmptyState
        className="w-[360px]"
        icon={Plane}
        message="No trips booked yet — add your first trip to see it here."
        action={{ label: 'Add a trip', onClick: () => {} }}
      />
      <EmptyState
        className="w-[360px]"
        icon={Wallet}
        message="No spend recorded for this trip."
      />
    </div>
  ),
}

export const EdgeData: Story = {
  render: () => (
    <EmptyState
      className="w-[360px]"
      icon={Search}
      message="No trips match “Reykjavík extended stopover” across any status — try clearing the filter or widening the date range."
      action={{ label: 'Clear all filters', onClick: () => {} }}
    />
  ),
}
