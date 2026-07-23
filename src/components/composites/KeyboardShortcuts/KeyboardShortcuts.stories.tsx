import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useCallback } from 'react'
import {
  KeyboardShortcutsProvider,
  useKeyboardShortcut,
  KeyComboDisplay,
} from './KeyboardShortcuts'

const meta = {
  title: 'Composites/KeyboardShortcuts',
  component: KeyboardShortcutsProvider,

  tags: ['stable'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Global klavye kisayollari sistemi. `KeyboardShortcutsProvider` uygulamayi sarar, ' +
          '`useKeyboardShortcut` hook ile bilesenlere ozel kisayollar eklenir. ' +
          '`?` tusuna basarak tum kayitli kisayollari gosteren yardim modalini acar. ' +
          'Mac/Windows otomatik algilamasi, modifier tuslar, sira kisayollari (G then L) ' +
          've input alanlarina odaklanildikca devre disi birakma destegi icerir.',
      },
    },
  },
} satisfies Meta<typeof KeyboardShortcutsProvider>

export default meta
type Story = StoryObj<typeof meta>

/* ────────────────────────────────────────────────────────────
   Helper component to demo custom shortcut registration
   ──────────────────────────────────────────────────────────── */

function CustomShortcutDemo() {
  const handleSave = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Custom save triggered')
  }, [])

  const handlePreview = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Preview triggered')
  }, [])

  useKeyboardShortcut('Cmd+Shift+P', 'Onizleme ac/kapat', handlePreview, {
    section: 'Islemler',
  })

  useKeyboardShortcut('Cmd+Shift+S', 'Taslak olarak kaydet', handleSave, {
    section: 'Islemler',
  })

  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <p style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-md)' }}>
        <kbd>?</kbd> tusuna basarak kisayol yardimini gorun.
      </p>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
        Bu story iki ek kisayol kaydeder: <strong>Cmd+Shift+P</strong> (Onizleme) ve{' '}
        <strong>Cmd+Shift+S</strong> (Taslak kaydet).
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Stories
   ──────────────────────────────────────────────────────────── */

/** Kisayol yardim overlay'i acik halde. */
export const HelpOverlay: Story = {
  args: {
    defaultHelpOpen: true,
    children: null,
  },
  render: (args) => (
    <KeyboardShortcutsProvider defaultHelpOpen={args.defaultHelpOpen === true}>
      <div style={{ padding: '2rem', color: 'var(--color-text-primary)' }}>
        <p>Yardim overlay'i acik durumda.</p>
      </div>
    </KeyboardShortcutsProvider>
  ),
}

/** Ozel kisayol kaydi demo. */
export const ShortcutRegistration: Story = {
  args: {
    children: null,
  },
  render: () => (
    <KeyboardShortcutsProvider>
      <CustomShortcutDemo />
    </KeyboardShortcutsProvider>
  ),
}

/** Farkli tus kombinasyonu stilleri: tekli, modifier'li ve sira kisayollar. */
export const KeyComboDisplayStory: Story = {
  name: 'KeyComboDisplay',
  args: {
    children: null,
  },
  render: () => (
    <KeyboardShortcutsProvider>
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', minWidth: '8rem' }}>Tek tus:</span>
          <KeyComboDisplay keys="?" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', minWidth: '8rem' }}>Escape:</span>
          <KeyComboDisplay keys="Escape" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', minWidth: '8rem' }}>Modifier:</span>
          <KeyComboDisplay keys="Cmd+K" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', minWidth: '8rem' }}>
            Cift modifier:
          </span>
          <KeyComboDisplay keys="Cmd+Shift+P" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', minWidth: '8rem' }}>Sira:</span>
          <KeyComboDisplay keys="G then L" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', minWidth: '8rem' }}>Alt:</span>
          <KeyComboDisplay keys="Alt+S" />
        </div>
      </div>
    </KeyboardShortcutsProvider>
  ),
}

/** Play test: press `?`, verify help modal opens. */
export const HelpOverlayViaKeypress: Story = {
  args: {
    children: null,
  },
  render: () => (
    <KeyboardShortcutsProvider>
      <div
        data-testid="shortcut-container"
        style={{ padding: '2rem', color: 'var(--color-text-primary)' }}
      >
        <p>? tusuna basarak yardimi acin.</p>
      </div>
    </KeyboardShortcutsProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Press `?` to open the help overlay
    await userEvent.keyboard('?')

    // The dialog title should now be visible
    // Use findByText which waits for the element to appear
    const title = await canvas.findByText('Klavye Kisayollari', {}, { timeout: 2000 })
    await expect(title).toBeInTheDocument()
  },
}
