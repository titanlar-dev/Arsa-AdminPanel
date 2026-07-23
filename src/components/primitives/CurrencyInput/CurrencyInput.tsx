import { NumberField } from '@base-ui/react/number-field'
import { Select as BaseSelect } from '@base-ui/react/select'
import { ChevronDown } from 'lucide-react'
import { FieldShell } from '../../internal/FieldShell'
import { Currency } from '../../../types/domain'
import type { CurrencyInputProps, ValidationState } from '../../../types/component-props'
import * as listbox from '../../internal/listbox.css'
import { currencyStatic, currencyTrigger, group, input } from './CurrencyInput.css'

/** Para birimi kodlari yerine kullanicinin tanidigi semboller gosterilir. */
const CURRENCY_LABEL: Record<Currency, string> = {
  [Currency.Try]: '\u20BA TRY',
  [Currency.Usd]: '$ USD',
  [Currency.Eur]: '\u20AC EUR',
  [Currency.Gbp]: '\u00A3 GBP',
}

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
 * Tutar girisi: fiyat, aidat, depozito, devir bedeli icin.
 *
 * Tutar ve para birimi tek bir kontrolde toplanir -- ikisi ayri alanlarda
 * durursa kullanici birini degistirip digerini unutabilir ve `Money` tutarsiz
 * kalir.
 *
 * `currencies` verilmezse para birimi sabit etiket olarak gosterilir; verilirse
 * secilebilir hale gelir. Rakamlar saga yasli ve `tabular-nums` ile hizalidir.
 *
 * @example
 * <CurrencyInput label="Fiyat" currency={Currency.Try} value={fiyat} onValueChange={setFiyat} />
 */
export function CurrencyInput({
  value,
  currency,
  currencies,
  min,
  max,
  size = 'md',
  disabled = false,
  onValueChange,
  onCurrencyChange,
  label,
  helperText,
  error,
  required = false,
  validationState: validationStateProp,
  validationMessage,
}: CurrencyInputProps) {
  const resolved = resolveValidation(error, validationStateProp)
  const hasError = resolved === 'error'
  const canChangeCurrency = currencies !== undefined && currencies.length > 1

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
        required={required}
        {...(value !== undefined && { value })}
        {...(min !== undefined && { min })}
        {...(max !== undefined && { max })}
        format={{ style: 'decimal', maximumFractionDigits: 2 }}
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
          <NumberField.Input className={input} />

          {canChangeCurrency ? (
            <BaseSelect.Root
              value={currency}
              disabled={disabled}
              {...(onCurrencyChange !== undefined && {
                onValueChange: (next: string | null) => {
                  if (next !== null) onCurrencyChange(next as Currency)
                },
              })}
            >
              <BaseSelect.Trigger
                className={currencyTrigger}
                data-disabled={disabled ? '' : undefined}
                aria-label="Para birimi"
              >
                <BaseSelect.Value>{CURRENCY_LABEL[currency]}</BaseSelect.Value>
                <ChevronDown size={14} aria-hidden="true" />
              </BaseSelect.Trigger>

              <BaseSelect.Portal>
                <BaseSelect.Positioner className={listbox.positioner} sideOffset={4}>
                  <BaseSelect.Popup className={listbox.popup}>
                    {currencies.map((item) => (
                      <BaseSelect.Item key={item} value={item} className={listbox.item}>
                        {CURRENCY_LABEL[item]}
                      </BaseSelect.Item>
                    ))}
                  </BaseSelect.Popup>
                </BaseSelect.Positioner>
              </BaseSelect.Portal>
            </BaseSelect.Root>
          ) : (
            <span className={currencyStatic}>{CURRENCY_LABEL[currency]}</span>
          )}
        </NumberField.Group>
      </NumberField.Root>
    </FieldShell>
  )
}
