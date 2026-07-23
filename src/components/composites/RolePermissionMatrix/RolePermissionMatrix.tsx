import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, CircleMinus, CirclePlus, Minus } from 'lucide-react'
import { ROLE_PERMISSIONS, type AdminPermission } from '../../../types/domain'
import { ADMIN_PERMISSION_LABEL, ADMIN_ROLE_LABEL } from '../../../domain/labels'
import { Checkbox } from '../../primitives/Checkbox'
import { Spinner } from '../../primitives/Spinner'
import { SearchInput } from '../../primitives/SearchInput'
import type { RolePermissionMatrixProps } from '../../../types/component-props'
import * as css from './RolePermissionMatrix.css'

/** Hücrenin tabana (`baseline`) göre okunuşu. */
type HucreDurumu = 'granted' | 'denied' | 'added' | 'removed'

interface HucreSunumu {
  icon: ReactNode
  /** Ekran okuyucuya okunan hücre içeriği; işaret görsel, bu metin değil. */
  text: string
  /** `cell` recipe'inin zemin varyantı. */
  change: 'unchanged' | 'added' | 'removed'
}

const HUCRE_SUNUMU = {
  granted: {
    icon: <Check size={18} strokeWidth={3} aria-hidden="true" />,
    text: 'Var',
    change: 'unchanged',
  },
  denied: {
    icon: <Minus size={18} aria-hidden="true" />,
    text: 'Yok',
    change: 'unchanged',
  },
  added: {
    icon: <CirclePlus size={18} aria-hidden="true" />,
    text: 'Var (eklendi)',
    change: 'added',
  },
  removed: {
    icon: <CircleMinus size={18} aria-hidden="true" />,
    text: 'Yok (kaldırıldı)',
    change: 'removed',
  },
} as const satisfies Record<HucreDurumu, HucreSunumu>

/**
 * Hücreyi tabandaki karşılığıyla kıyaslar.
 *
 * Taban `baseline`'dan gelir; verilmezse `ROLE_PERMISSIONS`'a düşer (Faz 2'nin
 * davranışı, geriye dönük uyum için korundu).
 */
function hucreDurumu(
  taban: readonly AdminPermission[],
  permission: AdminPermission,
  isaretli: boolean,
): HucreDurumu {
  if (taban.includes(permission) === isaretli) return isaretli ? 'granted' : 'denied'
  return isaretli ? 'added' : 'removed'
}

// ---------------------------------------------------------------------------
// Grup tanımları: izin enum adının önekine göre Türkçe grup etiketleri.
// ---------------------------------------------------------------------------

/** İzin enum değerinden grup anahtarını çıkarır: 'listing:view' => 'listing' */
function izinGrupKey(permission: AdminPermission): string {
  const colonIndex = permission.indexOf(':')
  return colonIndex !== -1 ? permission.slice(0, colonIndex) : 'other'
}

/** Grup anahtarından Türkçe etiket döndürür. */
const GRUP_ETIKETLERI: Record<string, string> = {
  dashboard: 'Dashboard',
  listing: 'İlan',
  promotion: 'Promosyon',
  user: 'Kullanıcı',
  category: 'Kategori',
  report: 'Şikayet',
  settings: 'Ayarlar',
  permission: 'İzin',
  theme: 'Tema',
  audit: 'Denetim',
}

// ---------------------------------------------------------------------------
// Arama vurgulama
// ---------------------------------------------------------------------------

/** Aranana göre etiket metninde eşleşen kısımları `<mark>` ile sarar. */
function vurgulayMetin(text: string, query: string): ReactNode {
  if (!query) return text
  const lowerText = text.toLocaleLowerCase('tr')
  const lowerQuery = query.toLocaleLowerCase('tr')
  const idx = lowerText.indexOf(lowerQuery)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className={css.highlightMark}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ---------------------------------------------------------------------------
// Debounce hook
// ---------------------------------------------------------------------------

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

/**
 * Rol × izin matrisi — brifing 1.4 yetki tablosunun ekrandaki hâli.
 *
 * **Satır izin, sütun rol.** 33 izin dört role karşı geliyor ve ters çevrilmiş
 * hâli (33 sütun) hiçbir ekrana sığmaz: başlıklar döndürülür ya da kırpılır,
 * ikisi de okunmaz. Bu yönde izin etiketi bir cümle uzunluğunda olabilir
 * ("Kullanıcı bilgisi düzenleme (sınırlı: ad, e-posta, telefon…)") ve satır
 * başlığı sarabildiği için sorun çıkarmaz. Yön ayrıca brifing 1.4'ün kendi
 * tablosuyla birebir: ekran şartnameyle satır satır karşılaştırılabilir kalır.
 *
 * **Her kutunun erişilebilir adı "rol + izin".** Ekranda 128 kutu var ve hepsi
 * "Seç" deseydi ekran okuyucu kullanıcısı hangisinde olduğunu ayırt edemezdi —
 * DataTable'ın her satırda "Satırı seç" okutan sapmasının aynısı, 32 katı. Ad
 * `hideLabel` ile gizleniyor (`clip`, `visibility` değil: `visibility: hidden`
 * adı erişilebilirlik ağacından siler).
 *
 * **`readOnly` kutu göstermez, işaret gösterir.** Devre dışı bırakılmış 128
 * kutuluk bir tarla "yetkin yok" ya da "bozuk" diye okunur; oysa salt okunur
 * matris çalışan bir cevaptır: "bu rol ne yapabilir". Onun yerine ikon artı
 * gizli metin ("Var" / "Yok") — renk tek başına durum taşımaz.
 *
 * **`diff`'in tabanını `baseline` söyler** (Faz 3'te eklendi); verilmezse
 * `ROLE_PERMISSIONS`'a düşer. Faz 2'de taban domain sabitine **gömülüydü** ve bu
 * yalnız kayıtlı izinler sabitle aynı kaldığı sürece doğruydu: `superAdmin` bir
 * izni kaydettiği an sunucunun gerçeği sabitten ayrılır ve matris o günden sonra
 * hiçbir şey değişmemişken "değişmiş" hücreler gösterirdi. Ayarlar ekranı artık
 * **kayıtlı** hâli taban veriyor, dolayısıyla diff "kaydetmeden önce neyi
 * değiştiriyorum" sorusunu cevaplıyor. `diff` düzenlenemez: orada karar verilir,
 * düzeltme için `editable`'a dönülür.
 *
 * **`disabled` yetki anlatmaz.** `permission:manage` izni olmayan kullanıcıya
 * kilitli matris değil `readOnly` matris verilir, ya da sayfa hiç render
 * edilmez. `saving` ayrı bir prop çünkü sebebi geçici ve söylenebilir: kullanıcı
 * beklediğini bilmeli, yetkisini sorgulamamalı.
 *
 * `onChange` verilmezse `editable` istense bile salt okunur davranır — sonuçsuz
 * kutu sunmanın anlamı yok. Gösterilecek satır ya da sütun yoksa hiç render
 * edilmez; "izin yok" mesajı sayfanın EmptyState'inin işi.
 *
 * @example
 * <RolePermissionMatrix
 *   roles={Object.values(AdminRole)}
 *   permissions={ALL_ADMIN_PERMISSIONS}
 *   value={taslakIzinler}
 *   onChange={(role, permission, enabled) => izniDegistir(role, permission, enabled)}
 * />
 */
export function RolePermissionMatrix({
  roles,
  permissions,
  value,
  baseline = ROLE_PERMISSIONS,
  variant = 'editable',
  disabled = false,
  saving = false,
  onChange,
  searchable = false,
  grouped = false,
}: RolePermissionMatrixProps) {
  if (roles.length === 0 || permissions.length === 0) return null

  /** Sonuçsuz kutu sunma: handler yoksa `editable` isteği salt okunura düşer. */
  const etkinVaryant = variant === 'editable' && onChange === undefined ? 'readOnly' : variant
  const kilitli = disabled || saving

  // --- Arama durumu ----------------------------------------------------------
  const [aramaMetni, setAramaMetni] = useState('')
  const debouncedArama = useDebounce(aramaMetni, 200)

  const suzulmusIzinler = useMemo(() => {
    if (!searchable || !debouncedArama) return permissions
    const q = debouncedArama.toLocaleLowerCase('tr')
    return permissions.filter((p) =>
      ADMIN_PERMISSION_LABEL[p].toLocaleLowerCase('tr').includes(q),
    )
  }, [permissions, debouncedArama, searchable])

  // --- Grup durumu -----------------------------------------------------------
  const [kapalıGruplar, setKapaliGruplar] = useState<Set<string>>(new Set())

  const gruplar = useMemo(() => {
    if (!grouped) return null
    const map = new Map<string, AdminPermission[]>()
    const sira: string[] = []
    for (const p of suzulmusIzinler) {
      const key = izinGrupKey(p)
      if (!map.has(key)) {
        map.set(key, [])
        sira.push(key)
      }
      map.get(key)!.push(p)
    }
    return sira.map((key) => ({
      key,
      label: GRUP_ETIKETLERI[key] ?? key,
      permissions: map.get(key)!,
    }))
  }, [grouped, suzulmusIzinler])

  const grupToggle = useCallback((key: string) => {
    setKapaliGruplar((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  // --- Diff sayacı -----------------------------------------------------------
  const degisenSayisi =
    etkinVaryant === 'diff'
      ? suzulmusIzinler.reduce(
          (toplam, permission) =>
            toplam +
            roles.filter((role) => {
              const durum = hucreDurumu(
                baseline[role],
                permission,
                value[role].includes(permission),
              )
              return durum === 'added' || durum === 'removed'
            }).length,
          0,
        )
      : 0

  /*
    Tablonun erişilebilir adı ve boyutu. Görsel kullanıcı sütun başlıklarını
    tek bakışta sayar; ekran okuyucu kullanıcısı matrise girmeden önce neyle
    karşılaşacağını yalnız buradan öğrenir.
  */
  const captionMetni =
    `Rol ve izin matrisi: ${suzulmusIzinler.length} izin satırı, ${roles.length} rol sütunu. ` +
    (etkinVaryant === 'editable'
      ? 'Her hücre işaretlenebilir bir kutudur.'
      : etkinVaryant === 'readOnly'
        ? 'Salt okunur.'
        : `Salt okunur; ${degisenSayisi} hücre önceki hâlinden farklı.`)

  // --- Satır render yardımcıları ---------------------------------------------

  const renderPermissionRow = (permission: AdminPermission) => (
    <tr key={permission}>
      <th scope="row" className={css.permissionHeader}>
        {searchable && debouncedArama
          ? vurgulayMetin(ADMIN_PERMISSION_LABEL[permission], debouncedArama)
          : ADMIN_PERMISSION_LABEL[permission]}
      </th>

      {roles.map((role) => {
        const isaretli = value[role].includes(permission)

        if (etkinVaryant === 'editable') {
          return (
            <td key={role} className={css.cell({ change: 'unchanged' })}>
              <Checkbox
                label={`${ADMIN_ROLE_LABEL[role]} — ${ADMIN_PERMISSION_LABEL[permission]}`}
                hideLabel
                checked={isaretli}
                disabled={kilitli}
                onCheckedChange={(next) => onChange?.(role, permission, next)}
              />
            </td>
          )
        }

        const gosterim: HucreDurumu =
          etkinVaryant === 'diff'
            ? hucreDurumu(baseline[role], permission, isaretli)
            : isaretli
              ? 'granted'
              : 'denied'
        const sunum = HUCRE_SUNUMU[gosterim]

        return (
          <td key={role} className={css.cell({ change: sunum.change })}>
            <span className={css.mark({ state: gosterim })}>
              {sunum.icon}
              <span className={css.visuallyHidden}>{sunum.text}</span>
            </span>
          </td>
        )
      })}
    </tr>
  )

  // --- Özet satırı -----------------------------------------------------------

  const summaryRow = (izinListesi: AdminPermission[]) => (
    <tr className={css.summaryRow}>
      <th scope="row" className={css.summaryHeader}>
        Toplam
      </th>
      {roles.map((role) => {
        const granted = izinListesi.filter((p) => value[role].includes(p)).length
        return (
          <td key={role} className={css.summaryCell}>
            {granted} / {izinListesi.length}
          </td>
        )
      })}
    </tr>
  )

  // --- Tablo gövdesi ---------------------------------------------------------

  const tableBody = () => {
    if (grouped && gruplar) {
      return gruplar.map((grup) => {
        const kapali = kapalıGruplar.has(grup.key)
        return (
          <tbody key={grup.key}>
            <tr
              className={css.groupHeader}
              onClick={() => grupToggle(grup.key)}
              role="button"
              aria-expanded={!kapali}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  grupToggle(grup.key)
                }
              }}
            >
              <th
                colSpan={roles.length + 1}
                className={css.groupHeaderCell}
              >
                <span
                  className={`${css.groupToggleIcon} ${kapali ? css.groupToggleIconCollapsed : ''}`}
                >
                  <ChevronDown size={16} aria-hidden="true" />
                </span>
                {grup.label}
                <span className={css.visuallyHidden}>
                  {` — ${grup.permissions.length} izin, ${kapali ? 'daraltilmis' : 'genisletilmis'}`}
                </span>
              </th>
            </tr>
            {!kapali && grup.permissions.map(renderPermissionRow)}
          </tbody>
        )
      })
    }

    return <tbody>{suzulmusIzinler.map(renderPermissionRow)}</tbody>
  }

  return (
    <div className={css.root}>
      {searchable ? (
        <div className={css.searchContainer}>
          <SearchInput
            label="Yetki ara"
            placeholder="Yetki adina gore filtrele..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            onClear={() => setAramaMetni('')}
            debounceMs={9999}
          />
          {debouncedArama ? (
            <p className={css.searchMeta}>
              {suzulmusIzinler.length} / {permissions.length} yetki gösteriliyor
            </p>
          ) : null}
        </div>
      ) : null}

      {etkinVaryant === 'diff' ? (
        <div className={css.diffBar}>
          <span className={css.diffCount}>
            {degisenSayisi === 0
              ? 'Önceki hâline göre değişiklik yok'
              : `${degisenSayisi.toLocaleString('tr-TR')} hücre önceki hâlinden farklı`}
          </span>

          <ul className={css.legend}>
            <li className={css.legendItem}>
              <span className={css.mark({ state: 'added' })}>{HUCRE_SUNUMU.added.icon}</span>
              İzin verildi
            </li>
            <li className={css.legendItem}>
              <span className={css.mark({ state: 'removed' })}>{HUCRE_SUNUMU.removed.icon}</span>
              İzin kaldırıldı
            </li>
          </ul>
        </div>
      ) : null}

      {saving ? (
        <p className={css.savingBar}>
          <Spinner size="sm" label="İzinler kaydediliyor" />
          <span aria-hidden="true">İzinler kaydediliyor…</span>
        </p>
      ) : null}

      {searchable && debouncedArama && suzulmusIzinler.length === 0 ? (
        <p className={css.emptySearch}>Aramanızla eşleşen yetki bulunamadı</p>
      ) : (
        <div className={css.scroller} tabIndex={0}>
          <table className={css.table} aria-busy={saving}>
            <caption className={css.visuallyHidden}>{captionMetni}</caption>

            <thead>
              <tr>
                <th scope="col" className={css.cornerHeader}>
                  İzin
                </th>

                {roles.map((role) => (
                  <th key={role} scope="col" className={css.roleHeader}>
                    {ADMIN_ROLE_LABEL[role]}
                  </th>
                ))}
              </tr>
            </thead>

            {tableBody()}

            <tfoot>{summaryRow(suzulmusIzinler)}</tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
