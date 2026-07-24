import { useNavigate } from 'react-router'
import { ArrowRight } from 'lucide-react'
import * as css from './DashboardPage.css'

/* ── Mock data ── */

const STATS = [
  { label: 'Onay Bekleyen', value: 12 },
  { label: 'Aktif Ilan', value: 127 },
  { label: 'Sikayetli Ilan', value: 3 },
  { label: 'Yeni Kullanici', value: 8 },
]

const ACTIVITIES = [
  { color: '#ef4444', text: 'AI, "Gebze Depo" ilaninda sahte belge suphesi tespit etti', time: '12 dk once' },
  { color: '#3b82f6', text: 'Marmara Emlak Danismanligi yeni ilan yayinladi', time: '48 dk once' },
  { color: '#22c55e', text: '"Kadikoy Ticari Arsa" ilani onaylandi', time: '2 sa once' },
  { color: '#6366f1', text: 'Yeni kullanici kaydoldu: Fatih Yildiz', time: '4 sa once' },
  { color: '#f59e0b', text: 'Konyaalti Villa ilani icin sikayet alindi', time: '5 sa once' },
]

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className={css.root}>
      {/* Baslik */}
      <h1 className={css.title}>Ozet</h1>

      {/* Stat kartlari 2x2 */}
      <div className={css.statsGrid}>
        {STATS.map((s) => (
          <div key={s.label} className={css.statCard}>
            <span className={css.statLabel}>{s.label}</span>
            <span className={css.statValue}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* AI Icgorusu */}
      <div className={css.aiCard}>
        <div className={css.aiHeader}>
          <span className={css.aiDot} />
          AI Icgorusu
        </div>
        <p className={css.aiBody}>
          2 ilan AI tarafindan supheli olarak isaretlendi, 12 ilan onayinizi bekliyor.
        </p>
        <button
          type="button"
          className={css.aiAction}
          onClick={() => navigate('/moderation')}
        >
          Detayli incele <ArrowRight size={14} />
        </button>
      </div>

      {/* Son Aktiviteler */}
      <span className={css.sectionTitle}>Son Aktiviteler</span>
      <div className={css.activityList}>
        {ACTIVITIES.map((a, i) => (
          <div key={i} className={css.activityItem}>
            <span className={css.activityDot} style={{ background: a.color }} />
            <div className={css.activityContent}>
              <span className={css.activityText}>{a.text}</span>
              <span className={css.activityTime}>{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
