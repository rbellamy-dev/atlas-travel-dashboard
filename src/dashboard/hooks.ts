import * as React from 'react'
import type { Trip, Metric, TravelGoal } from './types'
import { mockTrips, mockMetrics, mockGoal } from './data'

export type Async<T> = { data: T; status: 'loading' | 'error' | 'success'; retry: () => void }

function useMockAsync<T>(value: T, delayMs = 500, simulateError = false): Async<T> {
  const [state, setState] = React.useState<{ data: T; status: 'loading' | 'error' | 'success' }>({
    data: value,
    status: 'loading',
  })
  const [attempt, setAttempt] = React.useState(0)

  React.useEffect(() => {
    setState({ data: value, status: 'loading' })
    const t = setTimeout(() => {
      setState(simulateError ? { data: value, status: 'error' } : { data: value, status: 'success' })
    }, delayMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulateError, attempt])

  const retry = React.useCallback(() => setAttempt((a) => a + 1), [])
  return { ...state, retry }
}

export function useTrips(simulateError = false): Async<Trip[]> {
  return useMockAsync(mockTrips, 550, simulateError)
}

export function useMetrics(simulateError = false): Async<Metric[]> {
  return useMockAsync(mockMetrics, 400, simulateError)
}

export function useTravelGoal(simulateError = false): Async<TravelGoal> {
  return useMockAsync(mockGoal, 650, simulateError)
}
