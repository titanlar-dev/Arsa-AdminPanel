import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import {
  CheckCircle2,
  ClipboardList,
  FilePlus2,
  FileSpreadsheet,
  BarChart3,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { StatCard } from '../components/composites/StatCard'
import { AIInsightFeed, type AIInsight } from '../components/composites/AIInsightCard'
import { Badge } from '../components/primitives/Badge'
import {
  dashboardMetrics,
  dailyNewListings,
  dailyApprovals,
  dailyRejections,
  categoryDistribution,
  recentModerationEvents,
} from '../mocks/dashboard'
import { allMockAiInsights } from '../mocks/ai-insights'
import { LISTING_CATEGORY_LABEL } from '../domain/labels'
import { ModerationEventType } from '../types/domain'
import * as css from './DashboardPage.css'

/* ── Sabitler ────────────────────────────────────────────────────────────── */

/** Kategori grafigi icin renkler */
const CATEGORY_COLORS = [
  '#818cf8', // indigo
  '#34d399', // emerald
  '#f472b6', // pink
  '#fbbf24', // amber
  '#38bdf8', // sky
  '#a78bfa', // violet
]

/** Son 7 gunluk sparkline degerleri uretir. */
function last7(data: { value: number }[]): number[] {
  return data.slice(-7).map((d) => d.value)
}

/** Saat dilimine gore selamlama. */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6) return 'Iyi geceler'
  if (hour < 12) return 'Gunaydin'
  if (hour < 18) return 'Iyi gunler'
  return 'Iyi aksamlar'
}

/** Mevcut tarih/saati formatlar. */
function formatCurrentDateTime(): string {
  return new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

/** ModerationEventType icin Turkce etiketler. */
const EVENT_TYPE_LABEL: Record<string, string> = {
  [ModerationEventType.Approved]: 'Onaylandi',
  [ModerationEventType.Rejected]: 'Reddedildi',
  [ModerationEventType.Assigned]: 'Atandi',
  [ModerationEventType.Paused]: 'Durduruldu',
  [ModerationEventType.Created]: 'Olusturuldu',
  [ModerationEventType.Submitted]: 'Gonderildi',
  [ModerationEventType.ChangesRequested]: 'Degisiklik istendi',
  [ModerationEventType.Withdrawn]: 'Geri cekildi',
  [ModerationEventType.Edited]: 'Duzenlendi',
  [ModerationEventType.Resumed]: 'Devam ettirildi',
  [ModerationEventType.Expired]: 'Suresi doldu',
  [ModerationEventType.Archived]: 'Arsivlendi',
  [ModerationEventType.Restored]: 'Geri yuklendi',
  [ModerationEventType.NoteAdded]: 'Not eklendi',
  [ModerationEventType.ReportLinked]: 'Rapor baglandi',
}

/** ModerationEventType icin timeline nokta CSS sinifi. */
function dotClass(eventType: ModerationEventType): string {
  switch (eventType) {
    case ModerationEventType.Approved:
      return css.timelineDotApproved
    case ModerationEventType.Rejected:
      return css.timelineDotRejected
    case ModerationEventType.Assigned:
      return css.timelineDotAssigned
    case ModerationEventType.Paused:
      return css.timelineDotPaused
    default:
      return css.timelineDotDefault
  }
}

/** Mock AI Insight verisini AIInsightFeed'in beklediği formata donusturur. */
function mapMockInsightsToFeedFormat(
  mockInsights: typeof allMockAiInsights,
): AIInsight[] {
  return mockInsights.slice(0, 4).map((insight) => ({
    id: insight.id,
    type: insight.type,
    title: insight.title,
    description: insight.description,
    confidence:
      insight.confidence >= 0.85
        ? 'high'
        : insight.confidence >= 0.65
          ? 'medium'
          : 'low',
    timestamp: new Intl.DateTimeFormat('tr-TR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(insight.createdAt)),
    isNew: insight.severity === 'critical',
    ...(insight.suggestedAction !== undefined
      ? {
          actions: [
            {
              label: insight.suggestedAction,
              onClick: () => {},
              variant: insight.severity === 'critical' ? 'danger' as const : 'primary' as const,
            },
          ],
        }
      : {}),
  }))
}

/* ── Grafik veri hazirlama ───────────────────────────────────────────────── */

/** AreaChart icin gunluk aktivite verisi. */
function buildActivityData() {
  return dailyNewListings.map((point, i) => ({
    date: point.date.slice(5), // "07-23" formatina dusur
    yeniIlan: point.value,
    onay: dailyApprovals[i]?.value ?? 0,
    red: dailyRejections[i]?.value ?? 0,
  }))
}

/** PieChart icin kategori verisi. */
function buildCategoryData() {
  return categoryDistribution.map((item) => ({
    name: LISTING_CATEGORY_LABEL[item.category] ?? item.category,
    value: item.count,
  }))
}

/* ── Sayfa ───────────────────────────────────────────────────────────────── */

export function DashboardPage() {
  const navigate = useNavigate()
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(
    () => new Set(),
  )

  const feedInsights = useMemo(() => {
    const mapped = mapMockInsightsToFeedFormat(allMockAiInsights)
    return mapped.filter((i) => !dismissedInsights.has(i.id))
  }, [dismissedInsights])

  const activityData = useMemo(() => buildActivityData(), [])
  const categoryData = useMemo(() => buildCategoryData(), [])

  const rejectionRate = (dashboardMetrics.rejectionRate * 100).toFixed(1)

  return (
    <div className={css.root}>
      {/* ── 1. Hero Section ───────────────────────────────────────── */}
      <section className={css.hero}>
        <h1 className={css.greeting}>
          {getGreeting()}, Elif
        </h1>
        <p className={css.subtitle}>
          Arsam.net yonetim paneline hos geldiniz
        </p>
        <span className={css.dateTime}>{formatCurrentDateTime()}</span>
        <div className={css.quickStats}>
          <span>127 aktif ilan</span>
          <span className={css.quickStatDot} aria-hidden="true" />
          <span>12 onay bekliyor</span>
          <span className={css.quickStatDot} aria-hidden="true" />
          <span>3 sikayet</span>
        </div>
      </section>

      {/* ── 2. AI Insights Feed ───────────────────────────────────── */}
      <div className={css.insightsFeedWrapper}>
        <AIInsightFeed
          insights={feedInsights}
          onDismiss={(id) => {
            setDismissedInsights((prev) => {
              const next = new Set(prev)
              next.add(id)
              return next
            })
          }}
          onAction={(insightId, actionLabel) => {
            console.log(`AI action: ${insightId} -> ${actionLabel}`)
          }}
        />
      </div>

      {/* ── 3. KPI Metrics Grid ───────────────────────────────────── */}
      <section aria-label="Temel metrikler">
        <div className={css.kpiGrid}>
          <div className={css.kpiCard}>
            <StatCard
              label="Aktif Ilanlar"
              value={dashboardMetrics.publishedListingCount}
              description="Yayinda olan toplam"
              variant="trend"
              trend={{ direction: 'up', value: '+%4,2', sentiment: 'positive' }}
              sparklineData={last7(dailyNewListings)}
              icon={<FilePlus2 size={20} />}
            />
          </div>
          <div className={css.kpiCard}>
            <StatCard
              label="Bekleyen Onay"
              value={dashboardMetrics.pendingReviewCount}
              description="Inceleme kuyrugunda"
              variant="trend"
              trend={{ direction: 'up', value: '+5', sentiment: 'negative' }}
              sparklineData={[28, 32, 30, 35, 33, 36, 37]}
              icon={<ClipboardList size={20} />}
            />
          </div>
          <div className={css.kpiCard}>
            <StatCard
              label="Bugun Onaylanan"
              value={dashboardMetrics.newListingCountToday}
              description="Bugunun islemi"
              variant="trend"
              trend={{ direction: 'up', value: '+%8', sentiment: 'positive' }}
              sparklineData={last7(dailyApprovals)}
              icon={<CheckCircle2 size={20} />}
            />
          </div>
          <div className={css.kpiCard}>
            <StatCard
              label="Red Orani"
              value={`%${rejectionRate}`}
              description="Son 30 gun"
              variant="trend"
              trend={{ direction: 'down', value: '-%1,2', sentiment: 'positive' }}
              sparklineData={[16.5, 15.8, 16.2, 15.1, 14.9, 15.3, 14.8]}
              icon={<BarChart3 size={20} />}
            />
          </div>
        </div>
      </section>

      {/* ── 4. Charts Section ─────────────────────────────────────── */}
      <section aria-label="Grafikler">
        <div className={css.chartsGrid}>
          {/* Ilan Aktivitesi - Area Chart */}
          <div className={css.chartGlass}>
            <p className={css.chartTitle}>Ilan Aktivitesi (Son 30 Gun)</p>
            <div className={css.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="gradYeni" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradOnay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="date"
                    stroke="#475569"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                      fontSize: '13px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="yeniIlan"
                    name="Yeni Ilan"
                    stroke="#818cf8"
                    fill="url(#gradYeni)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="onay"
                    name="Onay"
                    stroke="#34d399"
                    fill="url(#gradOnay)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="red"
                    name="Red"
                    stroke="#f87171"
                    fill="url(#gradRed)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Kategori Dagilimi - Donut Chart */}
          <div className={css.chartGlass}>
            <p className={css.chartTitle}>Kategori Dagilimi</p>
            <div className={css.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length] ?? '#8884d8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                      fontSize: '13px',
                    }}
                    formatter={(value: unknown) => [
                      Number(value).toLocaleString('tr-TR'),
                      'Ilan',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Quick Actions Grid ─────────────────────────────────── */}
      <section aria-label="Hizli islemler">
        <h2 className={css.sectionHeader}>Hizli Islemler</h2>
        <div className={css.actionsGrid} style={{ marginTop: '1rem' }}>
          <button
            type="button"
            className={css.actionCard}
            onClick={() => navigate('/approvals')}
          >
            <div className={css.actionIconWrapper}>
              <span className={css.actionIcon}>
                <ClipboardList size={20} />
              </span>
              <span className={css.actionBadge}>
                <Badge tone="warning" variant="soft" size="sm">
                  12
                </Badge>
              </span>
            </div>
            <span className={css.actionLabel}>Onay Kuyruguna Git</span>
            <span className={css.actionDescription}>
              Bekleyen ilanlari inceleyin ve onaylayin
            </span>
          </button>

          <button
            type="button"
            className={css.actionCard}
            onClick={() => navigate('/listings/new')}
          >
            <div className={css.actionIconWrapper}>
              <span className={css.actionIcon}>
                <FilePlus2 size={20} />
              </span>
            </div>
            <span className={css.actionLabel}>Yeni Ilan Ekle</span>
            <span className={css.actionDescription}>
              Manuel olarak yeni bir ilan olusturun
            </span>
          </button>

          <button
            type="button"
            className={css.actionCard}
            onClick={() => navigate('/bulk-import')}
          >
            <div className={css.actionIconWrapper}>
              <span className={css.actionIcon}>
                <FileSpreadsheet size={20} />
              </span>
            </div>
            <span className={css.actionLabel}>Toplu Icerik Aktar</span>
            <span className={css.actionDescription}>
              CSV veya Excel ile toplu ilan yukleyin
            </span>
          </button>

          <button
            type="button"
            className={css.actionCard}
            onClick={() => navigate('/reports')}
          >
            <div className={css.actionIconWrapper}>
              <span className={css.actionIcon}>
                <BarChart3 size={20} />
              </span>
            </div>
            <span className={css.actionLabel}>Raporlari Incele</span>
            <span className={css.actionDescription}>
              Detayli analiz ve performans raporlari
            </span>
          </button>
        </div>
      </section>

      {/* ── 6. Recent Activity ────────────────────────────────────── */}
      <section aria-label="Son aktiviteler">
        <div className={css.activityCard}>
          <p className={css.activityTitle}>Son Moderasyon Islemleri</p>
          <ul className={css.timeline}>
            {recentModerationEvents.slice(0, 5).map((event) => (
              <li key={event.id} className={css.timelineItem}>
                <span
                  className={`${css.timelineDot} ${dotClass(event.eventType)}`}
                  aria-hidden="true"
                />
                <div className={css.timelineContent}>
                  <span className={css.timelineText}>
                    <strong>{event.actor.displayName}</strong>
                    {' '}
                    {EVENT_TYPE_LABEL[event.eventType] ?? event.eventType}
                    {' — '}
                    {event.listingId}
                  </span>
                  {event.note !== undefined ? (
                    <span className={css.timelineNote}>{event.note}</span>
                  ) : null}
                </div>
                <span className={css.timelineTime}>
                  {new Intl.DateTimeFormat('tr-TR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(event.createdAt))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
