// generated from design.md — do not hand-edit

export const colors = {
  dark: {
    background: '#0a0e14',
    foreground: '#eef4f9',
    foregroundStrong: '#f8fbfd',
    foregroundBody: '#b8c4cf',
    foregroundMuted: '#7c8894',
    card: '#12181f',
    cardRaised: '#1a2129',
    border: '#263140',
    primary: '#22d3ee',
    primaryForeground: '#0a0e14',
    primaryTint: 'rgba(34,211,238,.10)',
    amber: '#fbbf24',
    amberTint: 'rgba(251,191,36,.10)',
    violet: '#a78bfa',
    violetTint: 'rgba(167,139,250,.10)',
    destructive: '#f87171',
    ring: '#67e8f9',
  },
  light: {
    background: '#f4f7fa',
    foreground: '#0d1420',
    foregroundStrong: '#060a10',
    foregroundBody: '#414c59',
    foregroundMuted: '#5f6a78',
    card: '#ffffff',
    cardRaised: '#eef2f6',
    border: '#d7dee6',
    primary: '#0e7490',
    primaryForeground: '#ffffff',
    primaryTint: 'rgba(14,116,144,.08)',
    amber: '#b45309',
    amberTint: 'rgba(180,83,9,.08)',
    violet: '#7c3aed',
    violetTint: 'rgba(124,58,237,.08)',
    destructive: '#dc2626',
    ring: '#0891b2',
  },
} as const

export type ThemeMode = keyof typeof colors
export type ColorKey = keyof typeof colors.dark

export const fonts = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const

export const radius = {
  card: '0.875rem',
  btn: '0.625rem',
  icon: '0.75rem',
  chip: '0.375rem',
  pill: '9999px',
} as const

export const shadows = {
  cyan: '0 4px 14px rgba(34,211,238,.22)',
  cyanHover: '0 8px 24px rgba(34,211,238,.32)',
} as const

export const spacing = {
  sp1: 4,
  sp2: 8,
  sp3: 12,
  sp4: 16,
  sp5: 24,
  sp6: 32,
  sp7: 48,
  sp8: 64,
} as const

export interface TypeRole {
  size: string
  weight: number
  lh: string
  ls: string
  font: 'display' | 'body' | 'mono'
}

export const typeScale: Record<string, TypeRole> = {
  displayXl: { size: '44px', weight: 600, lh: '1.05', ls: '-0.02em', font: 'display' },
  displayLg: { size: '30px', weight: 600, lh: '1.1', ls: '-0.02em', font: 'display' },
  heading: { size: '20px', weight: 600, lh: '1.2', ls: '-0.01em', font: 'display' },
  body: { size: '15px', weight: 400, lh: '1.5', ls: '0', font: 'body' },
  bodySm: { size: '13px', weight: 400, lh: '1.45', ls: '0', font: 'body' },
  label: { size: '11px', weight: 500, lh: '1.3', ls: '0.06em', font: 'mono' },
  numeral: { size: '15px', weight: 500, lh: '1.3', ls: '0', font: 'mono' },
}

export const motion = {
  easeOutExpo: 'cubic-bezier(.16,1,.3,1)',
  durFast: '150ms',
  durBase: '260ms',
  durSlow: '480ms',
  durStagger: '60ms',
} as const
