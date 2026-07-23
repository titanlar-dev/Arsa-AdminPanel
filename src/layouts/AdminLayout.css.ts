import { style, keyframes } from '@vanilla-extract/css'

const EASE_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

const slideIn = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
})

const fadeInOverlay = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

/* ── Layout root ── */

export const layoutRoot = style({
  minHeight: '100dvh',
  background: '#050510',
  color: 'rgba(255, 255, 255, 0.88)',
  position: 'relative',
  isolation: 'isolate',
})

/* ── Hamburger button — sol üst köşe ── */

export const hamburger = style({
  position: 'fixed',
  top: '1.125rem',
  left: '1rem',
  zIndex: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.25rem',
  height: '2.25rem',
  border: 'none',
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.06)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  color: 'rgba(255, 255, 255, 0.7)',
  cursor: 'pointer',
  transition: `background 0.15s, color 0.15s`,

  ':hover': {
    background: 'rgba(255, 255, 255, 0.12)',
    color: 'rgba(255, 255, 255, 0.95)',
  },

  ':focus-visible': {
    outline: '2px solid #818cf8',
    outlineOffset: '2px',
  },
})

/* ── Sidebar overlay drawer ── */

export const sidebarBackdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 55,
  background: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  animation: `${fadeInOverlay} 0.2s ease-out`,
})

export const sidebarDrawer = style({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 56,
  width: '18rem',
  maxWidth: '85vw',
  display: 'flex',
  flexDirection: 'column',
  background:
    'linear-gradient(180deg, rgba(15, 18, 35, 0.97) 0%, rgba(8, 10, 22, 0.98) 100%)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '16px 0 48px rgba(0, 0, 0, 0.4)',
  animation: `${slideIn} 0.3s ${EASE_EXPO}`,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
})

export const sidebarHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.25rem 1rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  flexShrink: 0,
})

export const sidebarBrand = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.625rem',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.9)',
  letterSpacing: '-0.01em',
})

export const sidebarLogo = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: '8px',
  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: 700,
})

export const sidebarCloseBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  border: 'none',
  borderRadius: '8px',
  background: 'transparent',
  color: 'rgba(255, 255, 255, 0.4)',
  cursor: 'pointer',

  ':hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.8)',
  },
})

export const sidebarContent = style({
  flex: 1,
  paddingBlock: '0.5rem',
  overflowY: 'auto',
})

/* ── Content area ── */

export const contentArea = style({
  paddingBlockStart: '5rem',
  paddingBlockEnd: '3rem',
  paddingInline: '1.5rem',
  minHeight: '100dvh',
  width: '100%',
  maxWidth: '1440px',
  marginInline: 'auto',
  animation: `${fadeIn} 0.3s ease-out`,
  '@media': {
    '(max-width: 768px)': {
      paddingInline: '1rem',
      paddingBlockStart: '4.5rem',
      paddingBlockEnd: '3rem',
    },
  },
})

/* ── Placeholder page (kept for PlaceholderPage compatibility) ── */

export const placeholderPage = style({
  display: 'grid',
  placeItems: 'center',
  minHeight: '60vh',
  textAlign: 'center',
  gap: '0.5rem',
})

export const placeholderTitle = style({
  fontSize: '1.25rem',
  fontWeight: 600,
})

export const placeholderSubtitle = style({
  opacity: 0.6,
})
