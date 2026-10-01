import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Card> = {
  title: 'Components/UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-[340px]">
      <CardHeader>
        <CardTitle>Tokyo</CardTitle>
        <CardDescription>Jul 22 – Jul 29 · Flight NH 106</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground-body">
          Currently in-transit. Budget tracking at 80% of the trip allowance.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">
          View itinerary
        </Button>
      </CardFooter>
    </Card>
  ),
}
