import { keyframes, style, globalStyle } from '@vanilla-extract/css'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

const focusRing = {
  borderColor: 'rgba(99,102,241,0.5)',
  boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
} as const

const inputBase = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.92)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
} as const

export const root = style({
  display: 'flex', flexDirection: 'column', gap: '1.5rem',
  maxWidth: '900px', marginInline: 'auto',
  animation: `${fadeIn} 0.4s ease-out`, paddingBottom: '5rem',
})
export const headerRow = style({ display: 'flex', alignItems: 'center', gap: '1rem' })
export const backBtn = style({
  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
  padding: '0.4rem 0.85rem', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px',
  color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem', fontWeight: 500,
  cursor: 'pointer', transition: 'background 0.15s',
  ':hover': { background: 'rgba(255,255,255,0.10)' },
})
export const titleText = style({
  fontSize: '1.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em',
})

/* Tab bar */
export const tabBar = style({ display: 'flex', gap: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' })
export const tab = style({
  padding: '0.625rem 1rem', background: 'none', border: 'none',
  borderBottom: '3px solid transparent', color: 'rgba(255,255,255,0.45)',
  fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
  transition: 'color 0.15s, border-color 0.15s',
  ':hover': { color: 'rgba(255,255,255,0.7)' },
})
export const tabActive = style({ color: '#fff', borderBottomColor: 'rgba(99,102,241,0.8)' })
export const tabDisabled = style({
  opacity: 0.35, cursor: 'not-allowed',
  ':hover': { color: 'rgba(255,255,255,0.45)' },
})

/* Card */
export const card = style({
  padding: '2rem', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px',
  display: 'flex', flexDirection: 'column', gap: '1.25rem',
})
export const fieldGroup = style({ display: 'flex', flexDirection: 'column', gap: '0.375rem' })
export const label = style({
  fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase', letterSpacing: '0.04em',
})
export const input = style({ ...inputBase, ':focus': focusRing, '::placeholder': { color: 'rgba(255,255,255,0.3)' } })
export const textarea = style({
  ...inputBase, minHeight: '6rem', resize: 'vertical', fontFamily: 'inherit',
  ':focus': focusRing, '::placeholder': { color: 'rgba(255,255,255,0.3)' },
})
export const select = style({ ...inputBase, ':focus': focusRing })

/* Grids */
export const row = style({
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.25rem',
  '@media': { '(max-width: 580px)': { gridTemplateColumns: '1fr' } },
})
export const row3 = style({
  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem 1.25rem',
  '@media': { '(max-width: 580px)': { gridTemplateColumns: '1fr' } },
})
export const checkRow = style({
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem',
})

/* Map & drop zone */
export const mapPlaceholder = style({
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  height: '12rem', border: '2px dashed rgba(255,255,255,0.15)',
  borderRadius: '12px', color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem',
})
export const dropZone = style({
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  minHeight: '8rem', border: '2px dashed rgba(255,255,255,0.15)',
  borderRadius: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem',
  cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s',
  ':hover': { borderColor: 'rgba(99,102,241,0.5)', color: 'rgba(99,102,241,0.8)' },
})

/* Photo grid */
export const photoGrid = style({
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem',
})
export const photoCard = style({
  position: 'relative', borderRadius: '8px', overflow: 'hidden',
  aspectRatio: '4/3', background: 'rgba(255,255,255,0.06)',
})
export const photoImg = style({ width: '100%', height: '100%', objectFit: 'cover' })
export const photoOverlay = style({
  position: 'absolute', inset: 0, display: 'flex',
  alignItems: 'flex-end', justifyContent: 'center', gap: '0.375rem',
  padding: '0.5rem', background: 'rgba(0,0,0,0.55)', opacity: 0, transition: 'opacity 0.15s',
})
globalStyle(`${photoCard}:hover ${photoOverlay}`, { opacity: 1 })
export const coverBadge = style({
  position: 'absolute', top: '0.375rem', left: '0.375rem',
  padding: '0.125rem 0.5rem', background: 'rgba(99,102,241,0.85)',
  borderRadius: '4px', color: '#fff', fontSize: '0.6875rem', fontWeight: 600,
})
export const overlayBtn = style({
  padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.15)',
  border: 'none', borderRadius: '4px', color: '#fff', fontSize: '0.6875rem',
  cursor: 'pointer', ':hover': { background: 'rgba(255,255,255,0.3)' },
})
export const photoCounter = style({ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)' })

/* Info box */
export const infoBox = style({
  padding: '1rem', background: 'rgba(99,102,241,0.08)',
  border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px',
  color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem',
})

/* Sticky action bar */
export const stickyBar = style({
  position: 'sticky', bottom: 0, display: 'flex', gap: '0.75rem',
  padding: '1rem 2rem', background: 'rgba(10,10,20,0.9)',
  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
  borderTop: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px 14px 0 0',
  marginInline: '-0.5rem',
})
export const primaryBtn = style({
  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
  padding: '0.6rem 1.25rem', background: 'rgba(99,102,241,0.8)',
  border: 'none', borderRadius: '8px', color: 'rgba(255,255,255,0.95)',
  fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
  transition: 'background 0.15s', ':hover': { background: 'rgba(99,102,241,0.95)' },
})
export const ghostBtn = style({
  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
  padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px',
  color: 'rgba(255,255,255,0.82)', fontSize: '0.8125rem', fontWeight: 500,
  cursor: 'pointer', transition: 'background 0.15s',
  ':hover': { background: 'rgba(255,255,255,0.10)' },
})
