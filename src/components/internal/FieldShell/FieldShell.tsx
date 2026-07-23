import type { ReactNode } from 'react'
import { Field } from '@base-ui/react/field'
import { AlertCircle, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import type { FieldMetaProps, ValidationState } from '../../../types/component-props'
import {
  description as descriptionClass,
  error as errorClass,
  errorIcon,
  label as labelClass,
  requiredMark,
  root,
  validationIcon,
  validationSuccess,
  validationValidating,
  validationWarning,
} from './FieldShell.css'

export interface FieldShellProps extends FieldMetaProps {
  /** Alanin kendisi: Input, Textarea, Select vb. */
  children: ReactNode
  disabled?: boolean
  /**
   * Etikete verilecek id.
   *
   * Base UI'in `Field.Label`'i `for`'u yalnizca Field'a kayitli bir control'e
   * baglar. Kontrol bir Field.Control degilse (ornegin DateRangePicker'daki
   * Popover.Trigger) `for` bosa duser; o durumda bag ters yonden, kontrolun
   * `aria-labelledby`'si ile kurulur ve etiketin id'si buradan verilir.
   */
  labelId?: string
}

/**
 * Cozumlenmis dogrulama durumunu hesaplar.
 *
 * Oncelik: `error` > `validationState`. `error` doluysa her zaman 'error' doner.
 * `error` bosken `validationState` gecerlidir.
 */
function resolveValidationState(
  error: string | undefined,
  validationState: ValidationState | undefined,
): ValidationState | undefined {
  const hasError = error !== undefined && error !== ''
  if (hasError) return 'error'
  return validationState
}

/**
 * Etiket, yardimci metin ve hata mesajini saran ortak form iskeleti.
 *
 * BU BIR KATALOG COMPONENT'I DEGILDIR -- brifingin 26 primitive listesinde yer
 * almaz. `FieldMetaProps` dokuz component tarafindan paylasildiği icin bu
 * isaretlemeyi dokuz kez kopyalamamak adina ortak bir iskelet olarak ayrildi.
 * Dogrudan kullanilmaz; Input, Select gibi primitive'lerin icinden cagirilir.
 *
 * Etiket-control eslemesini ve `aria-describedby` baglantisini Base UI'in Field'i
 * kurar; hangi id'nin nereye gidecegi ile ugrasma gerek kalmaz.
 *
 * Hata varken yardimci metin gizlenir: ikisi birden okunursa ekran okuyucu
 * kullanicisi once cozumu, sonra sorunu duyar -- kafa karistirici bir sira.
 */
export function FieldShell({
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  labelId,
  validationState: validationStateProp,
  validationMessage,
  children,
}: FieldShellProps) {
  const resolved = resolveValidationState(error, validationStateProp)
  const hasError = resolved === 'error'

  // Dogrulama mesaji: error icin Field.Error kullanilir (mevcut davranis).
  // Diger durumlar icin ozel mesaj blogu render edilir.
  const showValidationMessage =
    resolved !== undefined && resolved !== 'error' && !hasError

  const effectiveValidationMessage =
    validationMessage ??
    (resolved === 'validating' ? 'Dogrulanıyor...' : undefined)

  return (
    <Field.Root className={root} invalid={hasError} disabled={disabled}>
      {label !== undefined ? (
        <Field.Label className={labelClass} {...(labelId !== undefined && { id: labelId })}>
          {label}
          {required ? (
            <span className={requiredMark} aria-hidden="true">
              *
            </span>
          ) : null}
        </Field.Label>
      ) : null}

      {children}

      {helperText !== undefined && !hasError && !showValidationMessage ? (
        <Field.Description className={descriptionClass}>{helperText}</Field.Description>
      ) : null}

      {hasError ? (
        <Field.Error match className={errorClass}>
          <AlertCircle size={14} className={errorIcon} aria-hidden="true" />
          {error}
        </Field.Error>
      ) : null}

      {showValidationMessage && effectiveValidationMessage !== undefined ? (
        <p
          className={
            resolved === 'warning'
              ? validationWarning
              : resolved === 'success'
                ? validationSuccess
                : validationValidating
          }
          role="status"
          aria-live="polite"
        >
          {resolved === 'warning' ? (
            <AlertTriangle size={14} className={validationIcon} aria-hidden="true" />
          ) : resolved === 'success' ? (
            <CheckCircle2 size={14} className={validationIcon} aria-hidden="true" />
          ) : (
            <Loader2 size={14} className={validationIcon} aria-hidden="true" />
          )}
          {effectiveValidationMessage}
        </p>
      ) : null}
    </Field.Root>
  )
}
