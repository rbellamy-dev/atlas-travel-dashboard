import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '@/components/ui/badge'
import { Plane, CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { children: 'Upcoming' } }

export const TripStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className="gap-1 border-transparent bg-violet-tint text-violet">
        <CalendarClock className="size-3" /> Upcoming
      </Badge>
      <Badge className="gap-1 border-transparent bg-primary-tint text-primary">
        <Plane className="size-3" /> In-Transit
      </Badge>
      <Badge className="gap-1 border-transparent bg-amber-tint text-amber">
        <AlertTriangle className="size-3" /> Delayed
      </Badge>
      <Badge className="gap-1 border-border bg-card text-foreground-muted">
        <CheckCircle2 className="size-3" /> Completed
      </Badge>
    </div>
  ),
}
