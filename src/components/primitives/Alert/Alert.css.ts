import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

/** Ton renkleri yerel değişkenlere yazılır; varyantlar bunları okur. */
const toneSubtle = createVar()
const toneStrong = createVar()
const toneText = createVar()
const toneBorder = createVar()

export const alert = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: vars.space[3],
    padding: vars.space[4],
    border: '1px solid transparent',
    borderRadius: vars.radius.md,
    fontSize: vars.font.size.sm,
    lineHeight: vars.lineHeight.body,
  },

  variants: {
    tone: {
      success: {
        vars: {
          [toneSubtle]: 'rgba(34, 197, 94, 0.12)',
          [toneStrong]: vars.color.success[700],
          [toneText]: '#86efac',
          [toneBorder]: 'rgba(34, 197, 94, 0.25)',
        },
      },
      warning: {
        vars: {
          [toneSubtle]: 'rgba(234, 179, 8, 0.12)',
          [toneStrong]: vars.color.warning[700],
          [toneText]: '#fde047',
          [toneBorder]: 'rgba(234, 179, 8, 0.25)',
        },
      },
      danger: {
        vars: {
          [toneSubtle]: 'rgba(239, 68, 68, 0.12)',
          [toneStrong]: vars.color.danger[700],
          [toneText]: '#fca5a5',
          [toneBorder]: 'rgba(239, 68, 68, 0.25)',
        },
      },
      info: {
        vars: {
          [toneSubtle]: 'rgba(59, 130, 246, 0.12)',
          [toneStrong]: vars.color.info[700],
          [toneText]: '#93c5fd',
          [toneBorder]: 'rgba(59, 130, 246, 0.25)',
        },
      },
    },

    variant: {
      solid: {
        background: toneStrong,
        color: vars.color.neutral[0],
      },
      soft: {
        background: toneSubtle,
        color: toneText,
        borderColor: toneBorder,
      },
      outline: {
        background: 'rgba(255, 255, 255, 0.04)',
        color: toneText,
        borderColor: toneBorder,
      },
    },
  },

  defaultVariants: {
    tone: 'info',
    variant: 'soft',
  },
})

export const icon = style({
  display: 'inline-flex',
  flexShrink: 0,
  marginTop: '0.125rem',
})

export const content = style({
  display: 'grid',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
})

export const title = style({
  fontWeight: vars.font.weight.semibold,
  fontSize: vars.font.size.sm,
})

export const description = style({
  fontSize: vars.font.size.sm,
})

export const actions = style({
  marginTop: vars.space[2],
})

export const dismiss = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '1.5rem',
  height: '1.5rem',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  flexShrink: 0,

  ':hover': {
    opacity: 0.7,
  },

  /* 44x44px dokunma hedefi, görünür kutuyu büyütmeden. */
  '::after': {
    content: '""',
    position: 'absolute',
    inset: '-0.625rem',
  },
})
