import {
  AutomatedCheckCode,
  AutomatedCheckResultStatus,
  RejectionReason,
  type AutomatedCheckResult,
} from '../../../types/domain'
import { AUTOMATED_CHECK_LABEL } from '../../../domain/labels'

export interface SuggestedReason {
  /** Eşlenen red gerekçesinin enum değeri. */
  reason: RejectionReason
  /** Önerinin güvenilirlik düzeyi. */
  confidence: 'high' | 'medium' | 'low'
  /** Öneriyi üreten kontrolün kullanıcıya gösterilecek adı. */
  source: string
}

/**
 * Başarısız otomatik kontrol sonuçlarını red gerekçesi önerilerine dönüştürür.
 *
 * Yalnız `failed` durumundaki kontroller eşlenir — `warning` ve `passed`
 * sonuçları yok sayılır. Fraud risk kontrolünde skor eşiğine göre güven
 * düzeyi değişir.
 */
export function mapChecksToSuggestions(checks: AutomatedCheckResult[]): SuggestedReason[] {
  const suggestions: SuggestedReason[] = []

  for (const check of checks) {
    if (check.status !== AutomatedCheckResultStatus.Failed) continue

    const source = AUTOMATED_CHECK_LABEL[check.code]

    switch (check.code) {
      case AutomatedCheckCode.RequiredFields:
        suggestions.push({
          reason: RejectionReason.MisleadingOrIncompleteInfo,
          confidence: 'high',
          source,
        })
        break

      case AutomatedCheckCode.DuplicateContent:
        suggestions.push({
          reason: RejectionReason.DuplicateListing,
          confidence: 'high',
          source,
        })
        break

      case AutomatedCheckCode.PriceAnomaly:
        suggestions.push({
          reason: RejectionReason.PricingError,
          confidence: 'medium',
          source,
        })
        break

      case AutomatedCheckCode.ContactInfoDetection:
        suggestions.push({
          reason: RejectionReason.ContactInformationViolation,
          confidence: 'high',
          source,
        })
        break

      case AutomatedCheckCode.ImageQuality:
        suggestions.push({
          reason: RejectionReason.InsufficientPhotoQuality,
          confidence: 'medium',
          source,
        })
        break

      case AutomatedCheckCode.LocationConsistency:
        suggestions.push({
          reason: RejectionReason.IncorrectLocation,
          confidence: 'medium',
          source,
        })
        break

      case AutomatedCheckCode.FraudRisk:
        suggestions.push({
          reason: RejectionReason.SuspectedFraud,
          confidence: (check.score ?? 0) > 0.7 ? 'high' : 'low',
          source,
        })
        break

      // ImageSafety has no direct rejection reason mapping in scope.
      default:
        break
    }
  }

  return suggestions
}
