import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/ui/button'
import { Plane } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
  },
}
export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = { args: { children: 'Book trip', variant: 'default' } }

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Plane className="size-4" />
      Track flight
    </Button>
  ),
}
