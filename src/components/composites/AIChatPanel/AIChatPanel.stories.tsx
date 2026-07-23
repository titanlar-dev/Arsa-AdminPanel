import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { ChatMessage } from './AIChatPanel'
import { AIChatPanel } from './AIChatPanel'

/* ── Yardimci: sabit timestamp'ler (goreceli zamani tutarli gostermek icin) ── */

const now = new Date()
const mins = (n: number) => new Date(now.getTime() - n * 60_000).toISOString()

/* ── Mock veri ── */

const QUICK_ACTIONS = [
  { label: 'Bekleyen ilanlari ozetle', prompt: 'Bekleyen ilanlari ozetle' },
  { label: 'Bugunun istatistikleri', prompt: 'Bugunun istatistikleri' },
  { label: 'Risk analizi yap', prompt: 'Risk analizi yap' },
  { label: 'Son moderasyonlar', prompt: 'Son moderasyonlar' },
]

const EMPTY_MESSAGES: ChatMessage[] = []

const BASIC_CONVERSATION: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Bugun kac ilan onay bekliyor?',
    type: 'text',
    timestamp: mins(12),
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Bugun **47 ilan** onay bekliyor. Bunlarin dagilimi:\n- **Satilik**: 28 ilan\n- **Kiralik**: 15 ilan\n- **Gunluk Kiralik**: 4 ilan\n\nEn cok bekleme suresi olan ilan **3 gundur** kuyrukta.',
    type: 'text',
    timestamp: mins(12),
  },
  {
    id: '3',
    role: 'user',
    content: 'En uzun bekleyen 3 ilani goster',
    type: 'text',
    timestamp: mins(10),
  },
  {
    id: '4',
    role: 'assistant',
    content: 'En uzun suredir onay bekleyen ilanlar:',
    type: 'table',
    timestamp: mins(10),
    metadata: {
      tableData: {
        headers: ['Ilan No', 'Baslik', 'Bekleme', 'Kategori'],
        rows: [
          ['#45231', 'Besiktas 3+1 Deniz Manzarali', '3 gun', 'Satilik'],
          ['#45218', 'Kadikoy Stüdyo Daire', '2 gun', 'Kiralik'],
          ['#45225', 'Sisli Ofis Kati 250m2', '2 gun', 'Satilik'],
        ],
      },
    },
  },
  {
    id: '5',
    role: 'user',
    content: 'Besiktas ilaninin detayini goster',
    type: 'text',
    timestamp: mins(8),
  },
  {
    id: '6',
    role: 'assistant',
    content: 'Deniz manzarali, 3. kat, asansorlu bina. 2023 tadilat.',
    type: 'listing',
    timestamp: mins(8),
    metadata: {
      listingId: '45231',
      listingTitle: 'Besiktas 3+1 Deniz Manzarali Daire',
      listingPrice: '8.500.000 TL',
    },
  },
  {
    id: '7',
    role: 'assistant',
    content: 'Bu ilani onayla',
    type: 'action',
    timestamp: mins(8),
    metadata: {
      actionId: 'approve-45231',
    },
  },
  {
    id: '8',
    role: 'user',
    content: 'Bugunun genel istatistiklerini ver',
    type: 'text',
    timestamp: mins(5),
  },
  {
    id: '9',
    role: 'assistant',
    content: 'Toplam aktif ilan sayisi',
    type: 'insight',
    timestamp: mins(5),
    metadata: {
      icon: 'TrendingUp',
      value: '12,847',
      trend: '+3.2%',
    },
  },
  {
    id: '10',
    role: 'assistant',
    content: 'Bugun bir risk unsuru tespit ettim: **3 farkli hesaptan** ayni adres ve telefon numarasi ile ilan girilmis. Muhtemel coklu hesap ihlali.',
    type: 'text',
    timestamp: mins(3),
  },
  {
    id: '11',
    role: 'assistant',
    content: 'Supheli hesaplari incele',
    type: 'action',
    timestamp: mins(3),
    metadata: {
      actionId: 'investigate-multi-account',
    },
  },
]

const INSIGHT_MESSAGE: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Bugunun performans ozeti nedir?',
    type: 'text',
    timestamp: mins(3),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Gunluk aktif kullanici',
    type: 'insight',
    timestamp: mins(3),
    metadata: {
      icon: 'TrendingUp',
      value: '2,451',
      trend: '+12.4%',
    },
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Yeni ilan girisi',
    type: 'insight',
    timestamp: mins(3),
    metadata: {
      icon: 'BarChart3',
      value: '186',
      trend: '-5.1%',
    },
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Moderasyon kuyrugu',
    type: 'insight',
    timestamp: mins(3),
    metadata: {
      icon: 'AlertTriangle',
      value: '47',
      trend: '+22',
    },
  },
]

const ACTION_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Supheli ilanlar var mi?',
    type: 'text',
    timestamp: mins(5),
  },
  {
    id: '2',
    role: 'assistant',
    content:
      '**2 supheli ilan** tespit edildi. Her ikisi de dusuk kaliteli gorseller ve abartili fiyat iceriyor.\n\n- **#45289**: "Taksim Merkez 1+1" - 150.000 TL (piyasanin %70 altinda)\n- **#45301**: "Nisantasi 4+1 Dublex" - gorsel baska siteden alinmis',
    type: 'text',
    timestamp: mins(5),
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Ilan #45289\'u reddedip kullaniciya uyari gonder',
    type: 'action',
    timestamp: mins(5),
    metadata: { actionId: 'reject-warn-45289' },
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Ilan #45301\'i inceleme icin askiya al',
    type: 'action',
    timestamp: mins(5),
    metadata: { actionId: 'suspend-45301' },
  },
]

/* ── Meta ── */

const meta = {
  title: 'Composites/AIChatPanel',
  component: AIChatPanel,
  tags: ['stable'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Yonetici panelinin AI asistani: sag taraftan acilan veya kalici yan panel olarak gorunen ' +
          'sohbet arayuzu. Mesaj tipleri (metin, metrik, eylem, tablo, ilan karti), hizli eylem ' +
          'cip\'leri ve sayfa/varlik baglamini destekler. Tamamen prop-kontrollüdur, AI backend\'i icermez.',
      },
    },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    onSendMessage: fn(),
    mode: 'drawer',
    messages: EMPTY_MESSAGES,
    isTyping: false,
    quickActions: QUICK_ACTIONS,
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['drawer', 'docked'],
    },
    open: { control: 'boolean' },
    isTyping: { control: 'boolean' },
    hasUnread: { control: 'boolean' },
  },
} satisfies Meta<typeof AIChatPanel>

export default meta
type Story = StoryObj<typeof AIChatPanel>

/* ── Stories ── */

/** Bos sohbet: hic mesaj yok, hizli eylem cip'leri gorunur. */
export const Empty: Story = {
  args: {
    messages: [],
    quickActions: QUICK_ACTIONS,
  },
}

/** 10+ mesajli konusma: metin, tablo, ilan karti, eylem onerisi ve insight. */
export const Conversation: Story = {
  args: {
    messages: BASIC_CONVERSATION,
    quickActions: QUICK_ACTIONS,
  },
}

/** AI "dusunuyor" gostergesi: animasyonlu nokta satiri. */
export const AITyping: Story = {
  args: {
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Son 7 gunun moderasyon raporunu cikar',
        type: 'text' as const,
        timestamp: mins(1),
      },
    ],
    isTyping: true,
  },
}

/** Sayfa ve secili varlik baglamini gosteren context pill'leri. */
export const ContextAware: Story = {
  args: {
    messages: [
      {
        id: '1',
        role: 'assistant',
        content:
          'Su an **Dashboard** sayfasindasiniz ve **#12345** numarali ilani secmissiniz. Bu ilan hakkinda ne ogrenmek istersiniz?',
        type: 'text' as const,
        timestamp: mins(1),
      },
    ],
    currentPage: 'Dashboard',
    selectedEntity: { type: 'listing', id: '12345', title: 'Besiktas 3+1 Daire' },
    quickActions: [
      { label: 'Bu ilanin gecmisini goster', prompt: 'Ilan #12345 gecmisini goster' },
      { label: 'Benzer ilanlari bul', prompt: 'Ilan #12345 ile benzer ilanlari bul' },
      { label: 'Fiyat analizi', prompt: 'Ilan #12345 fiyat analizi yap' },
    ],
  },
}

/**
 * Kalici yan panel (docked) modu. Wrapper ile sayfanin geri kalaniyla
 * yan yana gosterilir.
 */
export const DockedMode: Story = {
  args: {
    messages: BASIC_CONVERSATION.slice(0, 4),
    mode: 'docked',
    quickActions: QUICK_ACTIONS,
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: '100vh', background: '#f8f9fa' }}>
        <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Dashboard</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Admin paneli icerik alani. AI asistani sag tarafta kalici olarak gorunur.
          </p>
          <div
            style={{
              marginTop: '1rem',
              padding: '2rem',
              background: '#fff',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <p style={{ margin: 0, color: '#9ca3af' }}>Icerik buraya gelir...</p>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
}

/** Hizli eylem cip'leri: yatay kaydirmali oneri satirlari. */
export const QuickActions: Story = {
  args: {
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Merhaba! Size nasil yardimci olabilirim? Asagidaki hizli eylemleri kullanabilir veya dogrudan soru sorabilirsiniz.',
        type: 'text' as const,
        timestamp: mins(0),
      },
    ],
    quickActions: [
      { label: 'Bekleyen ilanlari ozetle', prompt: 'Bekleyen ilanlari ozetle' },
      { label: 'Bugunun istatistikleri', prompt: 'Bugunun istatistikleri' },
      { label: 'Risk analizi yap', prompt: 'Risk analizi yap' },
      { label: 'Son moderasyonlar', prompt: 'Son moderasyonlar' },
      { label: 'Kullanici sikayet ozeti', prompt: 'Kullanici sikayet ozeti' },
      { label: 'Gunluk rapor olustur', prompt: 'Gunluk rapor olustur' },
    ],
  },
}

/** 320px mobil gorunumu: tam ekran panel. */
export const MobileFullScreen: Story = {
  args: {
    messages: BASIC_CONVERSATION.slice(0, 6),
    quickActions: QUICK_ACTIONS.slice(0, 3),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [320] },
  },
}

/** AI metrik insight karti: buyuk sayi, trend oku ve aciklama. */
export const InsightMessage: Story = {
  args: {
    messages: INSIGHT_MESSAGE,
  },
}

/** AI eylem onerisi: tiklanabilir kartlar. */
export const ActionSuggestion: Story = {
  args: {
    messages: ACTION_MESSAGES,
    quickActions: QUICK_ACTIONS.slice(0, 2),
  },
}

/** Panel kapali: yalnizca FAB gorunur (pulse animasyonlu). */
export const ClosedWithFAB: Story = {
  args: {
    open: false,
    messages: [],
    hasUnread: true,
  },
}
