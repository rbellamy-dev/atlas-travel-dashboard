import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '@/components/ui/skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-6 w-24" />
    </div>
  ),
}
