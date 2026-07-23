import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import {
  BarChart3,
  Building2,
  CheckSquare,
  ClipboardList,
  DollarSign,
  FileText,
  FolderTree,
  History,
  LayoutDashboard,
  MapPin,
  Menu,
  Settings,
  ShieldCheck,
  Upload,
  Users,
  X,
} from 'lucide-react'
import type { NavigationItem, DynamicIslandItem, DynamicIslandCommand, DockItem } from '../types/component-props'
import { DynamicIsland } from '../components/composites/DynamicIsland/DynamicIsland'
import { Dock } from '../components/composites/Dock/Dock'
import { SidebarNav } from '../components/composites/SidebarNav/SidebarNav'
import { AIChatPanel } from '../components/composites/AIChatPanel/AIChatPanel'
import type { ChatMessage } from '../components/composites/AIChatPanel/AIChatPanel'
import * as css from './AdminLayout.css'

/* ------------------------------------------------------------------ */
/*  Sidebar navigation items                                           */
/* ------------------------------------------------------------------ */

const SIDEBAR_ITEMS: NavigationItem[] = [
  { id: 'dashboard', label: 'Pano', href: '/', icon: <LayoutDashboard size={20} /> },
  {
    id: 'ilan-yonetimi', label: 'Ilan Yonetimi', href: '/listings', icon: <Building2 size={20} />,
    children: [
      { id: 'listings', label: 'Ilanlar', href: '/listings', icon: <ClipboardList size={20} /> },
      { id: 'moderation', label: 'Onay Kuyrugu', href: '/moderation', icon: <CheckSquare size={20} />, badge: 12 },
      { id: 'categories', label: 'Kategoriler', href: '/categories', icon: <FolderTree size={20} /> },
      { id: 'import', label: 'Toplu Icerik Aktarimi', href: '/import', icon: <Upload size={20} /> },
    ],
  },
  {
    id: 'kullanici-yonetimi', label: 'Kullanici Yonetimi', href: '/users', icon: <Users size={20} />,
    children: [
      { id: 'users', label: 'Kullanicilar', href: '/users', icon: <Users size={20} /> },
      { id: 'verification', label: 'Satici Dogrulama', href: '/verification', icon: <ShieldCheck size={20} /> },
      { id: 'reports', label: 'Sikayetler', href: '/reports', icon: <FileText size={20} />, badge: 3 },
    ],
  },
  {
    id: 'sistem', label: 'Sistem', href: '/locations', icon: <Settings size={20} />,
    children: [
      { id: 'locations', label: 'Konum Yonetimi', href: '/locations', icon: <MapPin size={20} /> },
      { id: 'pricing', label: 'Fiyatlandirma', href: '/pricing', icon: <DollarSign size={20} /> },
      { id: 'audit-log', label: 'Islem Gecmisi', href: '/audit-log', icon: <History size={20} /> },
      { id: 'settings', label: 'Ayarlar', href: '/settings', icon: <Settings size={20} /> },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Rota -> aktif oge esleme                                            */
/* ------------------------------------------------------------------ */

/**
 * URL yolundan aktif sidebar ogesi kimligini tureten harita.
 *
 * `/listings/abc123` gibi alt yollar icin en uzun eslesen onek kazanir:
 * `/listings/:id` detay sayfasinda "listings" aktif kalir.
 */
const ROUTE_TO_ITEM: [prefix: string, itemId: string][] = [
  ['/', 'dashboard'],
  ['/listings', 'listings'],
  ['/moderation', 'moderation'],
  ['/users', 'users'],
  ['/reports', 'reports'],
  ['/categories', 'categories'],
  ['/locations', 'locations'],
  ['/pricing', 'pricing'],
  ['/verification', 'verification'],
  ['/import', 'import'],
  ['/audit-log', 'audit-log'],
  ['/settings', 'settings'],
]

function resolveActiveItem(pathname: string): string {
  // Exact match first
  for (const [prefix, id] of ROUTE_TO_ITEM) {
    if (pathname === prefix) return id
  }
  // Prefix match (longest first -- array is short, linear scan is fine)
  for (const [prefix, id] of [...ROUTE_TO_ITEM].reverse()) {
    if (prefix !== '/' && pathname.startsWith(prefix)) return id
  }
  return 'dashboard'
}

/* ------------------------------------------------------------------ */
/*  Page title mapping (for Dock context label)                         */
/* ------------------------------------------------------------------ */

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Pano',
  listings: 'Ilanlar',
  moderation: 'Onay Kuyrugu',
  users: 'Kullanicilar',
  reports: 'Sikayetler',
  categories: 'Kategoriler',
  locations: 'Konum Yonetimi',
  pricing: 'Fiyatlandirma',
  verification: 'Satici Dogrulama',
  import: 'Toplu Icerik Aktarimi',
  'audit-log': 'Islem Gecmisi',
  settings: 'Ayarlar',
}

/* ------------------------------------------------------------------ */
/*  DynamicIsland nav items                                            */
/* ------------------------------------------------------------------ */

const ISLAND_NAV_ITEMS: DynamicIslandItem[] = [
  { id: 'dashboard', label: 'Pano', icon: LayoutDashboard, href: '/', color: '#6366f1' },
  { id: 'listings', label: 'Ilanlar', icon: ClipboardList, href: '/listings', color: '#f59e0b' },
  { id: 'moderation', label: 'Onay Kuyrugu', icon: CheckSquare, href: '/moderation', color: '#10b981' },
  { id: 'users', label: 'Kullanicilar', icon: Users, href: '/users', color: '#3b82f6' },
  { id: 'reports', label: 'Sikayetler', icon: FileText, href: '/reports', color: '#ef4444' },
  { id: 'categories', label: 'Kategoriler', icon: FolderTree, href: '/categories', color: '#8b5cf6' },
  { id: 'settings', label: 'Ayarlar', icon: Settings, href: '/settings', color: '#64748b' },
]

const ISLAND_COMMANDS: DynamicIslandCommand[] = [
  { id: 'new-listing', label: 'Yeni Ilan Ekle', icon: Building2, hint: 'Ilan olustur' },
  { id: 'bulk-import', label: 'Toplu Icerik Aktarimi', icon: Upload, hint: 'CSV/Excel yukle' },
  { id: 'view-stats', label: 'Istatistikleri Gor', icon: BarChart3, hint: 'Dashboard' },
]

/* ------------------------------------------------------------------ */
/*  Dock items                                                          */
/* ------------------------------------------------------------------ */

const DOCK_ITEMS: DockItem[] = [
  { label: 'Pano', icon: LayoutDashboard, href: '/', color: '#6366f1' },
  { label: 'Ilanlar', icon: ClipboardList, href: '/listings', color: '#f59e0b' },
  { label: 'Moderasyon', icon: CheckSquare, href: '/moderation', color: '#10b981' },
  { label: 'Kullanicilar', icon: Users, href: '/users', color: '#3b82f6' },
  { label: 'Sikayetler', icon: FileText, href: '/reports', color: '#ef4444' },
  { label: 'Ayarlar', icon: Settings, href: '/settings', color: '#64748b' },
]

/* ------------------------------------------------------------------ */
/*  Layout component                                                   */
/* ------------------------------------------------------------------ */

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeItemId = resolveActiveItem(location.pathname)
  const currentPageTitle = PAGE_TITLES[activeItemId] ?? 'Pano'

  // Sidebar: default kapalı, config ile devre dışı bırakılabilir
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Sidebar her zaman enabled — devre dışı bırakma settings sayfasından yapılır
  const sidebarEnabled = true

  // AI Chat panel state
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [aiMessages] = useState<ChatMessage[]>([])

  // Sayfa değişince sidebar kapat
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  // Set dark theme on mount
  useEffect(() => {
    const root = document.documentElement
    const prev = root.getAttribute('data-theme')
    root.setAttribute('data-theme', 'corporate-blue-dark')
    return () => {
      if (prev) root.setAttribute('data-theme', prev)
      else root.removeAttribute('data-theme')
    }
  }, [])

  return (
    <div className={css.layoutRoot}>
      {/* Hamburger button — sol üst köşe */}
      {sidebarEnabled ? (
        <button
          type="button"
          className={css.hamburger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      ) : null}

      {/* Sidebar overlay drawer */}
      {sidebarEnabled && sidebarOpen ? (
        <>
          <div
            className={css.sidebarBackdrop}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className={css.sidebarDrawer}>
            <div className={css.sidebarHeader}>
              <span className={css.sidebarBrand}>
                <span className={css.sidebarLogo}>A</span>
                <span>Arsam.net</span>
              </span>
              <button
                type="button"
                className={css.sidebarCloseBtn}
                onClick={() => setSidebarOpen(false)}
                aria-label="Menüyü kapat"
              >
                <X size={18} />
              </button>
            </div>
            <div className={css.sidebarContent}>
              <SidebarNav
                items={SIDEBAR_ITEMS}
                activeItemId={activeItemId}
                collapsed={false}
                mobileOpen={false}
                onCollapsedChange={() => {}}
                onMobileOpenChange={() => {}}
              />
            </div>
          </aside>
        </>
      ) : null}

      {/* DynamicIsland -- top-center */}
      <DynamicIsland
        items={ISLAND_NAV_ITEMS}
        commands={ISLAND_COMMANDS}
        activeItemId={activeItemId}
        brandName="Arsam"
        brandBadge="admin"
        onNavigate={(item) => {
          if (item.href !== undefined) navigate(item.href)
        }}
        onCommand={(cmd) => {
          if (cmd.id === 'new-listing') navigate('/listings')
          else if (cmd.id === 'bulk-import') navigate('/import')
          else if (cmd.id === 'view-stats') navigate('/')
        }}
      />

      {/* Content area */}
      <main className={css.contentArea}>
        <Outlet />
      </main>

      {/* Dock -- sağ kenarda dikey */}
      <Dock
        items={DOCK_ITEMS}
        title={currentPageTitle}
        onSelect={(item) => {
          if (item.href !== undefined) navigate(item.href)
        }}
      />

      {/* AI Chat Panel */}
      <AIChatPanel
        open={aiChatOpen}
        onOpenChange={setAiChatOpen}
        mode="drawer"
        messages={aiMessages}
        onSendMessage={() => {}}
        currentPage={currentPageTitle}
        quickActions={[
          { label: 'Ozet', prompt: 'Bekleyen ilanlari ozetle' },
          { label: 'Istatistikler', prompt: 'Bugunun istatistiklerini goster' },
          { label: 'Moderasyon', prompt: 'Moderasyon kuyrugunun durumu nedir?' },
        ]}
      />
    </div>
  )
}
