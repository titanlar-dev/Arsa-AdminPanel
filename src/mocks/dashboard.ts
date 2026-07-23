/**
 * Dashboard KPI, grafik ve tablo verileri.
 *
 * Sayilar birbiriyle tutarli: toplam moderasyon = onay + red,
 * red orani = red / toplam moderasyon, kategori dagilimi toplami = onaylanan toplam.
 */

import {
  ListingCategory,
  ModerationActorType,
  ModerationEventType,
  AdminRole,
  ListingStatus,
  type CategoryDistributionItem,
  type DashboardMetrics,
  type ISODate,
  type ModerationEvent,
  type ModeratorVolumeItem,
  type TimeSeriesPoint,
} from '../types/domain'
import { formatMockDateTime } from './helpers'
import { lst003, lst008, lst012, lst015, lst019 } from './listings'

/* ── Gunluk seriler (son 30 gun: 2026-06-24 → 2026-07-23) ──────────────── */

const GUNLUK_SERI = [
  { date: '2026-06-24' as ISODate, yeniIlan: 118, moderasyon: 115, onay: 97, red: 18 },
  { date: '2026-06-25' as ISODate, yeniIlan: 124, moderasyon: 121, onay: 102, red: 19 },
  { date: '2026-06-26' as ISODate, yeniIlan: 111, moderasyon: 108, onay: 91, red: 17 },
  { date: '2026-06-27' as ISODate, yeniIlan: 68, moderasyon: 32, onay: 27, red: 5 },
  { date: '2026-06-28' as ISODate, yeniIlan: 62, moderasyon: 28, onay: 24, red: 4 },
  { date: '2026-06-29' as ISODate, yeniIlan: 130, moderasyon: 127, onay: 107, red: 20 },
  { date: '2026-06-30' as ISODate, yeniIlan: 126, moderasyon: 123, onay: 104, red: 19 },
  { date: '2026-07-01' as ISODate, yeniIlan: 135, moderasyon: 132, onay: 112, red: 20 },
  { date: '2026-07-02' as ISODate, yeniIlan: 119, moderasyon: 116, onay: 98, red: 18 },
  { date: '2026-07-03' as ISODate, yeniIlan: 108, moderasyon: 105, onay: 89, red: 16 },
  { date: '2026-07-04' as ISODate, yeniIlan: 71, moderasyon: 35, onay: 30, red: 5 },
  { date: '2026-07-05' as ISODate, yeniIlan: 64, moderasyon: 29, onay: 25, red: 4 },
  { date: '2026-07-06' as ISODate, yeniIlan: 129, moderasyon: 126, onay: 106, red: 20 },
  { date: '2026-07-07' as ISODate, yeniIlan: 122, moderasyon: 119, onay: 100, red: 19 },
  { date: '2026-07-08' as ISODate, yeniIlan: 137, moderasyon: 134, onay: 113, red: 21 },
  { date: '2026-07-09' as ISODate, yeniIlan: 115, moderasyon: 112, onay: 95, red: 17 },
  { date: '2026-07-10' as ISODate, yeniIlan: 109, moderasyon: 106, onay: 90, red: 16 },
  { date: '2026-07-11' as ISODate, yeniIlan: 73, moderasyon: 36, onay: 31, red: 5 },
  { date: '2026-07-12' as ISODate, yeniIlan: 66, moderasyon: 30, onay: 26, red: 4 },
  { date: '2026-07-13' as ISODate, yeniIlan: 131, moderasyon: 128, onay: 108, red: 20 },
  { date: '2026-07-14' as ISODate, yeniIlan: 125, moderasyon: 122, onay: 103, red: 19 },
  { date: '2026-07-15' as ISODate, yeniIlan: 140, moderasyon: 137, onay: 116, red: 21 },
  { date: '2026-07-16' as ISODate, yeniIlan: 112, moderasyon: 109, onay: 92, red: 17 },
  { date: '2026-07-17' as ISODate, yeniIlan: 106, moderasyon: 103, onay: 87, red: 16 },
  { date: '2026-07-18' as ISODate, yeniIlan: 70, moderasyon: 34, onay: 29, red: 5 },
  { date: '2026-07-19' as ISODate, yeniIlan: 63, moderasyon: 28, onay: 24, red: 4 },
  { date: '2026-07-20' as ISODate, yeniIlan: 133, moderasyon: 130, onay: 110, red: 20 },
  { date: '2026-07-21' as ISODate, yeniIlan: 127, moderasyon: 124, onay: 105, red: 19 },
  { date: '2026-07-22' as ISODate, yeniIlan: 138, moderasyon: 135, onay: 114, red: 21 },
  { date: '2026-07-23' as ISODate, yeniIlan: 128, moderasyon: 0, onay: 0, red: 0 },
]

export const dailyNewListings: TimeSeriesPoint[] = GUNLUK_SERI.map(r => ({
  date: r.date,
  value: r.yeniIlan,
}))

export const dailyModerationCount: TimeSeriesPoint[] = GUNLUK_SERI.map(r => ({
  date: r.date,
  value: r.moderasyon,
}))

export const dailyApprovals: TimeSeriesPoint[] = GUNLUK_SERI.map(r => ({
  date: r.date,
  value: r.onay,
}))

export const dailyRejections: TimeSeriesPoint[] = GUNLUK_SERI.map(r => ({
  date: r.date,
  value: r.red,
}))

/* ── Kategori dagilimi ──────────────────────────────────────────────────── */

export const categoryDistribution: CategoryDistributionItem[] = [
  { category: ListingCategory.Residential, count: 1612, ratio: 0.52 },
  { category: ListingCategory.Land, count: 558, ratio: 0.18 },
  { category: ListingCategory.Commercial, count: 465, ratio: 0.15 },
  { category: ListingCategory.Building, count: 186, ratio: 0.06 },
  { category: ListingCategory.Timeshare, count: 155, ratio: 0.05 },
  { category: ListingCategory.TourismFacility, count: 124, ratio: 0.04 },
]

/* ── En uzun bekleyen ilanlar ───────────────────────────────────────────── */

export const longestWaitingListings = [
  lst019, // 6 gundur bekliyor
  lst015, // 4 gundur bekliyor
  lst012, // 3 gundur bekliyor
  lst003, // 2 gundur bekliyor
  lst008, // 1 gundur bekliyor
]

/* ── Son moderasyon islemleri ───────────────────────────────────────────── */

export const recentModerationEvents: ModerationEvent[] = [
  {
    id: 'mev-dash-001',
    listingId: 'lst-008',
    eventType: ModerationEventType.Assigned,
    toStatus: ListingStatus.PendingReview,
    actor: { type: ModerationActorType.Admin, id: 'usr-012', displayName: 'Elif Kaya', adminRole: AdminRole.SuperAdmin },
    rejectionReasons: [],
    note: 'Burak Ay\'a atandi',
    revision: 1,
    createdAt: formatMockDateTime(0, 11, 30),
  },
  {
    id: 'mev-dash-002',
    listingId: 'lst-005',
    eventType: ModerationEventType.Rejected,
    fromStatus: ListingStatus.PendingReview,
    toStatus: ListingStatus.Rejected,
    actor: { type: ModerationActorType.Admin, id: 'usr-014', displayName: 'Selin Dogan', adminRole: AdminRole.ContentReviewer },
    rejectionReasons: [],
    note: 'Fotograf kalitesi yetersiz, metrekare uyusmazligi',
    revision: 1,
    createdAt: formatMockDateTime(1, 14, 45),
  },
  {
    id: 'mev-dash-003',
    listingId: 'lst-002',
    eventType: ModerationEventType.Approved,
    fromStatus: ListingStatus.PendingReview,
    toStatus: ListingStatus.Published,
    actor: { type: ModerationActorType.Admin, id: 'usr-013', displayName: 'Burak Ay', adminRole: AdminRole.Moderator },
    rejectionReasons: [],
    revision: 1,
    createdAt: formatMockDateTime(1, 10, 15),
  },
  {
    id: 'mev-dash-004',
    listingId: 'lst-016',
    eventType: ModerationEventType.Paused,
    fromStatus: ListingStatus.Published,
    toStatus: ListingStatus.Paused,
    actor: { type: ModerationActorType.ListingOwner, id: 'usr-004', displayName: 'Ayse Ozturk' },
    rejectionReasons: [],
    note: 'Satici talebiyle durduruldu',
    revision: 3,
    createdAt: formatMockDateTime(2, 9, 0),
  },
  {
    id: 'mev-dash-005',
    listingId: 'lst-020',
    eventType: ModerationEventType.Rejected,
    fromStatus: ListingStatus.PendingReview,
    toStatus: ListingStatus.Rejected,
    actor: { type: ModerationActorType.Admin, id: 'usr-012', displayName: 'Elif Kaya', adminRole: AdminRole.SuperAdmin },
    rejectionReasons: [],
    note: 'Isletme ruhsati eksik, dolandiricilik suphesi',
    revision: 1,
    createdAt: formatMockDateTime(3, 16, 20),
  },
]

/* ── Moderator performans tablosu ───────────────────────────────────────── */

export const moderatorVolume: ModeratorVolumeItem[] = [
  { adminId: 'usr-012', adminName: 'Elif Kaya', approvedCount: 245, rejectedCount: 38, changesRequestedCount: 12 },
  { adminId: 'usr-013', adminName: 'Burak Ay', approvedCount: 312, rejectedCount: 52, changesRequestedCount: 27 },
  { adminId: 'usr-014', adminName: 'Selin Dogan', approvedCount: 198, rejectedCount: 41, changesRequestedCount: 18 },
]

/* ── Toplam metrikler ───────────────────────────────────────────────────── */

const totalModeration = dailyModerationCount.reduce((sum, p) => sum + p.value, 0)
const totalApproved = dailyApprovals.reduce((sum, p) => sum + p.value, 0)
const totalRejected = dailyRejections.reduce((sum, p) => sum + p.value, 0)

export const dashboardMetrics: DashboardMetrics = {
  pendingReviewCount: 37,
  newListingCountToday: 128,
  publishedListingCount: totalApproved,
  rejectedListingCount: totalRejected,
  rejectionRate: totalModeration > 0 ? totalRejected / totalModeration : 0,
  averageReviewMinutes: 14.6,
  openReportCount: 19,
  dailyNewListings,
  dailyModerationCount,
  categoryDistribution,
  longestWaitingListings,
  recentModerationEvents,
  moderatorVolume,
  dailyApprovals,
  dailyRejections,
}

/** Bos dashboard metrikleri (bos tarih araligi secildiginde). */
export const emptyDashboardMetrics: DashboardMetrics = {
  pendingReviewCount: 0,
  newListingCountToday: 0,
  publishedListingCount: 0,
  rejectedListingCount: 0,
  rejectionRate: 0,
  averageReviewMinutes: 0,
  openReportCount: 0,
  dailyNewListings: [],
  dailyModerationCount: [],
  categoryDistribution: [],
}
