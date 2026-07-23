import { createVar, keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

export const root = style({
  display: 'grid',
  gap: vars.space[5],
})

/**
 * Gerekçe grubu bir `<fieldset>`.
 *
 * Dördü birden sıfırlanıyor ve hepsinin ayrı bir sebebi var:
 *
 * - `margin`/`padding`/`border`: global reset yalnız `body`'nin margin'ini
 *   sıfırlıyor; fieldset'in tarayıcı varsayılanı (2px kenarlık, ~0.35em dolgu,
 *   iki yandan margin) grid `gap`'inin üstüne biner ve dikey ritmi token'lar
 *   değil tarayıcı belirlerdi.
 * - `minInlineSize: 0`: fieldset'in `min-width: min-content` varsayılanı
 *   spec'ten gelir ve grid/flex kabında **küçülmeyi tamamen reddeder** — 320
 *   piksel ekranda en uzun gerekçe kartı kadar genişleyip sayfayı yatay
 *   kaydırtırdı.
 */
export const group = style({
  display: 'grid',
  gap: vars.space[3],
  margin: 0,
  padding: 0,
  border: 0,
  minInlineSize: 0,
})

/** `<legend>`'in de kendi dolgusu var; grubun başlığı diğer etiketlerle aynı hizada dursun. */
export const legend = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[1],
  padding: 0,
  marginBlockEnd: vars.space[1],
  color: vars.color.text.primary,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.lineHeight.tight,
})

export const requiredMark = style({
  color: vars.color.danger[600],
})

export const options = recipe({
  base: {
    display: 'grid',
  },

  variants: {
    variant: {
      /**
       * Kartlar: açıklama okunacağı için satır yüksekliği serbest, kolon
       * `auto-fill` ile ekrana göre 1–3 arasında.
       */
      cards: {
        gap: vars.space[3],
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 18rem), 1fr))',
      },

      /** Liste: tek kolon, sıkışık. Dialog içinde dikey alan pahalı. */
      list: {
        gap: vars.space[2],
      },
    },
  },
})

/**
 * Kartın kendisi Checkbox'ın `<label>` sarmalayıcısıdır — ayrı bir kutu
 * çizilmiyor, çünkü kartın tamamının tıklanabilir olması gerek ve etiketin
 * dışına çıkan her piksel tıklanamaz ölü alan olurdu.
 */
export const card = style({
  alignItems: 'start',
  padding: vars.space[3],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  background: vars.color.bg.surface,
  transition: `border-color ${vars.duration.fast} ${vars.ease.standard}, background ${vars.duration.fast} ${vars.ease.standard}`,

  selectors: {
    '&:hover:not([data-disabled])': {
      borderColor: vars.color.border.strong,
      background: vars.color.bg.subtle,
    },

    /**
     * Seçili kart vurgulanır. `:has()` ile: işaretli olan Base UI'ın
     * `Checkbox.Root`'u (`data-checked`), kartın kendisi değil — kutunun
     * durumunu ataya taşımanın CSS'teki tek yolu bu.
     */
    '&:has([data-checked])': {
      borderColor: vars.color.primary[600],
      background: vars.color.primary[50],
    },

    '&[data-disabled]': {
      background: vars.color.bg.disabled,
      cursor: 'not-allowed',
    },
  },
})

/** Listede kart yok; yalnız satır aralığı ve dokunma hedefi için dolgu. */
export const row = style({
  paddingBlock: vars.space[1],
})

export const error = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  color: vars.color.danger[600],
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.tight,
})

export const errorIcon = style({
  flexShrink: 0,
})

/* ── Suggestion section ──────────────────────────────────────────────── */

/** Collapsible wrapper for the suggestions section. */
export const suggestionsSection = style({
  display: 'grid',
  gap: vars.space[3],
})

export const suggestionToggle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: 0,
  margin: 0,
  border: 0,
  background: 'none',
  color: vars.color.text.primary,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.lineHeight.tight,
  cursor: 'pointer',

  selectors: {
    '&:hover': {
      color: vars.color.primary[700],
    },
  },
})

export const suggestionToggleIcon = style({
  transition: `transform ${vars.duration.fast} ${vars.ease.standard}`,

  selectors: {
    '[data-expanded="true"] > &': {
      transform: 'rotate(90deg)',
    },
  },
})

const collapseIn = keyframes({
  from: { opacity: 0, gridTemplateRows: '0fr' },
  to: { opacity: 1, gridTemplateRows: '1fr' },
})

const collapseOut = keyframes({
  from: { opacity: 1, gridTemplateRows: '1fr' },
  to: { opacity: 0, gridTemplateRows: '0fr' },
})

/**
 * Grid-row animation: `grid-template-rows: 0fr → 1fr` lets the inner
 * wrapper's `min-height: 0` → natural height transition smoothly.
 */
export const suggestionListWrapper = recipe({
  base: {
    display: 'grid',
    overflow: 'hidden',
  },
  variants: {
    open: {
      true: {
        gridTemplateRows: '1fr',
        animation: `${collapseIn} ${vars.duration.normal} ${vars.ease.standard}`,
      },
      false: {
        gridTemplateRows: '0fr',
        animation: `${collapseOut} ${vars.duration.normal} ${vars.ease.standard}`,
        /**
         * `animation-fill-mode: forwards` keeps the element at 0fr after
         * the animation ends so the collapsed content stays hidden.
         */
        animationFillMode: 'forwards',
      },
    },
  },
})

export const suggestionListInner = style({
  minHeight: 0,
})

export const suggestionList = style({
  display: 'grid',
  gap: vars.space[2],
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

const confidenceColor = createVar()

export const suggestionCard = recipe({
  base: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gap: vars.space[2],
    padding: vars.space[3],
    paddingInlineStart: vars.space[4],
    borderRadius: vars.radius.md,
    border: `1px solid ${vars.color.border.subtle}`,
    borderInlineStart: `3px solid ${vars.color.primary[400]}`,
    background: vars.color.primary[50],
    cursor: 'pointer',
    transition: `border-color ${vars.duration.fast} ${vars.ease.standard}, background ${vars.duration.fast} ${vars.ease.standard}, box-shadow ${vars.duration.fast} ${vars.ease.standard}`,

    selectors: {
      '&:hover': {
        borderColor: vars.color.primary[300],
        background: vars.color.primary[100],
        boxShadow: `0 1px 3px rgba(0, 0, 0, 0.06)`,
      },
    },
  },

  variants: {
    selected: {
      true: {
        borderInlineStartColor: vars.color.primary[600],
        borderColor: vars.color.primary[400],
        background: vars.color.primary[100],
      },
      false: {},
    },
  },
})

export const suggestionBody = style({
  display: 'grid',
  gap: vars.space[1],
  minWidth: 0,
})

export const suggestionLabel = style({
  color: vars.color.text.primary,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.lineHeight.tight,
})

export const suggestionSource = style({
  color: vars.color.text.muted,
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.tight,
})

export const confidenceBadge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.lineHeight.tight,
    whiteSpace: 'nowrap',
    color: confidenceColor,
  },

  variants: {
    level: {
      high: {
        vars: { [confidenceColor]: vars.color.success[700] },
      },
      medium: {
        vars: { [confidenceColor]: vars.color.warning[700] },
      },
      low: {
        vars: { [confidenceColor]: vars.color.text.muted },
      },
    },
  },
})

export const confidenceDot = recipe({
  base: {
    display: 'inline-block',
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    flexShrink: 0,
  },

  variants: {
    level: {
      high: { background: vars.color.success[600] },
      medium: { background: vars.color.warning[600] },
      low: { background: vars.color.text.muted },
    },
  },
})

/** Highlights a manual reason card/row when it matches a suggestion. */
export const highlightedCard = style({
  boxShadow: `inset 0 0 0 1px ${vars.color.primary[300]}, 0 0 0 2px ${vars.color.primary[100]}`,
})
