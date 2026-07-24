import { keyframes, style } from '@vanilla-extract/css'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  maxWidth: '900px',
  marginInline: 'auto',
  animation: `${fadeIn} 0.4s ease-out`,
})

export const title = style({
  fontSize: '1.75rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.92)',
  letterSpacing: '-0.01em',
})

export const statsRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '0.75rem',
  '@media': { '(max-width: 480px)': { gridTemplateColumns: '1fr' } },
})

export const statCard = style({
  padding: '1.25rem 1.5rem',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

export const statLabel = style({
  fontSize: '0.8125rem',
  color: 'rgba(255, 255, 255, 0.5)',
})

export const statValue = style({
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'rgba(255, 255, 255, 0.92)',
  fontVariantNumeric: 'tabular-nums',
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  overflow: 'hidden',
})

export const item = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  padding: '1rem 1.25rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  selectors: { '&:last-child': { borderBottom: 'none' } },
})

export const dot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
  marginTop: '0.375rem',
})

export const content = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
})

export const desc = style({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.82)',
})

export const date = style({
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.35)',
})
