import { keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

/**
 * Apple "Liquid Glass" estetiği — bileşen-lokal.
 *
 * Bu bileşen, projenin açık tema design token'larından (`vars.color.*`) **bilinçli
 * olarak ayrıdır**: kaynak (MetaPanel) Apple Dynamic Island'ının koyu cam-morfizmini
 * taşır ve koyu zeminde kullanılır. Glass renkleri yarı saydam beyaz/mor katmanlardır
 * ve açık tema token'larına eşlenemez — token'a zorlamak cam etkisini bozar. Bu yüzden
 * renkler ve Apple spring/expo easing'i burada modül-seviye sabittir; "component ham
 * renk içermez" kuralının dar, gerekçeli istisnası. Kaynak: `globals.css` glass-pill/
 * glass-heavy + `dynamic-island.tsx`.
 */

/* ── Palet (yarı saydam, koyu zemin için) ── */
const TEXT = 'rgba(255, 255, 255, 0.90)'
const TEXT_DIM = 'rgba(255, 255, 255, 0.60)'
const TEXT_FAINT = 'rgba(255, 255, 255, 0.40)'
const TEXT_GHOST = 'rgba(255, 255, 255, 0.25)'
const HAIRLINE = 'rgba(255, 255, 255, 0.08)'
const FILL = 'rgba(255, 255, 255, 0.08)'
const ACCENT = '#818cf8'
const ACCENT_BG = '#6366f1'

/* ── Apple easing (token `ease` overshoot=1.2 ile sınırlı; Island ~spring ister) ── */
const EASE_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_SPRING = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'

/* ── Keyframes (her animasyon aşağıda reduced-motion ile guard'lı) ── */
const glassIn = keyframes({
  from: { opacity: 0, transform: 'translateX(-50%) scale(0.92) translateY(-12px)' },
  to: { opacity: 1, transform: 'translateX(-50%) scale(1) translateY(0)' },
})
const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})
const statusPulse = keyframes({
  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
  '50%': { opacity: 0.4, transform: 'scale(0.85)' },
})

/*
  Cam filtresi **tek fonksiyon** (`blur`) — bilerek `saturate` YOK.

  Neden: `backdrop-filter: blur(Npx) saturate(P%)` (iki fonksiyon) üretim CSS
  küçültücüsünde iki fonksiyon arası boşluğu kaybedip (`blur(80px)saturate(200%)`)
  geçersizleşiyor ve tarayıcıda `none`'a düşüyordu — cam efekti Pages'te
  kayboluyordu. Değeri CSS custom property'ye almak WebKit'te düzeltti ama
  Chromium `backdrop-filter: var()`'ı `none`'a çeviriyor. En dayanıklı, üç motorda
  da çalışan yol tek fonksiyon: boşluk yok, küçültücü bozamaz. Doygunluk hissini
  yüzeyin kendi renkli gradyanı ve specüler iç gölgesi zaten veriyor.
*/

/* Ortak cam yüzey — blur + specüler iç gölge. */
const glassSurface = {
  backdropFilter: 'blur(60px)',
  WebkitBackdropFilter: 'blur(60px)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  boxShadow: [
    'inset 0 1px 0 0 rgba(255, 255, 255, 0.20)',
    'inset 0 -0.5px 0 0 rgba(0, 0, 0, 0.06)',
    '0 0 0 0.5px rgba(255, 255, 255, 0.06)',
    '0 8px 32px rgba(0, 0, 0, 0.3)',
    '0 2px 6px rgba(0, 0, 0, 0.2)',
  ].join(', '),
} as const

/* ── Daraltılmış hap (collapsed) ── */

/** Hap'ın sabit konumu — ekranın üst-ortası (Apple Dynamic Island yeri). */
export const pillWrapper = style({
  position: 'fixed',
  insetBlockStart: '1rem',
  insetInlineStart: '50%',
  transform: 'translateX(-50%)',
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
})

export const trigger = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: '9999px',
    paddingInline: '0.75rem',
    paddingBlock: '0.375rem',
    cursor: 'pointer',
    background:
      'linear-gradient(90deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.09) 100%), rgba(120,130,255,0.04)',
    ...glassSurface,
    transition: `padding 0.4s ${EASE_SPRING}, gap 0.4s ${EASE_SPRING}, border-color 0.3s ${EASE_EXPO}`,
    color: TEXT_DIM,
    font: 'inherit',

    selectors: {
      '&:hover': {
        paddingInline: '1rem',
        gap: '0.75rem',
        borderColor: 'rgba(255, 255, 255, 0.22)',
      },
      '&:focus-visible': {
        outline: `2px solid ${ACCENT}`,
        outlineOffset: '2px',
      },
    },

    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  },
  variants: {
    // Panel açıkken hap görsel olarak geri çekilir (expanded kart öne çıkar).
    open: {
      true: { opacity: 0, pointerEvents: 'none' },
      false: {},
    },
  },
  defaultVariants: { open: false },
})

/** Marka logosu — küçük dolu daire. */
export const logo = style({
  display: 'flex',
  height: '1.75rem',
  width: '1.75rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '9999px',
  background: ACCENT_BG,
  color: '#fff',
  fontSize: '0.625rem',
  fontWeight: 700,
})

export const current = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  whiteSpace: 'nowrap',
})

export const currentLabel = style({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: TEXT_DIM,
})

/** Hover'da açılan mini-nav noktaları (hap'ın kardeşi, iç içe etkileşim yok). */
export const miniNav = style({
  display: 'none',
  alignItems: 'center',
  gap: '0.25rem',
  marginInlineStart: '0.25rem',

  '@media': {
    'screen and (min-width: 40rem)': { display: 'flex' },
  },
})

export const miniDivider = style({
  height: '1px',
  width: '0.75rem',
  background: 'rgba(255, 255, 255, 0.15)',
})

export const miniDot = recipe({
  base: {
    display: 'flex',
    height: '1.5rem',
    width: '1.5rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    transition: `transform 0.2s ${EASE_SPRING}, background 0.2s ${EASE_EXPO}`,
    selectors: {
      '&:hover': { transform: 'scale(1.1)', background: FILL },
      '&:focus-visible': { outline: `2px solid ${ACCENT}`, outlineOffset: '1px' },
    },
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  },
  variants: {
    active: {
      true: { background: FILL, transform: 'scale(1.1)' },
      false: {},
    },
  },
  defaultVariants: { active: false },
})

export const miniMore = style({
  display: 'flex',
  height: '1.5rem',
  minWidth: '1.5rem',
  paddingInline: '0.25rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '9999px',
  color: TEXT_GHOST,
  fontSize: '0.5625rem',
})

/* ── kbd (klavye kısayol rozeti) — projede ilk ── */
export const kbd = style({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '0.25rem',
  background: FILL,
  paddingInline: '0.375rem',
  paddingBlock: '0.125rem',
  fontFamily: '"SF Mono", "Cascadia Code", "JetBrains Mono", ui-monospace, monospace',
  fontSize: '0.5625rem',
  color: TEXT_FAINT,
})

export const kbdHint = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  marginInlineStart: '0.25rem',
})

/* ── Backdrop (Dialog.Backdrop) ── */
export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 40,
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  animation: `${fadeIn} 0.3s ${EASE_EXPO}`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
})

/* ── Genişletilmiş kart (Dialog.Popup) — glass-heavy, top-center ── */
export const popup = style({
  position: 'fixed',
  zIndex: 50,
  insetBlockStart: '1rem',
  insetInlineStart: '50%',
  transform: 'translateX(-50%)',
  width: 'min(100vw - 2rem, 720px)',
  maxHeight: '80vh',
  overflowY: 'auto',
  borderRadius: '1.5rem',
  color: TEXT,
  background:
    'linear-gradient(160deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%), rgba(120,130,255,0.05)',
  backdropFilter: 'blur(80px)',
  WebkitBackdropFilter: 'blur(80px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: [
    'inset 0 1px 0 0 rgba(255, 255, 255, 0.25)',
    'inset 0 -1px 0 0 rgba(0, 0, 0, 0.08)',
    '0 0 80px rgba(99, 102, 241, 0.06)',
    '0 24px 64px rgba(0, 0, 0, 0.4)',
    '0 4px 16px rgba(0, 0, 0, 0.3)',
  ].join(', '),
  animation: `${glassIn} 0.5s ${EASE_EXPO}`,
  outline: 'none',

  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
})

/* Blur desteklemeyen tarayıcıda opak koyu yüzeye düş (kaynak globals.css deseni). */
export const noBlurFallback = style({
  '@supports': {
    'not (backdrop-filter: blur(1px))': {
      background: 'rgba(15, 16, 28, 0.96)',
    },
  },
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  borderBlockEnd: `1px solid ${HAIRLINE}`,
  paddingInline: '1rem',
  paddingBlock: '0.75rem',
})

export const brandRow = style({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  gap: '0.5rem',
})

export const brandName = style({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: TEXT,
})

export const brandBadge = style({
  borderRadius: '0.375rem',
  background: 'rgba(99, 102, 241, 0.2)',
  paddingInline: '0.375rem',
  paddingBlock: '0.125rem',
  fontSize: '0.625rem',
  color: ACCENT,
})

export const searchRow = style({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  gap: '0.5rem',
})

export const searchInput = style({
  flex: 1,
  minWidth: 0,
  border: 'none',
  background: 'transparent',
  fontSize: '0.875rem',
  color: TEXT,
  outline: 'none',
  '::placeholder': { color: TEXT_GHOST },
})

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
})

export const iconButton = style({
  display: 'flex',
  height: '1.75rem',
  minWidth: '1.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.25rem',
  paddingInline: '0.375rem',
  borderRadius: '0.5rem',
  border: 'none',
  background: 'transparent',
  color: TEXT_FAINT,
  fontSize: '0.625rem',
  cursor: 'pointer',
  transition: `background 0.2s ${EASE_EXPO}, color 0.2s ${EASE_EXPO}`,
  selectors: {
    '&:hover': { background: FILL, color: TEXT_DIM },
    '&:focus-visible': { outline: `2px solid ${ACCENT}`, outlineOffset: '1px' },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
})

/* ── Navigasyon grid'i ── */
export const section = style({
  padding: '0.75rem',
})

export const sectionLabel = style({
  marginBlockEnd: '0.5rem',
  paddingInline: '0.25rem',
  fontSize: '0.625rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: TEXT_GHOST,
})

export const navGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '0.25rem',
  '@media': {
    'screen and (min-width: 40rem)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
    'screen and (min-width: 48rem)': { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' },
  },
})

export const navItem = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.375rem',
    borderRadius: '0.75rem',
    padding: '0.75rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `background 0.25s ${EASE_EXPO}`,
    selectors: {
      '&:hover': { background: FILL },
      '&:focus-visible': { outline: `2px solid ${ACCENT}`, outlineOffset: '1px' },
    },
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  },
  variants: {
    active: {
      true: { background: FILL, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)' },
      false: {},
    },
  },
  defaultVariants: { active: false },
})

export const navIconWrap = recipe({
  base: {
    display: 'flex',
    height: '2.25rem',
    width: '2.25rem',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    transition: `background 0.25s ${EASE_EXPO}`,
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  },
  variants: {
    active: {
      true: { background: 'rgba(255, 255, 255, 0.12)' },
      false: { background: FILL },
    },
  },
  defaultVariants: { active: false },
})

export const navLabel = recipe({
  base: { fontSize: '0.625rem', fontWeight: 500 },
  variants: {
    active: {
      true: { color: TEXT },
      false: { color: TEXT_FAINT },
    },
  },
  defaultVariants: { active: false },
})

/* ── Hızlı komutlar ── */
export const commandSection = style({
  borderBlockStart: `1px solid ${HAIRLINE}`,
  padding: '0.75rem',
})

export const commandItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  borderRadius: '0.5rem',
  paddingInline: '0.5rem',
  paddingBlock: '0.5rem',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: `background 0.2s ${EASE_EXPO}`,
  selectors: {
    '&:hover': { background: FILL },
    '&:focus-visible': { outline: `2px solid ${ACCENT}`, outlineOffset: '1px' },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
})

export const commandIcon = style({
  display: 'flex',
  height: '1.75rem',
  width: '1.75rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.375rem',
  background: FILL,
  color: TEXT_DIM,
})

export const commandText = style({ display: 'grid', flex: 1, minWidth: 0 })
export const commandLabel = style({ fontSize: '0.75rem', fontWeight: 500, color: TEXT_DIM })
export const commandHint = style({ fontSize: '0.625rem', color: TEXT_GHOST })
export const commandChevron = style({ color: 'rgba(255, 255, 255, 0.15)', flexShrink: 0 })

/* ── Footer (klavye ipuçları + durum) ── */
export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  flexWrap: 'wrap',
  borderBlockStart: `1px solid ${HAIRLINE}`,
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  fontSize: '0.625rem',
  color: TEXT_GHOST,
})

export const footerHints = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

export const footerHint = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
})

export const status = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
})

export const statusDot = style({
  height: '0.5rem',
  width: '0.5rem',
  borderRadius: '9999px',
  background: '#34d399',
  animation: `${statusPulse} 2s ${EASE_EXPO} infinite`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
})

export const empty = style({
  padding: '1.5rem',
  textAlign: 'center',
  fontSize: '0.75rem',
  color: TEXT_GHOST,
})

/* Görsel gizli ama erişilebilir (Dialog.Title gerekliliği için). */
export const visuallyHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
})
