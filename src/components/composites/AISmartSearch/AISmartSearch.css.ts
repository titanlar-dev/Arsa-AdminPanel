import { globalStyle, keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

/**
 * AI Smart Search — cam-morfizmli arama overlay'i.
 *
 * DynamicIsland ile ayni koyu Apple glass estetigini paylasinir: yari saydam
 * beyaz katmanlar, backdrop-filter blur, spring easing. Acik tema token'larindan
 * bilinchli olarak ayridir — koyu zeminde kullanilir. Gerekchesi DynamicIsland.css.ts
 * ile ayni.
 */

/* -- Palet (yari saydam, koyu zemin icin) -- */
const TEXT = 'rgba(255, 255, 255, 0.90)'
const TEXT_DIM = 'rgba(255, 255, 255, 0.60)'
const TEXT_FAINT = 'rgba(255, 255, 255, 0.40)'
const TEXT_GHOST = 'rgba(255, 255, 255, 0.25)'
const HAIRLINE = 'rgba(255, 255, 255, 0.08)'
const FILL = 'rgba(255, 255, 255, 0.08)'
const ACCENT = '#818cf8'

/* -- Chip kategori renkleri -- */
const CHIP_LOCATION = { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa' }
const CHIP_TYPE = { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ade80' }
const CHIP_PRICE = { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24' }
const CHIP_STATUS = { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171' }
const CHIP_USER = { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)', text: '#c084fc' }
const CHIP_DATE = { bg: 'rgba(34, 211, 238, 0.15)', border: 'rgba(34, 211, 238, 0.3)', text: '#22d3ee' }
const CHIP_DEFAULT = { bg: FILL, border: HAIRLINE, text: TEXT_DIM }

/* -- Apple easing -- */
const EASE_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_SPRING = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'

/* -- Keyframes -- */
const glassIn = keyframes({
  from: { opacity: 0, transform: 'translateX(-50%) scale(0.92) translateY(-12px)' },
  to: { opacity: 1, transform: 'translateX(-50%) scale(1) translateY(0)' },
})
const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})
const chipIn = keyframes({
  from: { opacity: 0, transform: 'scale(0.8) translateY(4px)' },
  to: { opacity: 1, transform: 'scale(1) translateY(0)' },
})
const slideIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})
const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
})
const statusPulse = keyframes({
  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
  '50%': { opacity: 0.4, transform: 'scale(0.85)' },
})

/* -- Backdrop -- */
export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 40,
  background: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  animation: `${fadeIn} 0.3s ${EASE_EXPO}`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
})

/* -- Popup (cam kart) -- */
export const popup = style({
  position: 'fixed',
  zIndex: 50,
  insetBlockStart: '10vh',
  insetInlineStart: '50%',
  transform: 'translateX(-50%)',
  width: 'min(100vw - 2rem, 640px)',
  maxHeight: '75vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '1.25rem',
  color: TEXT,
  background:
    'linear-gradient(160deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%), rgba(120,130,255,0.05)',
  backdropFilter: 'blur(80px) saturate(200%)',
  WebkitBackdropFilter: 'blur(80px) saturate(200%)',
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
  overflow: 'hidden',

  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
    'screen and (max-width: 30rem)': {
      insetBlockStart: 0,
      insetInlineStart: 0,
      transform: 'none',
      width: '100vw',
      maxHeight: '100dvh',
      height: '100dvh',
      borderRadius: 0,
    },
  },
})

/* Blur desteklemeyen tarayicida opak koyu yuzeye dus. */
export const noBlurFallback = style({
  '@supports': {
    'not (backdrop-filter: blur(1px))': {
      background: 'rgba(15, 16, 28, 0.96)',
    },
  },
})

/* Scrollbar cam UI'a uydur. */
export const scrollArea = style({
  flex: 1,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255, 255, 255, 0.22) transparent',
})

globalStyle(`${scrollArea}::-webkit-scrollbar`, { width: '10px', height: '10px' })
globalStyle(`${scrollArea}::-webkit-scrollbar-track`, { background: 'transparent' })
globalStyle(`${scrollArea}::-webkit-scrollbar-thumb`, {
  background: 'rgba(255, 255, 255, 0.18)',
  borderRadius: '9999px',
  border: '2px solid transparent',
  backgroundClip: 'padding-box',
})
globalStyle(`${scrollArea}::-webkit-scrollbar-thumb:hover`, {
  background: 'rgba(255, 255, 255, 0.30)',
  backgroundClip: 'padding-box',
})

/* -- Search header -- */
export const searchHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  paddingInline: '1rem',
  paddingBlock: '0.875rem',
  borderBlockEnd: `1px solid ${HAIRLINE}`,
})

export const searchIconWrap = style({
  display: 'flex',
  flexShrink: 0,
  color: TEXT_FAINT,
})

export const sparkleIcon = style({
  color: '#818cf8',
  flexShrink: 0,
})

export const searchInput = style({
  flex: 1,
  minWidth: 0,
  border: 'none',
  background: 'transparent',
  fontSize: '1.125rem',
  fontWeight: 400,
  color: TEXT,
  outline: 'none',
  fontFamily: 'inherit',
  '::placeholder': { color: TEXT_GHOST },
})

export const closeButton = style({
  display: 'flex',
  height: '1.75rem',
  width: '1.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.5rem',
  border: 'none',
  background: 'transparent',
  color: TEXT_FAINT,
  cursor: 'pointer',
  flexShrink: 0,
  transition: `background 0.2s ${EASE_EXPO}, color 0.2s ${EASE_EXPO}`,
  selectors: {
    '&:hover': { background: FILL, color: TEXT_DIM },
    '&:focus-visible': { outline: `2px solid ${ACCENT}`, outlineOffset: '1px' },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
})

export const kbdHint = style({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '0.25rem',
  background: FILL,
  paddingInline: '0.375rem',
  paddingBlock: '0.125rem',
  fontFamily: '"SF Mono", "Cascadia Code", "JetBrains Mono", ui-monospace, monospace',
  fontSize: '0.5625rem',
  color: TEXT_GHOST,
  flexShrink: 0,
})

/* -- Parsed query chips -- */
export const parsedQueryRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  paddingInline: '1rem',
  paddingBlock: '0.5rem',
  borderBlockEnd: `1px solid ${HAIRLINE}`,
  flexWrap: 'wrap',
})

export const parsedLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.625rem',
  color: TEXT_GHOST,
  whiteSpace: 'nowrap',
  flexShrink: 0,
})

export const chipCategoryMap: Record<string, typeof CHIP_DEFAULT> = {
  location: CHIP_LOCATION,
  konum: CHIP_LOCATION,
  type: CHIP_TYPE,
  tip: CHIP_TYPE,
  price: CHIP_PRICE,
  fiyat: CHIP_PRICE,
  status: CHIP_STATUS,
  durum: CHIP_STATUS,
  user: CHIP_USER,
  kullanici: CHIP_USER,
  date: CHIP_DATE,
  tarih: CHIP_DATE,
}

/** Chip renklendirmesini JS'den yapmak yerine 6 kategorik varyant */
export const queryChip = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.1875rem',
    borderRadius: '9999px',
    fontSize: '0.6875rem',
    fontWeight: 500,
    border: '1px solid',
    whiteSpace: 'nowrap',
    animation: `${chipIn} 0.3s ${EASE_SPRING} both`,
    '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
  },
  variants: {
    category: {
      location: { background: CHIP_LOCATION.bg, borderColor: CHIP_LOCATION.border, color: CHIP_LOCATION.text },
      type: { background: CHIP_TYPE.bg, borderColor: CHIP_TYPE.border, color: CHIP_TYPE.text },
      price: { background: CHIP_PRICE.bg, borderColor: CHIP_PRICE.border, color: CHIP_PRICE.text },
      status: { background: CHIP_STATUS.bg, borderColor: CHIP_STATUS.border, color: CHIP_STATUS.text },
      user: { background: CHIP_USER.bg, borderColor: CHIP_USER.border, color: CHIP_USER.text },
      date: { background: CHIP_DATE.bg, borderColor: CHIP_DATE.border, color: CHIP_DATE.text },
      default: { background: CHIP_DEFAULT.bg, borderColor: CHIP_DEFAULT.border, color: CHIP_DEFAULT.text },
    },
  },
  defaultVariants: { category: 'default' },
})

export const chipLabel = style({
  fontWeight: 600,
  opacity: 0.7,
})

/* -- Category tabs -- */
export const tabRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  paddingInline: '1rem',
  borderBlockEnd: `1px solid ${HAIRLINE}`,
})

export const tab = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    paddingInline: '0.75rem',
    paddingBlock: '0.625rem',
    border: 'none',
    borderBlockEnd: '2px solid transparent',
    background: 'transparent',
    color: TEXT_FAINT,
    fontSize: '0.75rem',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    font: 'inherit',
    transition: `color 0.2s ${EASE_EXPO}, border-color 0.2s ${EASE_EXPO}`,
    selectors: {
      '&:hover': { color: TEXT_DIM },
      '&:focus-visible': { outline: `2px solid ${ACCENT}`, outlineOffset: '-2px' },
    },
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  },
  variants: {
    active: {
      true: { color: TEXT, borderBlockEndColor: ACCENT },
      false: {},
    },
  },
  defaultVariants: { active: false },
})

export const tabBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '1.25rem',
  height: '1rem',
  paddingInline: '0.25rem',
  borderRadius: '9999px',
  background: FILL,
  fontSize: '0.5625rem',
  fontWeight: 600,
  color: TEXT_FAINT,
})

/* -- Result list -- */
export const resultSection = style({
  padding: '0.5rem',
  animation: `${slideIn} 0.3s ${EASE_EXPO} both`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
})

export const resultItem = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderRadius: '0.5rem',
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `background 0.15s ${EASE_EXPO}`,
    selectors: {
      '&:hover': { background: FILL },
      '&:focus-visible': { outline: `2px solid ${ACCENT}`, outlineOffset: '1px' },
    },
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  },
  variants: {
    selected: {
      true: { background: FILL, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)' },
      false: {},
    },
  },
  defaultVariants: { selected: false },
})

export const resultThumbnail = style({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '0.375rem',
  objectFit: 'cover',
  flexShrink: 0,
  background: FILL,
})

export const resultIconWrap = style({
  display: 'flex',
  height: '2rem',
  width: '2rem',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.375rem',
  background: FILL,
  color: TEXT_DIM,
})

export const resultAvatar = style({
  width: '2rem',
  height: '2rem',
  borderRadius: '9999px',
  objectFit: 'cover',
  flexShrink: 0,
  background: FILL,
})

export const resultContent = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  gap: '0.125rem',
})

export const resultTitle = style({
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: TEXT,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const resultMeta = style({
  fontSize: '0.6875rem',
  color: TEXT_FAINT,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const resultStatusBadge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: '0.375rem',
    paddingBlock: '0.0625rem',
    borderRadius: '9999px',
    fontSize: '0.5625rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  variants: {
    variant: {
      success: { background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' },
      warning: { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
      danger: { background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
      info: { background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
      neutral: { background: FILL, color: TEXT_FAINT },
    },
  },
  defaultVariants: { variant: 'neutral' },
})

export const resultTrailing = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  flexShrink: 0,
})

export const resultPrice = style({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: TEXT,
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'tabular-nums',
})

/* -- Recent searches -- */
export const recentSection = style({
  padding: '0.75rem',
})

export const recentHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBlockEnd: '0.5rem',
  paddingInline: '0.25rem',
})

export const recentTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  fontSize: '0.625rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: TEXT_GHOST,
})

export const clearButton = style({
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: TEXT_FAINT,
  fontSize: '0.625rem',
  cursor: 'pointer',
  font: 'inherit',
  selectors: {
    '&:hover': { color: TEXT_DIM },
  },
})

export const recentItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  borderRadius: '0.5rem',
  paddingInline: '0.5rem',
  paddingBlock: '0.375rem',
  cursor: 'pointer',
  transition: `background 0.2s ${EASE_EXPO}`,
  selectors: {
    '&:hover': { background: FILL },
    '&:focus-visible': { outline: `2px solid ${ACCENT}`, outlineOffset: '1px' },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
})

export const recentItemIcon = style({
  color: TEXT_GHOST,
  flexShrink: 0,
})

export const recentItemText = style({
  fontSize: '0.75rem',
  color: TEXT_DIM,
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

/* -- AI suggestions -- */
export const suggestionsSection = style({
  padding: '0.75rem',
  borderBlockStart: `1px solid ${HAIRLINE}`,
})

export const suggestionsTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  paddingInline: '0.25rem',
  marginBlockEnd: '0.5rem',
  fontSize: '0.625rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: TEXT_GHOST,
})

export const suggestionItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  borderRadius: '0.375rem',
  paddingInline: '0.5rem',
  paddingBlock: '0.375rem',
  cursor: 'pointer',
  fontSize: '0.75rem',
  color: ACCENT,
  transition: `background 0.2s ${EASE_EXPO}`,
  selectors: {
    '&:hover': { background: FILL },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
})

export const aiAnalyzeButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  marginBlockStart: '0.5rem',
  marginInlineStart: '0.25rem',
  paddingInline: '0.75rem',
  paddingBlock: '0.375rem',
  borderRadius: '9999px',
  border: `1px solid rgba(129, 140, 248, 0.3)`,
  background: 'rgba(129, 140, 248, 0.1)',
  color: ACCENT,
  fontSize: '0.6875rem',
  fontWeight: 500,
  cursor: 'pointer',
  font: 'inherit',
  transition: `background 0.2s ${EASE_EXPO}, border-color 0.2s ${EASE_EXPO}`,
  selectors: {
    '&:hover': { background: 'rgba(129, 140, 248, 0.18)', borderColor: 'rgba(129, 140, 248, 0.5)' },
    '&:focus-visible': { outline: `2px solid ${ACCENT}`, outlineOffset: '2px' },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
})

/* -- Empty state -- */
export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  padding: '2rem 1rem',
  textAlign: 'center',
})

export const emptyIcon = style({
  color: TEXT_GHOST,
})

export const emptyTitle = style({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: TEXT_DIM,
})

export const emptyDescription = style({
  fontSize: '0.75rem',
  color: TEXT_GHOST,
  maxWidth: '280px',
})

/* -- Loading skeleton -- */
export const skeletonItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  paddingInline: '0.75rem',
  paddingBlock: '0.5rem',
})

export const skeletonBlock = recipe({
  base: {
    borderRadius: '0.25rem',
    background: `linear-gradient(90deg, ${FILL} 25%, rgba(255,255,255,0.12) 50%, ${FILL} 75%)`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 1.6s ease infinite`,
    '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
  },
  variants: {
    size: {
      avatar: { width: '2rem', height: '2rem', borderRadius: '9999px' },
      thumb: { width: '2.5rem', height: '2.5rem', borderRadius: '0.375rem' },
      sm: { width: '4rem', height: '0.75rem' },
      md: { width: '60%', height: '0.75rem' },
      lg: { width: '90%', height: '0.75rem' },
      chip: { width: '5rem', height: '1.25rem', borderRadius: '9999px' },
    },
  },
  defaultVariants: { size: 'md' },
})

/* -- Footer -- */
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
  flexShrink: 0,
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

/* Gorusel gizli ama erisilebilir (Dialog.Title gerekliligi icin). */
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
