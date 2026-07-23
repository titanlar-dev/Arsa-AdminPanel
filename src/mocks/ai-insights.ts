/**
 * AI analiz ve oneri verileri.
 *
 * Proje henuz bir `AiInsight` domain tipi tanimlamadigindan,
 * bu dosya kendi arayuz tipini export eder. Tip resmi olarak
 * `domain.ts`'e tasindiginda burasi guncellenir.
 */

import { formatMockDateTime } from './helpers'

/* ── Tip tanimi ─────────────────────────────────────────────────────────── */

export type AiInsightType = 'anomaly' | 'prediction' | 'recommendation' | 'summary' | 'risk'
export type AiInsightSeverity = 'info' | 'warning' | 'critical'

export interface AiInsight {
  id: string
  type: AiInsightType
  severity: AiInsightSeverity
  title: string
  description: string
  /** Ilgili varlik kimligi (ilan, kullanici vb.). Opsiyonel. */
  relatedEntityId?: string
  relatedEntityType?: 'listing' | 'user' | 'category' | 'report'
  /** Modelin guven skoru (0-1 arasi). */
  confidence: number
  /** Onerilen eylem. */
  suggestedAction?: string
  createdAt: string
}

/* ── Mock veriler ───────────────────────────────────────────────────────── */

export const aiInsight001: AiInsight = {
  id: 'ai-001',
  type: 'anomaly',
  severity: 'warning',
  title: 'Kadikoy bolgesinde anormal fiyat artisi',
  description: 'Son 7 gunde Kadikoy ilcesinde ilan edilen dairelerin ortalama fiyati %18 artis gosterdi. Bu artis, ilcenin son 90 gunluk ortalamasinin 2.3 standart sapma uzerinde. Olasi sebepler: yeni metro hatti duyurusu veya koordineli fiyat manipulasyonu.',
  relatedEntityType: 'category',
  confidence: 0.87,
  suggestedAction: 'Kadikoy bolgesindeki son 7 gunun ilanlarini inceleyin',
  createdAt: formatMockDateTime(0, 8, 30),
}

export const aiInsight002: AiInsight = {
  id: 'ai-002',
  type: 'prediction',
  severity: 'info',
  title: 'Onumuzdeki hafta ilan yogunlugu artacak',
  description: 'Gecmis yil verilerine gore, Temmuz sonunda ilan giris hizi %25 artmaktadir. Moderasyon ekibi kapasitesinin buna gore ayarlanmasi oneriliyor. Tahmini gunluk ilan sayisi: 160-180.',
  confidence: 0.78,
  suggestedAction: 'Moderasyon ekibine ek kaynak atayin',
  createdAt: formatMockDateTime(0, 9, 0),
}

export const aiInsight003: AiInsight = {
  id: 'ai-003',
  type: 'risk',
  severity: 'critical',
  title: 'Olasi sahte ilan halkasi tespit edildi',
  description: 'Son 48 saatte, farkli hesaplardan ama ayni IP adresinden gonderilen 5 ilan tespit edildi. Ilanlarin hepsi Marmaris bolgesinde, benzer aciklamalar ve stok fotograflar kullaniyor. Dolandiricilik riski yuksek.',
  relatedEntityId: 'usr-005',
  relatedEntityType: 'user',
  confidence: 0.93,
  suggestedAction: 'Ilgili hesaplari inceleyin ve ilanlari askiya alin',
  createdAt: formatMockDateTime(0, 10, 15),
}

export const aiInsight004: AiInsight = {
  id: 'ai-004',
  type: 'recommendation',
  severity: 'info',
  title: 'Arsa kategorisinde filtre iyilestirmesi',
  description: 'Arsa kategorisinde kullanicilarin %42\'si imar durumu filtresini kullaniyor, ancak altyapi filtresini yalniz %8\'i kullaniyor. Altyapi filtresinin varsayilan olarak acik gelmesi veya imar filtresinin hemen altinda konumlandirilmasi kullanici deneyimini iyilestirebilir.',
  relatedEntityType: 'category',
  confidence: 0.71,
  suggestedAction: 'Kategori yoneticisinde filtre sirasini gozden gecirin',
  createdAt: formatMockDateTime(1, 14, 0),
}

export const aiInsight005: AiInsight = {
  id: 'ai-005',
  type: 'summary',
  severity: 'info',
  title: 'Haftalik moderasyon ozeti',
  description: 'Bu hafta 847 ilan incelendi. Onay orani %91.6 (gecen hafta: %89.2). En cok reddedilen sebep: yetersiz gorsel kalitesi (%34). Ortalama inceleme suresi 14.6 dakikaya dustu (gecen hafta: 16.2 dk). Burak Ay en verimli moderator olarak 312 ilan inceledi.',
  confidence: 1.0,
  createdAt: formatMockDateTime(0, 7, 0),
}

export const aiInsight006: AiInsight = {
  id: 'ai-006',
  type: 'anomaly',
  severity: 'warning',
  title: 'Devremulk kategorisinde sikayet artisi',
  description: 'Devremulk kategorisindeki sikayetler son 14 gunde %65 artti. En sik sikayet sebebi: yaniltici bilgi (%58). Ozellikle kullanim donemi ve yillik bakim ucreti konusunda sikayetler yogunlasiyor.',
  relatedEntityType: 'category',
  confidence: 0.82,
  suggestedAction: 'Devremulk ilanlarinda zorunlu alan kontrollerini guclendirin',
  createdAt: formatMockDateTime(2, 11, 30),
}

/* ── Koleksiyon ─────────────────────────────────────────────────────────── */

export const allMockAiInsights: AiInsight[] = [
  aiInsight001,
  aiInsight002,
  aiInsight003,
  aiInsight004,
  aiInsight005,
  aiInsight006,
]

/** Yalniz kritik ve uyari seviyesindeki AI bildirimler. */
export const criticalAiInsights: AiInsight[] = allMockAiInsights.filter(
  i => i.severity === 'critical' || i.severity === 'warning',
)
