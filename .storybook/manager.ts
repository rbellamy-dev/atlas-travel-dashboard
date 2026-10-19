import { addons } from '@storybook/manager-api'
import { brandTheme } from './theme'

// Storybook saves the panel's size for good in localStorage, and that beats the config below, so anyone
// who once had it open would always get it open. Forget the saved size on each visit; opening the panel
// still sticks for the rest of the tab's session, which Storybook keeps separately.
try {
  const key = '@storybook/manager/store'
  const saved = JSON.parse(localStorage.getItem(key) ?? 'null')
  if (saved?.layout) {
    delete saved.layout.rightPanelWidth
    delete saved.layout.bottomPanelHeight
    localStorage.setItem(key, JSON.stringify(saved))
  }
} catch {
  // Storage blocked or unreadable: nothing saved to clear.
}

addons.setConfig({
  theme: brandTheme,
  // Addon panel starts closed so the component gets the full canvas; open it from the toolbar or with Option/Alt+A.
  // Storybook 8 reads "closed" from a zero size (showPanel is ignored); reopening restores its usual width.
  rightPanelWidth: 0,
  bottomPanelHeight: 0,
  // When opened, it docks to the right as a vertical column instead of below the canvas.
  panelPosition: 'right',
})
