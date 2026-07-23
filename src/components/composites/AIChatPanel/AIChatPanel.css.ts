import { globalStyle, keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

/* ── Animasyonlar ── */

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
const slideFromRight = keyframes({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
})
const pulseRing = keyframes({
  '0%': { boxShadow: `0 0 0 0 ${vars.color.primary[500]}66` },
  '70%': { boxShadow: '0 0 0 10px transparent' },
  '100%': { boxShadow: '0 0 0 0 transparent' },
})
const dotBounce = keyframes({
  '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
  '40%': { transform: 'scale(1)', opacity: '1' },
})

/* ── Backdrop (drawer modu) ── */

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: vars.z.drawer,
  background: vars.color.bg.overlay,
  animation: `${fadeIn} ${vars.duration.fast} ${vars.ease.standard}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
})

/* ── Panel kabi ── */

export const panel = recipe({
  base: {
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr auto auto',
    background: vars.color.bg.elevated,
    boxShadow: vars.shadow.xl,
    outline: 'none',
    overflow: 'hidden',
    '@media': {
      '(prefers-reduced-motion: reduce)': { animation: 'none' },
    },
  },
  variants: {
    mode: {
      drawer: {
        position: 'fixed',
        insetBlock: 0,
        insetInlineEnd: 0,
        zIndex: vars.z.drawer,
        width: 'min(380px, 100vw)',
        height: '100dvh',
        animation: `${slideFromRight} ${vars.duration.normal} ${vars.ease.standard}`,
        '@media': {
          'screen and (max-width: 48rem)': {
            width: '100vw',
          },
        },
      },
      docked: {
        position: 'relative',
        width: '380px',
        height: '100%',
        borderInlineStart: `1px solid ${vars.color.border.subtle}`,
        '@media': {
          'screen and (max-width: 48rem)': {
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100dvh',
            zIndex: vars.z.drawer,
            borderInlineStart: 'none',
          },
        },
      },
    },
  },
  defaultVariants: { mode: 'drawer' },
})

/* ── Header ── */

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  paddingInline: vars.space[4],
  paddingBlock: vars.space[3],
  borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
})

export const headerInfo = style({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  gap: vars.space[3],
  minWidth: 0,
})

export const headerTitle = style({
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.primary,
})

export const headerBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: vars.radius.full,
  background: vars.color.primary[100],
  color: vars.color.primary[700],
  paddingInline: vars.space[2],
  paddingBlock: '0.125rem',
  fontSize: '0.6875rem',
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.lineHeight.tight,
})

export const aiAvatar = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  borderRadius: vars.radius.full,
  background: vars.color.primary[500],
  color: vars.color.text.inverse,
  flexShrink: 0,
})

/* ── Context pills ── */

export const contextBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  paddingInline: vars.space[4],
  paddingBlock: vars.space[2],
  borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
  background: vars.color.bg.subtle,
  flexWrap: 'wrap',
})

export const contextPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  paddingInline: vars.space[2],
  paddingBlock: '0.1875rem',
  borderRadius: vars.radius.full,
  background: vars.color.primary[50],
  color: vars.color.primary[700],
  fontSize: '0.75rem',
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.lineHeight.tight,
  border: `1px solid ${vars.color.primary[200]}`,
})

/* ── Mesaj listesi ── */

export const messageList = style({
  flex: 1,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  padding: vars.space[4],
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  scrollbarWidth: 'thin',
  scrollbarColor: `${vars.color.neutral[300]} transparent`,
})

globalStyle(`${messageList}::-webkit-scrollbar`, {
  width: '6px',
})
globalStyle(`${messageList}::-webkit-scrollbar-track`, {
  background: 'transparent',
})
globalStyle(`${messageList}::-webkit-scrollbar-thumb`, {
  background: vars.color.neutral[300],
  borderRadius: '9999px',
})

/* ── Mesaj satirlari ── */

export const messageRow = recipe({
  base: {
    display: 'flex',
    gap: vars.space[2],
    maxWidth: '100%',
  },
  variants: {
    role: {
      user: {
        flexDirection: 'row-reverse',
      },
      assistant: {
        flexDirection: 'row',
      },
    },
  },
  defaultVariants: { role: 'assistant' },
})

export const messageBubble = recipe({
  base: {
    padding: vars.space[3],
    fontSize: vars.font.size.sm,
    lineHeight: vars.lineHeight.body,
    maxWidth: '85%',
    wordBreak: 'break-word',
    position: 'relative',
  },
  variants: {
    role: {
      user: {
        background: vars.color.action.primary.bg,
        color: vars.color.action.primary.text,
        borderRadius: `${vars.radius.lg} ${vars.radius.sm} ${vars.radius.lg} ${vars.radius.lg}`,
      },
      assistant: {
        background: vars.color.bg.surface,
        color: vars.color.text.primary,
        borderRadius: `${vars.radius.sm} ${vars.radius.lg} ${vars.radius.lg} ${vars.radius.lg}`,
        border: `1px solid ${vars.color.border.subtle}`,
      },
    },
  },
  defaultVariants: { role: 'assistant' },
})

export const messageTimestamp = style({
  fontSize: '0.6875rem',
  color: vars.color.text.muted,
  marginBlockStart: vars.space[1],
  paddingInline: vars.space[1],
})

export const messageAvatarSlot = style({
  flexShrink: 0,
  paddingBlockStart: vars.space[1],
})

/* ── Markdown icindeki ogelerin stilleri ── */

export const markdownContent = style({
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.body,
})

globalStyle(`${markdownContent} strong`, {
  fontWeight: vars.font.weight.semibold,
})
globalStyle(`${markdownContent} ul, ${markdownContent} ol`, {
  paddingInlineStart: vars.space[4],
  marginBlock: vars.space[2],
})
globalStyle(`${markdownContent} li`, {
  marginBlockEnd: vars.space[1],
})
globalStyle(`${markdownContent} code`, {
  fontFamily: vars.font.family.mono,
  fontSize: '0.8125em',
  background: vars.color.bg.subtle,
  paddingInline: vars.space[1],
  paddingBlock: '0.0625rem',
  borderRadius: vars.radius.sm,
})
globalStyle(`${markdownContent} pre`, {
  background: vars.color.bg.subtle,
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  overflowX: 'auto',
  marginBlock: vars.space[2],
})
globalStyle(`${markdownContent} pre code`, {
  background: 'none',
  padding: 0,
})

/* ── Insight karti ── */

export const insightCard = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space[3],
  padding: vars.space[3],
  background: vars.color.bg.subtle,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.subtle}`,
})

export const insightIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.25rem',
  height: '2.25rem',
  borderRadius: vars.radius.md,
  background: vars.color.primary[100],
  color: vars.color.primary[700],
  flexShrink: 0,
})

export const insightBody = style({
  flex: 1,
  minWidth: 0,
})

export const insightValue = style({
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.bold,
  color: vars.color.text.primary,
  lineHeight: vars.lineHeight.tight,
})

export const insightTrend = recipe({
  base: {
    fontSize: '0.75rem',
    fontWeight: vars.font.weight.medium,
    marginInlineStart: vars.space[2],
  },
  variants: {
    direction: {
      up: { color: vars.color.success[600] },
      down: { color: vars.color.danger[600] },
      neutral: { color: vars.color.text.muted },
    },
  },
  defaultVariants: { direction: 'neutral' },
})

export const insightLabel = style({
  fontSize: vars.font.size.sm,
  color: vars.color.text.secondary,
  marginBlockStart: vars.space[1],
})

/* ── Action suggestion ── */

export const actionCard = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  padding: vars.space[3],
  background: vars.color.bg.surface,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.default}`,
  cursor: 'pointer',
  transition: `background ${vars.duration.fast} ${vars.ease.standard}, border-color ${vars.duration.fast} ${vars.ease.standard}`,
  selectors: {
    '&:hover': {
      background: vars.color.action.ghost.hover,
      borderColor: vars.color.primary[300],
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
})

export const actionText = style({
  flex: 1,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  color: vars.color.primary[700],
})

export const actionArrow = style({
  color: vars.color.primary[500],
  flexShrink: 0,
})

/* ── Table ── */

export const tableWrapper = style({
  overflowX: 'auto',
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.subtle}`,
  marginBlockStart: vars.space[2],
})

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: vars.font.size.sm,
})

globalStyle(`${table} th`, {
  textAlign: 'start',
  padding: `${vars.space[2]} ${vars.space[3]}`,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.secondary,
  background: vars.color.bg.subtle,
  borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
  whiteSpace: 'nowrap',
})

globalStyle(`${table} td`, {
  padding: `${vars.space[2]} ${vars.space[3]}`,
  color: vars.color.text.primary,
  borderBlockEnd: `1px solid ${vars.color.border.subtle}`,
})

globalStyle(`${table} tr:last-child td`, {
  borderBlockEnd: 'none',
})

/* ── Listing mini karti ── */

export const listingCard = style({
  display: 'flex',
  gap: vars.space[3],
  padding: vars.space[3],
  background: vars.color.bg.surface,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.subtle}`,
})

export const listingThumb = style({
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: vars.radius.md,
  objectFit: 'cover',
  background: vars.color.bg.subtle,
  flexShrink: 0,
})

export const listingInfo = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[1],
})

export const listingTitle = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const listingMeta = style({
  fontSize: '0.75rem',
  color: vars.color.text.muted,
})

/* ── Typing indicator ── */

export const typingIndicator = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: vars.space[3],
})

export const typingDots = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
})

export const typingDot = style({
  width: '0.375rem',
  height: '0.375rem',
  borderRadius: vars.radius.full,
  background: vars.color.text.muted,
  animation: `${dotBounce} 1.4s infinite ease-in-out both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none', opacity: 0.6 },
  },
  selectors: {
    '&:nth-child(1)': { animationDelay: '0s' },
    '&:nth-child(2)': { animationDelay: '0.16s' },
    '&:nth-child(3)': { animationDelay: '0.32s' },
  },
})

export const typingLabel = style({
  fontSize: '0.75rem',
  color: vars.color.text.muted,
})

/* ── Quick action chips ── */

export const quickActionsBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  paddingInline: vars.space[4],
  paddingBlock: vars.space[2],
  overflowX: 'auto',
  scrollbarWidth: 'none',
  borderBlockStart: `1px solid ${vars.color.border.subtle}`,
  flexShrink: 0,
})

globalStyle(`${quickActionsBar}::-webkit-scrollbar`, {
  display: 'none',
})

export const quickActionChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  paddingInline: vars.space[3],
  paddingBlock: vars.space[2],
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.color.border.default}`,
  background: vars.color.bg.surface,
  color: vars.color.text.secondary,
  fontSize: '0.8125rem',
  fontWeight: vars.font.weight.medium,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: `background ${vars.duration.fast} ${vars.ease.standard}, border-color ${vars.duration.fast} ${vars.ease.standard}, color ${vars.duration.fast} ${vars.ease.standard}`,
  selectors: {
    '&:hover': {
      background: vars.color.action.ghost.hover,
      borderColor: vars.color.primary[300],
      color: vars.color.primary[700],
    },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.focus.ring}`,
      outlineOffset: '2px',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
})

/* ── Input alani ── */

export const inputArea = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: vars.space[2],
  paddingInline: vars.space[4],
  paddingBlock: vars.space[3],
  borderBlockStart: `1px solid ${vars.color.border.subtle}`,
  background: vars.color.bg.elevated,
})

export const textarea = style({
  flex: 1,
  minHeight: '2.5rem',
  maxHeight: '6rem',
  padding: vars.space[3],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.lg,
  background: vars.color.bg.surface,
  color: vars.color.text.primary,
  fontSize: vars.font.size.sm,
  fontFamily: 'inherit',
  lineHeight: vars.lineHeight.body,
  resize: 'none',
  outline: 'none',
  transition: `border-color ${vars.duration.fast} ${vars.ease.standard}`,
  '::placeholder': {
    color: vars.color.text.muted,
  },
  selectors: {
    '&:focus': {
      borderColor: vars.color.primary[500],
      boxShadow: `0 0 0 3px ${vars.color.focus.ring}`,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
})

export const sendButton = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: vars.radius.full,
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0,
    transition: `background ${vars.duration.fast} ${vars.ease.standard}, opacity ${vars.duration.fast} ${vars.ease.standard}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  },
  variants: {
    disabled: {
      true: {
        background: vars.color.bg.disabled,
        color: vars.color.text.disabled,
        cursor: 'not-allowed',
        opacity: '0.5',
      },
      false: {
        background: vars.color.action.primary.bg,
        color: vars.color.action.primary.text,
        selectors: {
          '&:hover': { background: vars.color.action.primary.hover },
          '&:active': { background: vars.color.action.primary.active },
        },
      },
    },
  },
  defaultVariants: { disabled: false },
})

/* ── FAB (Floating Action Button) ── */

export const fab = recipe({
  base: {
    position: 'fixed',
    insetBlockEnd: vars.space[6],
    insetInlineEnd: vars.space[6],
    zIndex: vars.z.sticky,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: vars.radius.full,
    border: 'none',
    background: vars.color.action.primary.bg,
    color: vars.color.action.primary.text,
    cursor: 'pointer',
    boxShadow: vars.shadow.lg,
    transition: `transform ${vars.duration.fast} ${vars.ease.standard}, box-shadow ${vars.duration.fast} ${vars.ease.standard}`,
    selectors: {
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: vars.shadow.xl,
      },
      '&:active': {
        transform: 'scale(0.97)',
      },
      '&:focus-visible': {
        outline: `2px solid ${vars.color.focus.ring}`,
        outlineOffset: '2px',
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  },
  variants: {
    pulse: {
      true: {
        animation: `${pulseRing} 2s infinite`,
        '@media': {
          '(prefers-reduced-motion: reduce)': { animation: 'none' },
        },
      },
      false: {},
    },
  },
  defaultVariants: { pulse: false },
})

/* ── Empty state ── */

export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space[3],
  padding: vars.space[8],
  textAlign: 'center',
  flex: 1,
})

export const emptyIcon = style({
  color: vars.color.neutral[300],
})

export const emptyTitle = style({
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.primary,
})

export const emptySubtitle = style({
  fontSize: vars.font.size.sm,
  color: vars.color.text.muted,
  maxWidth: '18rem',
})

/* ── Visually hidden ── */

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
