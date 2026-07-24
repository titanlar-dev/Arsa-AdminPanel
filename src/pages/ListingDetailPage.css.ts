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

export const headerRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
})

export const backBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.4rem 0.85rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: 'rgba(255,255,255,0.10)' },
})

export const titleText = style({
  fontSize: '1.75rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.92)',
  letterSpacing: '-0.01em',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const card = style({
  padding: '1.5rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '12px',
})

export const cardTitle = style({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '1rem',
})

export const infoGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  '@media': {
    '(max-width: 580px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const infoItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

export const infoLabel = style({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
})

export const infoValue = style({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.92)',
})

export const descriptionText = style({
  fontSize: '0.875rem',
  lineHeight: 1.65,
  color: 'rgba(255,255,255,0.82)',
  whiteSpace: 'pre-wrap',
})

export const actions = style({
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
})

export const primaryBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.6rem 1.25rem',
  background: 'rgba(99,102,241,0.8)',
  border: 'none',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.95)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: 'rgba(99,102,241,0.95)' },
})

export const ghostBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.6rem 1.25rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.82)',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: 'rgba(255,255,255,0.10)' },
})

export const successBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.6rem 1.25rem',
  background: 'rgba(34,197,94,0.7)',
  border: 'none',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.95)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: 'rgba(34,197,94,0.9)' },
})

export const dangerBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.6rem 1.25rem',
  background: 'rgba(239,68,68,0.7)',
  border: 'none',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.95)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: 'rgba(239,68,68,0.9)' },
})

export const warningBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.6rem 1.25rem',
  background: 'rgba(245,158,11,0.7)',
  border: 'none',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.95)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: 'rgba(245,158,11,0.9)' },
})

export const notFound = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '4rem 2rem',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '1rem',
  textAlign: 'center',
})
