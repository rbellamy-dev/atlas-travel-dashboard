import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@/components/ui/input'

const meta: Meta<typeof Input> = {
  title: 'Components/UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Search trips…' },
  render: (args) => <Input className="w-[280px]" {...args} />,
}

export const Disabled: Story = {
  args: { placeholder: 'Search trips…', disabled: true },
  render: (args) => <Input className="w-[280px]" {...args} />,
}
