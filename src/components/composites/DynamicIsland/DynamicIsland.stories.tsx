import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import {
  Activity,
  BarChart3,
  BookOpen,
  Database,
  FileCode,
  GitBranch,
  GitGraph,
  Layers,
  LayoutDashboard,
  Palette,
  Puzzle,
  Settings,
  Shield,
  Sparkles,
  Table2,
  Terminal,
} from 'lucide-react'
import type { DynamicIslandItem, DynamicIslandCommand } from '../../../types/component-props'
import { DynamicIsland } from './DynamicIsland'

/** MetaPanel navigasyonu (kaynak `dynamic-island.tsx` `navItems`); renkler Tailwind-400 karşılıkları. */
const NAV: DynamicIslandItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard, color: '#60a5fa' },
  { id: 'schema', label: 'Schema', href: '/schema', icon: Database, color: '#818cf8' },
  { id: 'erd', label: 'ERD', href: '/erd', icon: GitGraph, color: '#e879f9' },
  { id: 'data', label: 'Data', href: '/data', icon: Table2, color: '#38bdf8' },
  { id: 'modules', label: 'Modules', href: '/modules', icon: Puzzle, color: '#34d399' },
  { id: 'forms', label: 'Forms', href: '/forms', icon: Layers, color: '#22d3ee' },
  { id: 'workflows', label: 'Workflows', href: '/workflows', icon: GitBranch, color: '#a78bfa' },
  { id: 'permissions', label: 'Permissions', href: '/permissions', icon: Shield, color: '#f87171' },
  { id: 'theme', label: 'Theme', href: '/theme', icon: Palette, color: '#c084fc' },
  { id: 'api', label: 'API', href: '/api-explorer', icon: FileCode, color: '#fbbf24' },
  { id: 'ai', label: 'AI Copilot', href: '/ai-copilot', icon: Terminal, color: '#f472b6' },
  { id: 'reports', label: 'Reports', href: '/reports', icon: BarChart3, color: '#facc15' },
  { id: 'docs', label: 'Docs', href: '/docs', icon: BookOpen, color: '#60a5fa' },
  { id: 'activity', label: 'Activity', href: '/activity', icon: Activity, color: '#2dd4bf' },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    color: 'rgba(255,255,255,0.5)',
  },
]

const COMMANDS: DynamicIslandCommand[] = [
  {
    id: 'new-model',
    label: 'Yeni Model Oluştur',
    hint: 'Schema Builder',
    icon: Database,
    href: '/schema',
  },
  {
    id: 'ai-create',
    label: 'AI ile Oluştur',
    hint: 'AI Copilot',
    icon: Sparkles,
    href: '/ai-copilot',
  },
  { id: 'add-module', label: 'Modül Ekle', hint: 'Module Manager', icon: Puzzle, href: '/modules' },
  { id: 'edit-theme', label: 'Tema Düzenle', hint: 'Theme Engine', icon: Palette, href: '/theme' },
]

/** Glass ancak koyu zeminde okunur — kaynak `#050510` + ambient gradient mesh. */
const koyuZemin = (Story: () => React.JSX.Element) => (
  <div
    style={{
      minHeight: '100vh',
      background: '#050510',
      backgroundImage:
        'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 100%, rgba(139,92,246,0.10) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 5% 50%, rgba(59,130,246,0.08) 0%, transparent 50%)',
      position: 'relative',
    }}
  >
    <Story />
  </div>
)

const meta = {
  title: 'Composites/DynamicIsland',
  component: DynamicIsland,

  tags: ['stable'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Apple iPhone Dynamic Island’ına benzeyen, cam-morfizmli gezinme + komut paleti hap’ı. ' +
          'Üç durum: **daraltılmış hap** (marka + aktif sayfa + ⌘K; hover’da mini-nav açılır), ' +
          '**genişletilmiş cam kart** (navigasyon grid’i + hızlı komutlar) ve **arama modu** ' +
          '(⌘K ile açılır, öğeleri süzer). Overlay olarak Base UI `Dialog` kullanır — odak-kilidi, ' +
          'Escape ile kapanma ve dış-tık Modal ile aynı kaynaktan gelir. Router-agnostik: gezinmeyi ' +
          'yapmaz, `onNavigate`/`onCommand` ile bildirir; aktiflik `activeItemId`’den okunur. ' +
          'Görünüm bilinçli olarak açık tema token’larından ayrı, koyu Apple glass estetiğidir ' +
          '(`backdrop-filter` blur, specüler ışık, spring easing) — koyu zeminde kullanılır.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'navigation',
      useWhen: ['Koyu, cam temalı bir panelde global gezinme + ⌘K komut paleti istenirken'],
      doNotUseWhen: [
        'Açık tema panelde — bunun için SidebarNav/TopBar',
        'Kalıcı yan menü gerekiyorsa — bu geçici bir overlay’dir',
      ],
    },
  },

  decorators: [koyuZemin],

  args: {
    items: NAV,
    commands: COMMANDS,
    activeItemId: 'schema',
    brandName: 'MetaPanel',
    brandBadge: 'dev',
  },

  argTypes: {
    items: { control: false },
    commands: { control: false },
    open: { control: 'boolean' },
    activeItemId: { control: 'text' },
    brandName: { control: 'text' },
    brandBadge: { control: 'text' },
  },
} satisfies Meta<typeof DynamicIsland>

export default meta
type Story = StoryObj<typeof meta>

/** Daraltılmış hap — üst-ortada sabit; aktif sayfayı ve ⌘K ipucunu gösterir. */
export const Collapsed: Story = {}

/** Genişletilmiş cam kart — navigasyon grid’i + hızlı komutlar. */
export const Expanded: Story = {
  args: { open: true },
}

/** Çok sayıda navigasyon öğesiyle grid akışı (mini-nav’da “+N” göstergesi). */
export const LongNavigation: Story = {
  args: {
    open: true,
    items: [
      ...NAV,
      { id: 'code', label: 'Code', href: '/code', icon: FileCode, color: '#a3e635' },
      { id: 'health', label: 'Health', href: '/health', icon: Activity, color: '#34d399' },
    ],
  },
}

/**
 * Hap hover’da genişler ve mini-nav noktaları açılır (hap’ın kardeşi — iç içe
 * etkileşim yok). Play mouse hover’ı simüle eder.
 */
export const CollapsedHover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const pill = canvas.getByRole('button', { name: 'Komut paletini aç' })
    await userEvent.hover(pill.parentElement as HTMLElement)
    // Mini-nav öğeleri (ilk 7) hover’da erişilebilir hâle gelir.
    await waitFor(() => expect(canvas.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument())
  },
}

/**
 * Tam etkileşim: hap → genişler → Ara → süzer → Escape kapatır. Overlay Base
 * UI Portal’ına gittiği için sorgular `document.body` üzerinde yapılır.
 */
export const Interactive: Story = {
  args: { onNavigate: fn(), onCommand: fn() },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await step('Hap tıklanınca cam kart açılır', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Komut paletini aç' }))
      await waitFor(() => expect(body.getByRole('dialog')).toBeVisible())
      await expect(body.getByRole('link', { name: 'Schema' })).toBeVisible()
    })

    await step('Ara moduna geçip süz', async () => {
      await userEvent.click(body.getByRole('button', { name: 'Ara' }))
      const input = await body.findByRole('textbox', { name: 'Ara' })
      await userEvent.type(input, 'schema')
      // Sadece eşleşen öğe kaldı: "Data" gibi eşleşmeyen kayboldu.
      await expect(body.queryByRole('link', { name: 'Data' })).toBeNull()
      await expect(body.getByRole('link', { name: 'Schema' })).toBeVisible()
    })

    await step('Escape kartı kapatır', async () => {
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(body.queryByRole('dialog')).toBeNull())
    })
  },
}
