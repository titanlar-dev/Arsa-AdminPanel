import { keyframes, style } from '@vanilla-extract/css'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  maxWidth: '960px',
  marginInline: 'auto',
  animation: `${fadeIn} 0.4s ease-out`,
})

/* ── Header ── */

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

export const subtitle = style({
  fontSize: '0.8125rem',
  color: 'rgba(255,255,255,0.45)',
  fontWeight: 400,
  width: '100%',
})

/* ── Photo Gallery ── */

export const photoGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '0.5rem',
  '@media': {
    '(max-width: 580px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

export const photoCover = style({
  gridColumn: 'span 2',
  gridRow: 'span 2',
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
})

export const photoThumb = style({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
})

export const photoImg = style({
  width: '100%',
  aspectRatio: '4 / 3',
  objectFit: 'cover',
  display: 'block',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: '12px',
})

export const photoCoverImg = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  aspectRatio: '4 / 3',
  background: 'rgba(255,255,255,0.04)',
  borderRadius: '12px',
})

export const photoCountBadge = style({
  position: 'absolute',
  bottom: '0.5rem',
  right: '0.5rem',
  padding: '0.25rem 0.625rem',
  background: 'rgba(0,0,0,0.65)',
  borderRadius: '6px',
  color: 'rgba(255,255,255,0.88)',
  fontSize: '0.75rem',
  fontWeight: 500,
  backdropFilter: 'blur(8px)',
})

export const photoPlaceholder = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 2rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '12px',
  color: 'rgba(255,255,255,0.35)',
  fontSize: '0.875rem',
})

/* ── Cards ── */

export const card = style({
  padding: '1.5rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '12px',
})

export const cardTitle = style({
  fontSize: '1rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.7)',
  marginBottom: '1rem',
})

/* ── Info Grid (2-col) ── */

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
  fontSize: '0.6875rem',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
})

export const infoValue = style({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.88)',
})

/* ── Description ── */

export const descriptionText = style({
  fontSize: '0.875rem',
  lineHeight: 1.65,
  color: 'rgba(255,255,255,0.82)',
  whiteSpace: 'pre-wrap',
  fontFamily: "'SF Mono', 'Menlo', 'Consolas', monospace",
})

/* ── Metrics row ── */

export const metricsRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '0.75rem',
  '@media': {
    '(max-width: 580px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
})

export const metricCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: '1rem 1.25rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '12px',
  textAlign: 'center',
})

export const metricValue = style({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.92)',
  fontVariantNumeric: 'tabular-nums',
})

export const metricLabel = style({
  fontSize: '0.6875rem',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
})

/* ── Seller ── */

export const sellerBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.6875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  marginLeft: '0.5rem',
})

export const sellerTypeBadge = style({
  background: 'rgba(99,102,241,0.2)',
  color: 'rgba(165,162,255,0.9)',
})

export const verifiedBadge = style({
  background: 'rgba(34,197,94,0.2)',
  color: 'rgba(74,222,128,0.9)',
})

export const unverifiedBadge = style({
  background: 'rgba(239,68,68,0.2)',
  color: 'rgba(248,113,113,0.9)',
})

/* ── Moderation ── */

export const checkList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: '0.5rem',
})

export const checkItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.8125rem',
  color: 'rgba(255,255,255,0.75)',
})

export const checkBadge = style({
  display: 'inline-flex',
  padding: '0.125rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.6875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  flexShrink: 0,
})

export const checkPassed = style({
  background: 'rgba(34,197,94,0.15)',
  color: 'rgba(74,222,128,0.9)',
})

export const checkWarning = style({
  background: 'rgba(245,158,11,0.15)',
  color: 'rgba(251,191,36,0.9)',
})

export const checkFailed = style({
  background: 'rgba(239,68,68,0.15)',
  color: 'rgba(248,113,113,0.9)',
})

export const rejectionChip = style({
  display: 'inline-flex',
  padding: '0.25rem 0.625rem',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 500,
  background: 'rgba(239,68,68,0.12)',
  color: 'rgba(248,113,113,0.9)',
  marginRight: '0.375rem',
  marginBottom: '0.375rem',
})

export const reviewNote = style({
  marginTop: '0.75rem',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  fontSize: '0.8125rem',
  color: 'rgba(255,255,255,0.7)',
  fontStyle: 'italic',
  lineHeight: 1.5,
})

/* ── Actions ── */

export const actions = style({
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
})

const btnBase = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  padding: '0.6rem 1.25rem',
  border: 'none',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.95)',
  fontSize: '0.8125rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s',
} as const

export const primaryBtn = style({
  ...btnBase,
  background: 'rgba(99,102,241,0.8)',
  ':hover': { background: 'rgba(99,102,241,0.95)' },
})

export const ghostBtn = style({
  ...btnBase,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.07)',
  color: 'rgba(255,255,255,0.82)',
  fontWeight: 500,
  ':hover': { background: 'rgba(255,255,255,0.10)' },
})

export const successBtn = style({
  ...btnBase,
  background: 'rgba(34,197,94,0.7)',
  ':hover': { background: 'rgba(34,197,94,0.9)' },
})

export const dangerBtn = style({
  ...btnBase,
  background: 'rgba(239,68,68,0.7)',
  ':hover': { background: 'rgba(239,68,68,0.9)' },
})

export const warningBtn = style({
  ...btnBase,
  background: 'rgba(245,158,11,0.7)',
  ':hover': { background: 'rgba(245,158,11,0.9)' },
})

/* ── Not Found ── */

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
