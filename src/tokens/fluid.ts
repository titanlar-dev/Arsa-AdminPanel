/**
 * Akışkan (fluid) ölçek yardımcıları.
 *
 * `fluid()` iki viewport ucu arasında **doğrusal olarak** akan bir `clamp()`
 * dizgesi üretir: 320 pikselde `minPx`, 1440 pikselde `maxPx`, arada `vw` ile
 * kesintisiz büyüme. Böylece tipografi ve boşluklar breakpoint'te zıplamak
 * yerine ekranla birlikte ölçeklenir (brifing "adaptive-fluid" kararı).
 *
 * `minPx` her zaman alt sınırdır: 320 pikselin altında (ör. iPhone 5) değer
 * `minPx`'te **kilitlenir**, hiçbir zaman altına düşmez. Bu, "görünür metin
 * 1rem altına inmez" ve "dokunma hedefi ≥44px" kurallarını korumanın yoludur —
 * çağıran `minPx`'i bu tabanlara eşit verdiği sürece clamp onları garanti eder.
 *
 * Kök yazı boyutu %100'dür (`globals.css.ts`), yani 1rem = 16px. Değerleri rem
 * cinsinden üretiyoruz ki kullanıcı tarayıcı yazı boyutunu büyütünce ölçek
 * birlikte büyüsün (px tabanlı `vw` bunu kırardı).
 */

/** Fluid rampanın uçları — 6 hedef viewport'un en dar ve en genişi. */
export const FLUID_MIN_VW = 320
export const FLUID_MAX_VW = 1440

const ROOT_PX = 16

/** Gereksiz uzun ondalıkları kırpar ama doğruluğu korur (4 hane yeter). */
const round = (n: number): number => Math.round(n * 10000) / 10000

/**
 * `minPx` → `maxPx` arası akışkan bir `clamp()` dizgesi döndürür.
 *
 * @param minPx  320 pikselde (ve altında) kilitlenecek değer.
 * @param maxPx  1440 pikselde (ve üstünde) kilitlenecek değer.
 * @param opts   Rampanın viewport uçlarını değiştirmek için (varsayılan 320–1440).
 */
export function fluid(
  minPx: number,
  maxPx: number,
  opts: { minVw?: number; maxVw?: number } = {},
): string {
  const minVw = opts.minVw ?? FLUID_MIN_VW
  const maxVw = opts.maxVw ?? FLUID_MAX_VW

  if (minPx === maxPx) return `${round(minPx / ROOT_PX)}rem`

  const minRem = round(minPx / ROOT_PX)
  const maxRem = round(maxPx / ROOT_PX)

  // size(vwPx) = intercept + slope * vwPx  (px cinsinden, vwPx = viewport genişliği)
  const slope = (maxPx - minPx) / (maxVw - minVw)
  const interceptPx = minPx - slope * minVw
  const interceptRem = round(interceptPx / ROOT_PX)
  const slopeVw = round(slope * 100) // 1vw = viewport/100 px

  const lo = Math.min(minRem, maxRem)
  const hi = Math.max(minRem, maxRem)
  const preferred = interceptRem === 0 ? `${slopeVw}vw` : `${interceptRem}rem + ${slopeVw}vw`

  return `clamp(${lo}rem, ${preferred}, ${hi}rem)`
}

/**
 * 6 hedef viewport ve tutarlı `min-width` medya sorguları.
 *
 * Bileşenler breakpoint dizgelerini elle yazmak yerine bunları kullanır; böylece
 * "48rem mi 47.99rem mi", "px mi rem mi" tutarsızlıkları tek yerde çözülür.
 * Değerler rem'dir (kullanıcı zoom'unda breakpoint de kaymasın diye).
 */
export const bp = {
  /** iPhone 5 / SE — native alt sınır. */
  xs: '20rem', // 320px
  /** Küçük telefon (iPhone SE/12 mini). */
  sm: '23.4375rem', // 375px
  /** Büyük telefon (iPhone 15 Pro Max). */
  md: '26.875rem', // 430px
  /** Tablet portre (iPad). */
  lg: '48rem', // 768px
  /** Küçük laptop. */
  xl: '64rem', // 1024px
  /** Masaüstü. */
  xxl: '90rem', // 1440px
} as const

export type Breakpoint = keyof typeof bp

/** `media.lg` → `screen and (min-width: 48rem)`. vanilla-extract `@media` anahtarı. */
export const media: Record<Breakpoint, string> = {
  xs: `screen and (min-width: ${bp.xs})`,
  sm: `screen and (min-width: ${bp.sm})`,
  md: `screen and (min-width: ${bp.md})`,
  lg: `screen and (min-width: ${bp.lg})`,
  xl: `screen and (min-width: ${bp.xl})`,
  xxl: `screen and (min-width: ${bp.xxl})`,
}
