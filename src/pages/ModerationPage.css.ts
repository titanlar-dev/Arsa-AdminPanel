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

export const card = style({
  padding: '1rem 1.25rem',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

export const cardRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.5rem',
})

export const cardTitle = style({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.88)',
})

export const cardMeta = style({
  fontSize: '0.8125rem',
  color: 'rgba(255, 255, 255, 0.45)',
})

export const badge = style({
  display: 'inline-block',
  padding: '0.2rem 0.6rem',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 600,
  background: 'rgba(251, 191, 36, 0.15)',
  color: '#fbbf24',
})

export const actions = style({
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.25rem',
})

const actionBase = style({
  padding: '0.4rem 0.85rem',
  borderRadius: '8px',
  border: 'none',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  selectors: { '&:hover': { opacity: 0.85 } },
})

export const approveBtn = style([actionBase, {
  background: 'rgba(34, 197, 94, 0.2)',
  color: '#4ade80',
}])

export const rejectBtn = style([actionBase, {
  background: 'rgba(239, 68, 68, 0.15)',
  color: '#f87171',
}])
