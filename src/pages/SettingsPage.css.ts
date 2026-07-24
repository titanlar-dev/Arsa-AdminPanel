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

export const sectionTitle = style({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.7)',
})

export const themeGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '0.75rem',
  '@media': { '(max-width: 480px)': { gridTemplateColumns: '1fr' } },
})

export const themeCard = style({
  padding: '1.25rem',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  cursor: 'pointer',
  transition: 'border-color 0.15s',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  alignItems: 'center',
  textAlign: 'center' as const,
})

export const themeCardActive = style({
  borderColor: 'rgba(99, 102, 241, 0.5)',
  background: 'rgba(99, 102, 241, 0.08)',
})

export const themeDot = style({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
})

export const themeName = style({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.82)',
})

export const toggleList = style({
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  overflow: 'hidden',
})

export const toggleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem 1.25rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  selectors: { '&:last-child': { borderBottom: 'none' } },
})

export const toggleLabel = style({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.82)',
})

export const toggle = style({
  width: '40px',
  height: '22px',
  borderRadius: '11px',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  transition: 'background 0.2s',
  background: 'rgba(255, 255, 255, 0.12)',
  flexShrink: 0,
})

export const toggleActive = style({
  background: 'rgba(99, 102, 241, 0.6)',
})

export const toggleKnob = style({
  position: 'absolute',
  top: '3px',
  left: '3px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: '#fff',
  transition: 'transform 0.2s',
})

export const toggleKnobActive = style({
  transform: 'translateX(18px)',
})
