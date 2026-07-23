import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { ChevronDown, ChevronRight, EyeOff } from 'lucide-react'
import { Badge } from '../../primitives/Badge'
import { Skeleton } from '../../primitives/Skeleton'
import { SearchInput } from '../../primitives/SearchInput'
import { EmptyState } from '../EmptyState'
import type { CategoryTreeNode, CategoryTreeProps } from '../../../types/component-props'
import * as css from './CategoryTree.css'

/** Ağacın görünür hâlinin tek bir satırı. */
interface DuzDugum {
  node: CategoryTreeNode
  /** 1 tabanlı; `aria-level` doğrudan bunu alır. */
  seviye: number
  /** Kökte `null`. Yaprakta sol ok bununla ataya çıkar. */
  ebeveynId: string | null
}

/**
 * Ağacı **o an ekranda görünen** sırayla düzleştirir.
 *
 * Klavye gezinmesinin tamamı bu listeye dayanır: "aşağı ok" DOM'daki bir sonraki
 * kardeş değil, kullanıcının gözünün gittiği bir sonraki satırdır — kapalı bir
 * dalın çocukları aradan atlanmalı, açık bir dalınkiler araya girmelidir.
 * Kapalı düğümlerin çocukları hiç render edilmediği için liste DOM ile birebir.
 */
function gorunurDugumler(
  nodes: CategoryTreeNode[],
  expandedIds: string[],
  seviye = 1,
  ebeveynId: string | null = null,
): DuzDugum[] {
  return nodes.flatMap((node) => {
    const cocuklar = node.children ?? []
    const acik = cocuklar.length > 0 && expandedIds.includes(node.id)

    return [
      { node, seviye, ebeveynId },
      ...(acik ? gorunurDugumler(cocuklar, expandedIds, seviye + 1, node.id) : []),
    ]
  })
}

/**
 * `--kategori-agaci-derinlik` özel değişkenini taşıyan inline `style`.
 *
 * `CSSProperties`'in index imzası bilerek kaldırılmış (bkz. `@types/react`);
 * özel değişken için tipi kesişimle genişletmek, `as CSSProperties` cast'ından
 * daha dar bir kapı — yalnız bu tek değişkenin adı açılıyor.
 */
type DerinlikStili = CSSProperties & Record<typeof css.DERINLIK_VAR, string>

const derinlikStili = (seviye: number): DerinlikStili => ({
  [css.DERINLIK_VAR]: String(seviye - 1),
})

/* ── Arama yardımcıları ──────────────────────────────────────────────────── */

/**
 * Ağacı arama terimine göre süzer; hiyerarşiyi korur.
 *
 * Bir düğüm sonuca dahil edilir:
 * - kendi etiketi eşleşiyorsa, **veya**
 * - herhangi bir torunu eşleşiyorsa (ata olarak korunur).
 *
 * Dönen ağaçta yalnız eşleşen dallar kalır; eşleşme yoksa boş dizi döner.
 */
function filterTree(
  nodes: CategoryTreeNode[],
  term: string,
): CategoryTreeNode[] {
  const lower = term.toLocaleLowerCase('tr-TR')

  return nodes.reduce<CategoryTreeNode[]>((sonuc, node) => {
    const etiketEslesiyor = node.label.toLocaleLowerCase('tr-TR').includes(lower)
    const suzulmusCocuklar = filterTree(node.children ?? [], term)

    if (etiketEslesiyor || suzulmusCocuklar.length > 0) {
      const cocuklar = suzulmusCocuklar.length > 0 ? suzulmusCocuklar : (node.children ?? [])
      sonuc.push({
        ...node,
        children: cocuklar,
      })
    }

    return sonuc
  }, [])
}

/** Ağaçtaki tüm düğüm id'lerini toplar (tümünü aç için). */
function tumIdler(nodes: CategoryTreeNode[]): string[] {
  return nodes.flatMap((node) => {
    const cocuklar = node.children ?? []
    return cocuklar.length > 0
      ? [node.id, ...tumIdler(cocuklar)]
      : []
  })
}

/**
 * Süzülmüş ağaçta eşleşen (yaprak seviyesinde veya doğrudan eşleşen) düğüm
 * sayısını hesaplar.
 */
function eslesenSay(nodes: CategoryTreeNode[], term: string): number {
  const lower = term.toLocaleLowerCase('tr-TR')
  let toplam = 0

  for (const node of nodes) {
    if (node.label.toLocaleLowerCase('tr-TR').includes(lower)) {
      toplam++
    }
    toplam += eslesenSay(node.children ?? [], term)
  }

  return toplam
}

/** Süzülmüş ağaçtaki dal (çocuklu) düğümlerin id'lerini toplar. */
function dalIdleri(nodes: CategoryTreeNode[]): string[] {
  return nodes.flatMap((node) => {
    const cocuklar = node.children ?? []
    return cocuklar.length > 0
      ? [node.id, ...dalIdleri(cocuklar)]
      : []
  })
}

/**
 * Etiket metninde arama terimini `<mark>` ile vurgular.
 *
 * Eşleşme yoksa düz metin döner. Birden fazla eşleşme varsa hepsi vurgulanır.
 * Büyük/küçük harf Türkçe locale ile karşılaştırılır ama orijinal metin korunur.
 */
function vurgulayarak(etiket: string, term: string): ReactNode {
  if (term === '') return etiket

  const lower = etiket.toLocaleLowerCase('tr-TR')
  const termLower = term.toLocaleLowerCase('tr-TR')
  const parcalar: ReactNode[] = []
  let kalan = 0

  while (kalan < etiket.length) {
    const idx = lower.indexOf(termLower, kalan)
    if (idx === -1) {
      parcalar.push(etiket.slice(kalan))
      break
    }

    if (idx > kalan) {
      parcalar.push(etiket.slice(kalan, idx))
    }

    parcalar.push(
      <mark key={idx} className={css.highlight}>
        {etiket.slice(idx, idx + term.length)}
      </mark>,
    )

    kalan = idx + term.length
  }

  return parcalar
}

/**
 * Kategori hiyerarşisi: kategori ve öznitelik yönetiminin gezinme ağacı.
 *
 * **Açıklık kontrollü, odak değil.** `expandedIds` dışarıdan gelir ve ağaç kendi
 * kopyasını tutmaz — derin bir düğüm seçiliyken atalarının açık gelmesi gerekir
 * ve o yolu ancak veriyi bilen katman kurabilir. Odak ise bir sözleşme değil,
 * tarayıcı durumu: roving tabindex'i (ağacın tamamı tek Tab durağı) ağacın
 * kendisi yönetir. Odaklanan düğüm türetilir, saklanmaz: odaklanan satır kaybolursa
 * (çağıran atasını kapattı) sıra seçili düğüme, o da yoksa ilk köke düşer —
 * ağaç hiçbir zaman Tab ile girilemez hâle gelmez.
 *
 * **Satıra tıklamak seçer ve açar, asla kapatmaz.** Üç kural bir noktada
 * kesişiyordu: brifingin 44 piksellik dokunma hedefi, "kategori düğümü seçme"
 * eyleminin birincil olması (brifing 2.7) ve okun dar kolonda 24 pikselden
 * geniş olamaması. Seçim kapatsaydı, "Konut"a bakmak isteyen kullanıcı yedi alt
 * kategorisini kaybederdi; seçim açmasaydı, dokunmatik kullanıcının elinde 44
 * piksellik bir açma hedefi kalmazdı. Kapatmak bilinçli bir eylem olarak okta ve
 * sol ok tuşunda durur.
 *
 * **Düğümün adı satırdan gelir, alt ağacından değil.** `aria-labelledby` satır
 * kutusunu gösteriyor; gösterilmeseydi `treeitem`'ın adı "içerikten" hesaplanır
 * ve içine gömülü `role="group"` da hesaba katılırdı — açık Konut düğümü
 * ekran okuyucuda "Konut Daire Rezidans Müstakil Ev..." diye okunurdu.
 *
 * **Pasiflik renkle bırakılmaz.** `active: false` düğüm solar ama gizlenmez;
 * solma tek gösterge olmasın diye `panel`'de "Pasif" rozeti, dar varyantlarda
 * ikon + gizli metin eşlik eder.
 *
 * Hata kanalı **yok**: `CategoryTreeProps`'ta bir `error` alanı bulunmuyor ve
 * uydurulmadı — ağaç veri çekmez, çekemediğini de bilemez. Yükleme başarısızsa
 * sayfa ağacın yerine `ErrorState` gösterir.
 *
 * @example
 * <CategoryTree
 *   nodes={kategoriAgaci}
 *   selectedId={secili}
 *   expandedIds={acikDugumler}
 *   variant="sidebar"
 *   onSelect={setSecili}
 *   onExpandedIdsChange={setAcikDugumler}
 * />
 */
export function CategoryTree({
  nodes,
  selectedId,
  expandedIds,
  variant = 'sidebar',
  loading = false,
  onSelect,
  onExpandedIdsChange,
  searchable = false,
  showExpandControls = false,
}: CategoryTreeProps) {
  const idOneki = useId()
  /** Klavye odağı DOM'a ancak elemanın kendisinden verilebilir. */
  const dugumRefleri = useRef(new Map<string, HTMLLIElement>())
  const [odaklanan, setOdaklanan] = useState<string | null>(null)

  /* ── Arama durumu ──────────────────────────────────────────────────────── */
  const [aramaTerimi, setAramaTerimi] = useState('')
  /**
   * Arama başlamadan önceki açık düğüm listesi. Arama temizlenince bu listeye
   * geri dönülür; arama sırasında ağaç otomatik açıldığı için kullanıcının
   * önceki durumu kaybolmamalı.
   */
  const aramaOncesiAcikRef = useRef<string[] | null>(null)

  const aramaAktif = aramaTerimi !== ''

  const handleSearch = useCallback(
    (value: string) => {
      if (value !== '' && aramaOncesiAcikRef.current === null) {
        aramaOncesiAcikRef.current = expandedIds
      }

      setAramaTerimi(value)

      if (value === '') {
        /* Arama temizlendi: önceki duruma dön. */
        if (aramaOncesiAcikRef.current !== null) {
          onExpandedIdsChange(aramaOncesiAcikRef.current)
          aramaOncesiAcikRef.current = null
        }
      }
    },
    [expandedIds, onExpandedIdsChange],
  )

  const handleSearchClear = useCallback(() => {
    handleSearch('')
  }, [handleSearch])

  /* Süzülmüş ağaç ve otomatik açılacak dallar. */
  const suzulmusAgac = useMemo(() => {
    if (!aramaAktif) return nodes
    return filterTree(nodes, aramaTerimi)
  }, [nodes, aramaTerimi, aramaAktif])

  const eslesenSayisi = useMemo(() => {
    if (!aramaAktif) return 0
    return eslesenSay(nodes, aramaTerimi)
  }, [nodes, aramaTerimi, aramaAktif])

  /* Arama sırasında eşleşen dalları otomatik aç. */
  const aramaExpandIds = useMemo(() => {
    if (!aramaAktif) return expandedIds
    return dalIdleri(suzulmusAgac)
  }, [aramaAktif, suzulmusAgac, expandedIds])

  const aktifExpandedIds = aramaAktif ? aramaExpandIds : expandedIds

  if (loading) {
    return (
      <div className={css.root({ variant })} aria-busy="true">
        {/* Altı satır: brifing 1.1'in kök kategori sayısı. Veri gelince düzen zıplamaz. */}
        <Skeleton lines={6} />
      </div>
    )
  }

  if (nodes.length === 0) {
    return (
      <EmptyState
        variant="compact"
        title="Kategori yok"
        description="Gösterilecek kategori tanımı bulunamadı. Ağaç sunucudan gelir; boşluk bir yapılandırma eksikliğine işaret eder."
      />
    )
  }

  /* ── Tümünü aç / kapat ─────────────────────────────────────────────── */
  const tumunuAc = () => {
    onExpandedIdsChange(tumIdler(nodes))
  }

  const tumunuKapat = () => {
    onExpandedIdsChange([])
  }

  const gosterilecekAgac = suzulmusAgac
  const duzListe = gorunurDugumler(gosterilecekAgac, aktifExpandedIds)
  const gorunurMu = (id: string) => duzListe.some((duz) => duz.node.id === id)

  const odakId =
    odaklanan !== null && gorunurMu(odaklanan)
      ? odaklanan
      : selectedId !== undefined && gorunurMu(selectedId)
        ? selectedId
        : (duzListe[0]?.node.id ?? null)

  const odakla = (id: string) => {
    setOdaklanan(id)
    dugumRefleri.current.get(id)?.focus()
  }

  const ac = (id: string) => {
    if (!aktifExpandedIds.includes(id)) onExpandedIdsChange([...aktifExpandedIds, id])
  }

  const kapat = (id: string) => {
    onExpandedIdsChange(aktifExpandedIds.filter((acikId) => acikId !== id))
  }

  /** Satırın birincil eylemi: seç, dallıysa aç. Bkz. component JSDoc'u. */
  const satirSecildi = (node: CategoryTreeNode) => {
    onSelect(node.id)
    if ((node.children ?? []).length > 0) ac(node.id)
  }

  const tusaBasildi = (event: KeyboardEvent<HTMLUListElement>) => {
    if (odakId === null) return

    const indeks = duzListe.findIndex((duz) => duz.node.id === odakId)
    const gecerli = duzListe[indeks]
    if (gecerli === undefined) return

    const cocuklar = gecerli.node.children ?? []
    const acilabilir = cocuklar.length > 0
    const acik = acilabilir && aktifExpandedIds.includes(gecerli.node.id)

    switch (event.key) {
      case 'ArrowDown': {
        const sonraki = duzListe[indeks + 1]
        if (sonraki !== undefined) odakla(sonraki.node.id)
        break
      }

      case 'ArrowUp': {
        const onceki = duzListe[indeks - 1]
        if (onceki !== undefined) odakla(onceki.node.id)
        break
      }

      case 'ArrowRight': {
        if (!acilabilir) return
        if (acik) {
          const ilkCocuk = duzListe[indeks + 1]
          if (ilkCocuk !== undefined) odakla(ilkCocuk.node.id)
        } else {
          ac(gecerli.node.id)
        }
        break
      }

      case 'ArrowLeft': {
        if (acik) {
          kapat(gecerli.node.id)
        } else if (gecerli.ebeveynId !== null) {
          odakla(gecerli.ebeveynId)
        } else {
          return
        }
        break
      }

      case 'Home': {
        const ilk = duzListe[0]
        if (ilk !== undefined) odakla(ilk.node.id)
        break
      }

      case 'End': {
        const son = duzListe[duzListe.length - 1]
        if (son !== undefined) odakla(son.node.id)
        break
      }

      case 'Enter':
      case ' ': {
        satirSecildi(gecerli.node)
        break
      }

      default:
        return
    }

    event.preventDefault()
  }

  const dallariCiz = (liste: CategoryTreeNode[], seviye: number): ReactNode =>
    liste.map((node) => {
      const cocuklar = node.children ?? []
      const acilabilir = cocuklar.length > 0
      const acik = acilabilir && aktifExpandedIds.includes(node.id)
      const secili = node.id === selectedId
      const satirId = `${idOneki}-${node.id}`

      return (
        <li
          key={node.id}
          role="treeitem"
          aria-level={seviye}
          aria-labelledby={satirId}
          {...(acilabilir && { 'aria-expanded': acik })}
          {...(secili && { 'aria-selected': true })}
          tabIndex={node.id === odakId ? 0 : -1}
          className={css.item}
          ref={(el) => {
            if (el !== null) dugumRefleri.current.set(node.id, el)
            return () => {
              dugumRefleri.current.delete(node.id)
            }
          }}
          onFocus={(event) => {
            if (event.target === event.currentTarget) setOdaklanan(node.id)
          }}
        >
          <div
            id={satirId}
            className={css.row({ variant, selected: secili, passive: !node.active })}
            style={derinlikStili(seviye)}
            onClick={() => satirSecildi(node)}
          >
            {acilabilir ? (
              <span
                className={css.toggle}
                aria-hidden="true"
                onClick={(event) => {
                  event.stopPropagation()
                  if (acik) kapat(node.id)
                  else ac(node.id)
                }}
              >
                <ChevronRight size={16} className={css.chevron({ open: acik })} />
              </span>
            ) : (
              <span className={css.togglePlaceholder} aria-hidden="true" />
            )}

            <span className={css.label}>
              {aramaAktif ? vurgulayarak(node.label, aramaTerimi) : node.label}
            </span>

            {node.active ? null : variant === 'panel' ? (
              <span className={css.badgeSlot}>
                <Badge tone="neutral" size="sm">
                  Pasif
                </Badge>
              </span>
            ) : (
              <>
                <span className={css.passiveIcon} aria-hidden="true">
                  <EyeOff size={14} />
                </span>
                <span className={css.visuallyHidden}>Pasif</span>
              </>
            )}

            {node.count !== undefined ? (
              <span className={css.count}>
                {node.count.toLocaleString('tr-TR')}
                <span className={css.visuallyHidden}> ilan</span>
              </span>
            ) : null}
          </div>

          {acik ? (
            <ul role="group" className={css.list}>
              {dallariCiz(cocuklar, seviye + 1)}
            </ul>
          ) : null}
        </li>
      )
    })

  const aramaVeKontrollerVar = searchable || showExpandControls

  return (
    <div className={css.root({ variant })}>
      {aramaVeKontrollerVar ? (
        <div className={css.toolbar}>
          {searchable ? (
            <div className={css.searchContainer}>
              <SearchInput
                label="Kategori ara"
                placeholder="Kategori ara..."
                onSearch={handleSearch}
                onClear={handleSearchClear}
                debounceMs={300}
                size="sm"
              />
              {aramaAktif ? (
                <span className={css.matchCount} aria-live="polite">
                  {eslesenSayisi > 0
                    ? `${eslesenSayisi} sonuç bulundu`
                    : null}
                </span>
              ) : null}
            </div>
          ) : null}

          {showExpandControls && !aramaAktif ? (
            <div className={css.expandControls}>
              <button
                type="button"
                className={css.expandButton}
                onClick={tumunuAc}
              >
                <ChevronDown size={14} />
                Tümünü aç
              </button>
              <button
                type="button"
                className={css.expandButton}
                onClick={tumunuKapat}
              >
                <ChevronRight size={14} />
                Tümünü kapat
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {aramaAktif && suzulmusAgac.length === 0 ? (
        <EmptyState
          variant="compact"
          title="Sonuç bulunamadı"
          description="Aramanızla eşleşen kategori bulunamadı"
        />
      ) : (
        <ul role="tree" aria-label="Kategori ağacı" className={css.list} onKeyDown={tusaBasildi}>
          {dallariCiz(gosterilecekAgac, 1)}
        </ul>
      )}
    </div>
  )
}
