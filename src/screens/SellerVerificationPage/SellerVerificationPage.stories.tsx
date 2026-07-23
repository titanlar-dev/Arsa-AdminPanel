import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { VerificationRequest } from '../../types/component-props'
import { SellerVerificationPage } from './SellerVerificationPage'

/* ────────────────────────────────────────────────────────────────────────────
   Placeholder gorseller — data:image SVG
   ──────────────────────────────────────────────────────────────────────────── */

const DOC_FRONT = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23e2e8f0' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'%3EBelge On Yuz%3C/text%3E%3C/svg%3E`
const DOC_BACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23e2e8f0' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'%3EBelge Arka Yuz%3C/text%3E%3C/svg%3E`
const DOC_LICENSE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23dbeafe' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%233b82f6'%3ERuhsat Belgesi%3C/text%3E%3C/svg%3E`

/* ────────────────────────────────────────────────────────────────────────────
   Fixture'lar
   ──────────────────────────────────────────────────────────────────────────── */

function basvuru(overrides: Partial<VerificationRequest> & { id: string }): VerificationRequest {
  return {
    seller: {
      id: `seller-${overrides.id}`,
      name: 'Ahmet Yilmaz',
      email: 'ahmet@example.com',
      phone: '+90 532 123 4567',
      type: 'bireysel',
      registeredAt: '2025-03-15T10:00:00+03:00',
      listingCount: 12,
      activeListingCount: 8,
      reportCount: 1,
    },
    documentType: 'kimlik',
    documentImages: [
      { url: DOC_FRONT, label: 'On yuz' },
      { url: DOC_BACK, label: 'Arka yuz' },
    ],
    documentNumber: 'TC12345678',
    status: 'beklemede',
    priority: 'normal',
    submittedAt: '2026-07-20T14:30:00+03:00',
    ...overrides,
  }
}

const BASVURULAR: VerificationRequest[] = [
  basvuru({
    id: 'v1',
    seller: {
      id: 'seller-v1',
      name: 'Ahmet Yilmaz',
      email: 'ahmet@example.com',
      phone: '+90 532 123 4567',
      type: 'bireysel',
      registeredAt: '2025-03-15T10:00:00+03:00',
      listingCount: 12,
      activeListingCount: 8,
      reportCount: 1,
    },
    documentType: 'kimlik',
    status: 'beklemede',
    priority: 'acil',
    submittedAt: '2026-07-22T09:00:00+03:00',
    documentNumber: 'TC98761234',
    history: [
      {
        date: '2026-07-20T10:00:00+03:00',
        action: 'Basvuru olusturuldu',
        actor: 'Sistem',
      },
      {
        date: '2026-07-21T14:00:00+03:00',
        action: 'Incelemeye alindi',
        actor: 'Moderator Elif',
        note: 'Kimlik gorseli net degil, tekrar istenecek.',
      },
    ],
  }),
  basvuru({
    id: 'v2',
    seller: {
      id: 'seller-v2',
      name: 'Marmara Emlak Ofisi A.S.',
      email: 'info@marmaraemlak.com',
      type: 'kurumsal',
      registeredAt: '2024-11-01T08:00:00+03:00',
      listingCount: 45,
      activeListingCount: 32,
      reportCount: 3,
    },
    documentType: 'ticaret_sicil',
    status: 'inceleniyor',
    priority: 'yuksek',
    submittedAt: '2026-07-21T11:00:00+03:00',
    documentNumber: 'TS456789',
    documentImages: [{ url: DOC_LICENSE, label: 'Ticaret Sicil Belgesi' }],
    assignedTo: 'admin-1',
  }),
  basvuru({
    id: 'v3',
    seller: {
      id: 'seller-v3',
      name: 'Fatma Kara',
      email: 'fatma.kara@example.com',
      phone: '+90 541 987 6543',
      type: 'bireysel',
      registeredAt: '2026-01-10T12:00:00+03:00',
      listingCount: 3,
      activeListingCount: 2,
      reportCount: 0,
    },
    documentType: 'ehliyet',
    status: 'beklemede',
    priority: 'normal',
    submittedAt: '2026-07-20T16:00:00+03:00',
    documentNumber: 'EH87654321',
  }),
  basvuru({
    id: 'v4',
    seller: {
      id: 'seller-v4',
      name: 'Karadeniz Insaat Ltd. Sti.',
      email: 'karadeniz@example.com',
      type: 'kurumsal',
      registeredAt: '2025-06-20T09:00:00+03:00',
      listingCount: 28,
      activeListingCount: 20,
      reportCount: 2,
    },
    documentType: 'isyeri_ruhsati',
    status: 'beklemede',
    priority: 'normal',
    submittedAt: '2026-07-19T10:00:00+03:00',
    documentImages: [{ url: DOC_LICENSE, label: 'Isyeri Ruhsati' }],
  }),
  basvuru({
    id: 'v5',
    seller: {
      id: 'seller-v5',
      name: 'Mehmet Ozturk',
      email: 'mehmet.o@example.com',
      type: 'bireysel',
      registeredAt: '2026-04-05T14:00:00+03:00',
      listingCount: 5,
      activeListingCount: 4,
      reportCount: 0,
    },
    documentType: 'kimlik',
    status: 'onaylandi',
    priority: 'normal',
    submittedAt: '2026-07-18T08:00:00+03:00',
    history: [
      { date: '2026-07-18T08:00:00+03:00', action: 'Basvuru olusturuldu', actor: 'Sistem' },
      { date: '2026-07-18T14:00:00+03:00', action: 'Onaylandi', actor: 'Moderator Ali' },
    ],
  }),
  basvuru({
    id: 'v6',
    seller: {
      id: 'seller-v6',
      name: 'Ayse Demir',
      email: 'ayse.demir@example.com',
      phone: '+90 555 111 2233',
      type: 'bireysel',
      registeredAt: '2026-02-28T11:00:00+03:00',
      listingCount: 7,
      activeListingCount: 5,
      reportCount: 0,
    },
    documentType: 'ehliyet',
    status: 'reddedildi',
    priority: 'normal',
    submittedAt: '2026-07-17T09:00:00+03:00',
    history: [
      { date: '2026-07-17T09:00:00+03:00', action: 'Basvuru olusturuldu', actor: 'Sistem' },
      { date: '2026-07-17T16:00:00+03:00', action: 'Reddedildi — Belge okunamiyor', actor: 'Moderator Elif' },
    ],
  }),
  basvuru({
    id: 'v7',
    seller: {
      id: 'seller-v7',
      name: 'Can Yildirim',
      email: 'can.y@example.com',
      type: 'bireysel',
      registeredAt: '2026-05-12T10:00:00+03:00',
      listingCount: 2,
      activeListingCount: 1,
      reportCount: 0,
    },
    documentType: 'kimlik',
    status: 'ek_belge_bekleniyor',
    priority: 'normal',
    submittedAt: '2026-07-16T13:00:00+03:00',
    history: [
      { date: '2026-07-16T13:00:00+03:00', action: 'Basvuru olusturuldu', actor: 'Sistem' },
      { date: '2026-07-17T10:00:00+03:00', action: 'Ek belge istendi', actor: 'Moderator Ali', note: 'Kimligin arka yuzu eksik.' },
    ],
  }),
  basvuru({
    id: 'v8',
    seller: {
      id: 'seller-v8',
      name: 'Selin Arslan',
      email: 'selin.a@example.com',
      phone: '+90 533 444 5566',
      type: 'bireysel',
      registeredAt: '2026-06-01T08:00:00+03:00',
      listingCount: 1,
      activeListingCount: 1,
      reportCount: 0,
    },
    documentType: 'kimlik',
    status: 'beklemede',
    priority: 'yuksek',
    submittedAt: '2026-07-23T07:00:00+03:00',
    documentNumber: 'TC11223344',
  }),
]

const ISTATISTIKLER = {
  pending: 4,
  approvedToday: 6,
  rejectedToday: 2,
  avgProcessingTime: 12,
}

/* ────────────────────────────────────────────────────────────────────────────
   Meta
   ──────────────────────────────────────────────────────────────────────────── */

const meta = {
  title: 'Screens/SellerVerificationPage',
  component: SellerVerificationPage,

  tags: ['stable'],

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Satici dogrulama ekrani: sol kuyruk + sag detay bolunmus gorunum. ' +
          'Saticilarin kimlik ve isyeri belge dogrulama basvurularini listeler. ' +
          'Admin basvurulari inceleyip onaylar, reddeder veya ek belge talep eder. ' +
          'Veri cekmez — prop\'lardan gelir.',
      },
    },
  },

  args: {
    requests: BASVURULAR,
    selectedRequestId: BASVURULAR[0]?.id ?? 'vr-1',
    onSelectRequest: fn(),
    onApprove: fn(),
    onReject: fn(),
    onRequestDocuments: fn(),
    onClaimRequest: fn(),
    stats: ISTATISTIKLER,
  },

  argTypes: {
    requests: { control: false },
    stats: { control: false },
    capabilities: { control: false },
  },
} satisfies Meta<typeof SellerVerificationPage>

export default meta
type Story = StoryObj<typeof meta>

/* ────────────────────────────────────────────────────────────────────────────
   Story'ler
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Varsayilan gorunum: 8 basvuru, ilki secili.
 *
 * Istatistik satirinin gorunur oldugu ve kuyrugun dolu oldugu olculuyor.
 */
export const Default: Story = {
  args: {
    selectedRequestId: 'v1',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /* Baslik gorunur. */
    await expect(
      canvas.getByRole('heading', { level: 2, name: /Satici Dogrulama/ }),
    ).toBeInTheDocument()

    /* Istatistik kartlari gorunur. */
    await expect(canvas.getByText('Bekleyen Basvuru')).toBeInTheDocument()
    await expect(canvas.getByText('Bugun Onaylanan')).toBeInTheDocument()

    /* Kuyrukta en az bir satir var. */
    await expect(canvas.getByText('Ahmet Yilmaz')).toBeInTheDocument()
  },
}

/**
 * Secili basvuru detayi gorunur: satici bilgileri, belge gorselleri,
 * dogrulama gecmisi ve eylem cubugu.
 */
export const RequestSelected: Story = {
  args: {
    selectedRequestId: 'v1',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /* Satici bilgileri gorunur. */
    await expect(canvas.getByText('ahmet@example.com')).toBeInTheDocument()

    /* Belge bilgileri gorunur. */
    await expect(canvas.getByText('Kimlik Karti')).toBeInTheDocument()
    await expect(canvas.getByText('****1234')).toBeInTheDocument()

    /* Eylem butonlari gorunur. */
    await expect(canvas.getByRole('button', { name: /Onayla/ })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Reddet/ })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: /Ek belge iste/ })).toBeInTheDocument()

    /* Dogrulama gecmisi gorunur. */
    await expect(canvas.getByText(/Basvuru olusturuldu/)).toBeInTheDocument()
    await expect(canvas.getByText(/Incelemeye alindi/)).toBeInTheDocument()
  },
}

/**
 * Belge gorseli buyutulmus: zoom modal acik.
 */
export const DocumentZoom: Story = {
  args: {
    selectedRequestId: 'v1',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /* Belge gorsellerinden ilkine tikla. */
    const gorseller = canvas.getAllByRole('button', { name: /yuz/ })
    await expect(gorseller.length).toBeGreaterThan(0)
    const firstGorsel = gorseller[0]
    if (firstGorsel === undefined) throw new Error('No document image found')
    await userEvent.click(firstGorsel)

    /* Zoom modal acildi. */
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toBeInTheDocument()
  },
}

/**
 * Red akisi: red modal'i acik, neden secici ve not alani gorunur.
 */
export const RejectionFlow: Story = {
  args: {
    selectedRequestId: 'v1',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /* Reddet butonuna tikla. */
    await userEvent.click(canvas.getByRole('button', { name: /Reddet/ }))

    /* Modal acildi. */
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveTextContent('Basvuruyu reddet')

    /* Red butonu neden secilmeden devre disi. */
    const redBtn = within(dialog).getByRole('button', { name: /^Reddet$/ })
    await expect(redBtn).toBeDisabled()
  },
}

/**
 * Bos kuyruk: hicbir dogrulama basvurusu yok.
 */
export const EmptyQueue: Story = {
  args: {
    requests: [],
    stats: { pending: 0, approvedToday: 0, rejectedToday: 0, avgProcessingTime: 0 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Basvuru bulunamadi')).toBeInTheDocument()
  },
}

/**
 * Ek belge bekleniyor durumundaki basvuru secili.
 */
export const AdditionalDocumentsRequested: Story = {
  args: {
    selectedRequestId: 'v7',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /* Uyari gorunur. */
    await expect(canvas.getByText('Ek belge bekleniyor')).toBeInTheDocument()

    /* Gecmiste "Ek belge istendi" kaydi gorunur. */
    await expect(canvas.getByText(/Ek belge istendi/)).toBeInTheDocument()
    await expect(canvas.getByText(/Kimligin arka yuzu eksik/)).toBeInTheDocument()
  },
}

/**
 * 320 piksel genislikte mobil gorunum.
 *
 * Secili basvuru varken kuyruk gizlenir (drill-down) ve
 * yatay tasma olmaz.
 */
export const MobileView: Story = {
  globals: { viewport: { value: 'mobile320' } },
  args: {
    selectedRequestId: 'v1',
  },
  play: async ({ canvasElement }) => {
    /* Yatay tasma olmamali. */
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth)

    /* Detay paneli gorunur. */
    const canvas = within(canvasElement)
    await expect(canvas.getByText('ahmet@example.com')).toBeInTheDocument()

    /* "Listeye don" butonu gorunur (mobilde geri butonu). */
    await expect(canvas.getByRole('button', { name: /Listeye don/ })).toBeInTheDocument()
  },
}
