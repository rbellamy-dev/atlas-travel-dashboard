import type { Meta, StoryObj } from '@storybook/react'
import { TripCard } from '@/components/travel/trip-card'
import { EmptyState } from '@/components/travel/empty-state'
import { PanelError } from '@/components/travel/panel-error'
import { Plane } from 'lucide-react'

const meta: Meta<typeof TripCard> = {
  title: 'Components/Travel/TripCard',
  component: TripCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    status: { control: 'select', options: ['upcoming', 'in-transit', 'delayed', 'completed'] },
  },
}
export default meta
type Story = StoryObj<typeof TripCard>

export const Default: Story = {
  args: {
    destination: 'Tokyo',
    country: 'Japan',
    startDate: 'Jul 22',
    endDate: 'Jul 29',
    status: 'in-transit',
    travelers: 1,
    budgetUsed: 3200,
    budgetTotal: 4000,
    flightCode: 'NH 106',
  },
  render: (args) => <TripCard className="w-[360px]" {...args} />,
}

export const Loading: Story = {
  args: { ...Default.args, loading: true },
  render: (args) => <TripCard className="w-[360px]" {...args} />,
}

export const AllStatuses: Story = {
  render: () => (
    <div className="grid w-[380px] gap-3">
      <TripCard
        destination="Reykjavík"
        country="Iceland"
        startDate="Sep 3"
        endDate="Sep 9"
        status="upcoming"
        travelers={2}
        budgetUsed={200}
        budgetTotal={3100}
        flightCode="FI 632"
      />
      <TripCard
        destination="Tokyo"
        country="Japan"
        startDate="Jul 22"
        endDate="Jul 29"
        status="in-transit"
        travelers={1}
        budgetUsed={3200}
        budgetTotal={4000}
        flightCode="NH 106"
      />
      <TripCard
        destination="Vancouver"
        country="Canada"
        startDate="Jul 24"
        endDate="Jul 27"
        status="delayed"
        travelers={1}
        budgetUsed={1100}
        budgetTotal={1800}
        flightCode="AC 8891"
      />
      <TripCard
        destination="Singapore"
        country="Singapore"
        startDate="Mar 2"
        endDate="Mar 8"
        status="completed"
        travelers={3}
        budgetUsed={3980}
        budgetTotal={4200}
      />
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <EmptyState
      className="w-[360px]"
      icon={Plane}
      message="No trips booked yet — add your first trip to see it here."
      action={{ label: 'Add a trip', onClick: () => {} }}
    />
  ),
}

export const Error: Story = {
  render: () => (
    <PanelError className="w-[360px]" message="Couldn't load your trips." onRetry={() => {}} />
  ),
}

export const EdgeData: Story = {
  render: () => (
    <div className="grid w-[380px] gap-3">
      <TripCard
        destination="Reykjavík, Iceland — extended stopover itinerary"
        country="Iceland"
        startDate="Sep 3"
        endDate="Sep 9"
        status="upcoming"
        travelers={6}
        budgetUsed={0}
        budgetTotal={3100}
      />
      <TripCard
        destination="Singapore"
        country="Singapore"
        startDate="Mar 2"
        endDate="Mar 8"
        status="completed"
        travelers={3}
        budgetUsed={4600}
        budgetTotal={4200}
      />
    </div>
  ),
}
