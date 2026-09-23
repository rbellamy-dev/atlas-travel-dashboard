import { addons } from '@storybook/manager-api'
import { brandTheme } from './theme'

addons.setConfig({
  theme: brandTheme,
  showPanel: true,
})
