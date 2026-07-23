import { useCallback, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import * as css from './ThemeSwitcher.css'

/**
 * Tema adı: mevcut üç palet.
 *
 * Karanlık mod ayrı bir eksen; tema adı yalnızca paleti belirler,
 * `mode` ise `light` / `dark` ayrımını yapar.
 */
type ThemeId = 'corporate-blue' | 'neutral-slate' | 'warm-amber'

type Mode = 'light' | 'dark'

interface ThemeOption {
  id: ThemeId
  label: string
  /** Palette cipsi için kullanılan temsili renk. */
  swatch: string
}

const THEMES: ThemeOption[] = [
  { id: 'corporate-blue', label: 'Kurumsal Mavi', swatch: '#2563eb' },
  { id: 'neutral-slate', label: 'Notr Slate', swatch: '#64748b' },
  { id: 'warm-amber', label: 'Sicak Amber', swatch: '#d97706' },
]

const STORAGE_KEY = 'arsam-theme-preference'

interface StoredPreference {
  theme: ThemeId
  mode: Mode
}

function readPreference(): StoredPreference | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      parsed &&
      typeof parsed.theme === 'string' &&
      (parsed.mode === 'light' || parsed.mode === 'dark')
    ) {
      return parsed as StoredPreference
    }
  } catch {
    /* localStorage erisilemez veya gecersiz JSON */
  }
  return null
}

function writePreference(pref: StoredPreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pref))
  } catch {
    /* quota veya erisilemez */
  }
}

function getSystemMode(): Mode {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * `data-theme` niteligini `<html>` uzerine uygular.
 *
 * Tema kararlarinin hepsi CSS custom property'lerle calisiyor: tema
 * degistiginde yalnizca bu nitelik guncellenirse tum component'ler
 * aninda yeni paleti yansitir. Karanlık mod icin corporate-blue-dark
 * gibi bir sonek ekleniyor; simdilik sadece corporate-blue'nun karanlik
 * modu tanimli — digerleri icin karanlik mod secilirse light'a duser.
 */
function applyTheme(theme: ThemeId, mode: Mode): void {
  if (typeof document === 'undefined') return

  /* Simdilik yalnizca corporate-blue'nun karanlik modu var. */
  const hasDark = theme === 'corporate-blue'
  const effectiveMode = hasDark ? mode : 'light'

  const attr = effectiveMode === 'dark' ? `${theme}-dark` : theme
  document.documentElement.dataset['theme'] = attr
}

/* ── Kompakt varyant: yalnizca Sun/Moon ikonu ──────────────────────────── */

export interface ThemeSwitcherCompactProps {
  variant: 'compact'
  /** Disaridan baslangic modu verilmezse localStorage / sistem tercihi kullanilir. */
  defaultMode?: Mode
  onThemeChange?: (theme: string, mode: Mode) => void
}

/* ── Genisletilmis varyant: palet secici + mod gecisi ─────────────────── */

export interface ThemeSwitcherExpandedProps {
  variant: 'expanded'
  defaultTheme?: ThemeId
  defaultMode?: Mode
  onThemeChange?: (theme: string, mode: Mode) => void
}

export type ThemeSwitcherProps = ThemeSwitcherCompactProps | ThemeSwitcherExpandedProps

/**
 * Tema ve karanlik/aydinlik mod secici.
 *
 * - **compact**: TopBar'a entegre edilebilecek tek bir Sun/Moon ikonu.
 * - **expanded**: Ayarlar sayfasina uygun palet cipsleri + mod cubugu.
 *
 * Tercih `localStorage` ile kalici kilinir ve sayfa yuklendiginde
 * uygulanir. Tercih yoksa `prefers-color-scheme` medya sorgusuna dusulur.
 */
export function ThemeSwitcher(props: ThemeSwitcherProps) {
  const { variant, onThemeChange } = props

  const [theme, setTheme] = useState<ThemeId>(() => {
    const stored = readPreference()
    if (stored) return stored.theme
    if (variant === 'expanded' && 'defaultTheme' in props && props.defaultTheme) {
      return props.defaultTheme
    }
    return 'corporate-blue'
  })

  const [mode, setMode] = useState<Mode>(() => {
    const stored = readPreference()
    if (stored) return stored.mode
    if (props.defaultMode) return props.defaultMode
    return getSystemMode()
  })

  /* Sistem tercihi degistiginde (tercih yoksa) otomatik guncelle. */
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const stored = readPreference()
      if (!stored) {
        setMode(e.matches ? 'dark' : 'light')
      }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  /* Tema / mod her degistiginde DOM'a uygula ve kaydet. */
  useEffect(() => {
    applyTheme(theme, mode)
    writePreference({ theme, mode })
  }, [theme, mode])

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      onThemeChange?.(theme, next)
      return next
    })
  }, [theme, onThemeChange])

  const selectTheme = useCallback(
    (id: ThemeId) => {
      setTheme(id)
      onThemeChange?.(id, mode)
    },
    [mode, onThemeChange],
  )

  if (variant === 'compact') {
    return (
      <button
        type="button"
        className={css.toggle}
        onClick={toggleMode}
        aria-label={mode === 'light' ? 'Karanlik moda gec' : 'Aydinlik moda gec'}
      >
        {mode === 'light' ? (
          <Sun size={20} className={css.iconSun} aria-hidden />
        ) : (
          <Moon size={20} className={css.iconMoon} aria-hidden />
        )}
      </button>
    )
  }

  /* expanded */
  return (
    <div className={css.panel}>
      {/* Tema paleti */}
      <div className={css.section}>
        <span className={css.sectionLabel}>Tema</span>
        <ul className={css.paletteList} role="radiogroup" aria-label="Tema paleti">
          {THEMES.map((t) => {
            const active = t.id === theme
            return (
              <li key={t.id} className={css.paletteItem}>
                <button
                  type="button"
                  className={css.paletteButton}
                  data-active={active}
                  role="radio"
                  aria-checked={active}
                  aria-label={t.label}
                  onClick={() => selectTheme(t.id)}
                >
                  <span className={css.paletteChip} style={{ background: t.swatch }} />
                </button>
                <span className={css.paletteLabel} data-active={active ? 'true' : undefined}>
                  {t.label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Mod gecisi */}
      <div className={css.section}>
        <span className={css.sectionLabel}>Mod</span>
        <div className={css.modeBar} role="radiogroup" aria-label="Renk modu">
          <button
            type="button"
            className={css.modeButton}
            data-active={mode === 'light'}
            role="radio"
            aria-checked={mode === 'light'}
            onClick={() => {
              setMode('light')
              onThemeChange?.(theme, 'light')
            }}
          >
            <Sun size={16} aria-hidden />
            Aydinlik
          </button>
          <button
            type="button"
            className={css.modeButton}
            data-active={mode === 'dark'}
            role="radio"
            aria-checked={mode === 'dark'}
            onClick={() => {
              setMode('dark')
              onThemeChange?.(theme, 'dark')
            }}
          >
            <Moon size={16} aria-hidden />
            Karanlik
          </button>
        </div>
      </div>
    </div>
  )
}
