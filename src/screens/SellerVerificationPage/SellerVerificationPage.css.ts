import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

/**
 * Ekranin dis kabi.
 *
 * `minWidth: 0` grid cocuklarinin tasmasini engeller.
 */
export const root = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: vars.space[5],
  minWidth: 0,
})

/** Ozet istatistik satirinin kabi (StatCard'lar). */
export const statsRow = style({
  display: 'grid',
  gap: vars.space[3],
  gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
  minWidth: 0,
})

/**
 * Bolunmus duzen: sol kuyruk + sag detay.
 *
 * Mobilde (< 48rem) tek kolon; secili varken detay kuyrugu gizler (drill-down).
 * Masaustunde yan yana. `ApprovalQueue.css.ts`'in `layout` recipe'siyle
 * ayni kalip.
 */
export const layout = recipe({
  base: {
    display: 'grid',
    gap: vars.space[5],
    alignItems: 'start',
    gridTemplateColumns: '1fr',
  },

  variants: {
    split: {
      true: {
        '@media': {
          'screen and (min-width: 48rem)': {
            gridTemplateColumns: 'minmax(0, 22rem) minmax(0, 1fr)',
          },
        },
      },
      false: {},
    },
  },

  defaultVariants: { split: false },
})

/** Sol panel: kuyruk listesi. */
export const queuePanel = style({
  display: 'grid',
  gap: vars.space[3],
  alignContent: 'start',
  minWidth: 0,
})

/**
 * Mobilde secili varken kuyruk gizlenir (drill-down).
 *
 * `display: none` yalniz mobilde uygulanir; masaustunde her iki panel de gorunur.
 */
export const queuePanelHidden = style({
  '@media': {
    'screen and (max-width: 47.999rem)': {
      display: 'none',
    },
  },
})

/** Sag panel: secili basvurunun detayi. */
export const detailPanel = style({
  display: 'grid',
  gap: vars.space[4],
  alignContent: 'start',
  padding: vars.space[4],
  background: vars.color.bg.surface,
  border: `1px solid ${vars.color.border.subtle}`,
  borderRadius: vars.radius.lg,
  minWidth: 0,
})

/** Kuyruk baslik ve sayac satirinin kabi. */
export const queueHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: vars.space[2],
})

/** Alt bolum basliklari. */
export const sectionTitle = style({
  margin: 0,
  fontSize: vars.font.size.lg,
  lineHeight: vars.lineHeight.heading,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.primary,
})

/** Ekranin en ust basligi. */
export const title = style({
  margin: 0,
  fontSize: vars.font.size['2xl'],
  lineHeight: vars.lineHeight.heading,
  fontWeight: vars.font.weight.bold,
  color: vars.color.text.primary,
})

/** Kuyruk sayac metni ("N basvuru bekliyor"). */
export const countBadge = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.text.secondary,
  fontVariantNumeric: 'tabular-nums',
})

/** Filtre ve siralama kontrol satirinin kabi. */
export const filterRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  alignItems: 'center',
})

/**
 * Kuyruk listesi.
 *
 * `<ul>` margin + padding + listStyle uclu birden sifirlanir.
 */
export const queue = style({
  display: 'grid',
  gap: vars.space[2],
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

/** Kuyruk satirinin kabi. Secili olunca vurgulanir. */
export const queueItem = recipe({
  base: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    gap: vars.space[3],
    alignItems: 'center',
    padding: vars.space[3],
    borderRadius: vars.radius.md,
    cursor: 'pointer',
    border: '1px solid',
    borderColor: vars.color.border.subtle,
    transition: 'background 0.15s ease',

    ':hover': {
      background: vars.color.bg.subtle,
    },
  },

  variants: {
    selected: {
      true: {
        background: vars.color.bg.subtle,
        borderColor: vars.color.border.strong,
      },
      false: {},
    },
  },

  defaultVariants: { selected: false },
})

/** Kuyruk satirindaki icerik grubu. */
export const queueItemBody = style({
  display: 'grid',
  gap: vars.space[1],
  minWidth: 0,
})

/** Kuyruk satirindaki ad metni. */
export const queueItemName = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.primary,
  overflowWrap: 'anywhere',
})

/** Kuyruk satirindaki meta bilgi (tarih, belge turu). */
export const queueItemMeta = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.text.muted,
})

/** Kuyruk satirindaki eylem butonu kabi. */
export const queueItemActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  alignItems: 'center',
})

/* ──────────────────────────────────────────────────────────────────────────────
   Detay paneli stiller
   ────────────────────────────────────────────────────────────────────────────── */

/** Satici bilgi header'i. */
export const sellerHeader = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: vars.space[3],
  alignItems: 'start',
})

/** Satici bilgi header'inin metin grubu. */
export const sellerInfo = style({
  display: 'grid',
  gap: vars.space[1],
  minWidth: 0,
})

export const sellerName = style({
  margin: 0,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.primary,
  overflowWrap: 'anywhere',
})

export const sellerMeta = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.text.secondary,
  overflowWrap: 'anywhere',
})

/** Belge goruntuleri grid'i. */
export const documentGrid = style({
  display: 'grid',
  gap: vars.space[3],
  gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
  minWidth: 0,
})

/** Tek bir belge gorseli kabi. */
export const documentCard = style({
  display: 'grid',
  gap: vars.space[2],
  alignContent: 'start',
})

/**
 * Belge gorseli.
 *
 * `aspect-ratio` sabit: belgeler karti dolduracak sekilde olceklenir.
 * `cursor: zoom-in` tiklanabilir oldugunu belirtir.
 */
export const documentImage = style({
  width: '100%',
  aspectRatio: '3 / 2',
  objectFit: 'cover',
  borderRadius: vars.radius.md,
  border: '1px solid',
  borderColor: vars.color.border.subtle,
  cursor: 'zoom-in',
  transition: 'transform 0.2s ease',

  ':hover': {
    transform: 'scale(1.02)',
  },
})

/** Belge gorseli etiketi. */
export const documentLabel = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  color: vars.color.text.muted,
  textAlign: 'center',
})

/** Tanimlama bilgileri `<dl>`. */
export const facts = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: `${vars.space[1]} ${vars.space[3]}`,
  margin: 0,
  fontSize: vars.font.size.sm,
})

export const factTerm = style({
  margin: 0,
  color: vars.color.text.muted,
  fontWeight: vars.font.weight.medium,
})

export const factValue = style({
  margin: 0,
  color: vars.color.text.primary,
  overflowWrap: 'anywhere',
})

/** Dogrulama gecmisi zaman cizelgesi. */
export const timeline = style({
  display: 'grid',
  gap: vars.space[2],
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

export const timelineItem = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: vars.space[2],
  alignItems: 'start',
  fontSize: vars.font.size.sm,
})

export const timelineDot = style({
  width: '0.5rem',
  height: '0.5rem',
  borderRadius: vars.radius.full,
  background: vars.color.border.strong,
  marginBlockStart: '0.4rem',
  flexShrink: 0,
})

export const timelineContent = style({
  display: 'grid',
  gap: vars.space[0],
  minWidth: 0,
})

export const timelineDate = style({
  color: vars.color.text.muted,
  fontSize: vars.font.size.sm,
})

export const timelineAction = style({
  color: vars.color.text.primary,
  overflowWrap: 'anywhere',
})

export const timelineNote = style({
  color: vars.color.text.secondary,
  fontStyle: 'italic',
  overflowWrap: 'anywhere',
})

/** Satici istatistikleri satirinin kabi. */
export const sellerStats = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[3],
  fontSize: vars.font.size.sm,
})

export const sellerStatItem = style({
  display: 'flex',
  gap: vars.space[1],
  alignItems: 'center',
})

export const sellerStatLabel = style({
  color: vars.color.text.muted,
})

export const sellerStatValue = style({
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.primary,
  fontVariantNumeric: 'tabular-nums',
})

/** Alt eylem cubugu. */
export const actionBar = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  paddingBlockStart: vars.space[3],
  borderBlockStart: '1px solid',
  borderColor: vars.color.border.subtle,
})

/** Red nedeni modal'inin govdesi. */
export const rejectBody = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: vars.space[4],
  minWidth: 0,
})

/** Modal footer eylem satirinin kabi. */
export const dialogActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: vars.space[3],
})

/** Buyutulmus belge gorseli (zoom modal). */
export const zoomImage = style({
  width: '100%',
  maxHeight: '80vh',
  objectFit: 'contain',
  borderRadius: vars.radius.md,
})

/** "Geri" butonu: mobilde detaydan kuyruga donmek icin. */
export const backButton = style({
  '@media': {
    'screen and (min-width: 48rem)': {
      display: 'none',
    },
  },
})

/** Bos kuyruk yuzeyinin kabi. */
export const emptyQueue = style({
  display: 'grid',
  placeItems: 'center',
  padding: vars.space[8],
})

/**
 * Ayirici (HR).
 *
 * Grid'in gap'i yerine gorunen bir cizgi gereken yerlerde kullanilir.
 */
export const divider = style({
  border: 'none',
  borderBlockStart: '1px solid',
  borderColor: vars.color.border.subtle,
  margin: 0,
})

/** Oncelik rozetinin renk varyantlari. */
export const priorityBadge = recipe({
  base: {},
  variants: {
    priority: {
      normal: {},
      yuksek: {},
      acil: {},
    },
  },
  defaultVariants: { priority: 'normal' },
})
