/**
 * Mock veri yardimcilari.
 *
 * Tarihler sabit bir baz tarihten (2026-07-23) hesaplanir; `Date.now()` kullanilmaz.
 * Determinizm: her calistirmada ayni cikti.
 */

import type { ISODateTime, Location, Coordinates } from '../types/domain'

/* ── Sabit baz tarih ────────────────────────────────────────────────────── */

const BASE_DATE = new Date('2026-07-23T12:00:00+03:00')

/**
 * Baz tarihten `daysAgo` gun once ISO 8601 tarih-saat uretir.
 * Saat her zaman 10:00 + 03:00 (Turkiye).
 */
export function formatMockDate(daysAgo: number): ISODateTime {
  const d = new Date(BASE_DATE)
  d.setDate(d.getDate() - daysAgo)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T10:00:00+03:00`
}

/**
 * Baz tarihten `daysAgo` gun once, verilen saat ile ISO 8601 uretir.
 */
export function formatMockDateTime(daysAgo: number, hour: number, minute: number): ISODateTime {
  const d = new Date(BASE_DATE)
  d.setDate(d.getDate() - daysAgo)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(hour).padStart(2, '0')
  const min = String(minute).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:00+03:00`
}

/* ── Deterministik ID uretici ───────────────────────────────────────────── */

let _idCounter = 0

/**
 * Deterministik, tekrar edilebilir ID uretir.
 * Modul her yuklendiginde sifirlanir; ayni sira, ayni cikti.
 */
export function randomId(): string {
  _idCounter += 1
  return `mock-${String(_idCounter).padStart(6, '0')}`
}

/* ── Turkiye konum verileri ─────────────────────────────────────────────── */

export interface IlIlce {
  cityCode: string
  cityName: string
  districtId: string
  districtName: string
  neighborhoodId: string
  neighborhoodName: string
  coordinates: Coordinates
}

export const LOCATIONS = {
  istanbulKadikoy: {
    cityCode: '34',
    cityName: 'Istanbul',
    districtId: '34-kadikoy',
    districtName: 'Kadikoy',
    neighborhoodId: '34-kadikoy-caferaga',
    neighborhoodName: 'Caferaga',
    coordinates: { latitude: 40.9833, longitude: 29.0333 },
  },
  istanbulBesiktas: {
    cityCode: '34',
    cityName: 'Istanbul',
    districtId: '34-besiktas',
    districtName: 'Besiktas',
    neighborhoodId: '34-besiktas-levent',
    neighborhoodName: 'Levent',
    coordinates: { latitude: 41.0822, longitude: 29.0103 },
  },
  istanbulBakirkoy: {
    cityCode: '34',
    cityName: 'Istanbul',
    districtId: '34-bakirkoy',
    districtName: 'Bakirkoy',
    neighborhoodId: '34-bakirkoy-atakoy',
    neighborhoodName: 'Atakoy',
    coordinates: { latitude: 40.9707, longitude: 28.8574 },
  },
  istanbulSariyer: {
    cityCode: '34',
    cityName: 'Istanbul',
    districtId: '34-sariyer',
    districtName: 'Sariyer',
    neighborhoodId: '34-sariyer-emirgan',
    neighborhoodName: 'Emirgan',
    coordinates: { latitude: 41.1073, longitude: 29.0547 },
  },
  ankaraCankaya: {
    cityCode: '06',
    cityName: 'Ankara',
    districtId: '06-cankaya',
    districtName: 'Cankaya',
    neighborhoodId: '06-cankaya-gaziosmanpasa',
    neighborhoodName: 'Gaziosmanpasa',
    coordinates: { latitude: 39.9208, longitude: 32.8541 },
  },
  ankaraKecioren: {
    cityCode: '06',
    cityName: 'Ankara',
    districtId: '06-kecioren',
    districtName: 'Kecioren',
    neighborhoodId: '06-kecioren-etlik',
    neighborhoodName: 'Etlik',
    coordinates: { latitude: 39.9727, longitude: 32.8597 },
  },
  izmirKonak: {
    cityCode: '35',
    cityName: 'Izmir',
    districtId: '35-konak',
    districtName: 'Konak',
    neighborhoodId: '35-konak-alsancak',
    neighborhoodName: 'Alsancak',
    coordinates: { latitude: 38.4361, longitude: 27.1428 },
  },
  izmirKarsiyaka: {
    cityCode: '35',
    cityName: 'Izmir',
    districtId: '35-karsiyaka',
    districtName: 'Karsiyaka',
    neighborhoodId: '35-karsiyaka-bostanli',
    neighborhoodName: 'Bostanli',
    coordinates: { latitude: 38.4580, longitude: 27.1000 },
  },
  antalyaMuratpasa: {
    cityCode: '07',
    cityName: 'Antalya',
    districtId: '07-muratpasa',
    districtName: 'Muratpasa',
    neighborhoodId: '07-muratpasa-lara',
    neighborhoodName: 'Lara',
    coordinates: { latitude: 36.8607, longitude: 30.7532 },
  },
  antalyaKonyaalti: {
    cityCode: '07',
    cityName: 'Antalya',
    districtId: '07-konyaalti',
    districtName: 'Konyaalti',
    neighborhoodId: '07-konyaalti-hurma',
    neighborhoodName: 'Hurma',
    coordinates: { latitude: 36.8696, longitude: 30.6356 },
  },
  bursaNilüfer: {
    cityCode: '16',
    cityName: 'Bursa',
    districtId: '16-nilufer',
    districtName: 'Nilufer',
    neighborhoodId: '16-nilufer-ozluce',
    neighborhoodName: 'Ozluce',
    coordinates: { latitude: 40.2132, longitude: 28.8974 },
  },
  muglaFethiye: {
    cityCode: '48',
    cityName: 'Mugla',
    districtId: '48-fethiye',
    districtName: 'Fethiye',
    neighborhoodId: '48-fethiye-oludeniz',
    neighborhoodName: 'Oludeniz',
    coordinates: { latitude: 36.5500, longitude: 29.1145 },
  },
  trabzonOrtahisar: {
    cityCode: '61',
    cityName: 'Trabzon',
    districtId: '61-ortahisar',
    districtName: 'Ortahisar',
    neighborhoodId: '61-ortahisar-yomra',
    neighborhoodName: 'Yomra',
    coordinates: { latitude: 41.0027, longitude: 39.7168 },
  },
  tekirdagCorlu: {
    cityCode: '59',
    cityName: 'Tekirdag',
    districtId: '59-corlu',
    districtName: 'Corlu',
    neighborhoodId: '59-corlu-muhittin',
    neighborhoodName: 'Muhittin',
    coordinates: { latitude: 41.1591, longitude: 27.8003 },
  },
  eskisehirOdunpazari: {
    cityCode: '26',
    cityName: 'Eskisehir',
    districtId: '26-odunpazari',
    districtName: 'Odunpazari',
    neighborhoodId: '26-odunpazari-batikent',
    neighborhoodName: 'Batikent',
    coordinates: { latitude: 39.7667, longitude: 30.5256 },
  },
  kocaeliGebze: {
    cityCode: '41',
    cityName: 'Kocaeli',
    districtId: '41-gebze',
    districtName: 'Gebze',
    neighborhoodId: '41-gebze-guzeltepe',
    neighborhoodName: 'Guzeltepe',
    coordinates: { latitude: 40.8027, longitude: 29.4307 },
  },
  aydinKusadasi: {
    cityCode: '09',
    cityName: 'Aydin',
    districtId: '09-kusadasi',
    districtName: 'Kusadasi',
    neighborhoodId: '09-kusadasi-davutlar',
    neighborhoodName: 'Davutlar',
    coordinates: { latitude: 37.8584, longitude: 27.2590 },
  },
  sakaryaSerdivan: {
    cityCode: '54',
    cityName: 'Sakarya',
    districtId: '54-serdivan',
    districtName: 'Serdivan',
    neighborhoodId: '54-serdivan-kemaliye',
    neighborhoodName: 'Kemaliye',
    coordinates: { latitude: 40.6940, longitude: 30.3536 },
  },
  boluMerkez: {
    cityCode: '14',
    cityName: 'Bolu',
    districtId: '14-merkez',
    districtName: 'Merkez',
    neighborhoodId: '14-merkez-karacasu',
    neighborhoodName: 'Karacasu',
    coordinates: { latitude: 40.7356, longitude: 31.6113 },
  },
  marmarisIcmeler: {
    cityCode: '48',
    cityName: 'Mugla',
    districtId: '48-marmaris',
    districtName: 'Marmaris',
    neighborhoodId: '48-marmaris-icmeler',
    neighborhoodName: 'Icmeler',
    coordinates: { latitude: 36.8466, longitude: 28.2714 },
  },
} satisfies Record<string, IlIlce>

/**
 * `IlIlce` verisinden domain `Location` nesnesi uretir.
 */
export function toLocation(loc: IlIlce, showExact = false): Location {
  return {
    countryCode: 'TR',
    cityCode: loc.cityCode,
    cityName: loc.cityName,
    districtId: loc.districtId,
    districtName: loc.districtName,
    neighborhoodId: loc.neighborhoodId,
    neighborhoodName: loc.neighborhoodName,
    coordinates: loc.coordinates,
    showExactLocation: showExact,
  }
}
