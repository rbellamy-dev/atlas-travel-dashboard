import type { Meta, StoryObj } from '@storybook/react'
import { BudgetRing } from '@/components/travel/budget-ring'

const meta: Meta<typeof BudgetRing> = {
  title: 'Components/Travel/BudgetRing',
  component: BudgetRing,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    accent: { control: 'select', options: ['primary', 'warning', 'info'] },
  },
}
export default meta
type Story = StoryObj<typeof BudgetRing>

export const Default: Story = {
  args: { label: '2026 Travel Budget Used', current: 11580, target: 18000, unit: 'USD', accent: 'primary' },
}

export const Loading: Story = {
  args: { label: '2026 Travel Budget Used', current: 11580, target: 18000, loading: true },
}

export const AccentRoles: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <BudgetRing label="Budget" current={11580} target={18000} unit="USD" accent="primary" />
      <BudgetRing label="Delayed trips" current={1} target={4} accent="warning" />
      <BudgetRing label="Upcoming" current={2} target={4} accent="info" />
    </div>
  ),
}

export const EdgeData: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <BudgetRing label="Zero progress" current={0} target={18000} unit="USD" />
      <BudgetRing label="Over budget" current={22000} target={18000} unit="USD" accent="warning" />
    </div>
  ),
}
