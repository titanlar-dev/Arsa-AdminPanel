import { style, keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { vars } from '@/tokens/contract.css'

export const wrapper = recipe({
  base: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.025)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  variants: {
    visualStyle: {
      plain: {},
      bordered: {},
      striped: {},
    },
  },
  defaultVariants: { visualStyle: 'plain' },
})

/** Yatay kaydırma sarmalayıcısı: dar ekranda tablo kesilmez, kaydırılır. */
export const scroller = style({
  width: '100%',
  overflowX: 'auto',
})

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.8125rem',
  lineHeight: 1.4,
})

export const thead = recipe({
  base: {
    background: 'rgba(255, 255, 255, 0.035)',
  },
  variants: {
    sticky: {
      true: { position: 'sticky', insetBlockStart: 0, zIndex: vars.z.sticky },
      false: {},
    },
  },
  defaultVariants: { sticky: false },
})

export const th = recipe({
  base: {
    borderBlockEnd: '1px solid rgba(255, 255, 255, 0.06)',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 500,
    fontSize: '0.6875rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    textAlign: 'start',
  },
  variants: {
    density: {
      comfortable: { padding: '0.625rem 0.875rem' },
      compact: { padding: '0.375rem 0.625rem' },
    },
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
  },
  defaultVariants: { density: 'comfortable', align: 'start' },
})

/** Sıralanabilir başlık butonu — `<th onClick>` klavyeyle erişilemez. */
export const sortButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  fontWeight: 'inherit',
  cursor: 'pointer',

  ':hover': { color: 'rgba(255, 255, 255, 0.9)' },
})

/** Aktif olmayan sıralama oku soluk: hangi sütunun sıralandığı belli olsun. */
export const sortIcon = style({
  opacity: 0.3,
  flexShrink: 0,
  transition: 'opacity 0.12s, color 0.12s',

  selectors: {
    '[data-sorted] &': { opacity: 1, color: '#818cf8', transition: 'opacity 0.12s, color 0.12s' },
  },
})

export const tr = recipe({
  base: {
    borderBlockEnd: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'background-color 0.12s ease',

    selectors: {
      '&:last-child': { borderBlockEnd: 'none' },
      '&[data-clickable]:hover': { background: 'rgba(99, 102, 241, 0.05)', cursor: 'pointer' },
      '&[data-selected]': {
        background: 'rgba(99, 102, 241, 0.08)',
        boxShadow: 'inset 2px 0 0 #818cf8',
      },
    },
  },
  variants: {
    striped: {
      true: {
        selectors: {
          '&:nth-child(even):not([data-selected])': { background: 'rgba(255, 255, 255, 0.015)' },
        },
      },
      false: {},
    },
  },
  defaultVariants: { striped: false },
})

export const td = recipe({
  base: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.8125rem',
    verticalAlign: 'middle',
  },
  variants: {
    density: {
      comfortable: { padding: '0.625rem 0.875rem' },
      compact: { padding: '0.375rem 0.625rem' },
    },
    align: {
      start: { textAlign: 'start' },
      center: { textAlign: 'center' },
      end: { textAlign: 'end' },
    },
  },
  defaultVariants: { density: 'comfortable', align: 'start' },
})

export const selectionCell = style({
  width: '1px',
  paddingInlineEnd: 0,
})

/**
 * Görsel olarak gizli, erişilebilirlik ağacında açık.
 *
 * `visibility: hidden`/`display: none` **kullanılmıyor**: ikisi de alt ağacı
 * erişilebilir ad hesabından siler (Button'ın `loading` hatası tam buydu).
 * `clip` + 1 piksel kalıbı repoda RolePermissionMatrix ve StatCard'da da aynı.
 */
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

/** Durum bloğu: loading/empty/error hepsi tablo genişliğinde ortalanır. */
export const stateBlock = style({
  display: 'grid',
  placeItems: 'center',
  gap: vars.space[3],
  padding: vars.space[10],
  textAlign: 'center',
})

/**
 * Kart görünümü — yalnız <48rem.
 *
 * `mobileMode="cards"` artık viewport'a **kendisi** bakıyor: hem kart dalı hem
 * tablo dalı DOM'da durur, birini medya sorgusu boyar. Kartlar dar ekranda
 * görünür, 48rem ve üstünde `display: none` ile hem boyadan hem erişilebilirlik
 * ağacından çıkar (SidebarNav ray/çekmece öncülü). Eşik 48rem: AppShell'in menü
 * kolonu ve FilterBar'ın geniş alan kırılımıyla birebir aynı — tüketici ekranlar
 * (ListingListPage/UserManagementPage/ReportManagementPage) bu yüzden artık
 * kendi çift-render telafisini kaldırıp düz `mobileMode="cards"` diyor.
 *
 * Repoda container query yok; karar viewport medya sorgusuyla veriliyor.
 */
export const cards = style({
  display: 'grid',
  gap: vars.space[3],

  '@media': {
    'screen and (min-width: 48rem)': { display: 'none' },
  },
})

/**
 * Tablo dalı `mobileMode="cards"` içindeyken — yalnız ≥48rem. `cards`'ın
 * simetriği. Yalnız kart modunda `wrapper`'a ekleniyor; `scroll` ve varsayılan
 * dallarda tablo her viewport'ta görünür kaldığından bu sınıf onlara verilmez
 * (geriye dönük uyum: `cards` vermeyen tüketici hiç etkilenmez).
 */
export const tableInCards = style({
  display: 'none',

  '@media': {
    'screen and (min-width: 48rem)': { display: 'block' },
  },
})

export const cardRow = style({
  position: 'relative',

  selectors: {
    '&[data-selected]': {
      outline: '2px solid #818cf8',
      outlineOffset: '2px',
      borderRadius: vars.radius.lg,
    },
  },
})

/* ── Araç çubuğu (P1+): yoğunluk, sütun seçici, filtre düğmesi ── */

/**
 * Tablonun üstündeki kontrol şeridi. Dar ekranda (≤30rem) sola yaslanıp sarar;
 * geniş ekranda sağa yaslı durur — tablo başlığı/özeti ekranın solunda kalır.
 * `flex-wrap` ile kontroller sığmazsa alt satıra iner (BulkActionBar deseni).
 */
export const toolbar = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space[2],
  justifyContent: 'flex-end',
  paddingBlock: vars.space[2],
  minWidth: 0,

  '@media': {
    'screen and (max-width: 30rem)': {
      justifyContent: 'flex-start',
    },
  },
})

/** İki seçenekli yoğunluk anahtarı (rahat/sıkışık). Segmented görünüm. */
export const segmented = style({
  display: 'inline-flex',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: vars.radius.md,
  overflow: 'hidden',
})

export const segmentButton = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space[1],
    minHeight: vars.control.height.sm,
    paddingInline: vars.space[3],
    border: 'none',
    background: 'rgba(255, 255, 255, 0.04)',
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.medium,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transitionProperty: 'background-color, color',
    transitionDuration: vars.duration.fast,

    selectors: {
      '& + &': { borderInlineStart: '1px solid rgba(255, 255, 255, 0.08)' },
      '&:hover:not([aria-pressed="true"])': { background: 'rgba(255, 255, 255, 0.08)' },
    },
  },
  variants: {
    active: {
      /** Seçili yoğunluk: primary zeminle işaretlenir — renk tek gösterge değil, `aria-pressed` de var. */
      true: {
        background: 'rgba(99, 102, 241, 0.15)',
        color: '#c7d2fe',
      },
      false: {},
    },
  },
  defaultVariants: { active: false },
})

/** Araç çubuğu düğmelerindeki ikon. */
export const toolbarIcon = style({
  flexShrink: 0,
})

/**
 * Çoklu sıralamada başlıktaki öncelik rozeti (1, 2…). Yalnız birden çok kural
 * varken çizilir; hangi sütunun önce sıralandığını gösterir.
 */
export const sortOrder = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '1rem',
  height: '1rem',
  paddingInline: '0.25rem',
  marginInlineStart: vars.space[1],
  borderRadius: vars.radius.full,
  background: '#6366f1',
  color: '#ffffff',
  fontSize: '0.6875rem',
  fontWeight: vars.font.weight.semibold,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
})

/**
 * Başlığın altındaki filtre satırı. Hücreler başlıkla hizalı (aynı grid) ve
 * `thead` içinde durduğu için `stickyHeader` ile birlikte üstte kalır. Zemin
 * başlıkla aynı ki filtre alanı başlığın parçası gibi okunsun.
 */
export const filterRow = style({
  background: 'rgba(255, 255, 255, 0.03)',
})

export const filterCell = style({
  paddingInline: vars.space[2],
  paddingBlock: vars.space[2],
  borderBlockEnd: '1px solid rgba(255, 255, 255, 0.06)',
  verticalAlign: 'middle',
})

/* ── Sayfa-otesi secim banner'i ── */

/**
 * "Bu sayfadaki N kayit secildi / Tum X kaydi sec" banner'i.
 * Tablonun hemen ustunde, yumusak bilgi arka planiyla gorunur.
 * Dar ekranda metin sarar, ortalanmis kalir.
 */
export const selectAllBanner = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: vars.space[1],
  padding: `${vars.space[2]} ${vars.space[4]}`,
  background: 'rgba(99, 102, 241, 0.06)',
  borderBlockEnd: '1px solid rgba(99, 102, 241, 0.15)',
  color: 'rgba(255, 255, 255, 0.82)',
  fontSize: vars.font.size.sm,
  textAlign: 'center',

  '@media': {
    'screen and (max-width: 30rem)': {
      flexDirection: 'column',
      gap: vars.space[1],
    },
  },
})

/**
 * Banner icindeki baglanti/buton: "Tum X kaydi sec" veya "Secimi temizle".
 * Yalcin gorsel, buton semantigi.
 */
export const selectAllBannerLink = style({
  display: 'inline',
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: '#a5b4fc',
  fontSize: 'inherit',
  fontWeight: vars.font.weight.semibold,
  cursor: 'pointer',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',

  ':hover': {
    color: '#c7d2fe',
  },

  ':focus-visible': {
    outline: '2px solid #818cf8',
    outlineOffset: '2px',
    borderRadius: vars.radius.sm,
  },
})

/* ── Disa aktarma dugmesi ── */

/** Arac cubugundaki disa aktarma dugmesi ikonu + metin hizasi. */
export const exportButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
})

/* ── Sanallaştırma (virtualization) ── */

/**
 * Sanallaştırılmış kaydırma kabı: sabit yükseklik ve dikey kaydırma. Tablo
 * başlığı sticky kalır, tbody yüksekliği toplam satır yüksekliğine eşitlenir
 * ve yalnız görünür satırlar render edilir.
 */
export const virtualScroller = style({
  width: '100%',
  overflowX: 'auto',
  overflowY: 'auto',
  maxHeight: '80vh',
  position: 'relative',
})

/**
 * Sanallaştırılmış tbody: `position: relative` ile iç satırlar `translateY`
 * ile konumlandırılır. Yüksekliği toplam tüm satırların tahmini yüksekliğidir.
 */
export const virtualTbody = style({
  position: 'relative',
  width: '100%',
})

/**
 * Sanallaştırılmış satır: `position: absolute` ile `translateY` konumunda
 * çizilir. `width: 100%` ile tablo genişliğini korur.
 */
export const virtualRow = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  display: 'table-row',
})

/* ── Sütun-başlık-içi gelişmiş kontroller (sort icon + filter icon + popover) ── */

/**
 * Başlık hücresinin içeriğini flex satıra çevirir: etiket + sıralama ikonu +
 * filtre ikonu. Mevcut `sortButton` tek başına yetiyordu, ama filtre ikonu
 * eklenince düğmenin dışında ikinci bir kontrol gerekti — ikisini saran flex kap.
 */
export const headerContent = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space[1],
  position: 'relative',
  maxWidth: '100%',
})

/**
 * Filtre ikon butonu — huni. Varsayılan renk soluk; aktif filtrede primary renk
 * ve hafif arka plan alır. Başlık içinde inline durur, kendi başına tıklanabilir.
 */
export const filterButton = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.5)',
    cursor: 'pointer',
    borderRadius: vars.radius.sm,
    opacity: 0.4,
    flexShrink: 0,
    transition: `opacity 0.15s, color 0.15s, background-color 0.15s`,

    ':hover': {
      opacity: 1,
      color: 'rgba(255, 255, 255, 0.9)',
      background: 'rgba(255, 255, 255, 0.06)',
    },

    ':focus-visible': {
      outline: '2px solid #818cf8',
      outlineOffset: '1px',
      opacity: 1,
    },
  },
  variants: {
    active: {
      true: {
        opacity: 1,
        color: '#a5b4fc',
        background: 'rgba(99, 102, 241, 0.1)',
      },
      false: {},
    },
  },
  defaultVariants: { active: false },
})

/** Filtre popover'ı açılış animasyonu. */
const popoverIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-4px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

/**
 * Sütun-filtre popover'ı: başlık hücresinin altına mutlak konumlanır.
 * Cam yüzey estetiği — DynamicIsland'ın glass stiline yakın ama tablo
 * bağlamına uyarlanmış: blur düşük, boyut küçük.
 */
export const columnFilterPopover = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 50,
  minWidth: '14rem',
  padding: vars.space[3],
  marginTop: vars.space[1],

  background:
    'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%), rgba(15, 18, 30, 0.94)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  border: `1px solid rgba(255, 255, 255, 0.10)`,
  borderRadius: '12px',
  boxShadow: [
    'inset 0 0.5px 0 rgba(255, 255, 255, 0.06)',
    `0 8px 32px rgba(0, 0, 0, 0.3)`,
    `0 2px 8px rgba(0, 0, 0, 0.15)`,
  ].join(', '),
  color: 'rgba(255, 255, 255, 0.82)',
  fontSize: vars.font.size.sm,

  animation: `${popoverIn} 0.18s ease-out`,

  '@supports': {
    'not (backdrop-filter: blur(1px))': {
      background: 'rgba(15, 18, 30, 0.97)',
    },
  },

  '@media': {
    'screen and (max-width: 30rem)': {
      minWidth: '16rem',
      left: 'auto',
      right: 0,
    },
  },
})

/** Popover etiket metni (alan adı). */
export const popoverLabel = style({
  display: 'block',
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  color: 'rgba(255, 255, 255, 0.65)',
  marginBlockEnd: vars.space[2],
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
})

/** Popover içindeki input/select alanları. */
export const popoverField = style({
  width: '100%',
  marginBlockEnd: vars.space[2],
})

/** Min/Max alanları satırı (sayı filtresi). */
export const popoverRow = style({
  display: 'flex',
  gap: vars.space[2],
  alignItems: 'center',
  marginBlockEnd: vars.space[2],
})

/** Popover alt buton çubuğu. */
export const popoverActions = style({
  display: 'flex',
  gap: vars.space[2],
  justifyContent: 'flex-end',
  paddingTop: vars.space[2],
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  marginTop: vars.space[1],
})

/** Popover buton — küçük, cam estetiğe uyumlu. */
export const popoverButton = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${vars.space[1]} ${vars.space[3]}`,
    border: '1px solid rgba(255, 255, 255, 0.10)',
    borderRadius: vars.radius.md,
    fontSize: vars.font.size.sm,
    fontWeight: vars.font.weight.medium,
    cursor: 'pointer',
    transition: `background-color 0.15s, color 0.15s`,
  },
  variants: {
    variant: {
      primary: {
        background: '#6366f1',
        color: '#ffffff',
        border: 'none',
        ':hover': { background: '#4f46e5' },
      },
      ghost: {
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.65)',
        ':hover': { background: 'rgba(255, 255, 255, 0.06)' },
      },
    },
  },
  defaultVariants: { variant: 'ghost' },
})

/**
 * Popover'ın arka plan tıklamasını yakalayan saydam overlay. Popover'ı kapatır.
 * Tüm ekranı kaplar, tıklanabilir ama görünmez.
 */
export const popoverBackdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 49,
})
