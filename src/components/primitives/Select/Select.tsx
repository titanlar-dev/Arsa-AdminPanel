import { Combobox } from '@base-ui/react/combobox'
import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { FieldShell } from '../../internal/FieldShell'
import { Spinner } from '../Spinner'
import type { SelectOption, SelectProps, ValidationState } from '../../../types/component-props'
import * as css from '../../internal/listbox.css'

function OptionRow({ option }: { option: SelectOption }) {
  return (
    <>
      <span className={css.itemText}>
        <span>{option.label}</span>
        {option.description !== undefined ? (
          <span className={css.itemDescription}>{option.description}</span>
        ) : null}
      </span>
      <span className={css.itemIndicator}>
        <Check size={16} aria-hidden="true" />
      </span>
    </>
  )
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
 * Tekli secim.
 *
 * Iki farkli etkilesim modeli sunar ve `searchable` hangisinin kullanilacagini
 * belirler:
 *
 * - `searchable=false`: klasik acilir liste. Az sayida secenek icin.
 * - `searchable=true`: yazarak filtrelenen liste. Il/ilce/mahalle gibi uzun
 *   listelerde zorunludur -- 900 ilceyi kaydirarak bulmak kullanilabilir degildir.
 *
 * Ikisi Base UI'in farkli primitive'leri uzerine kuruludur (Select ve Combobox);
 * klavye davranislari da bu yuzden farklidir ve her biri kendi modeli icin dogrudur.
 *
 * 2-4 secenek varsa ve hepsi gorunmeliyse `RadioGroup` daha uygun olabilir.
 *
 * @example
 * <Select label="Il" options={iller} searchable value={il} onValueChange={setIl} />
 */
export function Select({
  value,
  options,
  placeholder = 'Secin',
  size = 'md',
  disabled = false,
  searchable = false,
  clearable = false,
  loading = false,
  onValueChange,
  label,
  helperText,
  error,
  required = false,
  validationState: validationStateProp,
  validationMessage,
}: SelectProps) {
  const resolved = resolveValidation(error, validationStateProp)
  const hasError = resolved === 'error'
  const selected = options.find((option) => option.value === value)

  const validationDataAttr =
    resolved !== undefined && resolved !== 'error' ? resolved : undefined

  const shell = (children: React.ReactNode) => (
    <FieldShell
      {...(label !== undefined && { label })}
      {...(helperText !== undefined && { helperText })}
      {...(error !== undefined && { error })}
      required={required}
      disabled={disabled}
      {...(validationStateProp !== undefined && { validationState: validationStateProp })}
      {...(validationMessage !== undefined && { validationMessage })}
    >
      {children}
    </FieldShell>
  )

  if (searchable) {
    return shell(
      <Combobox.Root
        items={options}
        itemToStringLabel={(item: SelectOption) => item.label}
        value={selected ?? null}
        {...(onValueChange !== undefined && {
          onValueChange: (next: SelectOption | null) => onValueChange(next?.value),
        })}
        disabled={disabled}
      >
        <Combobox.InputGroup
          className={css.trigger({ size })}
          data-invalid={hasError ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          data-validation-state={validationDataAttr}
        >
          <span className={css.icon}>
            <Search size={16} aria-hidden="true" />
          </span>
          <Combobox.Input className={css.searchInput} placeholder={placeholder} />
          {clearable ? (
            <Combobox.Clear className={css.chipRemove} aria-label="Secimi temizle">
              <X size={16} aria-hidden="true" />
            </Combobox.Clear>
          ) : null}
          <Combobox.Icon className={css.icon}>
            <ChevronDown size={16} aria-hidden="true" />
          </Combobox.Icon>
        </Combobox.InputGroup>

        <Combobox.Portal>
          <Combobox.Positioner className={css.positioner} sideOffset={4}>
            <Combobox.Popup className={css.popup}>
              {loading ? (
                <div className={css.empty}>
                  <Spinner size="sm" label="Secenekler yukleniyor" />
                </div>
              ) : (
                <>
                  <Combobox.Empty className={css.empty}>Sonuc bulunamadi</Combobox.Empty>
                  <Combobox.List>
                    {(option: SelectOption) => (
                      <Combobox.Item
                        key={option.value}
                        value={option}
                        className={css.item}
                        disabled={option.disabled ?? false}
                      >
                        <OptionRow option={option} />
                      </Combobox.Item>
                    )}
                  </Combobox.List>
                </>
              )}
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>,
    )
  }

  return shell(
    <BaseSelect.Root
      value={value ?? null}
      {...(onValueChange !== undefined && {
        onValueChange: (next: string | null) => onValueChange(next ?? undefined),
      })}
      disabled={disabled}
      required={required}
    >
      <BaseSelect.Trigger
        className={css.trigger({ size })}
        data-invalid={hasError ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-validation-state={validationDataAttr}
      >
        <BaseSelect.Value className={css.value}>
          {selected?.label ?? <span className={css.placeholder}>{placeholder}</span>}
        </BaseSelect.Value>
        {loading ? <Spinner size="sm" label="Yukleniyor" /> : null}
        <BaseSelect.Icon className={css.icon}>
          <ChevronDown size={16} aria-hidden="true" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner className={css.positioner} sideOffset={4}>
          <BaseSelect.Popup className={css.popup}>
            {options.length === 0 ? (
              <div className={css.empty}>Secenek yok</div>
            ) : (
              options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  className={css.item}
                  disabled={option.disabled ?? false}
                >
                  <OptionRow option={option} />
                </BaseSelect.Item>
              ))
            )}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>,
  )
}
