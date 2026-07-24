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
})

export const card = style({
  padding: '1.5rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
})

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

export const label = style({
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.5)',
})

export const input = style({
  width: '100%',
  padding: '0.625rem 0.875rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.92)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  ':focus': { borderColor: 'rgba(99,102,241,0.6)' },
  '::placeholder': { color: 'rgba(255,255,255,0.3)' },
})

export const textarea = style({
  width: '100%',
  minHeight: '120px',
  padding: '0.625rem 0.875rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.92)',
  fontSize: '0.875rem',
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s',
  ':focus': { borderColor: 'rgba(99,102,241,0.6)' },
  '::placeholder': { color: 'rgba(255,255,255,0.3)' },
})

export const select = style({
  width: '100%',
  padding: '0.625rem 0.875rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.92)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  ':focus': { borderColor: 'rgba(99,102,241,0.6)' },
})

export const row = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  '@media': {
    '(max-width: 580px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const actions = style({
  display: 'flex',
  gap: '0.75rem',
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
