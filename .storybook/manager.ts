import { addons } from '@storybook/manager-api'
import { brandTheme } from './theme'

addons.setConfig({
  theme: brandTheme,
  showPanel: true,
  // Addon panel (Controls, Actions…) docks to the right as a vertical column instead of below the canvas.
  panelPosition: 'right',
})
