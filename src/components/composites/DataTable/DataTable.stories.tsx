import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'
import type { ColumnDef } from '../../../types/component-props'
import type { Listing } from '../../../types/domain'
import { LISTING_CATEGORY_LABEL, TRANSACTION_TYPE_LABEL } from '../../../domain/labels'
import { formatCurrency } from '../../../utils/formatCurrency'
import { allListingFixtures } from '../../../fixtures'
import { ListingCard } from '../ListingCard'
import { StatusBadge } from '../StatusBadge'
import { DataTable } from './DataTable'

/**
 * Generic'in gerçek kanıtı: `cell` içinde `row` tipi `Listing`'dir, `unknown` değil.
 * `row.location.cityName` yazarken otomatik tamamlama gelir ve yanlış alan
 * derleme hatası verir.
 */
const SUTUNLAR: ColumnDef<Listing>[] = [
  {
    id: 'listingNo',
    header: 'İlan no',
    accessor: 'listingNo',
    sortable: true,
    filterable: true,
    width: '9rem',
  },
  {
    id: 'title',
    header: 'Başlık',
    cell: (row) => (
      <span
        style={{
          display: 'block',
          maxWidth: '22rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {row.title}
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => row.title,
    filterable: true,
    filterAccessor: (row) => row.title,
  },
  {
    id: 'category',
    header: 'Kategori',
    cell: (row) =>
      `${LISTING_CATEGORY_LABEL[row.category]} · ${TRANSACTION_TYPE_LABEL[row.transactionType]}`,
    hideable: true,
  },
  {
    id: 'location',
    header: 'Konum',
    cell: (row) => `${row.location.districtName}, ${row.location.cityName}`,
    hideable: true,
  },
  {
    id: 'price',
    header: 'Fiyat',
    cell: (row) => formatCurrency(row.price),
    sortable: true,
    align: 'end',
    sortAccessor: (row) => row.price.amount,
  },
  {
    id: 'status',
    header: 'Durum',
    cell: (row) => <StatusBadge status={row.status} size="sm" showDot />,
  },
  {
    id: 'reports',
    header: 'Şikayet',
    accessor: 'id',
    cell: (row) => row.metrics.reportCount,
    align: 'center',
    sortable: true,
    hideable: true,
    sortAccessor: (row) => row.metrics.reportCount,
  },
]

const meta = {
  title: 'Composites/DataTable',
  component: DataTable,

  tags: ['stable'],

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Sıralama, seçim ve yoğun veri gösterimi. Generic’tir ve satır tipini korur — `cell` ' +
          'içinde `row` tipi `Listing`’dir, `unknown` değil. `mobileMode="scroll"` sütunlar ' +
          'önemliyse (audit log), `"cards"` okunabilirlik önemliyse (ilan listesi). Sıralanabilir ' +
          'başlıklar `<button>`’dır — `<th onClick>` klavyeyle erişilemez.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'data-display',
      useWhen: ['İlan, kullanıcı, rapor veya audit listesi gösterilirken'],
      doNotUseWhen: ['Tek bir kaydın alanları gösterilecekse — ListingFacts kullanın'],
    },
  },

  args: {
    rows: allListingFixtures,
    columns: SUTUNLAR,
    density: 'comfortable',
    visualStyle: 'plain',
    mobileMode: 'scroll',
    loading: false,
    selectable: false,
    stickyHeader: false,
  },

  argTypes: {
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    visualStyle: { control: 'inline-radio', options: ['plain', 'bordered', 'striped'] },
    mobileMode: { control: 'inline-radio', options: ['scroll', 'cards'] },
    loading: { control: 'boolean' },
    selectable: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    rows: { control: false },
    columns: { control: false },
  },
} satisfies Meta<typeof DataTable<Listing>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Bordered: Story = {
  args: { visualStyle: 'bordered' },
}

export const Striped: Story = {
  args: { visualStyle: 'striped' },
}

export const Compact: Story = {
  args: { density: 'compact', visualStyle: 'bordered' },
}

/** Başlık korunur, satırlar skeleton olur: veri gelince düzen zıplamaz. */
export const Loading: Story = {
  args: { loading: true, visualStyle: 'bordered' },
}

export const Empty: Story = {
  args: { rows: [], visualStyle: 'bordered' },
}

export const FilteredEmpty: Story = {
  args: {
    rows: [],
    visualStyle: 'bordered',
    emptyState: (
      <>
        <strong>Filtrelere uyan ilan yok</strong>
        <span style={{ color: 'var(--color-text-muted)' }}>
          Filtreleri temizleyip tekrar deneyin.
        </span>
      </>
    ),
  },
}

export const Error: Story = {
  args: {
    visualStyle: 'bordered',
    error: {
      title: 'İlanlar yüklenemedi',
      message: 'Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.',
      code: 'NETWORK_TIMEOUT',
      retryable: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /*
      `retryable: true` ama `onRetry` yok: buton çıkmamalı. İki kapı birden
      açılmalı — bkz. `ErrorCanBeRetried`.
    */
    await expect(canvas.queryByRole('button', { name: 'Tekrar dene' })).not.toBeInTheDocument()
    await expect(canvas.getByRole('alert')).toHaveTextContent('İlanlar yüklenemedi')
  },
}

/**
 * `onRetry` bağlıyken hata bloğu tekrar deneme butonu gösterir.
 *
 * Tablo sorguyu kendi atmaz; `ChartCardProps.onRetry` ile aynı sözleşme —
 * ikisi tek kararın iki yüzü olduğu için birlikte eklendi.
 */
export const ErrorCanBeRetried: Story = {
  args: {
    visualStyle: 'bordered',
    error: {
      title: 'İlanlar yüklenemedi',
      message: 'Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.',
      code: 'NETWORK_TIMEOUT',
      retryable: true,
    },
    onRetry: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Tekrar dene' }))
    await expect(args.onRetry).toHaveBeenCalledTimes(1)
  },
}

/**
 * Seçim kutularının etiketi gizlidir ama ekran okuyucuya gider.
 *
 * `rowLabel` satırı tanımlar, "Satırı seç" demez: 12 kez aynı metni duyan
 * kullanıcı hangisini seçtiğini anlamaz. `render` kullanılıyor çünkü Storybook'un
 * `Meta` tipi generic'i `T`'nin sınırlamasına düşürüyor (bkz. MobileCards).
 */
export const Selectable: Story = {
  args: { selectable: true, selectedIds: ['listing-land-corlu-field'], onSelectionChange: fn() },
  render: (args) => (
    <DataTable<Listing>
      {...args}
      rows={allListingFixtures}
      columns={SUTUNLAR}
      rowLabel={(row) => `${row.title} ilanını seç`}
    />
  ),
}

export const Sorted: Story = {
  args: { sort: { columnId: 'price', direction: 'desc' }, onSortChange: fn() },
}

export const StickyHeader: Story = {
  args: { stickyHeader: true, visualStyle: 'bordered' },
  decorators: [
    (Story) => (
      <div style={{ height: '20rem', overflowY: 'auto' }}>
        <Story />
      </div>
    ),
  ],
}

export const ClickableRows: Story = {
  args: { onRowClick: fn() },
}

/** Dar ekranda tablo yatay kaydırılır, kesilmez. */
export const MobileScroll: Story = {
  globals: { viewport: { value: 'mobile320' } },
  args: { visualStyle: 'bordered' },
}

/**
 * Dar ekranda her satır karta dönüşür; okunabilirlik önemliyse bu tercih edilir.
 *
 * `renderMobileCard` args yerine `render` içinde veriliyor: Storybook'un `Meta`
 * tipi generic'i `T`'nin sınırlamasına (`{ id: string }`) düşürüyor, `Listing`'e
 * daraltmıyor. Component'te sorun yok — orada `DataTable<Listing>` tipi korur.
 */
export const MobileCards: Story = {
  globals: { viewport: { value: 'mobile320' } },
  render: (args) => (
    <DataTable<Listing>
      {...args}
      rows={allListingFixtures}
      columns={SUTUNLAR}
      mobileMode="cards"
      renderMobileCard={(row) => <ListingCard listing={row} variant="grid" />}
    />
  ),
  /*
    `mobileMode="cards"` artık viewport'a KENDİSİ bakıyor: iki dal da DOM'da,
    birini medya sorgusu boyuyor. Eskiden bu dal yalnız kart çiziyordu (tablo
    hiç yoktu); tablonun `{ hidden: true }` ile bulunması düzeltmenin regresyon
    kanıtı. Sorgular viewport'tan bağımsız — `{ hidden: true }` iddiayı "DOM'da
    var/yok" düzeyine indirir.
  */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('article', { hidden: true })).toHaveLength(
      allListingFixtures.length,
    )
    await expect(canvas.getByRole('table', { hidden: true })).toBeInTheDocument()
    await expect(canvas.getAllByRole('row', { hidden: true })).toHaveLength(
      allListingFixtures.length + 1,
    )
  },
}

export const Interactive: Story = {
  render: function Render(args) {
    const [secili, setSecili] = useState<string[]>([])
    const [sort, setSort] = useState<{ columnId: string; direction: 'asc' | 'desc' } | undefined>()

    const sirali = [...allListingFixtures].sort((a, b) => {
      if (sort === undefined) return 0
      const yon = sort.direction === 'asc' ? 1 : -1
      if (sort.columnId === 'price') return (a.price.amount - b.price.amount) * yon
      if (sort.columnId === 'reports') return (a.metrics.reportCount - b.metrics.reportCount) * yon
      if (sort.columnId === 'title') return a.title.localeCompare(b.title, 'tr') * yon
      return a.listingNo.localeCompare(b.listingNo) * yon
    })

    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
          {secili.length} ilan seçili
          {sort !== undefined ? ` · ${sort.columnId} ${sort.direction}` : ''}
        </span>
        <DataTable<Listing>
          {...args}
          rows={sirali}
          selectable
          selectedIds={secili}
          onSelectionChange={setSecili}
          {...(sort !== undefined && { sort })}
          onSortChange={setSort}
          visualStyle="bordered"
        />
      </div>
    )
  },
}

/** "Tümünü seç" kısmi seçimde `mixed` duyurmalı, tıklayınca hepsini seçmeli. */
export const SelectAllAnnouncesMixed: Story = {
  args: { selectable: true, selectedIds: ['listing-land-corlu-field'], onSelectionChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const tumunuSec = canvas.getByRole('checkbox', { name: /Tümünü seç/ })

    await expect(tumunuSec).toHaveAttribute('aria-checked', 'mixed')

    await userEvent.click(tumunuSec)
    await expect(args.onSelectionChange).toHaveBeenCalledWith(allListingFixtures.map((l) => l.id))
  },
}

/** Sıralama başlığı buton olmalı ve tıklayınca yönü değiştirmeli. */
export const SortToggles: Story = {
  args: { sort: { columnId: 'price', direction: 'asc' }, onSortChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const fiyat = canvas.getByRole('button', { name: /Fiyat/ })

    await userEvent.click(fiyat)
    await expect(args.onSortChange).toHaveBeenCalledWith({ columnId: 'price', direction: 'desc' })
  },
}

export const VariantsComparison: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <DataTable<Listing> {...args} rows={allListingFixtures.slice(0, 3)} visualStyle="plain" />
      <DataTable<Listing> {...args} rows={allListingFixtures.slice(0, 3)} visualStyle="bordered" />
      <DataTable<Listing> {...args} rows={allListingFixtures.slice(0, 3)} visualStyle="striped" />
      <DataTable<Listing>
        {...args}
        rows={allListingFixtures.slice(0, 3)}
        visualStyle="bordered"
        density="compact"
      />
    </div>
  ),
}

/**
 * Dahili araç çubuğu + yoğunluk anahtarı (P1).
 *
 * `toolbar={{ density: true }}` verilince tablo kendi araç çubuğunu çizer;
 * `onDensityChange` verilmediği için yoğunluğu **kendisi yönetir** (yönetilen mod).
 */
export const ToolbarDensity: Story = {
  args: { toolbar: { density: true }, visualStyle: 'bordered' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Rahat başlangıçta seçili', async () => {
      await expect(canvas.getByRole('button', { name: 'Rahat' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    })

    await step('Sıkışık’a basınca seçim ona geçer', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Sıkışık' }))
      await expect(canvas.getByRole('button', { name: 'Sıkışık' })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      await expect(canvas.getByRole('button', { name: 'Rahat' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })
  },
}

/**
 * Sütun görünürlük seçici (P2).
 *
 * `toolbar={{ columns: true }}` araç çubuğuna "Sütunlar" menüsü ekler; menü yalnız
 * `hideable` sütunları listeler (Kategori, Konum, Şikayet). `onHiddenColumnsChange`
 * verilmediği için görünürlüğü tablo kendi yönetir. Son görünür sütun kilitlenir.
 */
export const ColumnVisibility: Story = {
  args: { toolbar: { columns: true, density: true }, visualStyle: 'bordered' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Kategori sütunu başta görünür', async () => {
      await expect(canvas.getByRole('columnheader', { name: 'Kategori' })).toBeVisible()
    })

    await step('Menüden Kategori’yi gizle', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Sütunları göster veya gizle' }))
      const body = within(document.body)
      // Menü portal’a async açılır — `findByRole` DOM’a girene kadar bekler.
      await userEvent.click(await body.findByRole('menuitemcheckbox', { name: 'Kategori' }))
    })

    await step('Kategori sütunu artık yok', async () => {
      await expect(canvas.queryByRole('columnheader', { name: 'Kategori' })).toBeNull()
      // Diğer sütunlar duruyor: gizleme tabloyu bozmadı.
      await expect(canvas.getByRole('columnheader', { name: 'İlan no' })).toBeVisible()
    })
  },
}

/**
 * Yönetilen çoklu sıralama (P3).
 *
 * `onSortChange` VERİLMEZ; tablo `sortAccessor` ile client-side sıralar. Başlığa
 * tık asc → desc → (kaldır) döngüsü; **shift+tık** ikincil kural ekler ve
 * başlıklarda öncelik rozeti (1, 2…) belirir. Eski tek-kolon kontrollü sıralama
 * (`Sorted` story) değişmeden çalışmaya devam eder.
 */
export const ManagedMultiSort: Story = {
  args: { visualStyle: 'bordered', toolbar: { density: true } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const ilkListingNo = () =>
      canvas.getAllByRole('row')[1]?.querySelector('td')?.textContent?.trim()

    await step('Fiyat’a tıklamak satırları yeniden sıralar', async () => {
      const oncekiIlk = ilkListingNo()
      await userEvent.click(canvas.getByRole('button', { name: /Fiyat/ }))
      await expect(canvas.getByRole('columnheader', { name: /Fiyat/ })).toHaveAttribute(
        'aria-sort',
        'ascending',
      )
      // İlk satır değişti: client-side sıralama gerçekten uygulandı.
      await expect(ilkListingNo()).not.toBe(oncekiIlk)
    })

    await step('Aynı başlık ikinci tık: azalan', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Fiyat/ }))
      await expect(canvas.getByRole('columnheader', { name: /Fiyat/ })).toHaveAttribute(
        'aria-sort',
        'descending',
      )
    })

    await step('Shift+tık ikincil kural ekler, öncelik rozetleri belirir', async () => {
      // `userEvent` click’i shiftKey’i güvenilir taşımıyor; `fireEvent` doğrudan geçirir.
      await fireEvent.click(canvas.getByRole('button', { name: /Başlık/ }), { shiftKey: true })
      // İki başlık da sıralı: Fiyat birincil (desc), Başlık ikincil (asc).
      await expect(canvas.getByRole('columnheader', { name: /Fiyat/ })).toHaveAttribute(
        'aria-sort',
        'descending',
      )
      await expect(canvas.getByRole('columnheader', { name: /Başlık/ })).toHaveAttribute(
        'aria-sort',
        'ascending',
      )
    })
  },
}

/**
 * Sütun-içi filtreler (P4).
 *
 * `toolbar={{ filters: true }}` başlığın altına, `filterable` sütunlar için (İlan
 * no, Başlık) bir metin filtre satırı ekler. `onColumnFiltersChange` verilmediği
 * için tablo `filterAccessor` ile client-side süzer — girilen değer alt dize
 * (büyük/küçük harf duyarsız) olarak eşleştirilir; sonuç boşsa `emptyState` çıkar.
 */
export const ColumnFilters: Story = {
  args: { toolbar: { filters: true, density: true }, visualStyle: 'bordered' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const satirSayisi = () => canvas.getAllByRole('row').length

    await step('Başlığa "villa" yazınca satırlar süzülür', async () => {
      const oncekiSatir = satirSayisi()
      const filtre = canvas.getByRole('textbox', { name: 'Başlık filtresi' })
      await userEvent.type(filtre, 'villa')
      // Daha az satır kaldı ve kalanların hepsi "villa" içeriyor.
      await expect(satirSayisi()).toBeLessThan(oncekiSatir)
      const hucreler = canvas.getAllByRole('cell')
      const villaVar = hucreler.some((c) => /villa/i.test(c.textContent ?? ''))
      await expect(villaVar).toBe(true)
    })

    await step('Filtre temizlenince satırlar geri gelir', async () => {
      const filtre = canvas.getByRole('textbox', { name: 'Başlık filtresi' })
      await userEvent.clear(filtre)
      await expect(satirSayisi()).toBeGreaterThan(3)
    })
  },
}

/**
 * Tüm gelişmiş yetenekler bir arada: yoğunluk anahtarı, sütun seçici, sütun-içi
 * filtreler ve yönetilen çoklu sıralama (shift+tık). Hiçbir `on*Change` verilmez —
 * tablo hepsini kendi yönetir (yönetilen mod). Kontrollü kullanımda ilgili
 * kanalları bağlayıp veriyi sunucudan sıralı/süzülü getirin.
 */
export const AdvancedAllFeatures: Story = {
  args: {
    visualStyle: 'bordered',
    stickyHeader: true,
    toolbar: { density: true, columns: true, filters: true },
  },
  decorators: [
    (Story) => (
      <div style={{ maxHeight: '30rem', overflowY: 'auto' }}>
        <Story />
      </div>
    ),
  ],
}
