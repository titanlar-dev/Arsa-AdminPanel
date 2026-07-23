import { style } from '@vanilla-extract/css'
import { vars } from '@/tokens/contract.css'

/**
 * Split eşiği: CategoryAttributePage ile aynı (48rem viewport genişliğinde
 * kabuk menüsü açılıyor, 64rem'de iki kolon sığıyor).
 */
const GENIS_EKRAN = 'screen and (min-width: 64rem)'

/** Ağaç kolonunun genişliği. */
const AGAC_KOLONU = '20rem'

export const root = style({
  display: 'grid',
  gap: vars.space[4],
  color: vars.color.text.primary,
})

export const statsRow = style({
  display: 'grid',
  gap: vars.space[3],
  gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
})

export const split = style({
  display: 'grid',
  gap: vars.space[4],
  alignItems: 'start',

  '@media': {
    [GENIS_EKRAN]: {
      gridTemplateColumns: `${AGAC_KOLONU} minmax(0, 1fr)`,
    },
  },
})

export const treePane = style({
  display: 'grid',
  gap: vars.space[3],
  alignContent: 'start',
  minInlineSize: 0,

  selectors: {
    [`${root}[data-mobil-pano='detay'] &`]: { display: 'none' },
  },

  '@media': {
    [GENIS_EKRAN]: {
      selectors: {
        [`${root}[data-mobil-pano='detay'] &`]: { display: 'grid' },
      },
    },
  },
})

export const detailPane = style({
  display: 'grid',
  gap: vars.space[5],
  alignContent: 'start',
  minInlineSize: 0,

  selectors: {
    [`${root}[data-mobil-pano='agac'] &`]: { display: 'none' },
  },

  '@media': {
    [GENIS_EKRAN]: {
      selectors: {
        [`${root}[data-mobil-pano='agac'] &`]: { display: 'grid' },
      },
    },
  },
})

export const backButton = style({
  justifySelf: 'start',

  '@media': {
    [GENIS_EKRAN]: { display: 'none' },
  },
})

export const paneHeading = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space[2],
})

export const paneTitle = style({
  margin: 0,
  minInlineSize: 0,
  overflowWrap: 'anywhere',
  fontSize: vars.font.size.xl,
  lineHeight: vars.lineHeight.heading,
  fontWeight: vars.font.weight.semibold,
})

export const blockTitle = style({
  margin: 0,
  fontSize: vars.font.size.md,
  lineHeight: vars.lineHeight.heading,
  fontWeight: vars.font.weight.semibold,
})

export const block = style({
  display: 'grid',
  gap: vars.space[3],
  minInlineSize: 0,
})

export const fieldRow = style({
  display: 'grid',
  gap: vars.space[3],

  '@media': {
    [GENIS_EKRAN]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

export const breadcrumb = style({
  margin: 0,
  color: vars.color.text.muted,
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.body,
})

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[2],
  paddingBlockStart: vars.space[2],
})

export const treeList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: vars.space[1],
})

export const treeItem = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

export const treeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  fontSize: vars.font.size.sm,
  lineHeight: vars.lineHeight.body,
  transition: 'background-color 0.15s ease',
  minBlockSize: '2.75rem',

  ':hover': {
    backgroundColor: vars.color.bg.subtle,
  },

  selectors: {
    '&[data-selected="true"]': {
      backgroundColor: vars.color.bg.subtle,
      fontWeight: vars.font.weight.medium,
    },
    '&[data-passive="true"]': {
      opacity: '0.55',
    },
  },
})

export const treeLabel = style({
  flex: 1,
  minInlineSize: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const treeCount = style({
  color: vars.color.text.muted,
  fontSize: vars.font.size.sm,
  flexShrink: 0,
})

export const treeToggle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0,
  cursor: 'pointer',
  color: vars.color.text.muted,
})

export const treeTogglePlaceholder = style({
  width: '1.25rem',
  flexShrink: 0,
})

export const chevron = style({
  transition: 'transform 0.15s ease',

  selectors: {
    '&[data-open="true"]': {
      transform: 'rotate(90deg)',
    },
  },
})

export const treeChildren = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  paddingInlineStart: vars.space[4],
})

export const addButton = style({
  justifySelf: 'start',
})

export const coordRow = style({
  display: 'grid',
  gap: vars.space[3],
  gridTemplateColumns: '1fr 1fr',
})

export const dangerZone = style({
  borderBlockStart: `1px solid ${vars.color.border.default}`,
  paddingBlockStart: vars.space[4],
  display: 'grid',
  gap: vars.space[2],
})

export const createForm = style({
  display: 'grid',
  gap: vars.space[3],
  padding: vars.space[4],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.bg.surface,
})

export const createFormActions = style({
  display: 'flex',
  gap: vars.space[2],
  justifyContent: 'flex-end',
})
