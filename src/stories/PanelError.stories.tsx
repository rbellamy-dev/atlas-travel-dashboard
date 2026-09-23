import type { Meta, StoryObj } from '@storybook/react'
import { PanelError } from '@/components/travel/panel-error'

const meta: Meta<typeof PanelError> = {
  title: 'Travel/PanelError',
  component: PanelError,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof PanelError>

export const Default: Story = {
  args: {
    message: "Couldn't load your trips.",
    onRetry: () => {},
  },
  render: (args) => <PanelError className="w-[360px]" {...args} />,
}

export const WithoutRetry: Story = {
  args: {
    message: 'Trip history is unavailable for this account.',
  },
  render: (args) => <PanelError className="w-[360px]" {...args} />,
}

export const PerPanel: Story = {
  name: 'Per-panel messages',
  render: () => (
    <div className="grid gap-3">
      <PanelError className="w-[360px]" message="Couldn't load your stats." onRetry={() => {}} />
      <PanelError className="w-[360px]" message="Couldn't load your trips." onRetry={() => {}} />
      <PanelError className="w-[360px]" message="The Goal panel couldn't load." onRetry={() => {}} />
    </div>
  ),
}

export const EdgeData: Story = {
  render: () => (
    <PanelError
      className="w-[360px]"
      message="Couldn't reach the trips service after three attempts — the connection timed out. Retry, or check back shortly."
      onRetry={() => {}}
    />
  ),
}
