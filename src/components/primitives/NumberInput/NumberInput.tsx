import { NumberField } from '@base-ui/react/number-field'
import { Minus, Plus } from 'lucide-react'
import { FieldShell } from '../../internal/FieldShell'
import type { NumberInputProps, ValidationState } from '../../../types/component-props'
import { group, input, stepper } from './NumberInput.css'

/**
 * Cozumlenmis dogrulama durumunu hesaplar. `error` > `validationState`.
 */
function resolveValidation(
  error: string | undefined,
  validationState: ValidationState | undefined,
): ValidationState | undefined {
  const hasError = error !== undefined && error !== ''
  if (hasError) return 'error'
  return validationState
}

/**
 * Sayisal deger girisi: m2, oda sayisi, kat sayisi, bina yasi gibi alanlar icin.
 *
 * Artir/azalt butonlarinin yani sira ok tuslariyla da degistirilebilir; `min` ve
 * `max` sinirlarina gelinde ilgili buton kendiliğinden devre disi kalir.
 *
 * Rakamlar `tabular-nums` ile hizalanir ve saga yaslanir -- alt alta gelen
 * sayilarin basamaklari cakissin diye.
 *
 * Tutar girisi icin `CurrencyInput` kullanin; o para birimini de yonetir.
 *
 * @example
 * <NumberInput label="Brut m2" min={1} max={100000} value={brut} onValueChange={setBrut} />
 */
export function NumberInput({
  value,
  min,
  max,
  step,
  size = 'md',
  disabled = false,
  readOnly = false,
  onValueChange,
  label,
  helperText,
  error,
  required = false,
  validationState: validationStateProp,
  validationMessage,
}: NumberInputProps) {
  const resolved = resolveValidation(error, validationStateProp)
  const hasError = resolved === 'error'

  const validationDataAttr =
    resolved !== undefined && resolved !== 'error' ? resolved : undefined

  return (
    <FieldShell
      {...(label !== undefined && { label })}
      {...(helperText !== undefined && { helperText })}
      {...(error !== undefined && { error })}
      required={required}
      disabled={disabled}
      {...(validationStateProp !== undefined && { validationState: validationStateProp })}
      {...(validationMessage !== undefined && { validationMessage })}
    >
      <NumberField.Root
        locale="tr-TR"
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        {...(value !== undefined && { value })}
        {...(min !== undefined && { min })}
        {...(max !== undefined && { max })}
        {...(step !== undefined && { step })}
        {...(onValueChange !== undefined && {
          onValueChange: (next: number | null) => onValueChange(next ?? undefined),
        })}
      >
        <NumberField.Group
          className={group({ size })}
          data-invalid={hasError ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          data-validation-state={validationDataAttr}
        >
          <NumberField.Decrement className={stepper} aria-label="Azalt">
            <Minus size={16} aria-hidden="true" />
          </NumberField.Decrement>

          <NumberField.Input className={input} />

          <NumberField.Increment className={stepper} aria-label="Artir">
            <Plus size={16} aria-hidden="true" />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </FieldShell>
  )
}
