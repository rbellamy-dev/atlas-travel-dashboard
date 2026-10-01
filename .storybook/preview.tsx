import type { Preview } from '@storybook/react'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { brandTheme } from './theme'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          'Foundation',
          ['Overview', 'Primitives', 'Semantics', 'Design Tokens'],
          'Components',
          ['Overview', 'UI', 'Travel', 'Recipes'],
          '*',
        ],
      },
    },
    docs: {
      theme: brandTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { dark: 'dark', light: 'light' },
      defaultTheme: 'dark',
      attributeName: 'data-theme',
    }),
  ],
}

export default preview
