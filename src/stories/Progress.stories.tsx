import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from '@/components/ui/progress'

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
}
export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  args: { value: 65 },
  render: (args) => <Progress className="w-[280px]" {...args} />,
}

export const EdgeValues: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col gap-3">
      <Progress value={0} />
      <Progress value={100} />
      <Progress value={120} />
    </div>
  ),
}
