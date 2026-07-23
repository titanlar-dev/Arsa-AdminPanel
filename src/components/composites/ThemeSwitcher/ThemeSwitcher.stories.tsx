import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ThemeSwitcher } from './ThemeSwitcher'

const meta = {
  title: 'Composites/ThemeSwitcher',
  component: ThemeSwitcher,

  tags: ['stable'],

  parameters: {
    docs: {
      description: {
        component:
          'Tema paleti ve aydinlik/karanlik mod secici. Kompakt varyant TopBar icin Sun/Moon ' +
          'ikonu, genisletilmis varyant Ayarlar sayfasi icin palet cipsleri ve mod cubugu sunar. ' +
          'Tercih localStorage ile kalici kilinir ve prefers-color-scheme medya sorgusuna duser.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'theme-switcher',
      useWhen: ['Tema veya karanlik mod secimi gerektiginde'],
      doNotUseWhen: ['Tema bilgisi yalnizca okunacaksa — RadioGroup kullanin'],
    },
  },

  args: {
    onThemeChange: fn(),
  },
} satisfies Meta<typeof ThemeSwitcher>

export default meta

type Story = StoryObj<typeof meta>

/** TopBar'a entegre edilecek kompakt gecisin tek basina gorunumu. */
export const CompactToggle: Story = {
  args: {
    variant: 'compact',
  },
}

/** Ayarlar sayfasina uygun palet cipsleri ve mod cubugu. */
export const ExpandedSelector: Story = {
  args: {
    variant: 'expanded',
    defaultTheme: 'corporate-blue',
    defaultMode: 'light',
  },
}

/**
 * Karanlik mod onizlemesi: corporate-blue-dark temasinin nasil gorunecegini
 * gostermek icin baslangic modu dark olarak ayarlanmistir.
 */
export const DarkModePreview: Story = {
  args: {
    variant: 'expanded',
    defaultTheme: 'corporate-blue',
    defaultMode: 'dark',
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        maxWidth: '28rem',
      }}
    >
      <ThemeSwitcher {...args} />
      <div
        style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          background: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        <h3
          style={{
            margin: '0 0 0.5rem',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
          }}
        >
          Ornek kart
        </h3>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Bu kart karanlik modda nasil gorunecegini gosterir. Renk token&apos;lari
          otomatik olarak koyu paleti yansitir.
        </p>
      </div>
    </div>
  ),
}

/**
 * Sistem tercihine gore baslayan mod: `defaultMode` verilmediginde
 * `prefers-color-scheme` medya sorgusuna duser.
 */
export const SystemPreference: Story = {
  args: {
    variant: 'expanded',
    defaultTheme: 'corporate-blue',
  },
}

/**
 * Tum tema ve mod kombinasyonlarinin karsilastirmali gorunumu.
 *
 * 3 tema x 2 mod = 6 kombinasyon. Simdilik yalnizca corporate-blue'nun
 * karanlik modu tanimli; digerleri icin karanlik mod secilirse light'a
 * duser (bu kisit panelde belirtilmistir).
 */
export const AllThemesAllModes: Story = {
  render: () => {
    const themes = ['corporate-blue', 'neutral-slate', 'warm-amber'] as const
    const modes = ['light', 'dark'] as const
    const swatches: Record<string, string> = {
      'corporate-blue': '#2563eb',
      'neutral-slate': '#64748b',
      'warm-amber': '#d97706',
    }

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
          gap: '1rem',
        }}
      >
        {themes.flatMap((theme) =>
          modes.map((mode) => {
            const attr = mode === 'dark' && theme === 'corporate-blue' ? `${theme}-dark` : theme
            const hasDark = theme === 'corporate-blue'
            return (
              <div
                key={`${theme}-${mode}`}
                data-theme={attr}
                style={{
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-default)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '0.75rem',
                      height: '0.75rem',
                      borderRadius: '50%',
                      background: swatches[theme],
                    }}
                  />
                  <span
                    style={{
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    {theme}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {mode === 'dark' && !hasDark ? `${mode} (henuz tanimsiz, light'a duser)` : mode}
                </span>
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: 'var(--color-bg-canvas)',
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  Ornek icerik blogu
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      background: 'var(--color-action-primary-bg)',
                      color: 'var(--color-action-primary-text)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    Primary
                  </span>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      background: 'var(--color-bg-subtle)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-sm)',
                      border: '1px solid var(--color-border-default)',
                    }}
                  >
                    Secondary
                  </span>
                </div>
              </div>
            )
          }),
        )}
      </div>
    )
  },
  args: {
    variant: 'expanded',
  },
}
