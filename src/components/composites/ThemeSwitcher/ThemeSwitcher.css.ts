import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/tokens/contract.css'

/* ── Kompakt geçiş düğmesi (Sun/Moon) ───────────────────────────────────── */

export const toggle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.control.height.sm,
  height: vars.control.height.sm,
  padding: 0,
  border: '1px solid transparent',
  borderRadius: vars.radius.full,
  background: 'transparent',
  color: vars.color.text.secondary,
  cursor: 'pointer',
  transitionProperty: 'background-color, color',
  transitionDuration: vars.duration.fast,
  transitionTimingFunction: vars.ease.standard,

  selectors: {
    '&:hover': {
      background: vars.color.action.ghost.hover,
      color: vars.color.text.primary,
    },
    '&:active': {
      background: vars.color.action.ghost.active,
    },
  },
})

const spin = keyframes({
  from: { transform: 'rotate(0deg) scale(0.8)', opacity: 0 },
  to: { transform: 'rotate(360deg) scale(1)', opacity: 1 },
})

const fadeIn = keyframes({
  from: { transform: 'scale(0.8) rotate(-90deg)', opacity: 0 },
  to: { transform: 'scale(1) rotate(0deg)', opacity: 1 },
})

export const iconSun = style({
  animation: `${spin} 300ms ${vars.ease.standard} both`,
})

export const iconMoon = style({
  animation: `${fadeIn} 300ms ${vars.ease.standard} both`,
})

/* ── Genişletilmiş seçici panel ─────────────────────────────────────────── */

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
})

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
})

export const sectionLabel = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.secondary,
  lineHeight: vars.lineHeight.tight,
})

/* ── Tema palette cipsleri ──────────────────────────────────────────────── */

export const paletteList = style({
  display: 'flex',
  gap: vars.space[3],
  padding: 0,
  margin: 0,
  listStyle: 'none',
})

export const paletteItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[2],
})

export const paletteButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  height: '2.5rem',
  padding: 0,
  border: `2px solid ${vars.color.border.subtle}`,
  borderRadius: vars.radius.full,
  background: 'transparent',
  cursor: 'pointer',
  transitionProperty: 'border-color, box-shadow',
  transitionDuration: '200ms',
  transitionTimingFunction: vars.ease.standard,

  selectors: {
    '&:hover': {
      borderColor: vars.color.border.strong,
    },
    '&[data-active="true"]': {
      borderColor: vars.color.action.primary.bg,
      boxShadow: `0 0 0 2px ${vars.color.action.primary.bg}`,
    },
  },
})

export const paletteChip = style({
  width: '1.25rem',
  height: '1.25rem',
  borderRadius: vars.radius.full,
})

export const paletteLabel = style({
  fontSize: vars.font.size.sm,
  color: vars.color.text.muted,
  lineHeight: vars.lineHeight.tight,
  whiteSpace: 'nowrap',

  selectors: {
    '[data-active="true"] ~ &': {
      color: vars.color.text.primary,
      fontWeight: vars.font.weight.medium,
    },
  },
})

/* ── Mod geçiş çubuğu (expanded) ───────────────────────────────────────── */

export const modeBar = style({
  display: 'inline-flex',
  gap: vars.space[1],
  padding: vars.space[1],
  borderRadius: vars.radius.lg,
  background: vars.color.bg.subtle,
})

export const modeButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[2],
  paddingInline: vars.space[4],
  paddingBlock: vars.space[2],
  border: 'none',
  borderRadius: vars.radius.md,
  background: 'transparent',
  color: vars.color.text.muted,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.lineHeight.tight,
  cursor: 'pointer',
  transitionProperty: 'background-color, color, box-shadow',
  transitionDuration: '200ms',
  transitionTimingFunction: vars.ease.standard,

  selectors: {
    '&:hover': {
      color: vars.color.text.primary,
    },
    '&[data-active="true"]': {
      background: vars.color.bg.surface,
      color: vars.color.text.primary,
      boxShadow: vars.shadow.sm,
    },
  },
})
