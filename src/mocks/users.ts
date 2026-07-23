/**
 * 15 mock kullanici hesabi.
 *
 * Kimlikler `lst-*` ilanlariyla capraz referans verir:
 * usr-001 → lst-001'in sahibi, vb.
 */

import {
  AdminRole,
  UserStatus,
  UserType,
  type UserAccount,
  type UserSanction,
} from '../types/domain'
import { formatMockDate } from './helpers'

/* ── Bireysel saticilar ─────────────────────────────────────────────────── */

export const userAhmetYilmaz: UserAccount = {
  id: 'usr-001',
  fullName: 'Ahmet Yilmaz',
  email: 'ahmet.yilmaz@example.invalid',
  phone: '+905551110001',
  type: UserType.Individual,
  status: UserStatus.Active,
  verified: true,
  createdAt: formatMockDate(365),
  updatedAt: formatMockDate(10),
  lastLoginAt: formatMockDate(0),
  listingCount: 3,
  activeListingCount: 2,
  reportCount: 0,
}

export const userFatmaDemir: UserAccount = {
  id: 'usr-002',
  fullName: 'Fatma Demir',
  email: 'fatma.demir@example.invalid',
  phone: '+905551110002',
  type: UserType.Individual,
  status: UserStatus.Active,
  verified: true,
  createdAt: formatMockDate(540),
  updatedAt: formatMockDate(5),
  lastLoginAt: formatMockDate(1),
  listingCount: 2,
  activeListingCount: 1,
  reportCount: 0,
}

export const userMehmetKaya: UserAccount = {
  id: 'usr-003',
  fullName: 'Mehmet Kaya',
  email: 'mehmet.kaya@example.invalid',
  phone: '+905551110003',
  type: UserType.Individual,
  status: UserStatus.Active,
  verified: true,
  createdAt: formatMockDate(200),
  updatedAt: formatMockDate(15),
  lastLoginAt: formatMockDate(2),
  listingCount: 2,
  activeListingCount: 1,
  reportCount: 1,
}

export const userAyseOzturk: UserAccount = {
  id: 'usr-004',
  fullName: 'Ayse Ozturk',
  email: 'ayse.ozturk@example.invalid',
  phone: '+905551110004',
  type: UserType.Individual,
  status: UserStatus.Suspended,
  verified: true,
  createdAt: formatMockDate(450),
  updatedAt: formatMockDate(3),
  lastLoginAt: formatMockDate(5),
  listingCount: 4,
  activeListingCount: 0,
  reportCount: 3,
}

export const userHasanCelik: UserAccount = {
  id: 'usr-005',
  fullName: 'Hasan Celik',
  email: 'hasan.celik@example.invalid',
  phone: '+905551110005',
  type: UserType.Individual,
  status: UserStatus.Banned,
  verified: false,
  createdAt: formatMockDate(180),
  updatedAt: formatMockDate(7),
  lastLoginAt: formatMockDate(30),
  listingCount: 1,
  activeListingCount: 0,
  reportCount: 5,
}

export const userZeynepArslan: UserAccount = {
  id: 'usr-006',
  fullName: 'Zeynep Arslan',
  email: 'zeynep.arslan@example.invalid',
  phone: '+905551110006',
  type: UserType.Individual,
  status: UserStatus.Active,
  verified: true,
  createdAt: formatMockDate(90),
  updatedAt: formatMockDate(1),
  lastLoginAt: formatMockDate(0),
  listingCount: 1,
  activeListingCount: 1,
  reportCount: 0,
}

export const userKemalSahin: UserAccount = {
  id: 'usr-007',
  fullName: 'Kemal Sahin',
  email: 'kemal.sahin@example.invalid',
  phone: '+905551110007',
  type: UserType.Individual,
  status: UserStatus.PendingVerification,
  verified: false,
  createdAt: formatMockDate(14),
  updatedAt: formatMockDate(14),
  listingCount: 1,
  activeListingCount: 0,
  reportCount: 0,
}

/* ── Kurumsal saticilar ─────────────────────────────────────────────────── */

export const userEmlakPlus: UserAccount = {
  id: 'usr-008',
  fullName: 'Emlak Plus AS',
  email: 'info@emlakplus.example.invalid',
  phone: '+905551110008',
  type: UserType.RealEstateOffice,
  status: UserStatus.Active,
  verified: true,
  companyName: 'Emlak Plus Gayrimenkul Danismanlik A.S.',
  createdAt: formatMockDate(730),
  updatedAt: formatMockDate(2),
  lastLoginAt: formatMockDate(0),
  listingCount: 5,
  activeListingCount: 4,
  reportCount: 0,
}

export const userMarmaraEmlak: UserAccount = {
  id: 'usr-009',
  fullName: 'Marmara Emlak Ltd',
  email: 'info@marmaraemlak.example.invalid',
  phone: '+905551110009',
  type: UserType.RealEstateOffice,
  status: UserStatus.Active,
  verified: true,
  companyName: 'Marmara Emlak Danismanlik Ltd. Sti.',
  createdAt: formatMockDate(600),
  updatedAt: formatMockDate(8),
  lastLoginAt: formatMockDate(1),
  listingCount: 3,
  activeListingCount: 2,
  reportCount: 1,
}

export const userYapiProje: UserAccount = {
  id: 'usr-010',
  fullName: 'Yapi Proje Insaat AS',
  email: 'satis@yapiproje.example.invalid',
  phone: '+905551110010',
  type: UserType.ConstructionCompany,
  status: UserStatus.Active,
  verified: true,
  companyName: 'Yapi Proje Insaat ve Taahhut A.S.',
  createdAt: formatMockDate(500),
  updatedAt: formatMockDate(4),
  lastLoginAt: formatMockDate(0),
  listingCount: 2,
  activeListingCount: 2,
  reportCount: 0,
}

export const userAnadoluInsaat: UserAccount = {
  id: 'usr-011',
  fullName: 'Anadolu Insaat',
  email: 'info@anadoluinsaat.example.invalid',
  phone: '+905551110011',
  type: UserType.ConstructionCompany,
  status: UserStatus.Suspended,
  verified: true,
  companyName: 'Anadolu Insaat ve Ticaret A.S.',
  createdAt: formatMockDate(400),
  updatedAt: formatMockDate(10),
  lastLoginAt: formatMockDate(20),
  listingCount: 1,
  activeListingCount: 0,
  reportCount: 2,
}

/* ── Admin kullanicilari ────────────────────────────────────────────────── */

export const userAdminSuperElifKaya: UserAccount = {
  id: 'usr-012',
  fullName: 'Elif Kaya',
  email: 'elif.kaya@arsam.net.invalid',
  phone: '+905551110012',
  type: UserType.Admin,
  status: UserStatus.Active,
  adminRole: AdminRole.SuperAdmin,
  verified: true,
  createdAt: formatMockDate(900),
  updatedAt: formatMockDate(0),
  lastLoginAt: formatMockDate(0),
  listingCount: 0,
  activeListingCount: 0,
  reportCount: 0,
}

export const userAdminModeratorBurakAy: UserAccount = {
  id: 'usr-013',
  fullName: 'Burak Ay',
  email: 'burak.ay@arsam.net.invalid',
  phone: '+905551110013',
  type: UserType.Admin,
  status: UserStatus.Active,
  adminRole: AdminRole.Moderator,
  verified: true,
  createdAt: formatMockDate(600),
  updatedAt: formatMockDate(1),
  lastLoginAt: formatMockDate(0),
  listingCount: 0,
  activeListingCount: 0,
  reportCount: 0,
}

export const userAdminContentReviewer: UserAccount = {
  id: 'usr-014',
  fullName: 'Selin Dogan',
  email: 'selin.dogan@arsam.net.invalid',
  phone: '+905551110014',
  type: UserType.Admin,
  status: UserStatus.Active,
  adminRole: AdminRole.ContentReviewer,
  verified: true,
  createdAt: formatMockDate(300),
  updatedAt: formatMockDate(2),
  lastLoginAt: formatMockDate(0),
  listingCount: 0,
  activeListingCount: 0,
  reportCount: 0,
}

export const userAdminSupport: UserAccount = {
  id: 'usr-015',
  fullName: 'Deniz Yildirim',
  email: 'deniz.yildirim@arsam.net.invalid',
  phone: '+905551110015',
  type: UserType.Admin,
  status: UserStatus.Active,
  adminRole: AdminRole.Support,
  verified: true,
  createdAt: formatMockDate(250),
  updatedAt: formatMockDate(3),
  lastLoginAt: formatMockDate(0),
  listingCount: 0,
  activeListingCount: 0,
  reportCount: 0,
}

/* ── Koleksiyon ─────────────────────────────────────────────────────────── */

export const allMockUsers: UserAccount[] = [
  userAhmetYilmaz,
  userFatmaDemir,
  userMehmetKaya,
  userAyseOzturk,
  userHasanCelik,
  userZeynepArslan,
  userKemalSahin,
  userEmlakPlus,
  userMarmaraEmlak,
  userYapiProje,
  userAnadoluInsaat,
  userAdminSuperElifKaya,
  userAdminModeratorBurakAy,
  userAdminContentReviewer,
  userAdminSupport,
]

/* ── Yaptirimlar ────────────────────────────────────────────────────────── */

export const sanctionSuspensionAyse: UserSanction = {
  id: 'sanc-001',
  userId: 'usr-004',
  type: 'suspension',
  reason: 'Yaniltici ilan bilgileri nedeniyle 30 gunluk hesap askiya alma',
  startsAt: formatMockDate(3),
  endsAt: formatMockDate(-27),
  createdByAdminId: 'usr-012',
  createdAt: formatMockDate(3),
}

export const sanctionBanHasan: UserSanction = {
  id: 'sanc-002',
  userId: 'usr-005',
  type: 'ban',
  reason: 'Tekrarlanan sahte ilan girisi ve dolandiricilik suphesi',
  startsAt: formatMockDate(7),
  createdByAdminId: 'usr-012',
  createdAt: formatMockDate(7),
}

export const sanctionSuspensionAnadolu: UserSanction = {
  id: 'sanc-003',
  userId: 'usr-011',
  type: 'suspension',
  reason: 'Eksik yetki belgesi nedeniyle hesap askiya alma',
  startsAt: formatMockDate(10),
  endsAt: formatMockDate(-20),
  createdByAdminId: 'usr-013',
  createdAt: formatMockDate(10),
}

export const allMockSanctions: UserSanction[] = [
  sanctionSuspensionAyse,
  sanctionBanHasan,
  sanctionSuspensionAnadolu,
]
