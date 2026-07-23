import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/tokens/contract.css'

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
const scaleIn = keyframes({
  from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.96)' },
  to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

/* ── Backdrop ── */
export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.z.modal,
  background: vars.color.bg.overlay,
  animation: `${fadeIn} ${vars.duration.fast} ${vars.ease.standard}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
})

/* ── Popup ── */
export const popup = style({
  position: 'fixed',
  insetBlockStart: '50%',
  insetInlineStart: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: vars.z.modal,
  display: 'flex',
  flexDirection: 'column',
  width: 'calc(100vw - 2rem)',
  maxWidth: vars.container.md,
  maxHeight: 'calc(100dvh - 4rem)',
  background: vars.color.bg.elevated,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.xl,
  outline: 'none',
  animation: `${scaleIn} ${vars.duration.normal} ${vars.ease.standard}`,
  overflow: 'hidden',
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
})

/* ── Header ── */
export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space[4]} ${vars.space[5]}`,
  borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
})

export const title = style({
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.lineHeight.heading,
  color: vars.color.text.primary,
  margin: 0,
})

/* ── Body (scrollable) ── */
export const body = style({
  overflowY: 'auto',
  padding: `${vars.space[4]} ${vars.space[5]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[6],
})

/* ── Section ── */
export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
})

export const sectionTitle = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.secondary,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: 0,
  paddingBlockEnd: vars.space[2],
  borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
})

/* ── Shortcut row ── */
export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  padding: `${vars.space[2]} 0`,
})

export const description = style({
  fontSize: vars.font.size.sm,
  color: vars.color.text.primary,
  lineHeight: vars.lineHeight.body,
})

export const keys = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
  flexShrink: 0,
})

/* ── <kbd> tag ── */
export const kbd = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '1.5rem',
  height: '1.5rem',
  padding: `0 ${vars.space[2]}`,
  fontFamily: vars.font.family.mono,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: 1,
  color: vars.color.text.secondary,
  background: vars.color.bg.subtle,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.sm,
  boxShadow: `0 1px 0 ${vars.color.border.default}`,
  whiteSpace: 'nowrap',
})

/** "then" connector between sequence keys */
export const thenLabel = style({
  fontSize: vars.font.size.sm,
  color: vars.color.text.muted,
  padding: `0 ${vars.space[1]}`,
})

/* ── Footer ── */
export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: `${vars.space[3]} ${vars.space[5]}`,
  borderBlockStart: `1px solid ${vars.color.border.subtle}`,
  fontSize: vars.font.size.sm,
  color: vars.color.text.muted,
})
