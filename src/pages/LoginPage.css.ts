import { keyframes, style } from '@vanilla-extract/css'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const root = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#050510',
  animation: `${fadeIn} 0.4s ease-out`,
})

export const card = style({
  width: '100%',
  maxWidth: '380px',
  padding: '2.5rem 2rem',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  alignItems: 'center',
})

export const logo = style({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'rgba(255, 255, 255, 0.92)',
  letterSpacing: '-0.02em',
})

export const form = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const input = style({
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.04)',
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
  '::placeholder': { color: 'rgba(255, 255, 255, 0.3)' },
  ':focus': { borderColor: 'rgba(255, 255, 255, 0.25)' },
})

export const button = style({
  width: '100%',
  padding: '0.75rem',
  borderRadius: '10px',
  border: 'none',
  background: 'rgba(99, 102, 241, 0.5)',
  color: 'rgba(255, 255, 255, 0.92)',
  fontSize: '0.9375rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s',
  marginTop: '0.25rem',
  ':hover': { background: 'rgba(99, 102, 241, 0.65)' },
  ':disabled': { opacity: 0.5, cursor: 'default' },
})

export const errorText = style({
  fontSize: '0.8125rem',
  color: '#f87171',
  textAlign: 'center',
})
