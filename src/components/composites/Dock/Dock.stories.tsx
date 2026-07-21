import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  BarChart3,
  Code,
  Database,
  Download,
  Eye,
  Palette,
  Play,
  Plus,
  Puzzle,
  RotateCcw,
  Save,
  Sparkles,
  Wand2,
} from 'lucide-react'
import type { DockItem } from '../../../types/component-props'
import { Dock } from './Dock'

/** MetaPanel "Dashboard" bağlamı (kaynak `contextual-dock.tsx`); renkler Tailwind-400. */
const DASHBOARD: DockItem[] = [
  { label: 'Yeni Model', icon: Database, color: '#818cf8', href: '/schema' },
  { label: 'AI Copilot', icon: Sparkles, color: '#f472b6', href: '/ai-copilot' },
  { label: 'Modül Ekle', icon: Puzzle, color: '#34d399', href: '/modules' },
  { label: 'Tema', icon: Palette, color: '#c084fc', href: '/theme' },
  { label: 'Metrikler', icon: BarChart3, color: '#fbbf24', href: '/activity' },
]

const SCHEMA: DockItem[] = [
  { label: 'Yeni Model', icon: Plus, color: '#818cf8' },
  { label: 'Field Ekle', icon: Database, color: '#34d399' },
  { label: 'AI Generate', icon: Wand2, color: '#f472b6' },
  { label: 'Code View', icon: Code, color: '#fbbf24' },
  { label: 'Kaydet', icon: Save, color: '#22d3ee' },
]

const THEME: DockItem[] = [
  { label: 'AI Palette', icon: Wand2, color: '#f472b6' },
  { label: 'Export CSS', icon: Download, color: '#34d399' },
  { label: 'Preview', icon: Eye, color: '#60a5fa' },
  { label: 'Reset', icon: RotateCcw, color: '#fbbf24' },
]

/** Glass ancak koyu zeminde okunur — kaynak `#050510` + ambient gradient mesh. */
const koyuZemin = (Story: () => React.JSX.Element) => (
  <div
    style={{
      minHeight: '100vh',
      background: '#050510',
      backgroundImage:
        'radial-gradient(ellipse 80% 50% at 50% 110%, rgba(99,102,241,0.16) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 15% 0%, rgba(139,92,246,0.10) 0%, transparent 50%)',
      position: 'relative',
    }}
  >
    <Story />
  </div>
)

const meta = {
  title: 'Composites/Dock',
  component: Dock,

  tags: ['stable'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'macOS Dock’a benzeyen, cam-morfizmli hızlı-eylem çubuğu. Alt-ortada sabit durur; ' +
          'üzerine gelinen ikon **büyür** ve komşuları da hafif büyür (macOS “magnification”), ' +
          'ikon üstünde etiket balonu belirir, altında bağlam etiketi (`title`) durur. ' +
          'Router-agnostik: gezinmeyi yapmaz, `onSelect` ile bildirir; `href` taşıyan öğe `<a>`, ' +
          'diğerleri `<button>` olur. Görünüm bilinçli olarak açık tema token’larından ayrı, koyu ' +
          'Apple glass estetiğidir (`DynamicIsland` ile aynı dil) — koyu zeminde kullanılır.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'navigation',
      useWhen: ['Koyu, cam temalı bir panelde bağlama duyarlı hızlı eylemler istenirken'],
      doNotUseWhen: ['Açık tema panelde — bunun için TopBar/BulkActionBar'],
    },
  },

  decorators: [koyuZemin],

  args: {
    items: DASHBOARD,
    title: 'Dashboard',
    onSelect: fn(),
  },

  argTypes: {
    items: { control: false },
    title: { control: 'text' },
  },
} satisfies Meta<typeof Dock>

export default meta
type Story = StoryObj<typeof meta>

/** Dashboard bağlamı — beş hızlı eylem. */
export const Dashboard: Story = {}

/** Schema bağlamı — farklı eylem seti (bağlama duyarlı). */
export const Schema: Story = {
  args: { items: SCHEMA, title: 'Schema' },
}

/** Etiketsiz (bağlam göstergesi olmadan). */
export const WithoutTitle: Story = {
  render: ({ items, onSelect }) => (
    <Dock items={items} {...(onSelect !== undefined && { onSelect })} />
  ),
}

/** Tek eylemli, sade dock. */
export const Minimal: Story = {
  args: {
    items: [{ label: 'AI ile Oluştur', icon: Play, color: '#34d399' }],
    title: 'Theme Engine',
  },
}

/**
 * macOS magnification: üzerine gelinen ikon büyür ve etiket balonu belirir. Play,
 * ortadaki ikona hover ederek büyümeyi tetikler.
 */
export const Magnified: Story = {
  args: { items: THEME, title: 'Theme' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Bir ikona hover büyütür ve etiketi gösterir', async () => {
      const preview = canvas.getByRole('button', { name: 'Preview' })
      await userEvent.hover(preview)
      // Etiket balonu görünür (tooltip opacity 1).
      await waitFor(() => {
        const tip = preview.querySelector('span')
        expect(tip && getComputedStyle(tip).opacity).toBe('1')
      })
    })
  },
}
