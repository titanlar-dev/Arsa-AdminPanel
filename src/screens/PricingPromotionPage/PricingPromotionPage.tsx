import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import {
  DollarSign,
  Package,
  Pencil,
  Plus,
  TrendingDown,
  TrendingUp,
  Ticket,
  BarChart3,
  Clock,
} from 'lucide-react'
import { Badge } from '../../components/primitives/Badge'
import { Button } from '../../components/primitives/Button'
import { CurrencyInput } from '../../components/primitives/CurrencyInput'
import { DateRangePicker } from '../../components/primitives/DateRangePicker'
import { IconButton } from '../../components/primitives/IconButton'
import { Input } from '../../components/primitives/Input'
import { Modal } from '../../components/primitives/Modal'
import { MultiSelect } from '../../components/primitives/MultiSelect'
import { NumberInput } from '../../components/primitives/NumberInput'
import { RadioGroup } from '../../components/primitives/RadioGroup'
import { Select } from '../../components/primitives/Select'
import { Switch } from '../../components/primitives/Switch'
import { Tabs } from '../../components/primitives/Tabs'
import { Textarea } from '../../components/primitives/Textarea'
import { ChartCard } from '../../components/composites/ChartCard'
import { DataTable } from '../../components/composites/DataTable'
import { EmptyState } from '../../components/composites/EmptyState'
import { StatCard } from '../../components/composites/StatCard'
import type {
  ColumnDef,
  Coupon,
  CouponInput,
  PricingPromotionPageProps,
  PromotionPackage,
  PromotionPackageType,
  PromotionTransaction,
  RadioOption,
  SelectOption,
  TabItem,
} from '../../types/component-props'
import { Currency } from '../../types/domain'
import * as css from './PricingPromotionPage.css'

// ─── Sabitler ────────────────────────────────────────────────────────────────

const SEKME_PAKETLER = 'paketler'
const SEKME_KUPONLAR = 'kuponlar'
const SEKME_ANALITIK = 'analitik'

const TUR_SECENEKLERI: SelectOption[] = [
  { value: 'vitrin', label: 'Vitrin' },
  { value: 'acil', label: 'Acil' },
  { value: 'anasayfa', label: 'Anasayfa' },
  { value: 'oncelikli', label: 'Oncelikli' },
  { value: 'ozel', label: 'Ozel' },
]

const TUR_ETIKET: Record<PromotionPackageType, string> = {
  vitrin: 'Vitrin',
  acil: 'Acil',
  anasayfa: 'Anasayfa',
  oncelikli: 'Oncelikli',
  ozel: 'Ozel',
}

const INDIRIM_TURU_SECENEKLERI: RadioOption[] = [
  { value: 'percentage', label: 'Yuzde (%)' },
  { value: 'fixed', label: 'Sabit Tutar (TL)' },
]

const PASTA_RENKLERI = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

function formatTL(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function bos<T>(val: T | undefined): val is undefined {
  return val === undefined
}

// ─── Paket duzenleme formu varsayilan degerleri ──────────────────────────────

function bossPaket(): PromotionPackage {
  return {
    id: '',
    name: '',
    type: 'vitrin',
    durationDays: 7,
    priceTL: 0,
    description: '',
    active: true,
    activeListingCount: 0,
  }
}

/**
 * Fiyatlandirma ve promosyon yonetimi ekrani.
 *
 * Uc sekmeli duzen: promosyon paketleri (doping), kupon yonetimi ve
 * fiyatlandirma analitigi. Veri prop'tan gelir, cekilmez.
 *
 * @example
 * <PricingPromotionPage
 *   packages={paketler}
 *   coupons={kuponlar}
 *   analytics={analitik}
 *   onSavePackage={kaydet}
 *   onTogglePackage={durumDegistir}
 *   onCreateCoupon={kuponOlustur}
 *   onToggleCoupon={kuponDurumDegistir}
 * />
 */
export function PricingPromotionPage({
  packages,
  coupons,
  analytics,
  onSavePackage,
  onTogglePackage,
  onCreateCoupon,
  onToggleCoupon,
  capabilities,
}: PricingPromotionPageProps) {
  const [sekme, setSekme] = useState<string>(SEKME_PAKETLER)

  // Paket duzenleme modal durumu
  const [duzenlenecekPaket, setDuzenlenecekPaket] = useState<PromotionPackage | null>(null)
  const [paketModalAcik, setPaketModalAcik] = useState(false)

  // Kupon olusturma modal durumu
  const [kuponModalAcik, setKuponModalAcik] = useState(false)

  // Yetki kapilari
  const canEdit = capabilities?.canEditPricing !== false
  const canCreateCoupons = capabilities?.canCreateCoupons !== false
  const canViewAnalytics = capabilities?.canViewAnalytics !== false

  // ─── Paket sekme form state ──────────────────────────────────────────

  const [paketForm, setPaketForm] = useState<PromotionPackage>(bossPaket())

  function paketDuzenle(pkg: PromotionPackage) {
    setPaketForm(pkg)
    setDuzenlenecekPaket(pkg)
    setPaketModalAcik(true)
  }

  function yeniPaketAc() {
    setPaketForm(bossPaket())
    setDuzenlenecekPaket(null)
    setPaketModalAcik(true)
  }

  async function paketKaydet() {
    await onSavePackage(paketForm)
    setPaketModalAcik(false)
  }

  // ─── Kupon form state ────────────────────────────────────────────────

  const [kuponForm, setKuponForm] = useState<CouponInput>({
    code: '',
    discountType: 'percentage',
    discountAmount: 0,
    validFrom: '',
    validUntil: '',
    usageLimit: 0,
    applicablePackageIds: [],
    active: true,
  })

  function yeniKuponAc() {
    setKuponForm({
      code: '',
      discountType: 'percentage',
      discountAmount: 0,
      validFrom: '',
      validUntil: '',
      usageLimit: 0,
      applicablePackageIds: [],
      active: true,
    })
    setKuponModalAcik(true)
  }

  async function kuponKaydet() {
    await onCreateCoupon(kuponForm)
    setKuponModalAcik(false)
  }

  function kuponKoduUret() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    setKuponForm((prev) => ({ ...prev, code }))
  }

  // ─── Paket sutunlari ────────────────────────────────────────────────

  const paketSutunlari: ColumnDef<PromotionPackage>[] = [
    {
      id: 'name',
      header: 'Paket Adi',
      cell: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span>,
    },
    {
      id: 'type',
      header: 'Tur',
      width: '8rem',
      cell: (row) => (
        <Badge size="sm" tone="info">
          {TUR_ETIKET[row.type]}
        </Badge>
      ),
    },
    {
      id: 'durationDays',
      header: 'Sure (gun)',
      width: '7rem',
      cell: (row) => <span className={css.amount}>{row.durationDays}</span>,
    },
    {
      id: 'priceTL',
      header: 'Fiyat (TL)',
      width: '8rem',
      cell: (row) => <span className={css.amount}>{formatTL(row.priceTL)}</span>,
    },
    {
      id: 'active',
      header: 'Durum',
      width: '8rem',
      cell: (row) =>
        canEdit ? (
          <Switch
            size="sm"
            label={row.active ? 'Aktif' : 'Pasif'}
            checked={row.active}
            onCheckedChange={(next) => onTogglePackage(row.id, next)}
          />
        ) : (
          <Badge size="sm" tone={row.active ? 'success' : 'neutral'}>
            {row.active ? 'Aktif' : 'Pasif'}
          </Badge>
        ),
    },
    {
      id: 'activeListingCount',
      header: 'Aktif Ilan',
      width: '7rem',
      cell: (row) => <span className={css.amount}>{row.activeListingCount}</span>,
    },
    ...(canEdit
      ? [
          {
            id: 'actions',
            header: '',
            width: '3rem',
            cell: (row: PromotionPackage) => (
              <IconButton
                icon={<Pencil size={16} />}
                label="Duzenle"
                size="sm"
                onClick={() => paketDuzenle(row)}
              />
            ),
          } satisfies ColumnDef<PromotionPackage>,
        ]
      : []),
  ]

  // ─── Kupon sutunlari ────────────────────────────────────────────────

  const kuponSutunlari: ColumnDef<Coupon>[] = [
    {
      id: 'code',
      header: 'Kupon Kodu',
      cell: (row) => <span className={css.couponCode}>{row.code}</span>,
    },
    {
      id: 'discount',
      header: 'Indirim',
      width: '8rem',
      cell: (row) => (
        <span className={css.amount}>
          {row.discountType === 'percentage' ? `%${row.discountAmount}` : formatTL(row.discountAmount)}
        </span>
      ),
    },
    {
      id: 'validity',
      header: 'Gecerlilik',
      width: '12rem',
      cell: (row) => (
        <span>
          {row.validFrom} - {row.validUntil}
        </span>
      ),
    },
    {
      id: 'usageLimit',
      header: 'Limit',
      width: '6rem',
      cell: (row) => <span>{row.usageLimit === 0 ? 'Sinirsiz' : row.usageLimit}</span>,
    },
    {
      id: 'usedCount',
      header: 'Kullanilan',
      width: '6rem',
      cell: (row) => <span className={css.amount}>{row.usedCount}</span>,
    },
    {
      id: 'active',
      header: 'Durum',
      width: '8rem',
      cell: (row) => {
        const expired = new Date(row.validUntil) < new Date()
        if (expired) {
          return (
            <Badge size="sm" tone="neutral">
              Suresi dolmus
            </Badge>
          )
        }
        return canCreateCoupons ? (
          <Switch
            size="sm"
            label={row.active ? 'Aktif' : 'Pasif'}
            checked={row.active}
            onCheckedChange={(next) => onToggleCoupon(row.id, next)}
          />
        ) : (
          <Badge size="sm" tone={row.active ? 'success' : 'neutral'}>
            {row.active ? 'Aktif' : 'Pasif'}
          </Badge>
        )
      },
    },
  ]

  // ─── Islem tablosu sutunlari ────────────────────────────────────────

  const islemSutunlari: ColumnDef<PromotionTransaction>[] = [
    {
      id: 'date',
      header: 'Tarih',
      width: '10rem',
      cell: (row) => <span>{row.date}</span>,
    },
    {
      id: 'userName',
      header: 'Kullanici',
      cell: (row) => <span>{row.userName}</span>,
    },
    {
      id: 'packageName',
      header: 'Paket',
      cell: (row) => <span>{row.packageName}</span>,
    },
    {
      id: 'amount',
      header: 'Tutar',
      width: '8rem',
      cell: (row) => <span className={css.amount}>{formatTL(row.amount)}</span>,
    },
    {
      id: 'couponCode',
      header: 'Kupon',
      width: '8rem',
      cell: (row) =>
        row.couponCode !== undefined ? (
          <Badge size="sm" tone="info">
            {row.couponCode}
          </Badge>
        ) : (
          <span style={{ color: 'var(--color-text-secondary)' }}>-</span>
        ),
    },
  ]

  // ─── Paket sekmesi ozet kartlari ────────────────────────────────────

  const toplamPaket = packages.length
  const aktifPaket = packages.filter((p) => p.active).length
  const toplamGelir = analytics?.monthlyRevenue ?? 0
  const aktifPromosyon = packages.reduce((acc, p) => acc + p.activeListingCount, 0)

  const paketPaneli = (
    <div className={css.section}>
      <div className={css.statGrid}>
        <StatCard label="Toplam Paket" value={toplamPaket} icon={<Package size={20} />} />
        <StatCard label="Aktif Paket" value={aktifPaket} icon={<Package size={20} />} />
        <StatCard label="Toplam Gelir (Bu Ay)" value={formatTL(toplamGelir)} icon={<DollarSign size={20} />} />
        <StatCard label="Aktif Promosyon Sayisi" value={aktifPromosyon} icon={<BarChart3 size={20} />} />
      </div>

      {canEdit ? (
        <div className={css.toolbar}>
          <Button variant="primary" size="sm" leadingIcon={<Plus size={16} />} onClick={yeniPaketAc}>
            Yeni paket ekle
          </Button>
        </div>
      ) : null}

      {packages.length === 0 ? (
        <EmptyState
          variant="compact"
          title="Promosyon paketi yok"
          description="Henuz bir promosyon paketi tanimlanmamis. 'Yeni paket ekle' ile baslayabilirsiniz."
        />
      ) : (
        <DataTable rows={packages} columns={paketSutunlari} visualStyle="bordered" mobileMode="scroll" />
      )}
    </div>
  )

  // ─── Kupon sekmesi ──────────────────────────────────────────────────

  const paketSecenekleri: SelectOption[] = packages.map((p) => ({
    value: p.id,
    label: p.name,
  }))

  const kuponPaneli = (
    <div className={css.section}>
      {canCreateCoupons ? (
        <div className={css.toolbar}>
          <Button variant="primary" size="sm" leadingIcon={<Plus size={16} />} onClick={yeniKuponAc}>
            Yeni kupon olustur
          </Button>
        </div>
      ) : null}

      {coupons.length === 0 ? (
        <EmptyState
          variant="compact"
          title="Kupon yok"
          description="Henuz bir indirim kuponu olusturulmamis."
        />
      ) : (
        <DataTable rows={coupons} columns={kuponSutunlari} visualStyle="bordered" mobileMode="scroll" />
      )}
    </div>
  )

  // ─── Analitik sekmesi ───────────────────────────────────────────────

  const analitikPaneli = (
    <div className={css.section}>
      {bos(analytics) ? (
        <EmptyState
          variant="compact"
          title="Analitik verisi yok"
          description="Fiyatlandirma analitigini gorebilmek icin yeterli veri bekleniyor."
        />
      ) : (
        <>
          <div className={css.statGrid}>
            <StatCard label="Bu Ayin Geliri" value={formatTL(analytics.monthlyRevenue)} icon={<DollarSign size={20} />} />
            <StatCard
              label="Gecen Aya Gore"
              value={`${analytics.monthlyChange >= 0 ? '+' : ''}${analytics.monthlyChange}%`}
              icon={analytics.monthlyChange >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            />
            <StatCard label="En Populer Paket" value={analytics.popularPackage} icon={<Ticket size={20} />} />
            <StatCard label="Ort. Promosyon Suresi" value={`${analytics.avgDuration} gun`} icon={<Clock size={20} />} />
          </div>

          <div className={css.chartGrid}>
            <ChartCard title="Promosyon Geliri (Son 30 Gun)">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analytics.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    fill="#3b82f680"
                    name="Gelir (TL)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Paket Dagilimi">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={analytics.packageDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name }: { name?: string }) => name ?? ''}
                  >
                    {analytics.packageDistribution.map((_, index) => (
                      <Cell key={index} fill={PASTA_RENKLERI[index % PASTA_RENKLERI.length] ?? '#8884d8'} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <h2 className={css.heading}>Son Islemler</h2>

          {analytics.recentTransactions.length === 0 ? (
            <EmptyState
              variant="compact"
              title="Islem yok"
              description="Son donemde promosyon satin alma islemi bulunmuyor."
            />
          ) : (
            <DataTable
              rows={analytics.recentTransactions}
              columns={islemSutunlari}
              visualStyle="bordered"
              mobileMode="scroll"
            />
          )}
        </>
      )}
    </div>
  )

  // ─── Sekmeler ───────────────────────────────────────────────────────

  const sekmeler: TabItem[] = [
    { id: SEKME_PAKETLER, label: 'Promosyon Paketleri', content: paketPaneli },
    { id: SEKME_KUPONLAR, label: 'Kupon Yonetimi', content: kuponPaneli },
    ...(canViewAnalytics
      ? [{ id: SEKME_ANALITIK, label: 'Fiyatlandirma Analitigi', content: analitikPaneli }]
      : []),
  ]

  return (
    <div className={css.root}>
      <Tabs value={sekme} items={sekmeler} onValueChange={(next) => setSekme(next)} />

      {/* Paket duzenleme modali */}
      <Modal
        open={paketModalAcik}
        title={duzenlenecekPaket !== null ? 'Paketi Duzenle' : 'Yeni Paket Ekle'}
        onOpenChange={setPaketModalAcik}
      >
        <div className={css.formGrid}>
          <Input
            label="Paket adi"
            value={paketForm.name}
            onChange={(e) => setPaketForm((p) => ({ ...p, name: e.target.value }))}
          />
          <Select
            label="Tur"
            value={paketForm.type}
            options={TUR_SECENEKLERI}
            onValueChange={(val) =>
              setPaketForm((p) => ({ ...p, type: val as PromotionPackageType }))
            }
          />
          <NumberInput
            label="Sure (gun)"
            value={paketForm.durationDays}
            onValueChange={(val) => setPaketForm((p) => ({ ...p, durationDays: val ?? 0 }))}
          />
          <CurrencyInput
            label="Fiyat"
            currency={Currency.Try}
            value={paketForm.priceTL}
            onValueChange={(val) => setPaketForm((p) => ({ ...p, priceTL: val ?? 0 }))}
          />
          <Textarea
            label="Aciklama"
            value={paketForm.description ?? ''}
            onChange={(e) => setPaketForm((p) => ({ ...p, description: e.target.value }))}
          />
          <Switch
            label="Durum"
            checked={paketForm.active}
            onCheckedChange={(next) => setPaketForm((p) => ({ ...p, active: next }))}
          />
          <div className={css.formActions}>
            <Button variant="secondary" onClick={() => setPaketModalAcik(false)}>
              Vazgec
            </Button>
            <Button variant="primary" onClick={paketKaydet}>
              Kaydet
            </Button>
          </div>
        </div>
      </Modal>

      {/* Kupon olusturma modali */}
      <Modal
        open={kuponModalAcik}
        title="Yeni Kupon Olustur"
        onOpenChange={setKuponModalAcik}
      >
        <div className={css.formGrid}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <Input
              label="Kupon kodu"
              value={kuponForm.code}
              onChange={(e) => setKuponForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
            />
            <Button variant="secondary" size="sm" onClick={kuponKoduUret}>
              Uret
            </Button>
          </div>
          <RadioGroup
            label="Indirim turu"
            value={kuponForm.discountType}
            options={INDIRIM_TURU_SECENEKLERI}
            onValueChange={(val) =>
              setKuponForm((p) => ({
                ...p,
                discountType: val as 'percentage' | 'fixed',
              }))
            }
          />
          {kuponForm.discountType === 'percentage' ? (
            <NumberInput
              label="Indirim miktari (%)"
              value={kuponForm.discountAmount}
              onValueChange={(val) => setKuponForm((p) => ({ ...p, discountAmount: val ?? 0 }))}
            />
          ) : (
            <CurrencyInput
              label="Indirim miktari"
              currency={Currency.Try}
              value={kuponForm.discountAmount}
              onValueChange={(val) => setKuponForm((p) => ({ ...p, discountAmount: val ?? 0 }))}
            />
          )}
          <DateRangePicker
            label="Gecerlilik araligi"
            value={{
              ...(kuponForm.validFrom !== '' && { from: kuponForm.validFrom as `${number}-${number}-${number}` }),
              ...(kuponForm.validUntil !== '' && { to: kuponForm.validUntil as `${number}-${number}-${number}` }),
            }}
            onValueChange={(range) =>
              setKuponForm((p) => ({
                ...p,
                validFrom: range.from ?? '',
                validUntil: range.to ?? '',
              }))
            }
          />
          <NumberInput
            label="Kullanim limiti (0 = sinirsiz)"
            value={kuponForm.usageLimit}
            onValueChange={(val) => setKuponForm((p) => ({ ...p, usageLimit: val ?? 0 }))}
          />
          <MultiSelect
            label="Uygulanabilir paketler"
            values={kuponForm.applicablePackageIds}
            options={paketSecenekleri}
            onValuesChange={(vals: string[]) => setKuponForm((p) => ({ ...p, applicablePackageIds: vals }))}
          />
          <Switch
            label="Aktif"
            checked={kuponForm.active}
            onCheckedChange={(next) => setKuponForm((p) => ({ ...p, active: next }))}
          />
          <div className={css.formActions}>
            <Button variant="secondary" onClick={() => setKuponModalAcik(false)}>
              Vazgec
            </Button>
            <Button variant="primary" onClick={kuponKaydet}>
              Olustur
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
