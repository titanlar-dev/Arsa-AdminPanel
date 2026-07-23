/**
 * Navigasyon yapilandirmasi: sidebar, Dynamic Island ve TopBar verileri.
 *
 * Ikon importlari ReactNode olarak verilir (lucide-react).
 * Badge sayilari dashboard metriklerinden turetilir.
 */

import {
  BarChart3,
  CheckCircle2,
  FileText,
  Flag,
  LayoutGrid,
  ScrollText,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import { createElement } from 'react'
import { AdminPermission } from '../types/domain'
import type { DynamicIslandCommand, DynamicIslandItem, NavigationItem } from '../types/component-props'
import { userAdminSuperElifKaya } from './users'

/* ── Sidebar navigasyon ─────────────────────────────────────────────────── */

export const sidebarNavItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Kontrol Paneli',
    href: '/',
    icon: createElement(BarChart3),
    requiredPermission: AdminPermission.DashboardView,
  },
  {
    id: 'listings',
    label: 'Ilan Yonetimi',
    href: '/ilanlar',
    icon: createElement(FileText),
    badge: 1247,
    requiredPermission: AdminPermission.ListingView,
  },
  {
    id: 'approvalQueue',
    label: 'Onay Kuyrugu',
    href: '/onay-kuyrugu',
    icon: createElement(CheckCircle2),
    badge: 37,
    requiredPermission: AdminPermission.ListingApprove,
  },
  {
    id: 'users',
    label: 'Kullanici Yonetimi',
    href: '/kullanicilar',
    icon: createElement(Users),
    requiredPermission: AdminPermission.UserView,
  },
  {
    id: 'reports',
    label: 'Sikayetler',
    href: '/sikayetler',
    icon: createElement(Flag),
    badge: 19,
    requiredPermission: AdminPermission.ReportView,
  },
  {
    id: 'categories',
    label: 'Kategori ve Ozellikler',
    href: '/kategoriler',
    icon: createElement(LayoutGrid),
    requiredPermission: AdminPermission.CategoryView,
  },
  {
    id: 'audit',
    label: 'Denetim Kayitlari',
    href: '/denetim',
    icon: createElement(ScrollText),
    requiredPermission: AdminPermission.AuditView,
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    href: '/ayarlar',
    icon: createElement(Settings),
    requiredPermission: AdminPermission.SettingsView,
  },
]

/* ── Dynamic Island ─────────────────────────────────────────────────────── */

export const dynamicIslandItems: DynamicIslandItem[] = [
  { id: 'di-dashboard', label: 'Kontrol Paneli', icon: BarChart3, href: '/', color: '#3B82F6' },
  { id: 'di-listings', label: 'Ilanlar', icon: FileText, href: '/ilanlar', color: '#10B981' },
  { id: 'di-queue', label: 'Onay Kuyrugu', icon: CheckCircle2, href: '/onay-kuyrugu', color: '#F59E0B' },
  { id: 'di-users', label: 'Kullanicilar', icon: Users, href: '/kullanicilar', color: '#8B5CF6' },
  { id: 'di-reports', label: 'Sikayetler', icon: Flag, href: '/sikayetler', color: '#EF4444' },
  { id: 'di-categories', label: 'Kategoriler', icon: LayoutGrid, href: '/kategoriler', color: '#06B6D4' },
  { id: 'di-audit', label: 'Denetim', icon: ScrollText, href: '/denetim', color: '#64748B' },
  { id: 'di-settings', label: 'Ayarlar', icon: Settings, href: '/ayarlar', color: '#6B7280' },
]

export const dynamicIslandCommands: DynamicIslandCommand[] = [
  { id: 'cmd-new-listing', label: 'Yeni Ilan Ekle', hint: 'Hizli ilan olusturma', icon: FileText, href: '/ilanlar/yeni' },
  { id: 'cmd-review', label: 'Ilani Incele', hint: 'Kuyruktan sonraki ilani ac', icon: CheckCircle2, href: '/onay-kuyrugu' },
  { id: 'cmd-user-search', label: 'Kullanici Ara', hint: 'Ad, e-posta veya telefon', icon: Users, href: '/kullanicilar' },
  { id: 'cmd-reports', label: 'Kritik Sikayetler', hint: 'Yuksek oncelikli sikayetleri gor', icon: Shield, href: '/sikayetler?severity=critical' },
]

export const dynamicIslandRecentItems: DynamicIslandItem[] = [
  { id: 'di-queue', label: 'Onay Kuyrugu', icon: CheckCircle2, href: '/onay-kuyrugu', color: '#F59E0B' },
  { id: 'di-listings', label: 'Ilanlar', icon: FileText, href: '/ilanlar', color: '#10B981' },
  { id: 'di-reports', label: 'Sikayetler', icon: Flag, href: '/sikayetler', color: '#EF4444' },
]

/* ── TopBar ─────────────────────────────────────────────────────────────── */

export const topBarConfig = {
  title: 'Arsam.net Yonetim Paneli',
  currentUser: userAdminSuperElifKaya,
  notificationCount: 5,
}
