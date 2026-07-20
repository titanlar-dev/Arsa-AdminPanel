import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

export const root = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: vars.space[3],
    flexWrap: 'wrap',
    background: vars.color.bg.elevated,
    fontSize: vars.font.size.sm,

    '@media': {
      /*
        Dar ekranda sayaç ile eylemler yan yana durduğunda eylemlere kalan kolon
        bir butondan dar kalıyor ve her buton kendi satırına düşüp tırtıklı bir
        sütun oluşturuyordu. Dikeye alınınca eylemler tam genişliği kullanıp
        ikişerli sarıyor.
      */
      'screen and (max-width: 30rem)': {
        flexDirection: 'column',
        alignItems: 'stretch',
      },
    },
  },

  variants: {
    variant: {
      /**
       * Yüzen ada: akıştan çıkar, uzun listede kaydırırken hep erişilir.
       * `insetInline` ile iki yandan boşluk bırakılır — 320 piksel ekranda
       * kenara yapışmaz; `maxWidth` ile geniş ekranda satır boyunca yayılmaz.
       */
      floating: {
        position: 'fixed',
        /*
          Alt konum iOS home indicator'ı (safe-area-inset-bottom, ~34px) hesaba
          katar: sabit `space[4]` (16px) çubuğu göstergenin üstüne bindiriyordu.
          `max(space[4], safe-area + space[2])` masaüstünde (safe-area 0) eski
          16px'i korur, iOS'ta göstergenin 8px üstüne oturur. Aynı desen
          Toast/Drawer/ModerationActionBar'da da var.
        */
        insetBlockEnd: `max(${vars.space[4]}, calc(env(safe-area-inset-bottom, 0px) + ${vars.space[2]}))`,
        /*
          Yatay güvenli alan: landscape iPhone'da yan çentik/kavis floating
          çubuğu kırpabilir. `max` ile safe-area 0 olan cihazlarda `space[4]`
          korunur.
        */
        insetInlineStart: `max(${vars.space[4]}, env(safe-area-inset-left, 0px))`,
        insetInlineEnd: `max(${vars.space[4]}, env(safe-area-inset-right, 0px))`,
        marginInline: 'auto',
        maxWidth: vars.container.md,
        zIndex: vars.z.sticky,
        padding: `${vars.space[3]} ${vars.space[4]}`,
        border: `1px solid ${vars.color.border.default}`,
        borderRadius: vars.radius.xl,
        boxShadow: vars.shadow.lg,
      },

      /** Kabın alt kenarına yapışır; tam genişlik, üstten çizgi. */
      sticky: {
        position: 'sticky',
        insetBlockEnd: 0,
        zIndex: vars.z.sticky,
        padding: `${vars.space[3]} ${vars.space[4]}`,
        borderBlockStart: `1px solid ${vars.color.border.default}`,
        boxShadow: vars.shadow.md,
      },

      /** Normal akışta: tablonun üstündeki toolbar. */
      inline: {
        padding: `${vars.space[2]} ${vars.space[3]}`,
        background: vars.color.selection.bg,
        border: `1px solid ${vars.color.border.subtle}`,
        borderRadius: vars.radius.md,
      },
    },
  },

  defaultVariants: { variant: 'floating' },
})

export const count = style({
  color: vars.color.text.primary,
  fontWeight: vars.font.weight.semibold,
  fontVariantNumeric: 'tabular-nums',
  whiteSpace: 'nowrap',
})

/**
 * Eylemler sayaç ile temizle arasında kalır ve daralınca alt satıra sarar;
 * mobilde altı eylem tek satıra sığmaz.
 */
export const actions = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space[2],
  flex: 1,
})

/** Temizle en sağda: seçimden çıkış yolu her zaman aynı yerde. */
export const clear = style({
  marginInlineStart: 'auto',
  flexShrink: 0,

  '@media': {
    /** Dikey düzende "en sağa it" anlamsız; sola hizalanıp eylemleri takip eder. */
    'screen and (max-width: 30rem)': {
      marginInlineStart: 0,
    },
  },
})
