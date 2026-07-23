import { assignVars, createGlobalTheme, globalStyle } from '@vanilla-extract/css'
import { vars } from './contract.css'
import { fluid } from './fluid'

/**
 * Token değerleri ve üç geçici palet.
 *
 * DİKKAT: Renkler geçici başlangıç değerleridir, marka kararı değildir.
 * Tasarım netleştiğinde değişecek tek yer burasıdır — component'ler ham renk
 * içermediği için hiçbiri elle düzenlenmez.
 *
 * Yapı brifing 4.2 ile aynı: `corporate-blue` `:root` üzerinde tam olarak
 * tanımlanır; diğer iki tema yalnızca `neutral` ve `primary` skalalarını
 * geçersiz kılar, semantik takma adlar (`--color-bg-canvas` gibi) bu skalalara
 * `var()` ile referans verdiği için otomatik olarak yeni palete uyar.
 */

/* Temadan bağımsız durum renkleri: üç palette de aynı kalır. */
const success = {
  50: '#f0fdf4',
  100: '#dcfce7',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
}

const warning = {
  50: '#fffbeb',
  100: '#fef3c7',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
}

const danger = {
  50: '#fef2f2',
  100: '#fee2e2',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
}

const info = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
}

const slateNeutral = {
  0: '#ffffff',
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
}

const blueScale = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
}

const slateScale = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
}

const stoneNeutral = {
  0: '#ffffff',
  50: '#fafaf9',
  100: '#f5f5f4',
  200: '#e7e5e4',
  300: '#d6d3d1',
  400: '#a8a29e',
  500: '#78716c',
  600: '#57534e',
  700: '#44403c',
  800: '#292524',
  900: '#1c1917',
}

const amberScale = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
}

/**
 * Varsayılan tema: corporate-blue.
 *
 * `:root` seçicisi kullanıldığı için `data-theme` hiç verilmese de geçerlidir;
 * diğer temalar bu değerlerin üzerine yazar.
 */
createGlobalTheme(':root', vars, {
  color: {
    neutral: slateNeutral,
    primary: blueScale,
    success,
    warning,
    danger,
    info,

    bg: {
      canvas: vars.color.neutral[50],
      surface: vars.color.neutral[0],
      subtle: vars.color.neutral[100],
      elevated: vars.color.neutral[0],
      disabled: vars.color.neutral[200],
      overlay: 'rgb(15 23 42 / 0.58)',
    },

    text: {
      primary: vars.color.neutral[900],
      secondary: vars.color.neutral[700],
      muted: vars.color.neutral[600],
      disabled: vars.color.neutral[500],
      inverse: vars.color.neutral[0],
      link: vars.color.primary[700],
      linkHover: vars.color.primary[900],
    },

    border: {
      default: vars.color.neutral[300],
      strong: vars.color.neutral[500],
      subtle: vars.color.neutral[200],
    },

    action: {
      primary: {
        bg: vars.color.primary[700],
        hover: vars.color.primary[800],
        active: vars.color.primary[900],
        text: vars.color.neutral[0],
      },
      secondary: {
        bg: vars.color.neutral[0],
        hover: vars.color.neutral[100],
        active: vars.color.neutral[200],
        text: vars.color.neutral[900],
        border: vars.color.neutral[400],
      },
      ghost: {
        hover: vars.color.neutral[100],
        active: vars.color.neutral[200],
        text: vars.color.neutral[800],
      },
      danger: {
        bg: vars.color.danger[700],
        hover: vars.color.danger[800],
        active: vars.color.danger[900],
        text: vars.color.neutral[0],
      },
    },

    focus: { ring: vars.color.primary[500] },
    selection: { bg: vars.color.primary[100] },
    table: { rowHover: vars.color.neutral[100] },

    /**
     * `solid` kademesi (Faz 2 kapanışı, kullanıcı onayladı).
     *
     * Solid rozet zeminini `border`'dan okuyordu; kenarlık rengi 3:1'e göre
     * seçilmiş olduğu için beyaz metin altında dört durum AA'dan düşüyordu
     * (draft 2.56, pendingReview 3.18, changesRequested 4.09, published 3.29).
     * Alternatif — 600'leri toptan koyulaştırmak — reddedildi: 600'ler ağırlıkla
     * kenarlık/nokta/iz olarak kullanılıyor (31 yer) ve onlar zaten 3:1 ile
     * geçiyordu; üstelik neutral-400'ü 4.5'e çekmek onu neutral-500'e yapıştırıp
     * rampadan bir basamak siliyordu.
     *
     * Kademenin ölçülen oranları (beyaz metin, AA eşiği 4.5):
     * draft 4.76 · pending 5.02 · changes 5.93 · published 5.02 · rejected 6.47
     * · paused 7.58 · expired 7.09 · archived 10.35. Sıcak amber'da nötrler
     * taş tonuna kayar: draft 4.80 · paused 7.63 · archived 10.27.
     *
     * Sekiz durum sekiz ayrı zemin üretir. Bunu **koru**: `paused` ile
     * `archived` eskiden ikisi de neutral-600'e düşüyor ve solid'de aynı
     * görünüyordu (7/8) — brifingin "her ListingStatus ayrı görsel durum"
     * kriterini rozetin en yoğun kullanıldığı varyantta çiğniyordu.
     */
    status: {
      draft: {
        bg: vars.color.neutral[100],
        text: vars.color.neutral[800],
        border: vars.color.neutral[400],
        solid: vars.color.neutral[500],
      },
      pending: {
        bg: vars.color.warning[50],
        text: vars.color.warning[800],
        border: vars.color.warning[600],
        solid: vars.color.warning[700],
      },
      changes: {
        bg: vars.color.info[50],
        text: vars.color.info[800],
        border: vars.color.info[600],
        solid: vars.color.info[700],
      },
      published: {
        bg: vars.color.success[50],
        text: vars.color.success[800],
        border: vars.color.success[600],
        solid: vars.color.success[700],
      },
      rejected: {
        bg: vars.color.danger[50],
        text: vars.color.danger[800],
        border: vars.color.danger[600],
        solid: vars.color.danger[700],
      },
      /**
       * Brifingden sapma: `paused` info yerine nötr, `expired` nötr yerine
       * turuncu tonuna alındı.
       *
       * Brifingin paletinde 8 durum yalnızca 6 farklı zemin üretiyordu:
       * `changes` ile `paused` ikisi de info-50, `draft` ile `expired` ikisi de
       * neutral-100 idi. Rozetler metin taşıdığı için erişilebilirlik sorunu
       * değildi, ama moderasyon kuyruğunda 50 satırı tarayıp durum dağılımını
       * bir bakışta görmek rozetin varlık sebebi — iki çift karışınca o fayda
       * kayboluyordu. Brifingin "tüm ListingStatus değerleri ayrı görsel durumla
       * temsil edilmelidir" kriteri de bunu gerektiriyor.
       */
      paused: {
        bg: vars.color.neutral[200],
        text: vars.color.neutral[800],
        border: vars.color.neutral[600],
        solid: vars.color.neutral[600],
      },
      /**
       * `expired`'ın solid'i 800: `pending` 700'ü aldığı için ikisi aynı
       * turuncuda buluşmasın. Soft'ta zaten 100/900 ile ayrışıyorlar.
       */
      expired: {
        bg: vars.color.warning[100],
        text: vars.color.warning[900],
        border: vars.color.warning[700],
        solid: vars.color.warning[800],
      },
      /**
       * Arşiv en koyu gri: üç gri durum taslak → pasif → arşiv diye kademelenir.
       * Kademe `solid`'de de korunur (500 → 600 → 700); `border` ikisinde de
       * 600 kaldığı için solid zemini oradan okumak taslağı değil **pasifi**
       * arşivle aynı gösteriyordu.
       */
      archived: {
        bg: vars.color.neutral[300],
        text: vars.color.neutral[900],
        border: vars.color.neutral[600],
        solid: vars.color.neutral[700],
      },
    },
  },

  font: {
    family: {
      sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
    },
    /**
     * Akışkan tipografi ölçeği (min@320 / max@1440).
     *
     * Gövde/UI metni (`sm`, `md`) neredeyse sabittir: `sm` tam `1rem`'de
     * kilitlidir (brifing "metin 1rem altına inmez" kuralı) ve okuma sırasında
     * satır kaymasına yol açacak oynaklık istemiyoruz. Ölçek yükseldikçe fluid
     * artış açılır: büyük başlıklar 320 pikselde küçülüp dar ekranda taşmayı
     * önler, 1440 pikselde eski sabit değerlerine döner (masaüstü görünümü
     * birebir korunur). Uçlar `fluid()` içinde 320↔1440 rampasına bağlıdır.
     */
    size: {
      sm: fluid(16, 16), // 1rem — sabit gövde tabanı
      md: fluid(16, 17),
      lg: fluid(16.5, 18),
      xl: fluid(18, 20),
      '2xl': fluid(20, 24),
      '3xl': fluid(23, 30),
      '4xl': fluid(27, 36),
    },
    weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  },

  lineHeight: { tight: '1.25', heading: '1.35', body: '1.5', relaxed: '1.65' },

  /**
   * Akışkan boşluk ölçeği (min@320 / max@1440).
   *
   * En küçük iki adım (`1`, `2`) **sabittir**: kılcal çizgi ve ikon–metin arası
   * gibi yerlerde kullanılır, akışkanlaştırılırsa dar ekranda öğeler yapışır.
   * `3` ve üstü mobilde daralır (aynı ekrana daha çok içerik sığar), 1440
   * pikselde eski değerlerine döner. Fluid taban `control.inlinePadding`'e de
   * yayılır (buton yatay dolgusu mobilde bir tık toparlanır); `control.height`
   * ise sabit kalır, dokunma hedefi ≥44px korunur.
   */
  space: {
    0: '0',
    1: fluid(4, 4), // sabit — kılcal
    2: fluid(8, 8), // sabit — ikon/metin arası
    3: fluid(10, 12),
    4: fluid(14, 16),
    5: fluid(16, 20),
    6: fluid(18, 24),
    8: fluid(24, 32),
    10: fluid(30, 40),
    12: fluid(34, 48),
    16: fluid(44, 64),
    20: fluid(52, 80),
    24: fluid(60, 96),
  },

  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  shadow: {
    xs: '0 1px 2px rgb(15 23 42 / 0.06)',
    sm: '0 1px 3px rgb(15 23 42 / 0.1), 0 1px 2px rgb(15 23 42 / 0.06)',
    md: '0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.08)',
    lg: '0 10px 15px -3px rgb(15 23 42 / 0.12), 0 4px 6px -4px rgb(15 23 42 / 0.08)',
    xl: '0 20px 25px -5px rgb(15 23 42 / 0.14), 0 8px 10px -6px rgb(15 23 42 / 0.08)',
  },

  z: {
    base: '0',
    sticky: '100',
    dropdown: '300',
    drawer: '500',
    modal: '700',
    toast: '900',
    tooltip: '1000',
  },

  duration: { fast: '120ms', normal: '180ms', slow: '260ms' },
  ease: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1.2)',
  },

  control: {
    height: { sm: '2.75rem', md: '3rem', lg: '3.5rem' },
    inlinePadding: { sm: vars.space[3], md: vars.space[4], lg: vars.space[5] },
  },

  container: { sm: '40rem', md: '48rem', lg: '64rem', xl: '80rem', '2xl': '96rem' },
})

/**
 * Nötr Slate: mavi vurgu yerine gri tonlu, sakin bir palet.
 * Yalnızca `primary` skalası değişir; nötrler corporate-blue ile aynıdır.
 */
globalStyle('[data-theme="neutral-slate"]', {
  vars: {
    ...assignVars(vars.color.neutral, slateNeutral),
    ...assignVars(vars.color.primary, slateScale),
  },
})

/** Sıcak Amber: taş tonlu nötrler ve amber vurgu. */
globalStyle('[data-theme="warm-amber"]', {
  vars: {
    ...assignVars(vars.color.neutral, stoneNeutral),
    ...assignVars(vars.color.primary, amberScale),
  },
})

/* ─────────────────────────────────────────────────────────────────────────────
 * Karanlık mod: corporate-blue-dark
 *
 * Aydınlık temanın renk skalalarını korur, yalnız semantik takma adları
 * tersine çevirir: zemin koyu, metin açık, kenarlıklar daha açık, gölgeler
 * daha koyu. Durum renkleri koyu zeminde okunabilir kalacak şekilde
 * ayarlanmıştır.
 *
 * Diğer temaların (neutral-slate, warm-amber) karanlık modları ileride
 * eklenecektir; şimdilik yalnızca corporate-blue için tanımlıdır.
 * ────────────────────────────────────────────────────────────────────────── */

globalStyle('[data-theme="corporate-blue-dark"]', {
  vars: {
    ...assignVars(vars.color.neutral, slateNeutral),
    ...assignVars(vars.color.primary, blueScale),

    /* ── Durum renkleri (üç palettede aynı) ── */
    ...assignVars(vars.color.success, success),
    ...assignVars(vars.color.warning, warning),
    ...assignVars(vars.color.danger, danger),
    ...assignVars(vars.color.info, info),

    /* ── Zemin: koyu, yüzey bir ton açık ── */
    [vars.color.bg.canvas]: slateNeutral[900],
    [vars.color.bg.surface]: slateNeutral[800],
    [vars.color.bg.subtle]: slateNeutral[700],
    [vars.color.bg.elevated]: slateNeutral[800],
    [vars.color.bg.disabled]: slateNeutral[700],
    [vars.color.bg.overlay]: 'rgb(0 0 0 / 0.6)',

    /* ── Metin: açık tonlar ── */
    [vars.color.text.primary]: slateNeutral[50],
    [vars.color.text.secondary]: slateNeutral[300],
    [vars.color.text.muted]: slateNeutral[400],
    [vars.color.text.disabled]: slateNeutral[500],
    [vars.color.text.inverse]: slateNeutral[900],
    [vars.color.text.link]: blueScale[400],
    [vars.color.text.linkHover]: blueScale[300],

    /* ── Kenarlıklar: koyu zeminde daha açık ── */
    [vars.color.border.default]: slateNeutral[600],
    [vars.color.border.strong]: slateNeutral[400],
    [vars.color.border.subtle]: slateNeutral[700],

    /* ── Eylem düğmeleri ── */
    [vars.color.action.primary.bg]: blueScale[600],
    [vars.color.action.primary.hover]: blueScale[500],
    [vars.color.action.primary.active]: blueScale[400],
    [vars.color.action.primary.text]: slateNeutral[0],

    [vars.color.action.secondary.bg]: slateNeutral[800],
    [vars.color.action.secondary.hover]: slateNeutral[700],
    [vars.color.action.secondary.active]: slateNeutral[600],
    [vars.color.action.secondary.text]: slateNeutral[50],
    [vars.color.action.secondary.border]: slateNeutral[500],

    [vars.color.action.ghost.hover]: slateNeutral[700],
    [vars.color.action.ghost.active]: slateNeutral[600],
    [vars.color.action.ghost.text]: slateNeutral[200],

    [vars.color.action.danger.bg]: danger[700],
    [vars.color.action.danger.hover]: danger[600],
    [vars.color.action.danger.active]: danger[800],
    [vars.color.action.danger.text]: slateNeutral[0],

    /* ── Odak / seçim / tablo ── */
    [vars.color.focus.ring]: blueScale[400],
    [vars.color.selection.bg]: blueScale[900],
    [vars.color.table.rowHover]: slateNeutral[700],

    /* ── Durum rozetleri: koyu zeminde okunabilir kalacak şekilde ayarlandı ── */
    [vars.color.status.draft.bg]: slateNeutral[700],
    [vars.color.status.draft.text]: slateNeutral[200],
    [vars.color.status.draft.border]: slateNeutral[500],
    [vars.color.status.draft.solid]: slateNeutral[500],

    [vars.color.status.pending.bg]: '#422006',
    [vars.color.status.pending.text]: warning[100],
    [vars.color.status.pending.border]: warning[600],
    [vars.color.status.pending.solid]: warning[700],

    [vars.color.status.changes.bg]: '#082f49',
    [vars.color.status.changes.text]: info[100],
    [vars.color.status.changes.border]: info[600],
    [vars.color.status.changes.solid]: info[700],

    [vars.color.status.published.bg]: '#052e16',
    [vars.color.status.published.text]: success[100],
    [vars.color.status.published.border]: success[600],
    [vars.color.status.published.solid]: success[700],

    [vars.color.status.rejected.bg]: '#450a0a',
    [vars.color.status.rejected.text]: danger[100],
    [vars.color.status.rejected.border]: danger[600],
    [vars.color.status.rejected.solid]: danger[700],

    [vars.color.status.paused.bg]: slateNeutral[600],
    [vars.color.status.paused.text]: slateNeutral[200],
    [vars.color.status.paused.border]: slateNeutral[400],
    [vars.color.status.paused.solid]: slateNeutral[600],

    [vars.color.status.expired.bg]: '#451a03',
    [vars.color.status.expired.text]: warning[100],
    [vars.color.status.expired.border]: warning[700],
    [vars.color.status.expired.solid]: warning[800],

    [vars.color.status.archived.bg]: slateNeutral[600],
    [vars.color.status.archived.text]: slateNeutral[100],
    [vars.color.status.archived.border]: slateNeutral[400],
    [vars.color.status.archived.solid]: slateNeutral[700],

    /* ── Gölgeler: koyu zeminde daha yoğun ── */
    [vars.shadow.xs]: '0 1px 2px rgb(0 0 0 / 0.2)',
    [vars.shadow.sm]: '0 1px 3px rgb(0 0 0 / 0.3), 0 1px 2px rgb(0 0 0 / 0.2)',
    [vars.shadow.md]: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
    [vars.shadow.lg]: '0 10px 15px -3px rgb(0 0 0 / 0.35), 0 4px 6px -4px rgb(0 0 0 / 0.2)',
    [vars.shadow.xl]: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.2)',
  },
})
