import { globalStyle } from '@vanilla-extract/css'

/**
 * Karanlık tema (corporate-blue-dark) icin global element-seviyesi duzeltmeler.
 *
 * Token degerleri themes.css.ts icinde cam efekti uyumlu hale getirilmistir;
 * bu dosya yalnizca HTML elementlerine (input, select, textarea vb.) dogrudan
 * uygulanan ve token sistemi disinda kalan stilleri duzeltir.
 *
 * Neden ayri dosya: vanilla-extract'in globalStyle'i element selektorleriyle
 * calisir, token contract'i uzerinden ulasilamayan native form kontrolleri
 * burada hedeflenir. Component CSS dosyalari DEGISTIRILMEZ.
 */

const DARK = '[data-theme="corporate-blue-dark"]'

/* ── Form kontrolleri: input, select, textarea ── */
globalStyle(`${DARK} input, ${DARK} select, ${DARK} textarea`, {
  background: 'rgba(255, 255, 255, 0.06)',
  borderColor: 'rgba(255, 255, 255, 0.10)',
  color: '#f1f5f9',
})

/* Placeholder metni */
globalStyle(
  `${DARK} input::placeholder, ${DARK} select::placeholder, ${DARK} textarea::placeholder`,
  {
    color: 'rgba(255, 255, 255, 0.35)',
  },
)

/* Focus durumunda hafif parlama */
globalStyle(
  `${DARK} input:focus, ${DARK} select:focus, ${DARK} textarea:focus`,
  {
    borderColor: 'rgba(99, 102, 241, 0.40)',
    background: 'rgba(255, 255, 255, 0.08)',
  },
)

/* ── Tablo hucreleri ── */
globalStyle(`${DARK} table`, {
  borderColor: 'rgba(255, 255, 255, 0.06)',
})

globalStyle(`${DARK} th`, {
  background: 'rgba(255, 255, 255, 0.03)',
  borderColor: 'rgba(255, 255, 255, 0.06)',
  color: '#94a3b8',
})

globalStyle(`${DARK} td`, {
  borderColor: 'rgba(255, 255, 255, 0.05)',
})

/* ── HR / ayirici cizgiler ── */
globalStyle(`${DARK} hr`, {
  borderColor: 'rgba(255, 255, 255, 0.06)',
})

/* ── Scrollbar (WebKit) ── */
globalStyle(`${DARK} ::-webkit-scrollbar`, {
  width: '8px',
  height: '8px',
})

globalStyle(`${DARK} ::-webkit-scrollbar-track`, {
  background: 'transparent',
})

globalStyle(`${DARK} ::-webkit-scrollbar-thumb`, {
  background: 'rgba(255, 255, 255, 0.10)',
  borderRadius: '4px',
})

globalStyle(`${DARK} ::-webkit-scrollbar-thumb:hover`, {
  background: 'rgba(255, 255, 255, 0.18)',
})
