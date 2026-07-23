import { style } from '@vanilla-extract/css'
import { vars } from '@/tokens/contract.css'

/**
 * Kok kap: masaustunde yatay (flex-row), mobilde dikey (flex-column).
 * Kirilma noktasi 48rem — FilterBar ve LocationPanel ile ayni.
 */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],

  '@media': {
    'screen and (min-width: 48rem)': {
      flexDirection: 'row',
    },
  },
})

/** Her kademenin kapsayicisi; yatay modda esit genislik alir. */
export const level = style({
  flex: 1,
  minWidth: 0,
})
