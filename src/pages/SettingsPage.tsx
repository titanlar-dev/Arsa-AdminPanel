import { useState } from 'react'
import * as css from './SettingsPage.css'

const THEMES = [
  { id: 'corporate-blue', name: 'Corporate Blue', color: '#3b82f6' },
  { id: 'neutral-slate', name: 'Neutral Slate', color: '#64748b' },
  { id: 'warm-amber', name: 'Warm Amber', color: '#f59e0b' },
]

const PREFS_INIT = [
  { id: 'notifications', label: 'E-posta Bildirimleri', on: true },
  { id: 'ai-moderation', label: 'AI Moderasyon', on: true },
  { id: 'auto-approve', label: 'Otomatik Onay (Dogrulanmis)', on: false },
  { id: 'dark-mode', label: 'Karanlik Mod', on: true },
]

export function SettingsPageWrapper() {
  const [theme, setTheme] = useState('corporate-blue')
  const [prefs, setPrefs] = useState(PREFS_INIT)

  const togglePref = (id: string) =>
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, on: !p.on } : p)))

  return (
    <div className={css.root}>
      <h1 className={css.title}>Ayarlar</h1>

      <span className={css.sectionTitle}>Tema</span>
      <div className={css.themeGrid}>
        {THEMES.map((t) => (
          <div
            key={t.id}
            className={`${css.themeCard} ${theme === t.id ? css.themeCardActive : ''}`}
            onClick={() => setTheme(t.id)}
          >
            <span className={css.themeDot} style={{ background: t.color }} />
            <span className={css.themeName}>{t.name}</span>
          </div>
        ))}
      </div>

      <span className={css.sectionTitle}>Tercihler</span>
      <div className={css.toggleList}>
        {prefs.map((p) => (
          <div key={p.id} className={css.toggleRow}>
            <span className={css.toggleLabel}>{p.label}</span>
            <button
              type="button"
              className={`${css.toggle} ${p.on ? css.toggleActive : ''}`}
              onClick={() => togglePref(p.id)}
            >
              <span className={`${css.toggleKnob} ${p.on ? css.toggleKnobActive : ''}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
