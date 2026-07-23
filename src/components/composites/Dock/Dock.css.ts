import { style, keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

/**
 * macOS Dock — Apple glass estetiği (bileşen-lokal).
 *
 * `DynamicIsland` ile aynı cam dilini paylaşır: yarı saydam beyaz/mor katmanlar,
 * blur, specüler iç gölge, Apple spring easing. Açık tema design token'larından
 * bilinçli olarak ayrıdır (koyu zeminde kullanılır) — gerekçe DynamicIsland.css'te.
 * Kaynak: MetaPanel `contextual-dock.tsx` + `globals.css` glass-pill.
 */

const TEXT = 'rgba(255, 255, 255, 0.90)'
const TEXT_GHOST = 'rgba(255, 255, 255, 0.35)'
const FILL = 'rgba(255, 255, 255, 0.08)'
const ACCENT = '#818cf8'
const EASE_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_SPRING = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'

/* Sağ-orta sabit yerleşim; dikey dock. */
export const wrapper = style({
  position: 'fixed',
  right: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 40,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.375rem',
})

/* Cam hap — dikey dock yüzeyi. Varsayılan gizli, hover ile sağdan slide-in açılır. */
export const pill = style({
  transition: `opacity 0.3s ${EASE_EXPO}, transform 0.3s ${EASE_EXPO}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.5rem',
  borderRadius: '1rem',
  maxHeight: 'calc(100vh - 10rem)',
  overflowY: 'auto',
  overflowX: 'visible',
  background:
    'linear-gradient(90deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.09) 100%), rgba(120,130,255,0.04)',
  backdropFilter: 'blur(60px)',
  WebkitBackdropFilter: 'blur(60px)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  boxShadow: [
    'inset 0 1px 0 0 rgba(255, 255, 255, 0.20)',
    'inset 0 -0.5px 0 0 rgba(0, 0, 0, 0.06)',
    '0 8px 32px rgba(0, 0, 0, 0.3)',
    '0 2px 6px rgba(0, 0, 0, 0.2)',
  ].join(', '),
  // Dar ekranda kaydırma çubuğunu cam yüzeye uydur.
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255, 255, 255, 0.22) transparent',
})

/* Bir dock öğesi: ikon + üstünde tooltip. */
export const item = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  textDecoration: 'none',
})

/**
 * İkon kutusu — magnification. Üzerine gelinen büyür ve yukarı kalkar, komşusu
 * hafif büyür, diğerleri temel boyutta. Spring easing "canlı" büyüme hissi verir.
 */
export const iconBox = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.75rem',
    transition: `width 0.2s ${EASE_SPRING}, height 0.2s ${EASE_SPRING}, transform 0.2s ${EASE_SPRING}, background 0.2s ${EASE_EXPO}`,
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  },
  variants: {
    zoom: {
      normal: { width: '2.5rem', height: '2.5rem' },
      neighbor: { width: '2.75rem', height: '2.75rem', transform: 'translateX(-0.125rem)' },
      hovered: {
        width: '3rem',
        height: '3rem',
        transform: 'translateX(-0.5rem)',
        background: FILL,
      },
    },
  },
  defaultVariants: { zoom: 'normal' },
})

/* İkonun kendisi — üzerine gelince büyür. Renk `style` ile öğe bazında verilir. */
export const icon = recipe({
  base: {
    transition: `width 0.2s ${EASE_SPRING}, height 0.2s ${EASE_SPRING}`,
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  },
  variants: {
    big: {
      true: { width: '1.25rem', height: '1.25rem' },
      false: { width: '1rem', height: '1rem' },
    },
  },
  defaultVariants: { big: false },
})

/* Etiket balonu — üzerine gelince ikonun solunda belirir. */
export const tooltip = recipe({
  base: {
    position: 'absolute',
    right: 'calc(100% + 0.5rem)',
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: '0.375rem',
    background: 'rgba(255, 255, 255, 0.10)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    fontSize: '0.625rem',
    fontWeight: 500,
    color: TEXT,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    transition: `opacity 0.2s ${EASE_EXPO}, transform 0.2s ${EASE_EXPO}`,
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  },
  variants: {
    visible: {
      true: { opacity: 1, transform: 'translateY(0)' },
      false: { opacity: 0, transform: 'translateY(0.25rem)' },
    },
  },
  defaultVariants: { visible: false },
})

export const focusRing = style({
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${ACCENT}`,
      outlineOffset: '2px',
      borderRadius: '0.75rem',
    },
  },
})

/* Handle bar — sağ kenarda dikey çubuk, yüksekliği pulse eder. */
const handlePulse = keyframes({
  '0%, 100%': { height: '3rem', opacity: 0.4 },
  '50%': { height: '4.5rem', opacity: 0.75 },
})

export const handle = style({
  position: 'fixed',
  right: 0,
  bottom: '50%',
  transform: 'translateY(50%)',
  width: '6px',
  height: '4rem',
  borderRadius: '6px 0 0 6px',
  background: 'rgba(255, 255, 255, 0.55)',
  zIndex: 9999,
  animation: `${handlePulse} 2.5s ease-in-out infinite`,
  transition: `opacity 0.25s ${EASE_EXPO}, height 0.25s ${EASE_EXPO}`,

  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
})

/* Dock altındaki bağlam etiketi (aktif sayfa adı). */
export const title = style({
  borderRadius: '9999px',
  background: 'rgba(255, 255, 255, 0.04)',
  paddingInline: '0.5rem',
  paddingBlock: '0.125rem',
  fontSize: '0.5625rem',
  fontWeight: 500,
  color: TEXT_GHOST,
})
