import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type {
  Coupon,
  PricingAnalytics,
  PromotionPackage,
  PromotionTransaction,
} from '../../types/component-props'
import { PricingPromotionPage } from './PricingPromotionPage'

// ─── Mock veri ───────────────────────────────────────────────────────────────

const PAKETLER: PromotionPackage[] = [
  {
    id: 'pkg-1',
    name: 'Vitrin Paketi',
    type: 'vitrin',
    durationDays: 7,
    priceTL: 250,
    description: 'Ilaniniz 7 gun boyunca arama sonuclarinda vitrin alaninda gosterilir.',
    active: true,
    activeListingCount: 142,
  },
  {
    id: 'pkg-2',
    name: 'Acil Satis',
    type: 'acil',
    durationDays: 3,
    priceTL: 150,
    description: 'Acil etiketi ile dikkat cekici bir ilan deneyimi.',
    active: true,
    activeListingCount: 87,
  },
  {
    id: 'pkg-3',
    name: 'Anasayfa Vitrini',
    type: 'anasayfa',
    durationDays: 14,
    priceTL: 750,
    description: 'Ilaniniz 14 gun anasayfa vitrininde yer alir.',
    active: true,
    activeListingCount: 34,
  },
  {
    id: 'pkg-4',
    name: 'Oncelikli Listeleme',
    type: 'oncelikli',
    durationDays: 30,
    priceTL: 500,
    description: 'Kategori sayfalarinda ilaniniz her zaman ust siralarda.',
    active: false,
    activeListingCount: 0,
  },
  {
    id: 'pkg-5',
    name: 'Ozel Kampanya Paketi',
    type: 'ozel',
    durationDays: 7,
    priceTL: 1200,
    description: 'Tum doping ozelliklerini iceren premium paket.',
    active: true,
    activeListingCount: 18,
  },
]

const KUPONLAR: Coupon[] = [
  {
    id: 'cpn-1',
    code: 'YAZ2026',
    discountType: 'percentage',
    discountAmount: 20,
    validFrom: '2026-06-01',
    validUntil: '2026-08-31',
    usageLimit: 500,
    usedCount: 234,
    applicablePackageIds: ['pkg-1', 'pkg-2', 'pkg-3'],
    active: true,
  },
  {
    id: 'cpn-2',
    code: 'ILKILAN50',
    discountType: 'fixed',
    discountAmount: 50,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    usageLimit: 0,
    usedCount: 1023,
    applicablePackageIds: ['pkg-1'],
    active: true,
  },
  {
    id: 'cpn-3',
    code: 'BAHAR25',
    discountType: 'percentage',
    discountAmount: 25,
    validFrom: '2026-03-01',
    validUntil: '2026-05-31',
    usageLimit: 200,
    usedCount: 200,
    applicablePackageIds: ['pkg-1', 'pkg-2', 'pkg-3', 'pkg-4', 'pkg-5'],
    active: false,
  },
  {
    id: 'cpn-4',
    code: 'PREMIUM100',
    discountType: 'fixed',
    discountAmount: 100,
    validFrom: '2026-07-01',
    validUntil: '2026-07-31',
    usageLimit: 50,
    usedCount: 12,
    applicablePackageIds: ['pkg-5'],
    active: true,
  },
]

function gunlukGelir(): { date: string; amount: number }[] {
  const data: { date: string; amount: number }[] = []
  const bugun = new Date('2026-07-23')
  for (let i = 29; i >= 0; i--) {
    const gun = new Date(bugun)
    gun.setDate(gun.getDate() - i)
    data.push({
      date: `${gun.getDate()}/${gun.getMonth() + 1}`,
      amount: Math.floor(2000 + Math.random() * 8000),
    })
  }
  return data
}

const ISLEMLER: PromotionTransaction[] = [
  {
    id: 'tx-1',
    date: '2026-07-23',
    userName: 'Ahmet Yilmaz',
    packageName: 'Vitrin Paketi',
    amount: 250,
    couponCode: 'YAZ2026',
  },
  {
    id: 'tx-2',
    date: '2026-07-22',
    userName: 'Fatma Demir',
    packageName: 'Anasayfa Vitrini',
    amount: 750,
  },
  {
    id: 'tx-3',
    date: '2026-07-22',
    userName: 'Mehmet Kaya',
    packageName: 'Acil Satis',
    amount: 150,
    couponCode: 'ILKILAN50',
  },
  {
    id: 'tx-4',
    date: '2026-07-21',
    userName: 'Elif Ozturk',
    packageName: 'Ozel Kampanya Paketi',
    amount: 1200,
    couponCode: 'PREMIUM100',
  },
  {
    id: 'tx-5',
    date: '2026-07-21',
    userName: 'Ali Celik',
    packageName: 'Vitrin Paketi',
    amount: 250,
  },
  {
    id: 'tx-6',
    date: '2026-07-20',
    userName: 'Zeynep Arslan',
    packageName: 'Oncelikli Listeleme',
    amount: 500,
  },
  {
    id: 'tx-7',
    date: '2026-07-19',
    userName: 'Hasan Sahin',
    packageName: 'Acil Satis',
    amount: 150,
  },
]

const ANALITIK: PricingAnalytics = {
  dailyRevenue: gunlukGelir(),
  packageDistribution: [
    { type: 'Vitrin', count: 142 },
    { type: 'Acil', count: 87 },
    { type: 'Anasayfa', count: 34 },
    { type: 'Oncelikli', count: 12 },
    { type: 'Ozel', count: 18 },
  ],
  monthlyRevenue: 187500,
  monthlyChange: 12.5,
  popularPackage: 'Vitrin Paketi',
  avgDuration: 11,
  recentTransactions: ISLEMLER,
}

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Screens/PricingPromotionPage',
  component: PricingPromotionPage,

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Promosyon paketleri (doping), kupon yonetimi ve fiyatlandirma analitigi ' +
          'icin uc sekmeli yonetim ekrani. Veri prop ile gelir, cekilmez.',
      },
    },
  },

  args: {
    packages: PAKETLER,
    coupons: KUPONLAR,
    analytics: ANALITIK,
    onSavePackage: fn(),
    onTogglePackage: fn(),
    onCreateCoupon: fn(),
    onToggleCoupon: fn(),
  },

  argTypes: {
    packages: { control: false },
    coupons: { control: false },
    analytics: { control: false },
  },
} satisfies Meta<typeof PricingPromotionPage>

export default meta

type Story = StoryObj<typeof meta>

// ─── Story'ler ───────────────────────────────────────────────────────────────

/** Tam ekran: uc sekme, paketler ve kuponlar dolu, analitik mevcut. */
export const Default: Story = {}

/** Hic paket tanimlanmamis: bos durum gosterir. */
export const EmptyPackages: Story = {
  args: {
    packages: [],
  },
}

/** Kupon yonetimi sekmesi odakli. */
export const CouponManagement: Story = {
  args: {
    packages: PAKETLER,
    coupons: KUPONLAR,
  },
}

/** Analitik sekmesi odakli: grafik ve istatistik verileriyle. */
export const Analytics: Story = {
  args: {
    packages: PAKETLER,
    coupons: KUPONLAR,
    analytics: ANALITIK,
  },
}

/** Paket duzenleme modali gorunur: yeni paket ekleme formunu acar. */
export const EditPackageModal: Story = {
  args: {
    packages: PAKETLER,
    coupons: KUPONLAR,
  },
}

/**
 * Salt okunur gorunum: yetki kisitlamalari ile duzenleme devre disi.
 *
 * `canEditPricing: false` ve `canCreateCoupons: false` oldugunda Switch ve
 * duzenleme butonlari render edilmez; durum Badge olarak gosterilir.
 * `canViewAnalytics: false` oldugunda analitik sekmesi gorunmez.
 */
export const ReadOnlyView: Story = {
  args: {
    packages: PAKETLER,
    coupons: KUPONLAR,
    analytics: ANALITIK,
    capabilities: {
      canEditPricing: false,
      canCreateCoupons: false,
      canViewAnalytics: false,
    },
  },
}
