import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import type {
  ImportResult,
  ImportRow,
  ParsedFile,
  ValidationRow,
} from './BulkImportPage'
import { BulkImportPage } from './BulkImportPage'
import type { SelectOption } from '../../types/component-props'

/* -- Fixture'lar ------------------------------------------------------------ */

const KATEGORILER: SelectOption[] = [
  { value: 'konut', label: 'Konut' },
  { value: 'isyeri', label: 'Isyeri' },
  { value: 'arsa', label: 'Arsa' },
]

const ILLER: SelectOption[] = [
  { value: '34', label: 'Istanbul' },
  { value: '06', label: 'Ankara' },
  { value: '35', label: 'Izmir' },
]

/** Gecerli satir: tum zorunlu alanlar dolu ve dogru. */
function gecerliSatir(index: number): ValidationRow {
  return {
    rowIndex: index,
    values: {
      title: `Ornek Ilan ${index}`,
      price: `${250_000 + index * 50_000}`,
      category: 'Konut',
      city: 'Istanbul',
      district: 'Kadikoy',
      description: `Guzel bir daire, ${index}. kat`,
      area: `${80 + index * 10}`,
      rooms: `${2 + (index % 3)}`,
    },
    errors: {},
    warnings: {},
  }
}

/** Hatali satir: fiyat bos, kategori gecersiz. */
function hataliSatir(index: number): ValidationRow {
  return {
    rowIndex: index,
    values: {
      title: `Eksik Ilan ${index}`,
      price: '',
      category: 'GecersizKategori',
      city: 'Istanbul',
      district: '',
      description: '',
      area: '0',
      rooms: '-1',
    },
    errors: {
      fiyat: 'Fiyat bos olamaz',
      kategori: 'Gecersiz kategori',
      ilce: 'Ilce bos olamaz',
      aciklama: 'Aciklama bos olamaz',
    },
    warnings: {},
  }
}

/** Uyarili satir: gecerli ama metrekare 0. */
function uyariliSatir(index: number): ValidationRow {
  return {
    rowIndex: index,
    values: {
      title: `Uyarili Ilan ${index}`,
      price: '500000',
      category: 'Konut',
      city: 'Ankara',
      district: 'Cankaya',
      description: 'Genis bir arsa',
      area: '0',
      rooms: '3',
    },
    errors: {},
    warnings: {
      metrekare: 'MetreKare 0 olarak girilmis',
    },
  }
}

const SUTUNLAR = [
  { name: 'title', sampleValues: ['Guzel Daire', 'Genis Villa'] },
  { name: 'price', sampleValues: ['250000', '1500000'] },
  { name: 'category', sampleValues: ['Konut', 'Isyeri'] },
  { name: 'city', sampleValues: ['Istanbul', 'Ankara'] },
  { name: 'district', sampleValues: ['Kadikoy', 'Cankaya'] },
  { name: 'description', sampleValues: ['Guzel bir daire', 'Genis arsa'] },
  { name: 'area', sampleValues: ['120', '85'] },
  { name: 'rooms', sampleValues: ['3', '4'] },
]

const PARSED_FILE: ParsedFile = {
  fileName: 'ilanlar_2026.csv',
  fileSize: 245_760,
  rowCount: 150,
  columns: SUTUNLAR,
  previewRows: [
    gecerliSatir(1),
    gecerliSatir(2),
    gecerliSatir(3),
    hataliSatir(4),
    hataliSatir(5),
    uyariliSatir(6),
    gecerliSatir(7),
    gecerliSatir(8),
    gecerliSatir(9),
    gecerliSatir(10),
  ],
}

/** Tum satirlar gecerli olan dosya. */
const PARSED_FILE_ALL_VALID: ParsedFile = {
  ...PARSED_FILE,
  previewRows: Array.from({ length: 10 }, (_, i) => gecerliSatir(i + 1)),
}

/** Basarili icerik aktarimi sonucu. */
const BASARILI_SONUC: ImportResult = {
  totalRows: 8,
  successCount: 7,
  errorCount: 1,
  results: [
    { rowIndex: 1, status: 'success' },
    { rowIndex: 2, status: 'success' },
    { rowIndex: 3, status: 'success' },
    { rowIndex: 4, status: 'error', errorMessage: 'Gecersiz fiyat formati' },
    { rowIndex: 5, status: 'success' },
    { rowIndex: 6, status: 'success' },
    { rowIndex: 7, status: 'success' },
    { rowIndex: 8, status: 'success' },
  ],
}

/* -- Sahte import fonksiyonu ------------------------------------------------ */

/** Aninda basarili sonuc doner. */
const anindaBasarili = async (_rows: ImportRow[]): Promise<ImportResult> => BASARILI_SONUC

/** Hic donmeyen promise — surekli yukleme durumu gostermek icin. */
const hicDonmez = (_rows: ImportRow[]): Promise<ImportResult> => new Promise(() => {})

/* -- Meta ------------------------------------------------------------------- */

const meta = {
  title: 'Screens/BulkImportPage',
  component: BulkImportPage,

  tags: ['stable'],

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Toplu ilan icerik aktarimi sihirbazi. Dort adimli sunum component\'i: dosya ' +
          'yukleme, kolon eslestirme, onizleme ve icerik aktarimi. CSV/Excel ayristirma ' +
          '**uygulanmaz** — disaridan `parsedFile` prop\'uyla gelir.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'screen',
      useWhen: ['CSV veya Excel dosyasindan toplu ilan aktarimi yapilacaksa'],
      doNotUseWhen: [
        'Tek bir ilan olusturulacaksa',
        'Ilanlarin teker teker duzenlenmesi gerekiyorsa',
      ],
    },
  },

  args: {
    onImport: fn(anindaBasarili),
    onCancel: fn(),
    categories: KATEGORILER,
    cities: ILLER,
  },

  argTypes: {
    parsedFile: { control: false },
    onImport: { control: false },
    onCancel: { control: false },
    categories: { control: false },
    cities: { control: false },
  },
} satisfies Meta<typeof BulkImportPage>

export default meta

type Story = StoryObj<typeof meta>

/* -- Story'ler -------------------------------------------------------------- */

/**
 * Bos durum: dosya henuz secilmedi. Surukle-birak alani ve dosya secme butonu
 * gorunur.
 */
export const EmptyState: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('CSV veya Excel dosyasini surukleyip birakin')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Dosya sec' })).toBeInTheDocument()
    await expect(canvas.getByText('Dosya Yukle')).toBeInTheDocument()
  },
}

/**
 * Dosya secilmis: ayristirilmis dosya bilgisi gorunuyor, "Devam et" butonu aktif.
 * Tiklaninca kolon eslestirme adimina gecer.
 */
export const FileSelected: Story = {
  args: {
    parsedFile: PARSED_FILE,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('ilanlar_2026.csv')).toBeInTheDocument()
    await expect(canvas.getByText(/150 satir/)).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Devam et' })).toBeInTheDocument()
  },
}

/**
 * Kolon eslestirme adimi: CSV kolonlari sol tarafta, sistem alanlari sag tarafta
 * Select ile eslestiriliyor. Otomatik eslestirme uygulanmis durumda.
 *
 * Bu story component'i dogrudan 1. adimda gosterir: `parsedFile` verilip
 * component icindeki `useEffect` yerine harici kontrol ile baslatilir.
 */
export const ColumnMapping: Story = {
  args: {
    parsedFile: PARSED_FILE,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // "Devam et" ile eslestirme adimina gec
    await (await canvas.findByRole('button', { name: 'Devam et' })).click()

    // Eslestirme adimindan gelen Select'ler gorunur
    await expect(canvas.getByText('title')).toBeInTheDocument()
    await expect(canvas.getByText('price')).toBeInTheDocument()

    // Otomatik eslestirme uygulanmis: eslestirme tamamlandi uyarisi gorunur
    await expect(canvas.getByText('Eslestirme tamamlandi')).toBeInTheDocument()
  },
}

/**
 * Dogrulama onizlemesi: eslenmis verinin ilk 20 satiri tablo halinde gosterilir.
 * Hatali hucreler kirmizi, uyarili hucreler sari arkaplanla vurgulanir.
 * Ozet: gecerli, hatali ve uyarili satir sayilari.
 */
export const ValidationPreview: Story = {
  args: {
    parsedFile: PARSED_FILE,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Dosya seciminden eslestirmeye, eslestirmeden onizlemeye gec
    await (await canvas.findByRole('button', { name: 'Devam et' })).click()
    await (await canvas.findByRole('button', { name: 'Devam et' })).click()

    // Dogrulama ozeti gorunur
    await expect(canvas.getByText('satir gecerli')).toBeInTheDocument()
    await expect(canvas.getByText('satir hatali')).toBeInTheDocument()
    await expect(canvas.getByText('satir uyari')).toBeInTheDocument()

    // Icerik aktarimi butonu satir sayisini gosterir
    const importBtn = canvas.getByRole('button', { name: /Icerik aktarimini baslat/ })
    await expect(importBtn).toBeInTheDocument()
  },
}

/**
 * Icerik aktarimi devam ediyor: ilerleme cubugu ve Spinner gorunur.
 * `onImport` hic donmuyor, boylece yukleme durumu surekli gorunur.
 */
export const ImportInProgress: Story = {
  args: {
    parsedFile: PARSED_FILE_ALL_VALID,
    onImport: fn(hicDonmez),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 3 adimi atlayarak icerik aktarimini baslat
    await (await canvas.findByRole('button', { name: 'Devam et' })).click()
    await (await canvas.findByRole('button', { name: 'Devam et' })).click()
    await (await canvas.findByRole('button', { name: /Icerik aktarimini baslat/ })).click()

    // Ilerleme gorunur
    await expect(canvas.getByText(/Icerik aktarimi devam ediyor/)).toBeInTheDocument()
  },
}

/**
 * Icerik aktarimi tamamlandi: basari mesaji, satir bazinda sonuclar ve
 * "Sonuclari indir" / "Ilan listesine don" butonlari gorunur.
 */
export const ImportComplete: Story = {
  args: {
    parsedFile: PARSED_FILE_ALL_VALID,
    onImport: fn(anindaBasarili),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 3 adimi atlayarak icerik aktarimini baslat
    await (await canvas.findByRole('button', { name: 'Devam et' })).click()
    await (await canvas.findByRole('button', { name: 'Devam et' })).click()
    await (await canvas.findByRole('button', { name: /Icerik aktarimini baslat/ })).click()

    // Basari mesaji gorunur
    await expect(
      await canvas.findByText('Icerik aktarimi tamamlandi', {}, { timeout: 5000 }),
    ).toBeInTheDocument()
    await expect(canvas.getByText(/7 ilan basariyla aktarildi/)).toBeInTheDocument()
    await expect(canvas.getByText(/1 ilan hata ile atlandi/)).toBeInTheDocument()

    // Eylem butonlari gorunur
    await expect(canvas.getByRole('button', { name: 'Sonuclari indir' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Ilan listesine don' })).toBeInTheDocument()
  },
}
