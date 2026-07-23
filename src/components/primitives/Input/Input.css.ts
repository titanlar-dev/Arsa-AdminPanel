import { keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

/** Metin girişi kutusu — Input, SearchInput, CurrencyInput ve Select bunu paylaşır. */
export const control = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space[2],
    width: '100%',
    background: vars.color.bg.surface,
    border: '1px solid',
    borderColor: vars.color.border.default,
    borderRadius: vars.radius.md,
    color: vars.color.text.primary,
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: vars.duration.fast,
    transitionTimingFunction: vars.ease.standard,

    selectors: {
      '&:focus-within': {
        borderColor: vars.color.focus.ring,
      },
      /** Hata durumu yalnız renkle değil, kenarlık kalınlığıyla da belli olur. */
      '&[data-invalid]': {
        borderColor: vars.color.danger[600],
      },
      '&[data-validation-state="warning"]': {
        borderColor: vars.color.warning[600],
      },
      '&[data-validation-state="success"]': {
        borderColor: vars.color.success[600],
      },
      '&[data-validation-state="validating"]': {
        borderColor: vars.color.info[600],
      },
      '&[data-disabled]': {
        background: vars.color.bg.disabled,
        borderColor: vars.color.border.subtle,
        color: vars.color.text.disabled,
        cursor: 'not-allowed',
      },
    },
  },

  variants: {
    size: {
      sm: { minHeight: vars.control.height.sm, paddingInline: vars.control.inlinePadding.sm },
      md: { minHeight: vars.control.height.md, paddingInline: vars.control.inlinePadding.md },
      lg: { minHeight: vars.control.height.lg, paddingInline: vars.control.inlinePadding.lg },
    },
  },

  defaultVariants: {
    size: 'md',
  },
})

/**
 * Asıl `<input>`. Kutunun kenarlığı sarmalayıcıda olduğu için burada kenarlık
 * ve odak halkası yok; odak halkası `:focus-within` ile sarmalayıcıda gösterilir.
 */
export const input = style({
  flex: 1,
  minWidth: 0,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.tight,

  ':focus': {
    outline: 'none',
  },

  '::placeholder': {
    color: vars.color.text.muted,
  },

  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
})

export const adornment = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  color: vars.color.text.muted,
})

/** Dogrulama durumu ikonu (trailing). */
export const validationStateIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
})

export const validationIconError = style({ color: vars.color.danger[600] })
export const validationIconWarning = style({ color: vars.color.warning[600] })
export const validationIconSuccess = style({ color: vars.color.success[600] })
export const validationIconValidating = style({ color: vars.color.info[600] })

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

/** Spinner animasyonu icin donme. */
export const spinnerSpin = style({
  animation: `${spin} 1s linear infinite`,
})

/** Karakter sayaci. */
export const counter = style({
  justifySelf: 'end',
  fontSize: vars.font.size.sm,
  color: vars.color.text.muted,
  fontVariantNumeric: 'tabular-nums',
})

export const counterNearLimit = style({
  color: vars.color.warning[800],
})

export const counterOverLimit = style({
  color: vars.color.danger[800],
  fontWeight: vars.font.weight.medium,
})
