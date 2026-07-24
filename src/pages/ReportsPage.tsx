import * as css from './ReportsPage.css'

const STATS = [
  { label: 'Acik', value: 3 },
  { label: 'Inceleniyor', value: 2 },
  { label: 'Cozulmus', value: 15 },
]

const REPORTS = [
  { id: 1, severity: '#ef4444', desc: 'Sahte belge suphesi: Gebze Sanayi Deposu ilani', date: '22 Tem 2026' },
  { id: 2, severity: '#f59e0b', desc: 'Yaniltici fiyat bilgisi: Kadikoy 3+1 Daire', date: '21 Tem 2026' },
  { id: 3, severity: '#ef4444', desc: 'Hakaret iceren ilan aciklamasi: Cesme Yazlik', date: '21 Tem 2026' },
  { id: 4, severity: '#3b82f6', desc: 'Yinelenen ilan bildirimi: Konyaalti Villa', date: '20 Tem 2026' },
  { id: 5, severity: '#3b82f6', desc: 'Yanlis kategori secimi: Ankara Ofis Kati', date: '19 Tem 2026' },
]

export function ReportsPage() {
  return (
    <div className={css.root}>
      <h1 className={css.title}>Sikayetler</h1>

      <div className={css.statsRow}>
        {STATS.map((s) => (
          <div key={s.label} className={css.statCard}>
            <span className={css.statLabel}>{s.label}</span>
            <span className={css.statValue}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className={css.list}>
        {REPORTS.map((r) => (
          <div key={r.id} className={css.item}>
            <span className={css.dot} style={{ background: r.severity }} />
            <div className={css.content}>
              <span className={css.desc}>{r.desc}</span>
              <span className={css.date}>{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
