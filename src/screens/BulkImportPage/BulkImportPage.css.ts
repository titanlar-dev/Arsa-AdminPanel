import { style } from '@vanilla-extract/css'
import { vars } from '@/tokens/contract.css'

export const root = style({
  display: 'grid',
  gap: vars.space[5],
  minWidth: 0,
})

export const heading = style({
  margin: 0,
  minWidth: 0,
  overflowWrap: 'anywhere',
  fontSize: vars.font.size['2xl'],
  lineHeight: vars.lineHeight.heading,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.primary,
})

/* -- Adim gostergesi -------------------------------------------------------- */

export const steps = style({
  display: 'flex',
  gap: vars.space[2],
  listStyle: 'none',
  margin: 0,
  padding: 0,
  overflowX: 'auto',
})

export const step = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  padding: `${vars.space[2]} ${vars.space[3]}`,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  color: vars.color.text.muted,
  borderRadius: vars.radius.md,
  whiteSpace: 'nowrap',
  background: 'transparent',
  border: 'none',
  cursor: 'default',
})

export const stepActive = style({
  color: vars.color.action.primary.text,
  background: vars.color.primary[50],
  fontWeight: vars.font.weight.semibold,
})

export const stepDone = style({
  color: vars.color.success[700],
})

export const stepNumber = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: vars.space[6],
  height: vars.space[6],
  borderRadius: vars.radius.full,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  border: `1px solid ${vars.color.border.default}`,
  flexShrink: 0,
})

export const stepNumberActive = style({
  background: vars.color.action.primary.bg,
  color: vars.color.action.primary.text,
  borderColor: vars.color.action.primary.bg,
})

export const stepNumberDone = style({
  background: vars.color.success[100],
  color: vars.color.success[700],
  borderColor: vars.color.success[600],
})

/* -- Dosya yukleme ---------------------------------------------------------- */

export const dropzone = style({
  display: 'grid',
  placeItems: 'center',
  gap: vars.space[3],
  padding: vars.space[10],
  border: `2px dashed ${vars.color.border.default}`,
  borderRadius: vars.radius.lg,
  textAlign: 'center',
  cursor: 'pointer',
  transition: `border-color ${vars.duration.fast} ${vars.ease.standard}, background ${vars.duration.fast} ${vars.ease.standard}`,

  ':hover': {
    borderColor: vars.color.action.primary.bg,
    background: vars.color.primary[50],
  },
})

export const dropzoneActive = style({
  borderColor: vars.color.action.primary.bg,
  background: vars.color.primary[50],
})

export const dropzoneError = style({
  borderColor: vars.color.danger[600],
})

export const dropzoneIcon = style({
  color: vars.color.text.muted,
})

export const dropzoneLabel = style({
  color: vars.color.text.primary,
  fontWeight: vars.font.weight.medium,
})

export const dropzoneHint = style({
  color: vars.color.text.secondary,
  fontSize: vars.font.size.sm,
})

export const fileInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  padding: vars.space[4],
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.md,
  background: vars.color.bg.surface,
})

export const fileDetails = style({
  display: 'grid',
  gap: vars.space[1],
  flex: 1,
  minWidth: 0,
})

export const fileName = style({
  color: vars.color.text.primary,
  fontWeight: vars.font.weight.medium,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const fileMeta = style({
  color: vars.color.text.secondary,
  fontSize: vars.font.size.sm,
})

/* -- Kolon eslestirme ------------------------------------------------------- */

export const mappingGrid = style({
  display: 'grid',
  gap: vars.space[3],
})

export const mappingRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  gap: vars.space[3],
  alignItems: 'center',
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  background: vars.color.bg.surface,
  border: `1px solid ${vars.color.border.subtle}`,

  '@media': {
    '(max-width: 48rem)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const mappingArrow = style({
  color: vars.color.text.muted,
  textAlign: 'center',

  '@media': {
    '(max-width: 48rem)': {
      display: 'none',
    },
  },
})

export const mappingSource = style({
  display: 'grid',
  gap: vars.space[1],
})

export const mappingSourceLabel = style({
  fontFamily: vars.font.family.mono,
  fontSize: vars.font.size.sm,
  color: vars.color.text.primary,
  fontWeight: vars.font.weight.medium,
})

export const mappingSourceSample = style({
  fontSize: vars.font.size.sm,
  color: vars.color.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

/* -- Onizleme & dogrulama --------------------------------------------------- */

export const validationSummary = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[3],
  padding: vars.space[4],
  borderRadius: vars.radius.md,
  background: vars.color.bg.surface,
  border: `1px solid ${vars.color.border.default}`,
})

export const validationStat = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  fontSize: vars.font.size.sm,
})

export const tableWrapper = style({
  minWidth: 0,
  overflowX: 'auto',
})

export const previewTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: vars.font.size.sm,
})

export const previewTh = style({
  padding: `${vars.space[2]} ${vars.space[3]}`,
  textAlign: 'left',
  fontWeight: vars.font.weight.semibold,
  color: vars.color.text.primary,
  borderBottom: `2px solid ${vars.color.border.strong}`,
  whiteSpace: 'nowrap',
})

export const previewTd = style({
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderBottom: `1px solid ${vars.color.border.subtle}`,
  color: vars.color.text.primary,
  maxWidth: '16rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const previewTdError = style({
  background: vars.color.danger[50],
  color: vars.color.danger[800],
})

export const previewTdWarning = style({
  background: vars.color.warning[50],
  color: vars.color.warning[800],
})

/* -- Icerik aktarimi -------------------------------------------------------- */

export const progressSection = style({
  display: 'grid',
  gap: vars.space[4],
})

export const progressBar = style({
  width: '100%',
  height: vars.space[2],
  borderRadius: vars.radius.full,
  background: vars.color.bg.subtle,
  overflow: 'hidden',
})

export const progressFill = style({
  height: '100%',
  borderRadius: vars.radius.full,
  background: vars.color.action.primary.bg,
  transition: `width ${vars.duration.normal} ${vars.ease.standard}`,
})

export const progressLabel = style({
  fontSize: vars.font.size.sm,
  color: vars.color.text.secondary,
  fontVariantNumeric: 'tabular-nums',
})

export const importResultList = style({
  display: 'grid',
  gap: vars.space[2],
  maxHeight: '20rem',
  overflowY: 'auto',
  padding: vars.space[3],
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border.default}`,
  background: vars.color.bg.surface,
})

export const importResultRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  fontSize: vars.font.size.sm,
  padding: `${vars.space[1]} 0`,
})

export const resultSuccess = style({
  color: vars.color.success[700],
})

export const resultError = style({
  color: vars.color.danger[700],
})

export const resultPending = style({
  color: vars.color.text.muted,
})

/* -- Ortak ------------------------------------------------------------------ */

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space[3],
  justifyContent: 'flex-end',
})

export const summaryText = style({
  margin: 0,
  color: vars.color.text.secondary,
  fontSize: vars.font.size.sm,
})

export const successBlock = style({
  display: 'grid',
  gap: vars.space[4],
  textAlign: 'center',
  padding: vars.space[8],
})

export const successTitle = style({
  margin: 0,
  color: vars.color.success[700],
  fontSize: vars.font.size.xl,
  fontWeight: vars.font.weight.semibold,
})
