import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

/**
 * Ton renkleri önce yerel değişkenlere yazılır, varyantlar bu değişkenleri okur.
 * Böylece 6 ton × 3 varyant = 18 kombinasyon tek tek tanımlanmak zorunda kalmaz.
 */
const toneSubtle = createVar()
const toneStrong = createVar()
const toneText = createVar()
const toneBorder = createVar()

export const badge = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space[1],
    border: '1px solid transparent',
    borderRadius: vars.radius.full,
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.medium,
    lineHeight: vars.lineHeight.tight,
    /** `nowrap` DEĞİL: uzun bir etiket dar ekranda taşmasın, sarsın (Button ile aynı gerekçe). */
    overflowWrap: 'anywhere',
  },

  variants: {
    tone: {
      neutral: {
        vars: {
          [toneSubtle]: 'rgba(148, 163, 184, 0.15)',
          [toneStrong]: vars.color.neutral[700],
          [toneText]: '#cbd5e1',
          [toneBorder]: 'rgba(148, 163, 184, 0.4)',
        },
      },
      primary: {
        vars: {
          [toneSubtle]: 'rgba(99, 102, 241, 0.15)',
          [toneStrong]: vars.color.primary[700],
          [toneText]: '#a5b4fc',
          [toneBorder]: 'rgba(99, 102, 241, 0.4)',
        },
      },
      success: {
        vars: {
          [toneSubtle]: 'rgba(34, 197, 94, 0.15)',
          [toneStrong]: vars.color.success[700],
          [toneText]: '#86efac',
          [toneBorder]: 'rgba(34, 197, 94, 0.4)',
        },
      },
      warning: {
        vars: {
          [toneSubtle]: 'rgba(234, 179, 8, 0.15)',
          [toneStrong]: vars.color.warning[700],
          [toneText]: '#fde047',
          [toneBorder]: 'rgba(234, 179, 8, 0.4)',
        },
      },
      danger: {
        vars: {
          [toneSubtle]: 'rgba(239, 68, 68, 0.15)',
          [toneStrong]: vars.color.danger[700],
          [toneText]: '#fca5a5',
          [toneBorder]: 'rgba(239, 68, 68, 0.4)',
        },
      },
      info: {
        vars: {
          [toneSubtle]: 'rgba(59, 130, 246, 0.15)',
          [toneStrong]: vars.color.info[700],
          [toneText]: '#93c5fd',
          [toneBorder]: 'rgba(59, 130, 246, 0.4)',
        },
      },
    },

    variant: {
      solid: {
        background: toneStrong,
        color: vars.color.neutral[0],
      },
      /** Brifing kuralı: açık arka plan üstünde en az 800 koyuluğunda metin. */
      soft: {
        background: toneSubtle,
        color: toneText,
      },
      outline: {
        background: 'transparent',
        color: toneText,
        borderColor: toneBorder,
      },
    },

    /**
     * Yazı boyutu her iki boyutta da 1rem'dir (brifingin minimum metin kuralı);
     * boyutlar yalnızca iç boşlukla ayrışır.
     */
    size: {
      sm: {
        paddingInline: vars.space[2],
        paddingBlock: '0.0625rem',
      },
      md: {
        paddingInline: vars.space[3],
        paddingBlock: vars.space[1],
      },
    },
  },

  defaultVariants: {
    tone: 'neutral',
    variant: 'soft',
    size: 'md',
  },
})

export const icon = style({
  display: 'inline-flex',
  flexShrink: 0,
})
