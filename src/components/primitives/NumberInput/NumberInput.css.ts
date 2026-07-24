import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

export const group = recipe({
  base: {
    display: 'flex',
    alignItems: 'stretch',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: '8px',
    overflow: 'hidden',
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: vars.duration.fast,

    selectors: {
      '&:hover:not([data-disabled])': { borderColor: 'rgba(255, 255, 255, 0.15)' },
      '&:focus-within': {
        borderColor: 'rgba(129, 140, 248, 0.5)',
        boxShadow: '0 0 0 3px rgba(129, 140, 248, 0.12)',
      },
      '&[data-invalid]': { borderColor: vars.color.danger[600] },
      '&[data-validation-state="warning"]': { borderColor: vars.color.warning[600] },
      '&[data-validation-state="success"]': { borderColor: vars.color.success[600] },
      '&[data-validation-state="validating"]': { borderColor: vars.color.info[600] },
      '&[data-disabled]': {
        background: 'rgba(255, 255, 255, 0.03)',
        borderColor: 'rgba(255, 255, 255, 0.06)',
      },
    },
  },

  variants: {
    size: {
      sm: { minHeight: vars.control.height.sm },
      md: { minHeight: vars.control.height.md },
      lg: { minHeight: vars.control.height.lg },
    },
  },

  defaultVariants: { size: 'md' },
})

export const input = style({
  flex: 1,
  minWidth: 0,
  paddingInline: vars.space[3],
  border: 'none',
  background: 'transparent',
  color: vars.color.text.primary,
  fontSize: vars.font.size.sm,
  /** Sayılar hizalı dursun diye tablo rakamları. */
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'right',

  ':focus': { outline: 'none' },

  selectors: {
    '&:disabled': { color: vars.color.text.disabled, cursor: 'not-allowed' },
  },
})

/**
 * Artır/azalt butonları. Görsel olarak dar ama dokunma hedefi kutunun tam
 * yüksekliğini kapladığı için 44px kuralı korunur.
 */
export const stepper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  padding: 0,
  border: 'none',
  borderInlineStart: '1px solid rgba(255, 255, 255, 0.08)',
  background: 'transparent',
  color: vars.color.text.secondary,
  cursor: 'pointer',

  ':hover': { background: 'rgba(255, 255, 255, 0.06)' },

  selectors: {
    '&[data-disabled]': {
      color: vars.color.text.disabled,
      cursor: 'not-allowed',
    },
  },
})
