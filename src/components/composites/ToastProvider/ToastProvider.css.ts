import { keyframes, style } from '@vanilla-extract/css'
import { vars } from '@/tokens/contract.css'

const slideInRight = keyframes({
  from: { opacity: 0, transform: 'translateX(100%)' },
  to: { opacity: 1, transform: 'translateX(0)' },
})

const fadeOut = keyframes({
  from: { opacity: 1, transform: 'translateX(0)' },
  to: { opacity: 0, transform: 'translateX(100%)' },
})

export const stack = style({
  position: 'fixed',
  insetBlockEnd: 0,
  insetInlineEnd: 0,
  zIndex: vars.z.toast,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[4],
  paddingBlockEnd: `max(${vars.space[4]}, env(safe-area-inset-bottom))`,
  width: 'min(24rem, 100vw)',
  pointerEvents: 'none',

  '@media': {
    '(max-width: 30rem)': {
      width: '100vw',
    },
  },
})

export const item = style({
  pointerEvents: 'auto',
  animation: `${slideInRight} ${vars.duration.normal} ${vars.ease.standard}`,
  transition: `transform ${vars.duration.normal} ${vars.ease.standard}`,

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      transition: 'none',
    },
  },
})

export const itemExiting = style({
  animation: `${fadeOut} ${vars.duration.fast} ${vars.ease.standard} forwards`,

  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
})
