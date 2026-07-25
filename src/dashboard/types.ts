import type { Accent } from '@/components/travel/icon-container'
import type { TripStatus } from '@/components/travel/trip-card'

export interface Trip {
  id: string
  destination: string
  country: string
  startDate: string
  endDate: string
  status: TripStatus
  travelers: number
  budgetUsed: number
  budgetTotal: number
  flightCode?: string
}

export interface Metric {
  id: string
  label: string
  value: number
  unit?: string
  precision?: number
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  accent?: boolean | Accent
}

export interface TravelGoal {
  id: string
  title: string
  current: number
  target: number
  unit?: string
  accent?: Accent
}

export type TripFilter = 'all' | TripStatus
