import { keyframes, style } from '@vanilla-extract/css'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

const glass = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
} as const

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  maxWidth: '1440px',
  marginInline: 'auto',
  animation: `${fadeIn} 0.4s ease-out`,
})

export const header = style({ display: 'flex', alignItems: 'baseline', gap: '0.75rem' })

export const title = style({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.92)',
  letterSpacing: '-0.01em',
})

export const badge = style({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.4)',
  background: 'rgba(255,255,255,0.04)',
  padding: '0.15rem 0.5rem',
  borderRadius: '4px',
  border: '1px solid rgba(255,255,255,0.06)',
})

export const search = style({
  width: '100%',
  padding: '0.4375rem 0.75rem',
  ...glass,
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.88)',
  fontSize: '0.8125rem',
  outline: 'none',
  '::placeholder': { color: 'rgba(255,255,255,0.3)' },
  ':focus': { borderColor: 'rgba(255,255,255,0.15)' },
})

export const filterBtn = style({
  alignSelf: 'flex-start',
  padding: '0.4rem 0.85rem',
  ...glass,
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: 'rgba(255,255,255,0.08)' },
})

export const filterGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
  gap: '0.5rem',
  padding: '1rem',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '12px',
})

export const filterSelect = style({
  padding: '0.5rem 0.75rem',
  ...glass,
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.82)',
  fontSize: '0.8125rem',
  outline: 'none',
})

export const tableWrap = style({
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '12px',
  overflow: 'hidden',
})

export const table = style({ width: '100%', borderCollapse: 'collapse' })

export const th = style({
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.4)',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
})

export const td = style({
  padding: '0.625rem 1rem',
  fontSize: '0.8125rem',
  color: 'rgba(255,255,255,0.82)',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  verticalAlign: 'middle',
})

export const thumb = style({
  width: '40px',
  height: '30px',
  objectFit: 'cover',
  borderRadius: '4px',
  background: 'rgba(255,255,255,0.06)',
})

export const statusDot = style({
  display: 'inline-block',
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  marginRight: '6px',
  verticalAlign: 'middle',
})

export const pager = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '0.8125rem',
  color: 'rgba(255,255,255,0.5)',
})

export const pageBtn = style({
  padding: '0.35rem 0.7rem',
  ...glass,
  borderRadius: '6px',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '0.8125rem',
  cursor: 'pointer',
  transition: 'background 0.15s',
  ':hover': { background: 'rgba(255,255,255,0.08)' },
  ':disabled': { opacity: 0.3, cursor: 'default' },
})

export const pageBtns = style({ display: 'flex', gap: '0.375rem' })
export const muted = style({ color: 'rgba(255,255,255,0.35)' })
export const price = style({ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' })

export const cover = style({
  width: '40px',
  height: '30px',
  objectFit: 'cover',
  borderRadius: '4px',
  background: 'rgba(255,255,255,0.06)',
  display: 'block',
})

export const coverMissing = style({
  width: '40px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: '4px',
  color: 'rgba(255,255,255,0.2)',
})

export const cellStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
})

export const cellPrimary = style({
  fontSize: '0.8125rem',
  color: 'rgba(255,255,255,0.88)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const cellSecondary = style({
  fontSize: '0.6875rem',
  color: 'rgba(255,255,255,0.4)',
})

export const metric = style({
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
})

export const empty = style({
  color: 'rgba(255,255,255,0.2)',
})

export const badgeList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.25rem',
})

export const identifier = style({
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.5)',
  letterSpacing: '0.02em',
})

export const paginationBar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.375rem 0.75rem',
  ...glass,
  borderRadius: '8px',
  fontSize: '0.75rem',
  color: 'rgba(255,255,255,0.45)',
})

export const paginationInfo = style({
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
})

export const paginationPages = style({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
})

export const paginationBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '1.5rem',
  height: '1.5rem',
  padding: '0 0.25rem',
  border: '1px solid transparent',
  borderRadius: '4px',
  background: 'transparent',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '0.6875rem',
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',
  cursor: 'pointer',
  transition: 'background 0.12s, color 0.12s',
  selectors: {
    '&:hover:not(:disabled)': {
      background: 'rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.85)',
    },
    '&[aria-current="page"]': {
      background: 'rgba(99,102,241,0.7)',
      color: '#fff',
      fontWeight: 600,
      borderColor: 'transparent',
    },
    '&:disabled': {
      opacity: 0.25,
      cursor: 'default',
    },
  },
})

export const pageSizeWrap = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
})

export const pageSizeSelect = style({
  padding: '0.125rem 0.375rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '4px',
  color: 'rgba(255,255,255,0.75)',
  fontSize: '0.6875rem',
  outline: 'none',
  cursor: 'pointer',
  selectors: {
    '&:focus': {
      borderColor: 'rgba(255,255,255,0.2)',
    },
  },
})
