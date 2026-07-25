import * as React from 'react'
import { PanelError } from '@/components/travel/panel-error'

interface PanelBoundaryProps {
  name: string
  children: React.ReactNode
}

interface PanelBoundaryState {
  hasError: boolean
}

export class PanelBoundary extends React.Component<PanelBoundaryProps, PanelBoundaryState> {
  state: PanelBoundaryState = { hasError: false }

  static getDerivedStateFromError(): PanelBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error(`[${this.props.name}] panel error:`, error)
  }

  reset = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) {
      return (
        <PanelError message={`The ${this.props.name} panel couldn't load.`} onRetry={this.reset} />
      )
    }
    return this.props.children
  }
}
