import { useCallback, useEffect, useRef, useState } from 'react'
import { Select } from '../../primitives/Select'
import type {
  CascadingSelectProps,
  CascadingSelectLevel,
  SelectOption,
} from '../../../types/component-props'
import * as css from './CascadingSelect.css'

/** 8'den fazla secenek varsa arama otomatik acilir — Select'in mevcut davranisiyla uyumlu. */
const SEARCHABLE_THRESHOLD = 8

/**
 * Kademeye bagimli (cascading) secim bileseni.
 *
 * Il -> Ilce -> Mahalle gibi N kademeli bagimli secimler icin tasarlanmistir.
 * Dahili olarak mevcut `Select` primitive'ini kullanir; kendisi yalnizca
 * kademeler arasi bagimlilik mantigi ve duzen (layout) saglar.
 *
 * @example
 * ```tsx
 * <CascadingSelect
 *   levels={[
 *     { label: 'Il', options: iller },
 *     { label: 'Ilce', options: (ilValue) => fetchIlceler(ilValue) },
 *     { label: 'Mahalle', options: (ilceValue) => fetchMahalleler(ilceValue) },
 *   ]}
 *   value={[il, ilce, mahalle]}
 *   onValueChange={(values, level) => { ... }}
 * />
 * ```
 */
export function CascadingSelect({
  levels,
  value = [],
  onValueChange,
  size = 'md',
  disabled = false,
}: CascadingSelectProps) {
  // Her kademenin cozulmus seceneklerini tutar. Kok kademe (0) her zaman
  // statik listeden gelir; alt kademeler async ise yuklendikten sonra buraya
  // yazilir.
  const [resolvedOptions, setResolvedOptions] = useState<
    Record<number, SelectOption[]>
  >(() => {
    const initial: Record<number, SelectOption[]> = {}
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i]
      if (level === undefined) continue
      const src = level.options
      if (Array.isArray(src)) {
        initial[i] = src
      }
    }
    return initial
  })

  // Hangi kademelerin async yuklemesi suruyor.
  const [loadingLevels, setLoadingLevels] = useState<Record<number, boolean>>(
    {},
  )

  // Async cagrilari iptal etmek icin: ust kademe degisirse onceki yukleme
  // artik gecersiz.
  const abortRef = useRef<Record<number, number>>({})

  /**
   * Belirli bir kademenin seceneklerini cozumler.
   * Statik dizi ise dogrudan kullanir; fonksiyon ise cagirir.
   */
  const resolveOptions = useCallback(
    async (levelIndex: number, parentValue: string) => {
      const levelDef = levels[levelIndex]
      if (levelDef === undefined) return
      const src = levelDef.options
      if (Array.isArray(src)) {
        // Statik kaynak: parentValue'ye gore filtreleme yapmiyoruz — cagiran
        // zaten dogru listeyi vermelidir. Ancak tipik kullanim senaryosunda
        // statik alt kademe icin cagiran tum secenekleri verir ve her secenegin
        // bir `parentKey` alani vardir. Bu filtreleme CascadingSelect'in
        // sorumlulugunun disindadir; cagiran dogru listeyi vermekle yukumludur.
        setResolvedOptions((prev) => ({ ...prev, [levelIndex]: src }))
        return
      }

      // Async kaynak
      const callId = Date.now()
      abortRef.current[levelIndex] = callId
      setLoadingLevels((prev) => ({ ...prev, [levelIndex]: true }))

      try {
        const result = await src(parentValue)
        // Eger bu arada yeni bir cagri yapildiysa bu sonucu yok say.
        if (abortRef.current[levelIndex] !== callId) return
        setResolvedOptions((prev) => ({ ...prev, [levelIndex]: result }))
      } finally {
        if (abortRef.current[levelIndex] === callId) {
          setLoadingLevels((prev) => ({ ...prev, [levelIndex]: false }))
        }
      }
    },
    [levels],
  )

  // Ust kademe degeri degistiginde alt kademenin seceneklerini cozumle.
  // Bu etki yalnizca value dizisindeki degisiklikleri izler.
  useEffect(() => {
    for (let i = 1; i < levels.length; i++) {
      const parentVal = value[i - 1]
      if (parentVal !== undefined) {
        resolveOptions(i, parentVal)
      } else {
        // Ust kademe secili degilse alt kademenin seceneklerini temizle.
        setResolvedOptions((prev) => {
          const next = { ...prev }
          delete next[i]
          return next
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels.length, resolveOptions, ...value])

  const handleChange = useCallback(
    (levelIndex: number, newVal: string | undefined) => {
      const newValues = [...value]
      // Yeni uzunlugu levels.length'e kadar doldur.
      while (newValues.length < levels.length) {
        newValues.push(undefined)
      }

      newValues[levelIndex] = newVal

      // Bu kademenin altindaki tum kademelerin secimini sifirla.
      for (let i = levelIndex + 1; i < levels.length; i++) {
        newValues[i] = undefined
      }

      onValueChange?.(newValues, levelIndex)
    },
    [value, levels.length, onValueChange],
  )

  return (
    <div className={css.root}>
      {levels.map((level: CascadingSelectLevel, i: number) => {
        const parentVal = i > 0 ? value[i - 1] : '__root__'
        const isDisabled =
          disabled || level.disabled === true || (i > 0 && parentVal === undefined)
        const isLoading = loadingLevels[i] === true
        const options = resolvedOptions[i] ?? []
        const searchable = options.length > SEARCHABLE_THRESHOLD

        return (
          <div key={i} className={css.level}>
            <Select
              label={level.label}
              placeholder={level.placeholder ?? 'Secin'}
              options={options}
              value={value[i]}
              onValueChange={(v) => handleChange(i, v)}
              size={size}
              disabled={isDisabled}
              loading={isLoading}
              searchable={searchable}
              {...(level.error !== undefined && { error: level.error })}
              {...(level.helperText !== undefined && {
                helperText: level.helperText,
              })}
            />
          </div>
        )
      })}
    </div>
  )
}
