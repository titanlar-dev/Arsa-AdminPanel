import type { ModerationEvent } from '../../../types/domain'
import {
  MODERATION_EVENT_LABEL,
  LISTING_STATUS_LABEL,
  REJECTION_REASON_LABEL,
  ADMIN_ROLE_LABEL,
  MODERATION_ACTOR_TYPE_LABEL,
} from '../../../domain/labels'

/**
 * ISO 8601 tarihini `YYYY-MM-DD HH:mm:ss` biçimine dönüştürür.
 *
 * Saat dilimi `Europe/Istanbul`'a sabitli — `formatDateTime` ile aynı gerekçe:
 * "kararı hangi gün verdik" sorusu dışa aktaran kişinin makinesine göre
 * değişmemeli.
 */
function formatDateForExport(isoDate: string): string {
  const date = new Date(isoDate)
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  // sv-SE locale `YYYY-MM-DD HH:mm:ss` formatına çok yakın üretir.
  return formatter.format(date).replace(',', '')
}

/** Aktör bilgisini metin olarak döndürür: `Elif Kaya · Moderatör`. */
function aktorMetni(event: ModerationEvent): string {
  const { actor } = event
  const rol =
    actor.adminRole !== undefined
      ? ADMIN_ROLE_LABEL[actor.adminRole]
      : MODERATION_ACTOR_TYPE_LABEL[actor.type]
  return `${actor.displayName} · ${rol}`
}

/** Durum geçişini metin olarak döndürür: `İncelemede → Reddedildi` veya boş. */
function durumDegisikligi(event: ModerationEvent): string {
  if (event.fromStatus === undefined || event.toStatus === undefined) return ''
  return `${LISTING_STATUS_LABEL[event.fromStatus]} → ${LISTING_STATUS_LABEL[event.toStatus]}`
}

/** Red gerekçelerini virgülle birleştirip döndürür. */
function redGerekcesi(event: ModerationEvent): string {
  return event.rejectionReasons.map((r) => REJECTION_REASON_LABEL[r]).join(', ')
}

/**
 * RFC 4180 uyumlu hücre kaçışı.
 *
 * Türkiye'de Excel noktalı virgül ayırıcı beklediği için ayırıcı parametre
 * olarak alınır. Çift tırnak, ayırıcı veya satır sonu içeren değerler
 * çift tırnakla sarılır.
 */
function escapeCSVCell(value: string, separator: string): string {
  if (
    value.includes('"') ||
    value.includes(separator) ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Moderasyon olaylarından CSV metni üretir.
 *
 * - UTF-8 BOM: Excel Türkçe karakterleri doğru gösterir.
 * - Noktalı virgül ayırıcı: Türkiye locale'inde Excel varsayılan olarak
 *   virgülü ondalık ayırıcı sayar, bu yüzden CSV ayırıcısı noktalı virgüldür.
 * - Tarih formatı: ISO 8601 uyumlu `YYYY-MM-DD HH:mm:ss`.
 * - Sütunlar: Tarih, Olay Türü, Moderatör, Açıklama, Not, Durum Değişikliği.
 */
export function generateModerationCSV(events: ModerationEvent[]): string {
  const separator = ';'
  const headers = ['Tarih', 'Olay Türü', 'Moderatör', 'Açıklama', 'Not', 'Durum Değişikliği']

  const headerLine = headers.map((h) => escapeCSVCell(h, separator)).join(separator)

  const dataLines = events.map((event) => {
    const cells = [
      formatDateForExport(event.createdAt),
      MODERATION_EVENT_LABEL[event.eventType],
      aktorMetni(event),
      redGerekcesi(event),
      event.note ?? '',
      durumDegisikligi(event),
    ]
    return cells.map((c) => escapeCSVCell(c, separator)).join(separator)
  })

  // UTF-8 BOM + başlık + veri
  return '\uFEFF' + [headerLine, ...dataLines].join('\r\n')
}

/**
 * Moderasyon olaylarından güzel biçimlenmiş JSON metni üretir.
 *
 * Tüm alan adları olduğu gibi korunur — ham veriyle denetim arasında
 * kayıp alan olmaması için.
 */
export function generateModerationJSON(events: ModerationEvent[]): string {
  return JSON.stringify(events, null, 2)
}

/**
 * İçeriği tarayıcıda dosya olarak indirir.
 *
 * Blob + `URL.createObjectURL` + programatik tıklama deseni: `DataTable`'ın
 * `downloadCSV`'siyle aynı — ama ayrı, çünkü MIME tipi ve dosya adı kalıbı
 * farklı.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * İndirme dosya adını üretir.
 *
 * Desen: `moderasyon-gecmisi-{listingId}-{tarih}.{uzanti}`
 *
 * `listingId` opsiyonel — olaylardan ilkinin `listingId`'si alınır. Olay
 * yoksa veya veri yoksa `bilinmiyor` yazılır.
 */
export function buildFilename(events: ModerationEvent[], extension: 'csv' | 'json'): string {
  const firstEvent = events[0]
  const listingId = firstEvent !== undefined ? firstEvent.listingId : 'bilinmiyor'
  const now = new Date()
  const date = now.toISOString().slice(0, 10) // YYYY-MM-DD
  return `moderasyon-gecmisi-${listingId}-${date}.${extension}`
}
