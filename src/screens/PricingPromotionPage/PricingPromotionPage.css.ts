import { style } from '@vanilla-extract/css'
import { vars } from '@/tokens/contract.css'

/**
 * Ekranin koku.
 *
 * Sayfa dolgusu yok: `AppShell`'in `<main>`'ine konan govde; dolguyu kabuk
 * verir. Story'ler `layout: 'padded'` ile taklit eder.
 */
export const root = style({
  display: 'grid',
  gap: vars.space[5],
  width: '100%',
  minWidth: 0,
})

/** Sekme panelinin ici. */
export const section = style({
  display: 'grid',
  gap: vars.space[4],
  minWidth: 0,
})

/** Baslik (h2). Tarayici varsayilan margin'ini sifirliyoruz. */
export const heading = style({
  margin: 0,
  color: vars.color.text.primary,
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.lineHeight.heading,
})

/** Aciklama metni. */
export const sectionDescription = style({
  margin: 0,
  maxWidth: vars.container.sm,
  color: vars.color.text.secondary,
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.body,
  overflowWrap: 'anywhere',
})

/** StatCard satirlari icin responsive grid. */
export const statGrid = style({
  display: 'grid',
  gap: vars.space[3],
  gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
  minWidth: 0,
})

/** Eylem cubuklari: "Yeni paket ekle", "Yeni kupon olustur" gibi. */
export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: vars.space[2],
})

/** Modal/form icindeki alan grubu. */
export const formGrid = style({
  display: 'grid',
  gap: vars.space[3],
  minWidth: 0,
})

/** Modal ici buton grubu. */
export const formActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: vars.space[2],
  paddingBlockStart: vars.space[3],
})

/** Grafik satirlari icin iki-sutunlu grid (masaustunde). */
export const chartGrid = style({
  display: 'grid',
  gap: vars.space[4],
  gridTemplateColumns: '1fr',
  minWidth: 0,
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: '2fr 1fr',
    },
  },
})

/** Suresi dolmus kupon satirlarinin soluk gorunumu. */
export const expiredRow = style({
  opacity: 0.5,
})

/** Kupon kodu mono yazi. */
export const couponCode = style({
  fontFamily: 'monospace',
  fontWeight: vars.font.weight.medium,
  letterSpacing: '0.05em',
})

/** Tablo icinde yuzde/tutar gosterimi. */
export const amount = style({
  fontWeight: vars.font.weight.semibold,
  fontVariantNumeric: 'tabular-nums',
})
