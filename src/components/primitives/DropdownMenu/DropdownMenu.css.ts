import { style } from '@vanilla-extract/css'
import { vars } from '@/tokens/contract.css'

/**
 * Açılır menü stilleri. Popup/positioner ölçüleri `internal/listbox.css.ts`
 * (Select/MultiSelect) ile bilinçli olarak aynı hizada — kullanıcı aynı üründe
 * iki farklı açılır yüzey görmesin.
 */

/**
 * Tetikleyici buton — `secondary` Button görünümünde. Ham buton kabuğu (kenarlık,
 * dolgu, odak) burada; içeriği tüketici verir. Dokunma hedefi `control.height.sm`
 * (44px) ile korunur.
 */
export const trigger = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[2],
  minHeight: vars.control.height.sm,
  paddingInline: vars.control.inlinePadding.sm,
  background: vars.color.action.secondary.bg,
  border: `1px solid ${vars.color.action.secondary.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.action.secondary.text,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.lineHeight.tight,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transitionProperty: 'background-color, border-color',
  transitionDuration: vars.duration.fast,

  selectors: {
    '&:hover:not([data-disabled])': { background: vars.color.action.secondary.hover },
    '&[data-popup-open]': { background: vars.color.action.secondary.active },
    '&[data-disabled]': {
      background: vars.color.bg.disabled,
      borderColor: vars.color.border.subtle,
      color: vars.color.text.disabled,
      cursor: 'not-allowed',
    },
  },
})

export const positioner = style({
  zIndex: vars.z.dropdown,
  outline: 'none',
})

export const popup = style({
  maxHeight: 'min(20rem, var(--available-height))',
  minWidth: 'max(var(--anchor-width), 12rem)',
  overflowY: 'auto',
  padding: vars.space[1],
  background: vars.color.bg.elevated,
  border: `1px solid ${vars.color.border.subtle}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.lg,
  outline: 'none',
})

/** Ortak öğe kutusu: eylem ve checkbox öğeleri aynı yükseklik/ritmi paylaşır. */
const itemBase = {
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minHeight: vars.control.height.sm,
  paddingInline: vars.space[3],
  paddingBlock: vars.space[2],
  borderRadius: vars.radius.sm,
  fontSize: vars.font.size.sm,
  color: vars.color.text.primary,
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',
} as const

export const item = style({
  ...itemBase,
  selectors: {
    '&[data-highlighted]': { background: vars.color.bg.subtle },
    '&[data-disabled]': { color: vars.color.text.disabled, cursor: 'not-allowed' },
  },
})

export const checkboxItem = style({
  ...itemBase,
  selectors: {
    '&[data-highlighted]': { background: vars.color.bg.subtle },
    '&[data-disabled]': { color: vars.color.text.disabled, cursor: 'not-allowed' },
  },
})

/**
 * İşaret kutusu: her zaman yer kaplar (işaretli/işaretsiz) ki öğe metinleri
 * hizalı kalsın. İşaret yalnız `checked` iken görünür (indicator içeride).
 */
export const checkSlot = style({
  display: 'inline-flex',
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.primary[700],
})

export const itemLabel = style({
  flex: 1,
  minWidth: 0,
})
