import { create } from '@storybook/theming'
import { colors } from '../src/tokens'

// generated from design.md — same palette as the app, never hand-synced separately

export const brandTheme = create({
  base: 'dark',
  brandTitle: 'Atlas',
  brandUrl: '.',

  colorPrimary: colors.dark.primary,
  colorSecondary: colors.dark.primary,

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
