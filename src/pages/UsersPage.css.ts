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

export const searchInput = style({
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.04)',
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  '::placeholder': { color: 'rgba(255, 255, 255, 0.3)' },
  ':focus': { borderColor: 'rgba(255, 255, 255, 0.2)' },
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  overflow: 'hidden',
})

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.875rem 1.25rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  selectors: { '&:last-child': { borderBottom: 'none' } },
})

export const avatar = style({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'rgba(99, 102, 241, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.8)',
  flexShrink: 0,
})

export const info = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
})

export const name = style({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.88)',
})

export const email = style({
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.4)',
})

export const badge = style({
  display: 'inline-block',
  padding: '0.15rem 0.5rem',
  borderRadius: '6px',
  fontSize: '0.7rem',
  fontWeight: 600,
  background: 'rgba(99, 102, 241, 0.15)',
  color: '#818cf8',
  flexShrink: 0,
})

export const count = style({
  fontSize: '0.8125rem',
  color: 'rgba(255, 255, 255, 0.5)',
  fontVariantNumeric: 'tabular-nums',
  flexShrink: 0,
})

export const statusDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
})
