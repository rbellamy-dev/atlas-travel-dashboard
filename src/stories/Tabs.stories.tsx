import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Tabs>

export const StatusFilter: Story = {
  render: () => (
    <Tabs defaultValue="all" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="in-transit">In-Transit</TabsTrigger>
        <TabsTrigger value="delayed">Delayed</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="pt-3 text-sm text-foreground-body">
        Showing all 6 trips.
      </TabsContent>
      <TabsContent value="upcoming" className="pt-3 text-sm text-foreground-body">
        Showing 2 upcoming trips.
      </TabsContent>
      <TabsContent value="in-transit" className="pt-3 text-sm text-foreground-body">
        Showing 1 trip in-transit.
      </TabsContent>
      <TabsContent value="delayed" className="pt-3 text-sm text-foreground-body">
        Showing 1 delayed trip.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: /upcoming/i }))
    await expect(canvas.getByText(/2 upcoming trips/i)).toBeVisible()
  },
}
