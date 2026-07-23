import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/tokens/contract.css'

/* ---------- Sabitleri ---------- */

const TABLET = 'screen and (min-width: 48rem)'
const MASAUSTU = 'screen and (min-width: 64rem)'

/* ---------- Animasyonlar ---------- */

const fadeInUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(12px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

/* ---------- Cam efekti mixin ---------- */

const glass = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: vars.radius.xl,
} as const

/* ---------- Kok ---------- */

export const root = style({
  display: 'grid',
  gap: vars.space[8],
  minWidth: 0,
  /**
   * Sayfa DynamicIsland (ust) ve Dock (alt) icinde render ediliyor.
   * Ust/alt bosluk ile icerik bunlarin altinda kalmasin.
   */
  paddingTop: vars.space[6],
  paddingBottom: '7rem',
  paddingLeft: vars.space[4],
  paddingRight: vars.space[4],
  maxWidth: vars.container['2xl'],
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100%',
  color: '#e2e8f0',
  '@media': {
    [TABLET]: {
      paddingLeft: vars.space[6],
      paddingRight: vars.space[6],
      paddingBottom: '8rem',
    },
    [MASAUSTU]: {
      paddingLeft: vars.space[8],
      paddingRight: vars.space[8],
    },
  },
})

/* ---------- Hero bolumu ---------- */

export const hero = style({
  display: 'grid',
  gap: vars.space[3],
  animation: `${fadeInUp} 0.5s ${vars.ease.standard} both`,
})

export const greeting = style({
  fontSize: vars.font.size['3xl'],
  fontWeight: vars.font.weight.bold,
  lineHeight: vars.lineHeight.heading,
  color: '#f1f5f9',
  margin: 0,
  '@media': {
    [TABLET]: {
      fontSize: vars.font.size['4xl'],
    },
  },
})

export const subtitle = style({
  fontSize: vars.font.size.md,
  color: '#94a3b8',
  margin: 0,
})

export const quickStats = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[3],
  fontSize: vars.font.size.sm,
  color: '#94a3b8',
})

export const quickStatDot = style({
  display: 'inline-block',
  width: '4px',
  height: '4px',
  borderRadius: vars.radius.full,
  backgroundColor: '#475569',
  alignSelf: 'center',
})

export const dateTime = style({
  fontSize: vars.font.size.sm,
  color: '#64748b',
  fontFamily: vars.font.family.mono,
})

/* ---------- AI Insights Feed sarmalayici ---------- */

export const insightsFeedWrapper = style({
  animation: `${fadeInUp} 0.5s ${vars.ease.standard} 0.1s both`,
})

/* ---------- KPI Grid ---------- */

export const kpiGrid = style({
  display: 'grid',
  gap: vars.space[4],
  gridTemplateColumns: 'repeat(2, 1fr)',
  '@media': {
    [MASAUSTU]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
})

export const kpiCard = style({
  ...glass,
  padding: vars.space[5],
  animation: `${fadeInUp} 0.5s ${vars.ease.standard} both`,
  transition: `transform ${vars.duration.fast} ${vars.ease.standard}, box-shadow ${vars.duration.fast} ${vars.ease.standard}`,
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  selectors: {
    '&:nth-child(1)': { animationDelay: '0.15s' },
    '&:nth-child(2)': { animationDelay: '0.2s' },
    '&:nth-child(3)': { animationDelay: '0.25s' },
    '&:nth-child(4)': { animationDelay: '0.3s' },
  },
})

/* ---------- Chart Section ---------- */

export const chartsGrid = style({
  display: 'grid',
  gap: vars.space[4],
  gridTemplateColumns: '1fr',
  '@media': {
    [MASAUSTU]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
})

export const chartGlass = style({
  ...glass,
  padding: vars.space[4],
  animation: `${fadeInUp} 0.5s ${vars.ease.standard} 0.35s both`,
  overflow: 'hidden',
})

export const chartTitle = style({
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  color: '#f1f5f9',
  margin: 0,
  marginBottom: vars.space[4],
})

export const chartContainer = style({
  width: '100%',
  height: '280px',
})

/* ---------- Quick Actions ---------- */

export const actionsGrid = style({
  display: 'grid',
  gap: vars.space[4],
  gridTemplateColumns: 'repeat(2, 1fr)',
  '@media': {
    [MASAUSTU]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
})

export const actionCard = style({
  ...glass,
  display: 'grid',
  gap: vars.space[2],
  padding: vars.space[5],
  cursor: 'pointer',
  transition: `transform ${vars.duration.fast} ${vars.ease.standard}, background ${vars.duration.fast} ${vars.ease.standard}, box-shadow ${vars.duration.fast} ${vars.ease.standard}`,
  animation: `${fadeInUp} 0.5s ${vars.ease.standard} both`,
  ':hover': {
    transform: 'translateY(-2px)',
    background: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  // Button reset
  border: '1px solid rgba(255, 255, 255, 0.1)',
  font: 'inherit',
  color: 'inherit',
  textAlign: 'left' as const,
  selectors: {
    '&:nth-child(1)': { animationDelay: '0.4s' },
    '&:nth-child(2)': { animationDelay: '0.45s' },
    '&:nth-child(3)': { animationDelay: '0.5s' },
    '&:nth-child(4)': { animationDelay: '0.55s' },
  },
})

export const actionIconWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
})

export const actionIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: vars.radius.lg,
  background: 'rgba(99, 102, 241, 0.15)',
  color: '#818cf8',
  flexShrink: 0,
})

export const actionBadge = style({
  marginLeft: 'auto',
})

export const actionLabel = style({
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  color: '#f1f5f9',
})

export const actionDescription = style({
  fontSize: vars.font.size.sm,
  color: '#94a3b8',
  lineHeight: vars.lineHeight.body,
})

/* ---------- Section baslik ---------- */

export const sectionHeader = style({
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
  color: '#f1f5f9',
  margin: 0,
})

/* ---------- Recent Activity ---------- */

export const activityCard = style({
  ...glass,
  padding: vars.space[5],
  animation: `${fadeInUp} 0.5s ${vars.ease.standard} 0.6s both`,
})

export const activityTitle = style({
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  color: '#f1f5f9',
  margin: 0,
  marginBottom: vars.space[4],
})

export const timeline = style({
  display: 'grid',
  gap: 0,
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

export const timelineItem = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: vars.space[3],
  padding: `${vars.space[3]} 0`,
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  alignItems: 'center',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
})

export const timelineDot = style({
  width: '8px',
  height: '8px',
  borderRadius: vars.radius.full,
  flexShrink: 0,
})

export const timelineDotApproved = style({
  backgroundColor: '#22c55e',
})

export const timelineDotRejected = style({
  backgroundColor: '#ef4444',
})

export const timelineDotAssigned = style({
  backgroundColor: '#3b82f6',
})

export const timelineDotPaused = style({
  backgroundColor: '#f59e0b',
})

export const timelineDotDefault = style({
  backgroundColor: '#64748b',
})

export const timelineContent = style({
  display: 'grid',
  gap: '2px',
  minWidth: 0,
})

export const timelineText = style({
  fontSize: vars.font.size.sm,
  color: '#e2e8f0',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const timelineNote = style({
  fontSize: vars.font.size.sm,
  color: '#64748b',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const timelineTime = style({
  fontSize: vars.font.size.sm,
  color: '#64748b',
  fontFamily: vars.font.family.mono,
  whiteSpace: 'nowrap',
})
