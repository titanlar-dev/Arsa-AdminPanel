import { createVar, keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

/* ---------- Yerel renk degiskenleri ---------- */

const typeBorderColor = createVar()
const typeBgColor = createVar()
const typeTextColor = createVar()

/* ---------- Animasyonlar ---------- */

const pulseGlow = keyframes({
  '0%, 100%': { boxShadow: `0 0 0 0 ${typeBorderColor}` },
  '50%': { boxShadow: `0 0 8px 2px ${typeBorderColor}` },
})

const shimmer = keyframes({
  '0%': { backgroundPosition: '-200% 0' },
  '100%': { backgroundPosition: '200% 0' },
})

/* ---------- AIInsightCard ---------- */

export const card = recipe({
  base: {
    position: 'relative',
    display: 'grid',
    gap: vars.space[3],
    padding: vars.space[4],
    background: vars.color.bg.surface,
    border: '1px solid',
    borderColor: vars.color.border.subtle,
    borderRadius: vars.radius.lg,
    borderInlineStartWidth: vars.space[1],
    borderInlineStartColor: typeBorderColor,
    fontSize: vars.font.size.sm,
    lineHeight: vars.lineHeight.body,
  },

  variants: {
    type: {
      anomaly: {
        vars: {
          [typeBorderColor]: vars.color.danger[600],
          [typeBgColor]: vars.color.danger[50],
          [typeTextColor]: vars.color.danger[800],
        },
      },
      prediction: {
        vars: {
          [typeBorderColor]: vars.color.info[600],
          [typeBgColor]: vars.color.info[50],
          [typeTextColor]: vars.color.info[800],
        },
      },
      recommendation: {
        vars: {
          [typeBorderColor]: vars.color.warning[600],
          [typeBgColor]: vars.color.warning[50],
          [typeTextColor]: vars.color.warning[800],
        },
      },
      summary: {
        vars: {
          [typeBorderColor]: vars.color.success[600],
          [typeBgColor]: vars.color.success[50],
          [typeTextColor]: vars.color.success[800],
        },
      },
      risk: {
        vars: {
          [typeBorderColor]: vars.color.danger[600],
          [typeBgColor]: vars.color.danger[50],
          [typeTextColor]: vars.color.danger[800],
        },
      },
    },

    isNew: {
      true: {
        animation: `${pulseGlow} 2s ${vars.ease.standard} 3`,

        '@media': {
          '(prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        },
      },
      false: {},
    },
  },

  defaultVariants: { isNew: false },
})

/* ---------- Ust satir: AI etiketi + guven rozeti + kapat ---------- */

export const topRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  minWidth: 0,
})

/**
 * "Arsam AI" rozeti — mor-maviye gecen cam efektli gradient.
 * Koyu zemin ustune beyaz metin oldugu icin WCAG 4.5:1 icin koyu gradient
 * tercih ediliyor.
 */
export const aiBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  paddingInline: vars.space[2],
  paddingBlock: '0.125rem',
  borderRadius: vars.radius.full,
  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
  color: '#fff',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.lineHeight.tight,
  whiteSpace: 'nowrap',
  /**
   * Cam estetigi: hafif seffaflik ve backdrop-blur. Arka planin
   * degrade olmasi yeterli kontrast sagladigi icin seffaflik dusuk tutuluyor.
   */
  backdropFilter: 'blur(4px)',
})

/* ---------- Guven rozeti ---------- */

const confidenceDotColor = createVar()

export const confidenceBadge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    paddingInline: vars.space[2],
    paddingBlock: '0.0625rem',
    borderRadius: vars.radius.full,
    background: vars.color.bg.subtle,
    color: vars.color.text.secondary,
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.lineHeight.tight,
    whiteSpace: 'nowrap',

    '::before': {
      content: '""',
      display: 'block',
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: vars.radius.full,
      background: confidenceDotColor,
      flexShrink: 0,
    },
  },

  variants: {
    confidence: {
      high: { vars: { [confidenceDotColor]: vars.color.success[600] } },
      medium: { vars: { [confidenceDotColor]: vars.color.warning[600] } },
      low: { vars: { [confidenceDotColor]: vars.color.neutral[400] } },
    },
  },

  defaultVariants: { confidence: 'medium' },
})

export const topRowSpacer = style({
  flex: 1,
})

/* ---------- Kapat butonu ---------- */

export const dismissButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '1.5rem',
  height: '1.5rem',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  background: 'transparent',
  color: vars.color.text.muted,
  cursor: 'pointer',
  flexShrink: 0,

  ':hover': {
    opacity: 0.7,
  },

  /* 44x44px dokunma hedefi. */
  '::after': {
    content: '""',
    position: 'absolute',
    inset: '-0.625rem',
  },
})

/* ---------- Baslik ---------- */

export const title = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  color: vars.color.text.primary,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.lineHeight.heading,
})

export const typeIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: typeTextColor,
})

/* ---------- Aciklama ---------- */

export const description = style({
  color: vars.color.text.secondary,
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.body,
})

/* ---------- Metrik vurgusu ---------- */

export const metricBlock = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space[2],
  padding: vars.space[3],
  background: typeBgColor,
  borderRadius: vars.radius.md,
})

export const metricValue = style({
  color: vars.color.text.primary,
  fontSize: vars.font.size['2xl'],
  fontWeight: vars.font.weight.bold,
  lineHeight: vars.lineHeight.tight,
  fontVariantNumeric: 'tabular-nums',
})

export const metricMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
  minWidth: 0,
})

export const metricLabel = style({
  color: vars.color.text.secondary,
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.tight,
})

export const metricTrend = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.lineHeight.tight,
  },
  variants: {
    direction: {
      up: { color: vars.color.success[700] },
      down: { color: vars.color.danger[700] },
      flat: { color: vars.color.text.muted },
    },
  },
  defaultVariants: { direction: 'flat' },
})

/* ---------- Aksiyon butonlari ---------- */

export const actionsRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  flexWrap: 'wrap',
})

export const actionButton = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: vars.space[3],
    paddingBlock: vars.space[1],
    border: '1px solid',
    borderRadius: vars.radius.md,
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.lineHeight.tight,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transitionProperty: 'background, border-color, box-shadow',
    transitionDuration: vars.duration.fast,
    font: 'inherit',
  },

  variants: {
    variant: {
      primary: {
        background: vars.color.action.primary.bg,
        borderColor: vars.color.action.primary.bg,
        color: vars.color.action.primary.text,

        selectors: {
          '&:hover': {
            background: vars.color.action.primary.hover,
            borderColor: vars.color.action.primary.hover,
          },
        },
      },
      secondary: {
        background: vars.color.bg.surface,
        borderColor: vars.color.border.default,
        color: vars.color.text.primary,

        selectors: {
          '&:hover': {
            background: vars.color.bg.subtle,
            borderColor: vars.color.border.strong,
          },
        },
      },
      danger: {
        background: vars.color.action.danger.bg,
        borderColor: vars.color.action.danger.bg,
        color: vars.color.action.danger.text,

        selectors: {
          '&:hover': {
            background: vars.color.action.danger.hover,
            borderColor: vars.color.action.danger.hover,
          },
        },
      },
    },
  },

  defaultVariants: { variant: 'secondary' },
})

/* ---------- Zaman damgasi ---------- */

export const timestamp = style({
  color: vars.color.text.muted,
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.tight,
})

/* ---------- AIInsightFeed ---------- */

export const feedRoot = style({
  display: 'grid',
  gap: vars.space[4],
})

export const feedHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  flexWrap: 'wrap',
})

export const feedTitle = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  color: vars.color.text.primary,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.lineHeight.heading,
})

export const feedHeaderSpacer = style({
  flex: 1,
})

export const feedClearButton = style({
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: vars.color.text.link,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  cursor: 'pointer',
  font: 'inherit',

  ':hover': {
    color: vars.color.text.linkHover,
  },
})

export const feedList = style({
  display: 'grid',
  gap: vars.space[3],
  maxHeight: '600px',
  overflowY: 'auto',
  overflowX: 'hidden',
})

export const feedEmpty = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[3],
  padding: vars.space[8],
  color: vars.color.text.muted,
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.body,
  textAlign: 'center',
})

/* ---------- Skeleton kart ---------- */

export const skeletonCard = style({
  display: 'grid',
  gap: vars.space[3],
  padding: vars.space[4],
  background: vars.color.bg.surface,
  border: '1px solid',
  borderColor: vars.color.border.subtle,
  borderRadius: vars.radius.lg,
})

export const skeletonRow = style({
  display: 'flex',
  gap: vars.space[2],
  alignItems: 'center',
})

export const skeletonBlock = recipe({
  base: {
    borderRadius: vars.radius.sm,
    background: `linear-gradient(90deg, ${vars.color.bg.subtle} 25%, ${vars.color.bg.elevated} 50%, ${vars.color.bg.subtle} 75%)`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 1.6s ${vars.ease.standard} infinite`,

    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },
  },
  variants: {
    size: {
      sm: { width: '4rem', height: '1em' },
      md: { width: '60%', height: '1em' },
      lg: { width: '100%', height: '1em' },
      badge: { width: '5rem', height: '1.25rem', borderRadius: vars.radius.full },
      metric: { width: '100%', height: '3rem', borderRadius: vars.radius.md },
    },
  },
  defaultVariants: { size: 'md' },
})
