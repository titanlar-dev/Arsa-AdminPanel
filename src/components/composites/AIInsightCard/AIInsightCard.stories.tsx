import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { AIInsight, AIInsightCardProps, AIInsightFeedProps } from './AIInsightCard'
import { AIInsightCard, AIInsightFeed } from './AIInsightCard'

/* ================================================================
 * AIInsightCard Storyleri
 * ================================================================ */

const cardMeta: Meta<AIInsightCardProps> = {
  title: 'Composites/AIInsightCard',
  component: AIInsightCard,
  args: {
    onDismiss: fn(),
  },
}

export default cardMeta
type CardStory = StoryObj<AIInsightCardProps>

/* ---------- Anomaly ---------- */

export const AnomalyInsight: CardStory = {
  args: {
    type: 'anomaly',
    title: "Kadikoy'de fiyat anomalisi",
    description:
      "Son 24 saatte Kadikoy bolgesindeki konut ilanlarinda %340 fiyat artisi tespit edildi. Bu deger bolge ortalamasinin cok ustunde ve potansiyel bir veri manipulasyonuna isaret edebilir.",
    confidence: 'high',
    timestamp: '2dk once',
    isNew: false,
    actions: [
      { label: 'Incele', onClick: fn(), variant: 'primary' },
      { label: 'Yok say', onClick: fn(), variant: 'secondary' },
    ],
  },
}

/* ---------- Prediction ---------- */

export const PredictionInsight: CardStory = {
  args: {
    type: 'prediction',
    title: 'Ilan hacmi tahmini',
    description:
      'Yarin 45+ yeni ilan bekleniyor. Bu deger gecen hafta ortalamasinin %30 ustunde. Moderasyon ekibine ek kaynak ayrilmasi onerilir.',
    confidence: 'medium',
    timestamp: '15dk once',
    actions: [
      { label: 'Detay', onClick: fn(), variant: 'secondary' },
    ],
  },
}

/* ---------- Recommendation ---------- */

export const RecommendationInsight: CardStory = {
  args: {
    type: 'recommendation',
    title: 'Is dagitimini yeniden yapin',
    description:
      '3 moderator yeterli is yukunde degil. Gunluk ortalama islenen ilan sayisi ekip ortalamasinin %60 altinda. Is dagitimini dengelemek verimliligi artirabilir.',
    confidence: 'medium',
    timestamp: '1 saat once',
    actions: [
      { label: 'Incele', onClick: fn(), variant: 'primary' },
      { label: 'Yok say', onClick: fn(), variant: 'secondary' },
    ],
  },
}

/* ---------- Summary ---------- */

export const SummaryInsight: CardStory = {
  args: {
    type: 'summary',
    title: 'Gunluk ozet',
    description:
      'Bugun: 127 ilan onaylandi, 23 reddedildi, ortalama islem suresi 4.2dk. Onceki gune gore onay orani %3 artti.',
    confidence: 'high',
    timestamp: '5dk once',
  },
}

/* ---------- Risk ---------- */

export const RiskInsight: CardStory = {
  args: {
    type: 'risk',
    title: 'Bot aktivitesi suphesi',
    description:
      'Kullanici #4521 son 1 saatte 15 ilan ekledi. Bu hiz normal kullanici davranisinin cok ustunde ve otomatik icerik uretiminin gostergesi olabilir.',
    confidence: 'high',
    timestamp: '30sn once',
    isNew: true,
    actions: [
      { label: 'Incele', onClick: fn(), variant: 'danger' },
      { label: 'Yok say', onClick: fn(), variant: 'secondary' },
    ],
  },
}

/* ---------- New Insight Pulse ---------- */

export const NewInsightPulse: CardStory = {
  args: {
    type: 'anomaly',
    title: 'Yeni tespit edilen anomali',
    description:
      'Besiktas bolgesinde son 2 saatte 8 ilanda ayni telefon numarasi kullanildi. Kopya ilan riski yuksek.',
    confidence: 'high',
    timestamp: 'az once',
    isNew: true,
    actions: [
      { label: 'Incele', onClick: fn(), variant: 'primary' },
    ],
  },
}

/* ---------- Insight with Metric ---------- */

export const InsightWithMetric: CardStory = {
  args: {
    type: 'prediction',
    title: 'Haftalik ilan hacmi tahmini',
    description:
      'Onumuzdeki hafta beklenen toplam ilan sayisi, gecen haftanin %18 ustunde.',
    confidence: 'medium',
    metric: {
      value: '312',
      label: 'Beklenen ilan sayisi',
      trend: 'up',
    },
    timestamp: '10dk once',
    actions: [
      { label: 'Detay', onClick: fn(), variant: 'secondary' },
    ],
  },
}

/* ================================================================
 * AIInsightFeed Storyleri
 * ================================================================ */

const MOCK_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    type: 'risk',
    title: 'Bot aktivitesi suphesi',
    description: 'Kullanici #4521 son 1 saatte 15 ilan ekledi — bot aktivitesi olabilir.',
    confidence: 'high',
    timestamp: '30sn once',
    isNew: true,
    actions: [
      { label: 'Incele', onClick: fn(), variant: 'danger' },
      { label: 'Yok say', onClick: fn() },
    ],
  },
  {
    id: '2',
    type: 'anomaly',
    title: "Kadikoy'de fiyat anomalisi",
    description: "Son 24 saatte %340 fiyat artisi tespit edildi.",
    confidence: 'high',
    timestamp: '2dk once',
    isNew: true,
    actions: [
      { label: 'Incele', onClick: fn(), variant: 'primary' },
    ],
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Is dagitimini yeniden yapin',
    description: '3 moderator yeterli is yukunde degil, is dagitimini yeniden yapin.',
    confidence: 'medium',
    timestamp: '1 saat once',
    actions: [
      { label: 'Incele', onClick: fn(), variant: 'primary' },
      { label: 'Yok say', onClick: fn() },
    ],
  },
  {
    id: '4',
    type: 'prediction',
    title: 'Ilan hacmi tahmini',
    description: 'Yarin 45+ yeni ilan bekleniyor (gecen hafta ortalamasinin %30 ustu).',
    confidence: 'medium',
    timestamp: '15dk once',
    metric: {
      value: '45+',
      label: 'Beklenen ilan',
      trend: 'up',
    },
  },
  {
    id: '5',
    type: 'summary',
    title: 'Gunluk ozet',
    description: 'Bugun: 127 ilan onaylandi, 23 reddedildi, ort. islem suresi 4.2dk.',
    confidence: 'high',
    timestamp: '5dk once',
  },
]

/** Feed meta'si ayri bir nesne; default export zaten card icin kullanildi. */
const feedDecorator = (Story: React.ComponentType) => (
  <div style={{ maxWidth: '600px' }}>
    <Story />
  </div>
)

export const InsightFeed: StoryObj<AIInsightFeedProps> = {
  render: (args) => <AIInsightFeed {...args} />,
  decorators: [feedDecorator],
  args: {
    insights: MOCK_INSIGHTS,
    onDismiss: fn(),
    onAction: fn(),
    loading: false,
  },
}

export const LoadingFeed: StoryObj<AIInsightFeedProps> = {
  render: (args) => <AIInsightFeed {...args} />,
  decorators: [feedDecorator],
  args: {
    insights: [],
    onDismiss: fn(),
    onAction: fn(),
    loading: true,
  },
}

export const EmptyFeed: StoryObj<AIInsightFeedProps> = {
  render: (args) => <AIInsightFeed {...args} />,
  decorators: [feedDecorator],
  args: {
    insights: [],
    onDismiss: fn(),
    onAction: fn(),
    loading: false,
  },
}
