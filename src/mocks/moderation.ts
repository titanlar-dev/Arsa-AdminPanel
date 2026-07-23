/**
 * Moderasyon kuyrugu verileri.
 *
 * 8 onay bekleyen ilan, otomatik kontrol sonuclari ve moderasyon gecmisi.
 * Ilanlar `listings.ts`'ten `pendingReview` durumundakilerle capraz referans verir;
 * ek ilanlar kuyrugu gercekci boyuta cikarir.
 */

import {
  AdminRole,
  AutomatedCheckCode,
  AutomatedCheckResultStatus,
  ListingCategory,
  ListingStatus,
  ModerationActorType,
  ModerationEventType,
  type AutomatedCheckResult,
  type ModerationEvent,
} from '../types/domain'
import { formatMockDate, formatMockDateTime } from './helpers'

/* ── Kuyruk oncelikleri (pendingReview ilanlari icin ek veri) ────────────── */

export interface ModerationQueueItem {
  listingId: string
  listingTitle: string
  category: ListingCategory
  submittedAt: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  automatedChecks: AutomatedCheckResult[]
  assignedReviewerId?: string
  assignedReviewerName?: string
}

export const moderationQueue: ModerationQueueItem[] = [
  {
    listingId: 'lst-003',
    listingTitle: 'Antalya Konyaalti Deniz Manzarali Villa',
    category: ListingCategory.Residential,
    submittedAt: formatMockDate(2),
    priority: 'medium',
    automatedChecks: [
      { code: AutomatedCheckCode.RequiredFields, status: AutomatedCheckResultStatus.Passed, message: 'Tum zorunlu alanlar dolu', checkedAt: formatMockDate(2) },
      { code: AutomatedCheckCode.PriceAnomaly, status: AutomatedCheckResultStatus.Warning, score: 0.68, message: 'Fiyat bolge ortalamasinin uzerinde', checkedAt: formatMockDate(2) },
    ],
  },
  {
    listingId: 'lst-008',
    listingTitle: 'Sariyer Emirgan Bogazici Manzarali 5+1 Villa',
    category: ListingCategory.Residential,
    submittedAt: formatMockDate(1),
    priority: 'high',
    assignedReviewerId: 'usr-013',
    assignedReviewerName: 'Burak Ay',
    automatedChecks: [
      { code: AutomatedCheckCode.RequiredFields, status: AutomatedCheckResultStatus.Passed, message: 'Tum zorunlu alanlar dolu', checkedAt: formatMockDate(1) },
      { code: AutomatedCheckCode.DuplicateContent, status: AutomatedCheckResultStatus.Warning, score: 0.55, message: 'Benzer baslikli ilan mevcut', checkedAt: formatMockDate(1) },
      { code: AutomatedCheckCode.ImageQuality, status: AutomatedCheckResultStatus.Passed, message: 'Gorsel kalitesi yeterli', checkedAt: formatMockDate(1) },
    ],
  },
  {
    listingId: 'lst-012',
    listingTitle: 'Eskisehir Odunpazari Imarli Arsa 750 m2',
    category: ListingCategory.Land,
    submittedAt: formatMockDate(3),
    priority: 'low',
    automatedChecks: [
      { code: AutomatedCheckCode.RequiredFields, status: AutomatedCheckResultStatus.Passed, message: 'Tum zorunlu alanlar dolu', checkedAt: formatMockDate(3) },
      { code: AutomatedCheckCode.LocationConsistency, status: AutomatedCheckResultStatus.Passed, message: 'Konum bilgisi tutarli', checkedAt: formatMockDate(3) },
    ],
  },
  {
    listingId: 'lst-015',
    listingTitle: 'Gebze OSB Yakininda 500 m2 Depo',
    category: ListingCategory.Commercial,
    submittedAt: formatMockDate(4),
    priority: 'medium',
    automatedChecks: [
      { code: AutomatedCheckCode.RequiredFields, status: AutomatedCheckResultStatus.Passed, message: 'Tum zorunlu alanlar dolu', checkedAt: formatMockDate(4) },
      { code: AutomatedCheckCode.ContactInfoDetection, status: AutomatedCheckResultStatus.Warning, message: 'Aciklamada telefon numarasi tespit edildi', checkedAt: formatMockDate(4) },
    ],
  },
  {
    listingId: 'lst-019',
    listingTitle: 'Kusadasi Davutlar Tatil Sitesi Devremulk',
    category: ListingCategory.Timeshare,
    submittedAt: formatMockDate(6),
    priority: 'low',
    automatedChecks: [
      { code: AutomatedCheckCode.RequiredFields, status: AutomatedCheckResultStatus.Passed, message: 'Tum zorunlu alanlar dolu', checkedAt: formatMockDate(6) },
    ],
  },
  {
    // Kuyrugu 8 ilanla doldurmak icin ek mock kayitlar
    listingId: 'lst-queue-001',
    listingTitle: 'Antalya Muratpasa 2+1 Kiralik Daire',
    category: ListingCategory.Residential,
    submittedAt: formatMockDate(1),
    priority: 'low',
    automatedChecks: [
      { code: AutomatedCheckCode.RequiredFields, status: AutomatedCheckResultStatus.Passed, message: 'Tum zorunlu alanlar dolu', checkedAt: formatMockDate(1) },
    ],
  },
  {
    listingId: 'lst-queue-002',
    listingTitle: 'Izmir Bornova Satilik Isyeri 120 m2',
    category: ListingCategory.Commercial,
    submittedAt: formatMockDate(2),
    priority: 'critical',
    automatedChecks: [
      { code: AutomatedCheckCode.RequiredFields, status: AutomatedCheckResultStatus.Passed, message: 'Tum zorunlu alanlar dolu', checkedAt: formatMockDate(2) },
      { code: AutomatedCheckCode.FraudRisk, status: AutomatedCheckResultStatus.Failed, score: 0.92, message: 'Yuksek dolandiricilik riski', checkedAt: formatMockDate(2) },
      { code: AutomatedCheckCode.ImageSafety, status: AutomatedCheckResultStatus.Failed, message: 'Gorsellerde uygunsuz icerik tespit edildi', checkedAt: formatMockDate(2) },
    ],
  },
  {
    listingId: 'lst-queue-003',
    listingTitle: 'Bursa Osmangazi Satilik Arsa 300 m2',
    category: ListingCategory.Land,
    submittedAt: formatMockDate(5),
    priority: 'high',
    assignedReviewerId: 'usr-014',
    assignedReviewerName: 'Selin Dogan',
    automatedChecks: [
      { code: AutomatedCheckCode.RequiredFields, status: AutomatedCheckResultStatus.Passed, message: 'Tum zorunlu alanlar dolu', checkedAt: formatMockDate(5) },
      { code: AutomatedCheckCode.PriceAnomaly, status: AutomatedCheckResultStatus.Failed, score: 0.15, message: 'Fiyat bolge ortalamasinin cok altinda', checkedAt: formatMockDate(5) },
    ],
  },
]

/* ── Moderasyon gecmisi olaylari ────────────────────────────────────────── */

export const moderationHistory: ModerationEvent[] = [
  // lst-001 gecmisi: olusturuldu → gonderildi → onaylandi
  {
    id: 'mev-001',
    listingId: 'lst-001',
    eventType: ModerationEventType.Created,
    toStatus: ListingStatus.Draft,
    actor: { type: ModerationActorType.ListingOwner, id: 'usr-001', displayName: 'Ahmet Yilmaz' },
    rejectionReasons: [],
    revision: 1,
    createdAt: formatMockDateTime(50, 9, 0),
  },
  {
    id: 'mev-002',
    listingId: 'lst-001',
    eventType: ModerationEventType.Submitted,
    fromStatus: ListingStatus.Draft,
    toStatus: ListingStatus.PendingReview,
    actor: { type: ModerationActorType.ListingOwner, id: 'usr-001', displayName: 'Ahmet Yilmaz' },
    rejectionReasons: [],
    revision: 1,
    createdAt: formatMockDateTime(48, 10, 30),
  },
  {
    id: 'mev-003',
    listingId: 'lst-001',
    eventType: ModerationEventType.Approved,
    fromStatus: ListingStatus.PendingReview,
    toStatus: ListingStatus.Published,
    actor: { type: ModerationActorType.Admin, id: 'usr-013', displayName: 'Burak Ay', adminRole: AdminRole.Moderator },
    rejectionReasons: [],
    revision: 1,
    createdAt: formatMockDateTime(45, 11, 0),
  },

  // lst-005 gecmisi: olusturuldu → gonderildi → reddedildi
  {
    id: 'mev-004',
    listingId: 'lst-005',
    eventType: ModerationEventType.Created,
    toStatus: ListingStatus.Draft,
    actor: { type: ModerationActorType.ListingOwner, id: 'usr-004', displayName: 'Ayse Ozturk' },
    rejectionReasons: [],
    revision: 1,
    createdAt: formatMockDateTime(18, 14, 0),
  },
  {
    id: 'mev-005',
    listingId: 'lst-005',
    eventType: ModerationEventType.Submitted,
    fromStatus: ListingStatus.Draft,
    toStatus: ListingStatus.PendingReview,
    actor: { type: ModerationActorType.ListingOwner, id: 'usr-004', displayName: 'Ayse Ozturk' },
    rejectionReasons: [],
    revision: 1,
    createdAt: formatMockDateTime(16, 8, 45),
  },
  {
    id: 'mev-006',
    listingId: 'lst-005',
    eventType: ModerationEventType.Assigned,
    toStatus: ListingStatus.PendingReview,
    actor: { type: ModerationActorType.Admin, id: 'usr-012', displayName: 'Elif Kaya', adminRole: AdminRole.SuperAdmin },
    rejectionReasons: [],
    note: 'Selin Dogan\'a atandi',
    revision: 1,
    createdAt: formatMockDateTime(15, 9, 0),
  },
  {
    id: 'mev-007',
    listingId: 'lst-005',
    eventType: ModerationEventType.Rejected,
    fromStatus: ListingStatus.PendingReview,
    toStatus: ListingStatus.Rejected,
    actor: { type: ModerationActorType.Admin, id: 'usr-014', displayName: 'Selin Dogan', adminRole: AdminRole.ContentReviewer },
    rejectionReasons: [],
    note: 'Fotograf kalitesi yetersiz, metrekare uyusmazligi',
    revision: 1,
    createdAt: formatMockDateTime(12, 14, 45),
  },

  // lst-016 gecmisi: olusturuldu → gonderildi → onaylandi → durduruldu
  {
    id: 'mev-008',
    listingId: 'lst-016',
    eventType: ModerationEventType.Created,
    toStatus: ListingStatus.Draft,
    actor: { type: ModerationActorType.ListingOwner, id: 'usr-004', displayName: 'Ayse Ozturk' },
    rejectionReasons: [],
    revision: 1,
    createdAt: formatMockDateTime(75, 10, 0),
  },
  {
    id: 'mev-009',
    listingId: 'lst-016',
    eventType: ModerationEventType.Approved,
    fromStatus: ListingStatus.PendingReview,
    toStatus: ListingStatus.Published,
    actor: { type: ModerationActorType.Admin, id: 'usr-013', displayName: 'Burak Ay', adminRole: AdminRole.Moderator },
    rejectionReasons: [],
    revision: 1,
    createdAt: formatMockDateTime(70, 11, 30),
  },
  {
    id: 'mev-010',
    listingId: 'lst-016',
    eventType: ModerationEventType.Paused,
    fromStatus: ListingStatus.Published,
    toStatus: ListingStatus.Paused,
    actor: { type: ModerationActorType.ListingOwner, id: 'usr-004', displayName: 'Ayse Ozturk' },
    rejectionReasons: [],
    note: 'Satici talebiyle durduruldu',
    revision: 3,
    createdAt: formatMockDateTime(15, 9, 0),
  },
]
