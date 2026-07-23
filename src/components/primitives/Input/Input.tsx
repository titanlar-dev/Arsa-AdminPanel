import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Input as BaseInput } from '@base-ui/react/input'
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { FieldShell } from '../../internal/FieldShell'
import type { InputProps, ValidationState } from '../../../types/component-props'
import {
  adornment,
  control,
  counter,
  counterNearLimit,
  counterOverLimit,
  input,
  spinnerSpin,
  validationIconError,
  validationIconSuccess,
  validationIconValidating,
  validationIconWarning,
  validationStateIcon,
} from './Input.css'

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

/** Dogrulama durumuna gore trailing ikon. */
function ValidationIcon({ state }: { state: ValidationState }) {
  switch (state) {
    case 'error':
      return (
        <span className={[validationStateIcon, validationIconError].join(' ')} aria-hidden="true">
          <XCircle size={16} />
        </span>
      )
    case 'warning':
      return (
        <span className={[validationStateIcon, validationIconWarning].join(' ')} aria-hidden="true">
          <AlertTriangle size={16} />
        </span>
      )
    case 'success':
      return (
        <span className={[validationStateIcon, validationIconSuccess].join(' ')} aria-hidden="true">
          <CheckCircle2 size={16} />
        </span>
      )
    case 'validating':
      return (
        <span
          className={[validationStateIcon, validationIconValidating].join(' ')}
          aria-hidden="true"
        >
          <Loader2 size={16} className={spinnerSpin} />
        </span>
      )
  }
}

/**
 * Tek satirlik metin girisi.
 *
 * Etiket, yardimci metin ve hata mesaji `label`, `helperText`, `error` prop'lariyla
 * verilir; erisilebiilr baglantilari (id eslemesi, `aria-describedby`) Base UI'in
 * Field'i kurar. Etiketsiz kullanmayin -- placeholder etiket yerine gecmez, cunku
 * kullanici yazmaya baslayinca kaybolur.
 *
 * Kenarlik ve odak halkasi dis kutuda; boylece leading/trailing ikonlar da
 * odak cercevesinin icinde kalir.
 *
 * @example
 * <Input label="Ilan no" placeholder="1245789630" helperText="10 haneli numara" />
 */
export function Input({
  size = 'md',
  leadingIcon,
  trailingAction,
  label,
  helperText,
  error,
  invalid = false,
  required = false,
  disabled = false,
  className,
  validationState: validationStateProp,
  validationMessage,
  maxLength,
  value,
  defaultValue,
  onChange,
  ...rest
}: InputProps) {
  /*
    Oncelik `error`'da: dolu bir `error` hem kutuyu kirmiziya boyar hem mesaji
    alanin altina basar (FieldShell `Field.Error`'i ondan doguruyor). `invalid`
    yalniz `error` bosken devreye girer ve mesajsizdir -- yalniz kirmizi kenarlik.
    Ikisi de kutuyu gecersiz gosterir; birlesik bayrak ikisini tek yere indirir.
  */
  const resolved = resolveValidation(error, validationStateProp)
  const hasError = error !== undefined && error !== ''
  const gecersiz = hasError || invalid || resolved === 'error'

  // Karakter sayaci
  const [internalLength, setInternalLength] = useState(String(defaultValue ?? '').length)
  const isControlled = value !== undefined
  const length = isControlled ? String(value).length : internalLength

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalLength(event.target.value.length)
    }
    onChange?.(event)
  }

  const showCounter = maxLength !== undefined
  const overLimit = maxLength !== undefined && length > maxLength
  const nearLimit = maxLength !== undefined && !overLimit && length >= maxLength * 0.9

  const counterClass = [counter, nearLimit && counterNearLimit, overLimit && counterOverLimit]
    .filter(Boolean)
    .join(' ')

  // data-validation-state: hata disindaki durumlari CSS'e tasir.
  // Hata data-invalid ile tasiniyor (mevcut davranis).
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
      {/*
        data-invalid / data-disabled elle veriliyor: Base UI bu isaretleri
        Field.Root uzerine koyuyor, bu kutu ise onun icindeki siradan bir span --
        yani otomatik devralmiyor.
      */}
      <span
        className={[control({ size }), className].filter(Boolean).join(' ')}
        data-invalid={gecersiz ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-validation-state={validationDataAttr}
      >
        {leadingIcon !== undefined ? (
          <span className={adornment} aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}

        <BaseInput
          className={input}
          required={required}
          disabled={disabled}
          {...(gecersiz && { 'aria-invalid': true })}
          {...(isControlled ? { value } : { defaultValue })}
          {...(maxLength !== undefined && { maxLength })}
          onChange={handleChange}
          {...rest}
        />

        {/* Dogrulama durumu ikonu (trailing, trailingAction'dan once) */}
        {resolved !== undefined && trailingAction === undefined ? (
          <ValidationIcon state={resolved} />
        ) : null}

        {trailingAction !== undefined ? <span className={adornment}>{trailingAction}</span> : null}
      </span>

      {showCounter ? (
        <span className={counterClass} aria-live="polite">
          {length} / {maxLength}
        </span>
      ) : null}
    </FieldShell>
  )
}
