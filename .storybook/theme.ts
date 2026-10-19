import { create } from '@storybook/theming'
import { colors, palette } from '../src/tokens'

// colors come from src/tokens.ts, generated from src/tokens.json — the same values the app renders

export const brandTheme = create({
  base: 'dark',
  brandTitle: 'Atlas',
  brandUrl: '.',

  colorPrimary: colors.dark.primary,
  // Fills the selected sidebar item behind white text. The bright dark-mode primary only gives
  // white 1.6:1 there; teal-650 (light mode's primary) gives 6.2:1 and reads as a calm highlight.
  colorSecondary: palette['teal-650'],

  appBg: colors.dark.background,
  appContentBg: colors.dark.card,
  appPreviewBg: colors.dark.background,
  appBorderColor: colors.dark.border,
  appBorderRadius: 10,

  fontBase: '"Inter", sans-serif',
  fontCode: '"JetBrains Mono", monospace',

  textColor: colors.dark.foreground,
  textInverseColor: colors.dark.background,
  textMutedColor: colors.dark.foregroundMuted,

  barTextColor: colors.dark.foregroundMuted,
  barSelectedColor: colors.dark.primary,
  barHoverColor: colors.dark.primary,
  barBg: colors.dark.card,

  inputBg: colors.dark.cardRaised,
  inputBorder: colors.dark.border,
  inputTextColor: colors.dark.foreground,
  inputBorderRadius: 8,
})
