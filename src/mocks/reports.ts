/**
 * 10 mock kullanici sikayeti.
 *
 * Durum dagilimi: 4 open, 3 inReview, 2 resolved, 1 dismissed.
 * Siddet dagilimi: 2 critical, 3 high, 3 medium, 2 low.
 * Ilanlar ve kullanicilar `listings.ts` / `users.ts` ile capraz referans verir.
 */

import {
  ReportReason,
  ReportSeverity,
  ReportStatus,
  type ListingReport,
} from '../types/domain'
import { formatMockDateTime } from './helpers'

export const report001: ListingReport = {
  id: 'rpt-001',
  listingId: 'lst-004',
  reporterUserId: 'usr-006',
  reason: ReportReason.MisleadingInformation,
  detail: 'Ilanda belirtilen metrekare gercek durumla uyusmuyor. 90 m2 yazilmis ancak daire en fazla 70 m2 gorunuyor.',
  status: ReportStatus.Open,
  severity: ReportSeverity.Medium,
  createdAt: formatMockDateTime(5, 14, 30),
  updatedAt: formatMockDateTime(5, 14, 30),
}

export const report002: ListingReport = {
  id: 'rpt-002',
  listingId: 'lst-014',
  reporterUserId: 'usr-001',
  reason: ReportReason.PriceManipulation,
  detail: 'Ayni dukkan farkli hesaplardan farkli fiyatlarla ilan edilmis. Fiyat manipulasyonu yapiliyor.',
  status: ReportStatus.InReview,
  severity: ReportSeverity.High,
  assignedAdminId: 'usr-013',
  createdAt: formatMockDateTime(8, 11, 0),
  updatedAt: formatMockDateTime(3, 9, 15),
}

export const report003: ListingReport = {
  id: 'rpt-003',
  listingId: 'lst-020',
  reporterUserId: 'usr-002',
  reason: ReportReason.SuspectedFraud,
  detail: 'Otel gorselleri baska bir isletmeye ait. Satici ile iletisime gecildiginde tutarsiz bilgi veriyor.',
  status: ReportStatus.Open,
  severity: ReportSeverity.Critical,
  createdAt: formatMockDateTime(3, 16, 45),
  updatedAt: formatMockDateTime(3, 16, 45),
}

export const report004: ListingReport = {
  id: 'rpt-004',
  listingId: 'lst-020',
  reason: ReportReason.InappropriateContent,
  detail: 'Ilan aciklamasinda uygunsuz ve kufur iceren ifadeler mevcut.',
  status: ReportStatus.Open,
  severity: ReportSeverity.High,
  createdAt: formatMockDateTime(2, 10, 0),
  updatedAt: formatMockDateTime(2, 10, 0),
}

export const report005: ListingReport = {
  id: 'rpt-005',
  listingId: 'lst-001',
  reporterUserId: 'usr-003',
  reason: ReportReason.DuplicateListing,
  detail: 'Bu ilan baska bir platformda da yayinda. Ayni fotograflar ve aciklama kullanilmis.',
  status: ReportStatus.Dismissed,
  severity: ReportSeverity.Low,
  assignedAdminId: 'usr-014',
  resolutionNote: 'Farkli platformlarda ilan yayinlamak kural ihlali degil. Sikayet reddedildi.',
  createdAt: formatMockDateTime(20, 8, 30),
  updatedAt: formatMockDateTime(18, 14, 0),
  resolvedAt: formatMockDateTime(18, 14, 0),
}

export const report006: ListingReport = {
  id: 'rpt-006',
  listingId: 'lst-009',
  reporterUserId: 'usr-004',
  reason: ReportReason.WrongCategory,
  detail: 'Arsa olarak ilan edilmis ancak uzerinde yapi var. Kategori yanlis.',
  status: ReportStatus.InReview,
  severity: ReportSeverity.Medium,
  assignedAdminId: 'usr-014',
  createdAt: formatMockDateTime(12, 15, 20),
  updatedAt: formatMockDateTime(7, 10, 45),
}

export const report007: ListingReport = {
  id: 'rpt-007',
  listingId: 'lst-013',
  reporterUserId: 'usr-007',
  reason: ReportReason.ContactViolation,
  detail: 'Ilan aciklamasinda kisisel telefon numarasi paylasilmis. Iletisim kurallarina aykiri.',
  status: ReportStatus.Resolved,
  severity: ReportSeverity.Medium,
  assignedAdminId: 'usr-013',
  resolutionNote: 'Iletisim bilgisi ilan aciklamasindan kaldirildi. Satici uyarildi.',
  createdAt: formatMockDateTime(15, 9, 0),
  updatedAt: formatMockDateTime(13, 11, 30),
  resolvedAt: formatMockDateTime(13, 11, 30),
}

export const report008: ListingReport = {
  id: 'rpt-008',
  listingId: 'lst-002',
  reporterUserId: 'usr-005',
  reason: ReportReason.SoldOrRented,
  detail: 'Bu daire satin alindi, ancak ilan hala yayinda.',
  status: ReportStatus.InReview,
  severity: ReportSeverity.Low,
  assignedAdminId: 'usr-015',
  createdAt: formatMockDateTime(4, 13, 15),
  updatedAt: formatMockDateTime(2, 8, 0),
}

export const report009: ListingReport = {
  id: 'rpt-009',
  listingId: 'lst-005',
  reporterUserId: 'usr-008',
  reason: ReportReason.SuspectedFraud,
  detail: 'Satici hesabi askiya alinmis olmasina ragmen bu ilanin gorselleri baska ilanlarda kullaniliyor.',
  status: ReportStatus.Open,
  severity: ReportSeverity.Critical,
  createdAt: formatMockDateTime(1, 17, 0),
  updatedAt: formatMockDateTime(1, 17, 0),
}

export const report010: ListingReport = {
  id: 'rpt-010',
  listingId: 'lst-017',
  reporterUserId: 'usr-003',
  reason: ReportReason.Other,
  detail: 'Binanin iskan ruhsati olmadigi ogrenildi. Ilanda "iskan var" yazilmis.',
  status: ReportStatus.Resolved,
  severity: ReportSeverity.High,
  assignedAdminId: 'usr-012',
  resolutionNote: 'Satici ile gorusuldu, iskan belgesi teyit edildi. Ilan bilgisi guncellendi.',
  createdAt: formatMockDateTime(25, 10, 0),
  updatedAt: formatMockDateTime(22, 16, 30),
  resolvedAt: formatMockDateTime(22, 16, 30),
}

/* ── Koleksiyon ─────────────────────────────────────────────────────────── */

export const allMockReports: ListingReport[] = [
  report001, report002, report003, report004, report005,
  report006, report007, report008, report009, report010,
]

/** Duruma gore gruplanmis sikayetler. */
export const mockReportsByStatus: Record<ReportStatus, ListingReport[]> = {
  [ReportStatus.Open]: allMockReports.filter(r => r.status === ReportStatus.Open),
  [ReportStatus.InReview]: allMockReports.filter(r => r.status === ReportStatus.InReview),
  [ReportStatus.Resolved]: allMockReports.filter(r => r.status === ReportStatus.Resolved),
  [ReportStatus.Dismissed]: allMockReports.filter(r => r.status === ReportStatus.Dismissed),
}

/** Siddete gore gruplanmis sikayetler. */
export const mockReportsBySeverity: Record<ReportSeverity, ListingReport[]> = {
  [ReportSeverity.Critical]: allMockReports.filter(r => r.severity === ReportSeverity.Critical),
  [ReportSeverity.High]: allMockReports.filter(r => r.severity === ReportSeverity.High),
  [ReportSeverity.Medium]: allMockReports.filter(r => r.severity === ReportSeverity.Medium),
  [ReportSeverity.Low]: allMockReports.filter(r => r.severity === ReportSeverity.Low),
}
