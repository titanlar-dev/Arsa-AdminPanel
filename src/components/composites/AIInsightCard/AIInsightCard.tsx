import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Lightbulb,
  Minus,
  Shield,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'
import { Badge } from '../../primitives/Badge'
import * as css from './AIInsightCard.css'

/* ---------- Tipler ---------- */

export type InsightType = 'anomaly' | 'prediction' | 'recommendation' | 'summary' | 'risk'
export type Confidence = 'high' | 'medium' | 'low'

export interface InsightMetric {
  value: string
  label: string
  trend?: 'up' | 'down' | 'flat'
}

export interface InsightAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

export interface AIInsightCardProps {
  type: InsightType
  title: string
  description: string
  confidence: Confidence
  metric?: InsightMetric
  actions?: InsightAction[]
  timestamp: string
  onDismiss?: () => void
  isNew?: boolean
}

export interface AIInsight extends AIInsightCardProps {
  id: string
}

export interface AIInsightFeedProps {
  insights: AIInsight[]
  onDismiss: (id: string) => void
  onAction: (insightId: string, actionId: string) => void
  loading?: boolean
}

/* ---------- Sabitler ---------- */

const TYPE_ICON = {
  anomaly: AlertTriangle,
  prediction: TrendingUp,
  recommendation: Lightbulb,
  summary: BarChart3,
  risk: Shield,
} as const

const CONFIDENCE_LABEL = {
  high: 'Yuksek guven',
  medium: 'Orta guven',
  low: 'Dusuk guven',
} as const

/**
 * Feed'de oncelik sirasi: risk en ust, summary en alt.
 * Dusuk sayi = yuksek oncelik.
 */
const TYPE_PRIORITY: Record<InsightType, number> = {
  risk: 0,
  anomaly: 1,
  recommendation: 2,
  prediction: 3,
  summary: 4,
}

/* ---------- Trend ikonu ---------- */

function TrendIcon({ direction }: { direction: 'up' | 'down' | 'flat' }) {
  if (direction === 'up') return <ArrowUp size={14} aria-hidden="true" />
  if (direction === 'down') return <ArrowDown size={14} aria-hidden="true" />
  return <Minus size={14} aria-hidden="true" />
}

/* ---------- AIInsightCard ---------- */

/**
 * Yapay zeka tarafindan uretilmis bir oneriyi goruntuleyen kart.
 *
 * Salt UI bilesenidir — yapay zeka hesaplamasi yapmaz, prop olarak gelen
 * onceden hesaplanmis veriler render edilir.
 *
 * Bes tur desteklenir: anomali tespiti, tahmin, oneri, ozet, risk uyarisi.
 * Her tur kendine ozgu ikon ve sol kenar rengiyle gorsel olarak ayrisir.
 *
 * `isNew` prop'u yeni gelen onerilerde dikkat cekici bir nabiz animasyonu
 * baslatir; hareket azaltma tercihi olan kullanicilar icin animasyon devre
 * disi birakılir.
 *
 * @example
 * <AIInsightCard
 *   type="anomaly"
 *   title="Kadikoy'de fiyat anomalisi"
 *   description="Son 24 saatte %340 fiyat artisi tespit edildi."
 *   confidence="high"
 *   timestamp="2dk once"
 *   onDismiss={() => console.log('dismissed')}
 * />
 */
export function AIInsightCard({
  type,
  title,
  description,
  confidence,
  metric,
  actions,
  timestamp,
  onDismiss,
  isNew = false,
}: AIInsightCardProps) {
  const Icon = TYPE_ICON[type]

  return (
    <article className={css.card({ type, isNew })} data-insight-type={type}>
      {/* Ust satir: AI rozeti + guven + kapat */}
      <div className={css.topRow}>
        <span className={css.aiBadge} aria-hidden="true">
          <Sparkles size={14} />
          Arsam AI
        </span>

        <span className={css.confidenceBadge({ confidence })}>
          {CONFIDENCE_LABEL[confidence]}
        </span>

        <span className={css.topRowSpacer} />

        {onDismiss !== undefined ? (
          <button
            type="button"
            className={css.dismissButton}
            onClick={onDismiss}
            aria-label="Oneriyi kapat"
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {/* Baslik */}
      <div className={css.title}>
        <span className={css.typeIcon} aria-hidden="true">
          <Icon size={18} />
        </span>
        {title}
      </div>

      {/* Aciklama */}
      <p className={css.description}>{description}</p>

      {/* Metrik vurgusu */}
      {metric !== undefined ? (
        <div className={css.metricBlock}>
          <span className={css.metricValue}>{metric.value}</span>
          <div className={css.metricMeta}>
            <span className={css.metricLabel}>{metric.label}</span>
            {metric.trend !== undefined ? (
              <span className={css.metricTrend({ direction: metric.trend })}>
                <TrendIcon direction={metric.trend} />
                {metric.trend === 'up' ? 'Yukselis' : metric.trend === 'down' ? 'Dusus' : 'Sabit'}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Aksiyon butonlari */}
      {actions !== undefined && actions.length > 0 ? (
        <div className={css.actionsRow}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={css.actionButton({ variant: action.variant ?? 'secondary' })}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Zaman damgasi */}
      <span className={css.timestamp}>{timestamp}</span>
    </article>
  )
}

/* ---------- Skeleton kart ---------- */

function SkeletonInsightCard() {
  return (
    <div className={css.skeletonCard} aria-hidden="true">
      <div className={css.skeletonRow}>
        <span className={css.skeletonBlock({ size: 'badge' })} />
        <span className={css.skeletonBlock({ size: 'badge' })} />
      </div>
      <span className={css.skeletonBlock({ size: 'lg' })} />
      <span className={css.skeletonBlock({ size: 'md' })} />
      <span className={css.skeletonBlock({ size: 'sm' })} />
    </div>
  )
}

/* ---------- AIInsightFeed ---------- */

/**
 * AI onerilerinin dikey listesi. Onerileri oncelik sirasina gore siralar:
 * risk > anomaly > recommendation > prediction > summary.
 *
 * Uc durum desteklenir: yuklenme (skeleton kartlar), bos (bilgilendirme
 * mesaji) ve dolu (siralı oneriler).
 *
 * @example
 * <AIInsightFeed
 *   insights={insightListesi}
 *   onDismiss={(id) => sil(id)}
 *   onAction={(insightId, actionId) => isle(insightId, actionId)}
 * />
 */
export function AIInsightFeed({
  insights,
  onDismiss,
  onAction,
  loading = false,
}: AIInsightFeedProps) {
  const sorted = [...insights].sort(
    (a, b) => TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type],
  )

  const newCount = insights.filter((i) => i.isNew).length

  return (
    <section className={css.feedRoot} aria-label="Arsam AI Onerileri">
      {/* Baslik */}
      <div className={css.feedHeader}>
        <span className={css.feedTitle}>
          <Sparkles size={20} aria-hidden="true" />
          Arsam AI Onerileri
        </span>

        {newCount > 0 ? (
          <Badge tone="primary" variant="soft" size="sm">
            {newCount} yeni oneri
          </Badge>
        ) : null}

        <span className={css.feedHeaderSpacer} />

        {insights.length > 0 ? (
          <button
            type="button"
            className={css.feedClearButton}
            onClick={() => {
              for (const insight of insights) {
                onDismiss(insight.id)
              }
            }}
          >
            Tumunu temizle
          </button>
        ) : null}
      </div>

      {/* Icerik */}
      {loading ? (
        <div className={css.feedList} aria-busy="true">
          <SkeletonInsightCard />
          <SkeletonInsightCard />
          <SkeletonInsightCard />
        </div>
      ) : sorted.length === 0 ? (
        <div className={css.feedEmpty}>
          <Sparkles size={32} aria-hidden="true" />
          <p>Simdilik yeni oneri yok. Arsam AI veriyi analiz ediyor...</p>
        </div>
      ) : (
        <div className={css.feedList}>
          {sorted.map((insight) => {
            const mappedActions = insight.actions?.map((action) => ({
              ...action,
              onClick: () => onAction(insight.id, action.label),
            }))
            return (
            <AIInsightCard
              key={insight.id}
              type={insight.type}
              title={insight.title}
              description={insight.description}
              confidence={insight.confidence}
              {...(insight.metric !== undefined ? { metric: insight.metric } : {})}
              {...(mappedActions !== undefined ? { actions: mappedActions } : {})}
              timestamp={insight.timestamp}
              onDismiss={() => onDismiss(insight.id)}
              {...(insight.isNew !== undefined ? { isNew: insight.isNew } : {})}
            />
            )
          })}
        </div>
      )}
    </section>
  )
}
