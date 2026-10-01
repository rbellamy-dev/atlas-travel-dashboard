import type { Meta, StoryObj } from '@storybook/react'
import { IconContainer } from '@/components/travel/icon-container'
import { Plane, AlertTriangle, CalendarClock } from 'lucide-react'

const meta: Meta<typeof IconContainer> = {
  title: 'Components/Travel/IconContainer',
  component: IconContainer,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    accent: { control: 'select', options: ['cyan', 'amber', 'violet'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta
type Story = StoryObj<typeof IconContainer>

export const Default: Story = {
  args: { accent: 'cyan', size: 'md' },
  render: (args) => (
    <IconContainer {...args}>
      <Plane />
    </IconContainer>
  ),
}

export const AccentRoles: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <IconContainer accent="cyan">
          <Plane />
        </IconContainer>
        <p className="eyebrow">In-transit</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconContainer accent="amber">
          <AlertTriangle />
        </IconContainer>
        <p className="eyebrow">Delayed</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconContainer accent="violet">
          <CalendarClock />
        </IconContainer>
        <p className="eyebrow">Upcoming</p>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <IconContainer size="sm">
        <Plane />
      </IconContainer>
      <IconContainer size="md">
        <Plane />
      </IconContainer>
      <IconContainer size="lg">
        <Plane />
      </IconContainer>
    </div>
  ),
}
