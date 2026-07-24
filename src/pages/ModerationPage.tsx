import * as css from './ModerationPage.css'

const STATS = [
  { label: 'Bekleyen', value: 12 },
  { label: 'Bugun Onaylanan', value: 5 },
  { label: 'Bugun Reddedilen', value: 2 },
]

const PENDING = [
  { id: 1, title: 'Kadikoy 3+1 Daire', category: 'Konut', location: 'Istanbul / Kadikoy', date: '22 Tem 2026', status: 'Beklemede' },
  { id: 2, title: 'Konyaalti Villa', category: 'Villa', location: 'Antalya / Konyaalti', date: '21 Tem 2026', status: 'Beklemede' },
  { id: 3, title: 'Gebze Sanayi Deposu', category: 'Ticari', location: 'Kocaeli / Gebze', date: '21 Tem 2026', status: 'Supheli' },
  { id: 4, title: 'Cesme Yazlik', category: 'Villa', location: 'Izmir / Cesme', date: '20 Tem 2026', status: 'Beklemede' },
  { id: 5, title: 'Ankara Ofis Kati', category: 'Ticari', location: 'Ankara / Cankaya', date: '20 Tem 2026', status: 'Beklemede' },
]

export function ModerationPage() {
  return (
    <div className={css.root}>
      <h1 className={css.title}>Onay Kuyrugu</h1>

      <div className={css.statsRow}>
        {STATS.map((s) => (
          <div key={s.label} className={css.statCard}>
            <span className={css.statLabel}>{s.label}</span>
            <span className={css.statValue}>{s.value}</span>
          </div>
        ))}
      </div>

      {PENDING.map((item) => (
        <div key={item.id} className={css.card}>
          <div className={css.cardRow}>
            <span className={css.cardTitle}>{item.title}</span>
            <span className={css.badge}>{item.status}</span>
          </div>
          <span className={css.cardMeta}>
            {item.category} &middot; {item.location} &middot; {item.date}
          </span>
          <div className={css.actions}>
            <button type="button" className={css.approveBtn}>Onayla</button>
            <button type="button" className={css.rejectBtn}>Reddet</button>
          </div>
        </div>
      ))}
    </div>
  )
}
