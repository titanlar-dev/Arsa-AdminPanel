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

/* ── Stat cards 2x2 grid ── */

export const statsGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.75rem',

  '@media': {
    '(max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
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
  fontWeight: 400,
})

export const statValue = style({
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'rgba(255, 255, 255, 0.92)',
  fontVariantNumeric: 'tabular-nums',
})

/* ── AI insight card ── */

export const aiCard = style({
  padding: '1.5rem',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.30) 100%)',
  border: '1px solid rgba(168, 85, 247, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
})

export const aiHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.7)',
})

export const aiDot = style({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: '#a78bfa',
})

export const aiBody = style({
  fontSize: '0.9375rem',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.88)',
  lineHeight: 1.5,
})

export const aiAction = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  alignSelf: 'flex-start',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  background: 'rgba(255, 255, 255, 0.12)',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.88)',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'background 0.15s',

  ':hover': {
    background: 'rgba(255, 255, 255, 0.18)',
  },
})

/* ── Son Aktiviteler ── */

export const sectionTitle = style({
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.7)',
  marginBottom: '-0.25rem',
})

export const activityList = style({
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  overflow: 'hidden',
})

export const activityItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  padding: '1rem 1.25rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',

  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
})

export const activityDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
  marginTop: '0.375rem',
})

export const activityContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  flex: 1,
  minWidth: 0,
})

export const activityText = style({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.82)',
})

export const activityTime = style({
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.35)',
})
