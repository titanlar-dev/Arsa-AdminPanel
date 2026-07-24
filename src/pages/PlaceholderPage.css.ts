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
  alignItems: 'center',
  paddingTop: '4rem',
})

export const title = style({
  fontSize: '1.75rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.92)',
  letterSpacing: '-0.01em',
})

export const message = style({
  fontSize: '0.9375rem',
  color: 'rgba(255, 255, 255, 0.45)',
  textAlign: 'center',
})

export const backBtn = style({
  padding: '0.5rem 1.25rem',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.04)',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: 'rgba(255, 255, 255, 0.08)' },
})
