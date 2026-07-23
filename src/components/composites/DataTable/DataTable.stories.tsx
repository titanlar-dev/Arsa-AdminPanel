import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test'
import type { ColumnDef, SelectOption } from '../../../types/component-props'
import type { Listing } from '../../../types/domain'
import { LISTING_CATEGORY_LABEL, TRANSACTION_TYPE_LABEL } from '../../../domain/labels'
import { formatCurrency } from '../../../utils/formatCurrency'
import { allListingFixtures } from '../../../fixtures'
import { ListingCard } from '../ListingCard'
import { StatusBadge } from '../StatusBadge'
import { DataTable } from './DataTable'
import { generateCSV, downloadCSV } from './tableExport'

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
    width: 'min(100%, 9rem)',
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

/* ── Sayfa-otesi secim ve disa aktarma story'leri ── */

/**
 * Sayfa-otesi toplu secim: `totalRowCount` verilince baslik kutusuna basildiktan
 * sonra "Tum X kaydi sec" banner'i cikar. `selectAllMode` ile banner metni degisir.
 *
 * Sayfa basina 20 satir gosterilir; toplamda 5000 kayit oldugu varsayilir.
 */
export const BulkSelectAcrossPages: Story = {
  render: function Render(args) {
    const sayfaRows = allListingFixtures.slice(0, 5)
    const [secili, setSecili] = useState<string[]>([])
    const [selectAllMode, setSelectAllMode] = useState<'page' | 'all'>('page')

    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          {selectAllMode === 'all' ? 'Tum 5.000 kayit secili' : `${secili.length} kayit secili`}
          {' · '}mod: {selectAllMode}
        </span>
        <DataTable<Listing>
          {...args}
          rows={sayfaRows}
          columns={SUTUNLAR}
          selectable
          selectedIds={secili}
          onSelectionChange={(ids) => {
            setSecili(ids)
            // Sayfadaki tum satirlar secilmediyse modu page'e dondur
            if (ids.length < sayfaRows.length) {
              setSelectAllMode('page')
            }
          }}
          totalRowCount={5000}
          selectAllMode={selectAllMode}
          onSelectAllAcrossPages={() => setSelectAllMode('all')}
          onClearSelection={() => {
            setSecili([])
            setSelectAllMode('page')
          }}
          visualStyle="bordered"
          rowLabel={(row) => `${row.title} ilanini sec`}
        />
      </div>
    )
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Baslik kutusuna basinca tum sayfa secilir', async () => {
      const tumunuSec = canvas.getByRole('checkbox', { name: /Tumunu sec/ })
      await userEvent.click(tumunuSec)
    })

    await step('Banner gorunur: "Bu sayfadaki N kayit secildi"', async () => {
      await expect(canvas.getByRole('status')).toHaveTextContent(/Bu sayfadaki/)
    })

    await step('"Tum 5.000 kaydi sec" butonuna basinca banner degisir', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Tum.*kaydi sec/ }))
      await expect(canvas.getByRole('status')).toHaveTextContent(/Tum 5\.000 kayit secildi/)
    })

    await step('"Secimi temizle" butonuna basinca banner kalkar', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Secimi temizle/ }))
      await expect(canvas.queryByRole('status')).not.toBeInTheDocument()
    })
  },
}

/**
 * Disa aktarma butonu: `exportable` veya `toolbar.export` ile arac cubugunda
 * "Disa aktar" menusu gorunur. CSV secenegi yerlesik `generateCSV` ile
 * calisabilir; XLSX ise cagiran tarafindan uretilir.
 */
export const ExportableTable: Story = {
  render: function Render(args) {
    const handleExport = (format: 'csv' | 'xlsx', selectedOnly: boolean) => {
      if (format === 'csv') {
        const csv = generateCSV(allListingFixtures, SUTUNLAR)
        downloadCSV(csv, 'ilanlar.csv')
      } else {
        // XLSX icin gercek uretim cagiran tarafindan yapilir
        // eslint-disable-next-line no-console
        console.log('XLSX export requested', { selectedOnly })
      }
    }

    return (
      <DataTable<Listing>
        {...args}
        rows={allListingFixtures}
        columns={SUTUNLAR}
        exportable
        onExport={handleExport}
        visualStyle="bordered"
        toolbar={{ density: true, columns: true }}
      />
    )
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Disa aktar butonu gorunur', async () => {
      await expect(canvas.getByRole('button', { name: /Disa aktar/ })).toBeVisible()
    })

    await step('Menuyu acinca CSV ve Excel secenekleri var', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Disa aktar/ }))
      const body = within(document.body)
      await expect(await body.findByRole('menuitem', { name: /CSV olarak/ })).toBeVisible()
      await expect(await body.findByRole('menuitem', { name: /Excel olarak/ })).toBeVisible()
    })
  },
}

/**
 * Sayfa-otesi secim + disa aktarma bir arada. Satirlar secildiginde menude
 * "Secilenleri CSV/Excel olarak disa aktar" secenekleri de gorunur.
 */
export const SelectAndExport: Story = {
  render: function Render(args) {
    const sayfaRows = allListingFixtures.slice(0, 5)
    const [secili, setSecili] = useState<string[]>([])
    const [selectAllMode, setSelectAllMode] = useState<'page' | 'all'>('page')

    const handleExport = (format: 'csv' | 'xlsx', selectedOnly: boolean) => {
      const rows = selectedOnly ? sayfaRows.filter((r) => secili.includes(r.id)) : sayfaRows
      if (format === 'csv') {
        const csv = generateCSV(rows, SUTUNLAR)
        downloadCSV(csv, selectedOnly ? 'secili-ilanlar.csv' : 'ilanlar.csv')
      } else {
        // eslint-disable-next-line no-console
        console.log('XLSX export', { format, selectedOnly, count: rows.length })
      }
    }

    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          {selectAllMode === 'all' ? 'Tum 5.000 kayit secili' : `${secili.length} kayit secili`}
        </span>
        <DataTable<Listing>
          {...args}
          rows={sayfaRows}
          columns={SUTUNLAR}
          selectable
          selectedIds={secili}
          onSelectionChange={(ids) => {
            setSecili(ids)
            if (ids.length < sayfaRows.length) setSelectAllMode('page')
          }}
          totalRowCount={5000}
          selectAllMode={selectAllMode}
          onSelectAllAcrossPages={() => setSelectAllMode('all')}
          onClearSelection={() => {
            setSecili([])
            setSelectAllMode('page')
          }}
          exportable
          onExport={handleExport}
          visualStyle="bordered"
          toolbar={{ density: true, columns: true }}
          rowLabel={(row) => `${row.title} ilanini sec`}
        />
      </div>
    )
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Bir satir secince menude "Secilenleri" secenekleri gorunur', async () => {
      // Ilk satirin seçim kutusuna tıkla
      const checkboxes = canvas.getAllByRole('checkbox')
      // İlk checkbox "Tümünü seç", ikincisi ilk satır
      await userEvent.click(checkboxes[1]!)

      await userEvent.click(canvas.getByRole('button', { name: /Disa aktar/ }))
      const body = within(document.body)
      await expect(
        await body.findByRole('menuitem', { name: /Secilenleri CSV/ }),
      ).toBeVisible()
      await expect(
        await body.findByRole('menuitem', { name: /Secilenleri Excel/ }),
      ).toBeVisible()
    })
  },
}

/* ── Sanallaştırma (virtualization) story'leri ── */

/**
 * Sahte ilan verisi ureticisi. 10.000+ satirlik tablolarda performans
 * testleri icin kullanilir. Gercek `Listing` tipini tam olarak karsılamak
 * yerine yalniz SUTUNLAR'in eristigi alanlari doldurur; generic constraint
 * `{ id: string }` saglanir.
 */
const SEHIRLER = [
  { city: 'Istanbul', districts: ['Kadikoy', 'Besiktas', 'Uskudar', 'Sisli', 'Bakirkoy', 'Fatih', 'Beyoglu', 'Sariyer'] },
  { city: 'Ankara', districts: ['Cankaya', 'Kecioren', 'Yenimahalle', 'Mamak', 'Etimesgut'] },
  { city: 'Izmir', districts: ['Karsiyaka', 'Bornova', 'Konak', 'Buca', 'Bayrakli'] },
  { city: 'Antalya', districts: ['Muratpasa', 'Konyaalti', 'Kepez', 'Lara'] },
  { city: 'Bursa', districts: ['Nilufer', 'Osmangazi', 'Yildirim'] },
]

const BASLIKLAR = [
  'Deniz Manzarali Daire', 'Mustakil Villa', 'Bahceli Residence', 'Sehir Merkezinde Ofis',
  'Genis Arsa', 'Cati Dubleksi', 'Loft Daire', 'Penthouse', 'Yali Dairesi',
  'Sifir Bina Daire', 'Havuzlu Villa', 'Metroya Yakin Daire', 'Park Manzarali Residence',
  'Orman Manzarali Ciftlik', 'Ticari Depo', 'Isyeri', 'Otopark Alti Dukkan',
  'Plaja Yakin Yazlik', 'Kayak Merkezine Yakin', 'Universite Yaninda Studio',
]

const DURUMLAR = ['published', 'pendingReview', 'draft', 'rejected', 'paused', 'expired'] as const

function generateMockListings(count: number): Listing[] {
  const rows: Listing[] = []
  for (let i = 0; i < count; i++) {
    const sehir = SEHIRLER[i % SEHIRLER.length]!
    const ilce = sehir.districts[i % sehir.districts.length]!
    const baslik = BASLIKLAR[i % BASLIKLAR.length]!
    const durum = DURUMLAR[i % DURUMLAR.length]!
    const fiyat = 500_000 + (i * 73_291) % 9_500_000 // deterministik, cesitli fiyatlar

    rows.push({
      id: `mock-listing-${i}`,
      listingNo: `IL-${String(i + 1).padStart(6, '0')}`,
      title: `${baslik} #${i + 1}`,
      description: '',
      status: durum,
      category: 'konut',
      transactionType: 'satilik',
      subCategory: 'daire',
      price: { amount: fiyat, currency: 'TRY', period: 'toplu' },
      location: {
        cityCode: '34',
        cityName: sehir.city,
        districtId: `d-${ilce.toLowerCase()}`,
        districtName: ilce,
        neighborhoodId: `n-${ilce.toLowerCase()}-1`,
        neighborhoodName: `${ilce} Merkez`,
        latitude: 41.0 + (i % 100) * 0.001,
        longitude: 29.0 + (i % 100) * 0.001,
      },
      photos: [],
      listingDate: '2026-01-15T10:00:00+03:00',
      createdAt: '2026-01-15T10:00:00+03:00',
      updatedAt: '2026-01-15T10:00:00+03:00',
      ownerUserId: `user-${i % 500}`,
      seller: {
        id: `seller-${i % 500}`,
        type: 'sahibinden',
        displayName: `Satici ${i % 500}`,
        verificationStatus: 'verified',
      },
      contact: {
        phone: '+905551234567',
        allowPhone: true,
        allowMessage: true,
        preferredContactMethod: 'both',
      },
      promotionFlags: {
        oneCikan: false,
        acil: false,
        vitrin: false,
        anasayfaVitrini: false,
        kategoriOneCikan: false,
      },
      promotions: [],
      moderation: {
        rejectionReasons: [],
        automatedChecks: [],
      },
      metrics: {
        viewCount: i * 3,
        favoriteCount: i % 50,
        messageCount: i % 20,
        reportCount: i % 7,
      },
      source: 'web',
      revision: 1,
      tags: [],
      attributes: {
        grossArea: 80 + (i % 120),
        netArea: 70 + (i % 100),
        roomCount: '2+1',
        buildingAge: 'age0to5',
        floorNumber: (i % 15) + 1,
        totalFloors: 15,
        heatingType: 'merkezi',
        bathroomCount: 1,
        balcony: true,
        elevator: true,
        parking: 'kapaliOtopark',
        furnished: false,
        occupancyStatus: 'bos',
        loanEligible: 'uygun',
        titleDeedStatus: 'kat',
        buildingCondition: 'iyi',
        inSite: false,
      },
    } as unknown as Listing)
  }
  return rows
}

/**
 * 10.000 satirlik sanallastirilmis tablo.
 *
 * `virtualize={true}` ile yalniz gorunur satirlar (+ overscan) render edilir.
 * Kaydirma cubuguna dikkat: 10.000 satirin tamami icin orantili boyda. Sayfayi
 * asagi kaydirir, satirlar anlık gelir — performans sorunu yok.
 *
 * `stickyHeader` ile baslik kaydirmada ustunde kalir.
 */
export const VirtualizedLargeDataset: Story = {
  render: function Render() {
    const mockRows = useMemo(() => generateMockListings(10_000), [])

    return (
      <DataTable<Listing>
        rows={mockRows}
        columns={SUTUNLAR}
        virtualize={true}
        stickyHeader={true}
        visualStyle="bordered"
        toolbar={{ density: true, columns: true }}
      />
    )
  },
}

/**
 * Sanallastirma performans hikayesi: yogunluk degistirildiginde satir
 * yuksekligi uyum saglar, kaydirma pürüzsüz kalir. `estimateSize` yogunluga
 * gore otomatik ayarlanir (compact: 36px, comfortable: 48px).
 */
export const VirtualizationPerformance: Story = {
  render: function Render() {
    const mockRows = useMemo(() => generateMockListings(10_000), [])
    const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')

    return (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          {mockRows.length.toLocaleString('tr-TR')} satir, yogunluk: {density}
          {' — asagi kaydir, pürüzsüz performansi gozlemle'}
        </span>
        <DataTable<Listing>
          rows={mockRows}
          columns={SUTUNLAR}
          virtualize={{ overscan: 10 }}
          stickyHeader={true}
          visualStyle="striped"
          density={density}
          onDensityChange={setDensity}
          toolbar={{ density: true }}
        />
      </div>
    )
  },
}

/* ── Gelismis baslik (sort icon + filter icon + popover) story'leri ── */

/** Gelismis baslik sutun tanimlari: sort + filter ikonlari. */
const KATEGORI_SECENEKLERI: SelectOption[] = [
  { value: 'konut', label: 'Konut' },
  { value: 'isyeri', label: 'Is Yeri' },
  { value: 'arsa', label: 'Arsa' },
]

const DURUM_SECENEKLERI: SelectOption[] = [
  { value: 'published', label: 'Yayinda' },
  { value: 'pendingReview', label: 'Incelemede' },
  { value: 'draft', label: 'Taslak' },
  { value: 'rejected', label: 'Reddedildi' },
]

const GELISMIS_SUTUNLAR: ColumnDef<Listing>[] = [
  {
    id: 'listingNo',
    header: 'Ilan no',
    accessor: 'listingNo',
    sortable: true,
    filterable: true,
    columnFilterable: true,
    columnFilterType: 'text',
    width: 'min(100%, 9rem)',
  },
  {
    id: 'title',
    header: 'Baslik',
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
    columnFilterable: true,
    columnFilterType: 'text',
  },
  {
    id: 'category',
    header: 'Kategori',
    cell: (row) =>
      `${LISTING_CATEGORY_LABEL[row.category]} · ${TRANSACTION_TYPE_LABEL[row.transactionType]}`,
    hideable: true,
    columnFilterable: true,
    columnFilterType: 'select',
    columnFilterOptions: KATEGORI_SECENEKLERI,
  },
  {
    id: 'location',
    header: 'Konum',
    cell: (row) => `${row.location.districtName}, ${row.location.cityName}`,
    hideable: true,
    columnFilterable: true,
    columnFilterType: 'text',
  },
  {
    id: 'price',
    header: 'Fiyat',
    cell: (row) => formatCurrency(row.price),
    sortable: true,
    align: 'end',
    sortAccessor: (row) => row.price.amount,
    columnFilterable: true,
    columnFilterType: 'number',
  },
  {
    id: 'status',
    header: 'Durum',
    cell: (row) => <StatusBadge status={row.status} size="sm" showDot />,
    columnFilterable: true,
    columnFilterType: 'select',
    columnFilterOptions: DURUM_SECENEKLERI,
  },
  {
    id: 'reports',
    header: 'Sikayet',
    accessor: 'id',
    cell: (row) => row.metrics.reportCount,
    align: 'center',
    sortable: true,
    hideable: true,
    sortAccessor: (row) => row.metrics.reportCount,
  },
]

/**
 * Gelismis basliklar: tum siralanabilir sutunlarda sort ikonu, tum
 * filtrelenebilir sutunlarda huni ikonu gorulur. Huniye tiklaninca
 * sutun tipine uygun filtre popover'i acilir.
 */
export const AdvancedHeaders: Story = {
  render: (args) => (
    <DataTable<Listing>
      {...args}
      rows={allListingFixtures}
      columns={GELISMIS_SUTUNLAR}
      visualStyle="bordered"
    />
  ),
}

/**
 * Filtre popover'i acik gosterimi. "Kategori" sutunundaki huni
 * tiklanarakacilir — select tipinde filtre popover'i gorulur.
 */
export const ColumnFilterPopover: Story = {
  render: (args) => (
    <DataTable<Listing>
      {...args}
      rows={allListingFixtures}
      columns={GELISMIS_SUTUNLAR}
      visualStyle="bordered"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Kategori filtre butonuna tikla
    const filtreButonu = canvas.getByRole('button', { name: /Kategori filtrele/ })
    await userEvent.click(filtreButonu)
    // Popover acildi
    const body = within(document.body)
    await expect(body.getByRole('dialog', { name: /Kategori filtresi/ })).toBeVisible()
  },
}

/**
 * Aktif filtreler: bazi sutunlarda filtre uygulanmis, huni ikonu
 * vurgulanmis (primary renk + dolgulu ikon). Baslik filtreleri
 * `columnHeaderFilters` prop'u ile kontrollü olarak verilebilir.
 */
export const ActiveFilters: Story = {
  render: (args) => (
    <DataTable<Listing>
      {...args}
      rows={allListingFixtures}
      columns={GELISMIS_SUTUNLAR}
      visualStyle="bordered"
      columnHeaderFilters={{ category: 'konut', status: 'published' }}
      onColumnHeaderFilterChange={fn()}
    />
  ),
}

/**
 * Siralanmis sutun: Fiyat sutunu azalan sirada siralanmis, ok ikonu
 * primary renkte ve asagi yonu gosteriyor. Siralanabilir sutunlarin
 * hepsinde ChevronsUpDown (cift ok) ikonu gorunur.
 */
export const SortedColumn: Story = {
  render: (args) => (
    <DataTable<Listing>
      {...args}
      rows={allListingFixtures}
      columns={GELISMIS_SUTUNLAR}
      visualStyle="bordered"
      sort={{ columnId: 'price', direction: 'desc' }}
      onSortChange={fn()}
    />
  ),
}
