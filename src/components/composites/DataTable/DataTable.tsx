import { useRef, useState, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ArrowDown, ArrowUp, ChevronsUpDown, Columns3, Download, Filter } from 'lucide-react'
import { Checkbox } from '../../primitives/Checkbox'
import { DropdownMenu, DropdownMenuItem, DropdownMenuCheckboxItem } from '../../primitives/DropdownMenu'
import { Input } from '../../primitives/Input'
import { Skeleton } from '../../primitives/Skeleton'
import { Spinner } from '../../primitives/Spinner'
import { ErrorState } from '../ErrorState'
import type { ColumnDef, DataTableProps, SortRule } from '../../../types/component-props'
import * as css from './DataTable.css'

/**
 * Sıralama, seçim ve yoğun veri gösterimi.
 *
 * Generic'tir ve satır tipini korur: `DataTable<Listing>` içinde `cell` fonksiyonu
 * `Listing` alır, `unknown` değil — brifingin "generic DataTable satır tipini
 * korumalıdır" kriteri budur.
 *
 * `mobileMode` dar ekranda ne olacağını belirler ve viewport'a **kendisi** bakar:
 * - `scroll`: tablo yatay kaydırılır. Sütunlar önemliyse (audit log) uygundur.
 * - `cards`: 48rem'in altında her satır karta dönüşür, üstünde tablo kalır.
 *   Okunabilirlik önemliyse (ilan listesi) uygundur; `renderMobileCard` ile satırın
 *   kart görünümü verilir. İki dal da DOM'da durur, birini medya sorgusu boyar —
 *   tüketici viewport'a göre dal seçmez, yalnız `mobileMode="cards"` der.
 *
 * Sıralanabilir başlıklar `<button>`'dır — `<th onClick>` klavyeyle erişilemez.
 *
 * Veri çekmez: satırlar `rows` prop'undan gelir.
 *
 * @example
 * <DataTable<Listing> rows={ilanlar} columns={sutunlar} selectable onSelectionChange={setSecili} />
 */
export function DataTable<T extends { id: string }>({
  rows,
  columns,
  rowKey,
  rowLabel,
  density: densityProp = 'comfortable',
  visualStyle = 'plain',
  mobileMode = 'scroll',
  loading = false,
  error,
  onRetry,
  emptyState,
  selectable = false,
  selectedIds = [],
  sort,
  sortRules,
  stickyHeader = false,
  toolbar,
  hiddenColumnIds,
  columnFilters,
  onSelectionChange,
  onSortChange,
  onSortRulesChange,
  onDensityChange,
  onHiddenColumnsChange,
  onColumnFiltersChange,
  onRowClick,
  renderMobileCard,
  virtualize,
  totalRowCount,
  onSelectAllAcrossPages,
  onClearSelection,
  selectAllMode = 'page',
  onExport,
  exportable = false,
  columnHeaderFilters,
  onColumnHeaderFilterChange,
}: DataTableProps<T>) {
  const anahtar = (row: T) => rowKey?.(row) ?? row.id

  /*
    Yoğunluk hibrit: `onDensityChange` verilirse kontrollü (çağıran `density`'yi
    tutar), verilmezse yönetilen (tablo kendi durumunu tutar). Parametre
    `densityProp` adını alıyor ki efektif değer düz `density` olarak kalsın —
    aşağıdaki tüm `css.th({ density })` / `css.td({ density })` kullanımları
    değişmeden efektif yoğunluğu okur.
  */
  const [yonetilenYogunluk, setYonetilenYogunluk] = useState(densityProp)
  const density = onDensityChange !== undefined ? densityProp : yonetilenYogunluk
  const yogunlukDegistir = (sonraki: 'comfortable' | 'compact') => {
    if (onDensityChange !== undefined) onDensityChange(sonraki)
    else setYonetilenYogunluk(sonraki)
  }

  /*
    Sütun görünürlüğü hibrit: `onHiddenColumnsChange` verilirse kontrollü,
    verilmezse yönetilen (`hiddenColumnIds` başlangıç değeri). Hideable olmayan
    sütunlar her zaman görünür — yalnız görünür olanlar render edilir; menü
    yalnız hideable olanları listeler.
  */
  const [yonetilenGizli, setYonetilenGizli] = useState<string[]>(hiddenColumnIds ?? [])
  const gizliSutunIdleri =
    onHiddenColumnsChange !== undefined ? (hiddenColumnIds ?? []) : yonetilenGizli
  const gizliDegistir = (sonraki: string[]) => {
    if (onHiddenColumnsChange !== undefined) onHiddenColumnsChange(sonraki)
    else setYonetilenGizli(sonraki)
  }
  const sutunGizle = (id: string, gizli: boolean) => {
    gizliDegistir(gizli ? [...gizliSutunIdleri, id] : gizliSutunIdleri.filter((x) => x !== id))
  }
  const hideableSutunlar = columns.filter((s) => s.hideable === true)
  const gorunurSutunlar = columns.filter((s) => !gizliSutunIdleri.includes(s.id))
  const sutunSayisi = gorunurSutunlar.length + (selectable ? 1 : 0)

  /*
    Sıralama üç mod:
    - `onSortChange` verilirse ESKI tek-kolon kontrollü (mevcut 12 tüketici, değişmez).
    - `onSortRulesChange` verilirse çoklu kontrollü (çağıran veriyi sıralar).
    - İkisi de yoksa YÖNETİLEN: tablo dahili kurallar tutar ve `sortAccessor` ile
      client-side sıralar; shift+tık ikincil kural ekler.
    `efektifKurallar` görünüm (ikon + öncelik rozeti) için tek listeye indirger.
  */
  const eskiSort = onSortChange !== undefined
  const cokluKontrollu = onSortRulesChange !== undefined
  const yonetilenSort = !eskiSort && !cokluKontrollu
  const [yonetilenKurallar, setYonetilenKurallar] = useState<SortRule[]>(sortRules ?? [])
  const efektifKurallar: SortRule[] = eskiSort
    ? sort !== undefined
      ? [sort]
      : []
    : cokluKontrollu
      ? (sortRules ?? [])
      : yonetilenKurallar

  /*
    Sütun-içi filtre hibrit: `onColumnFiltersChange` verilirse kontrollü,
    verilmezse yönetilen (`filterAccessor` ile client-side). `toolbar.filters`
    açıkken başlığın altına filtre satırı çizilir.
  */
  const filtreKontrollu = onColumnFiltersChange !== undefined
  const yonetilenFiltre = !filtreKontrollu
  const [yonetilenFiltreler, setYonetilenFiltreler] = useState<Record<string, string>>(
    columnFilters ?? {},
  )
  const efektifFiltreler = filtreKontrollu ? (columnFilters ?? {}) : yonetilenFiltreler
  const filtreDegistir = (columnId: string, deger: string) => {
    const sonraki = { ...efektifFiltreler }
    if (deger === '') delete sonraki[columnId]
    else sonraki[columnId] = deger
    if (filtreKontrollu) onColumnFiltersChange?.(sonraki)
    else setYonetilenFiltreler(sonraki)
  }
  const filtrelenebilirSutunVar = gorunurSutunlar.some((s) => s.filterable === true)

  /*
    Sütun-başlık-içi filtre popover'ları (iStoc B2B tarzı). Her sütunun başlığında
    huni ikonu gösterir; tıklayınca popover açılır. Filtre değerleri ayrı bir
    `Record<string, unknown>` haritasında tutulur.
  */
  const baslikFiltreKontrollu = onColumnHeaderFilterChange !== undefined
  const [yonetilenBaslikFiltreler, setYonetilenBaslikFiltreler] = useState<Record<string, unknown>>(
    (columnHeaderFilters as Record<string, unknown>) ?? {},
  )
  const efektifBaslikFiltreler: Record<string, unknown> = baslikFiltreKontrollu
    ? ((columnHeaderFilters as Record<string, unknown>) ?? {})
    : yonetilenBaslikFiltreler

  const baslikFiltreDegistir = (columnId: string, deger: unknown) => {
    const sonraki = { ...efektifBaslikFiltreler }
    if (deger === undefined || deger === null || deger === '') {
      delete sonraki[columnId]
    } else {
      sonraki[columnId] = deger
    }
    if (baslikFiltreKontrollu) onColumnHeaderFilterChange?.(sonraki)
    else setYonetilenBaslikFiltreler(sonraki)
  }

  const baslikFiltreTemizle = (columnId: string) => {
    const sonraki = { ...efektifBaslikFiltreler }
    delete sonraki[columnId]
    if (baslikFiltreKontrollu) onColumnHeaderFilterChange?.(sonraki)
    else setYonetilenBaslikFiltreler(sonraki)
  }

  // Açık popover'ı izle — bir seferde tek popover açık olabilir.
  const [acikPopover, setAcikPopover] = useState<string | null>(null)

  /*
    Araç çubuğu yalnız `toolbar` verilince çizilir (bugünkü tüketiciler
    etkilenmez). Veri olan dallarda (loading + tablo/kart) gösterilir; error/empty
    tam-blok durumlarında kontrol edilecek bir tablo yok, o yüzden gizli.
  */
  const disaAktarmaAcik = exportable || toolbar?.export === true
  const secimVar = selectedIds.length > 0
  const araclarVar = toolbar !== undefined || disaAktarmaAcik
  const aracCubugu = araclarVar ? (
    <div className={css.toolbar}>
      {toolbar?.density === true ? (
        <div className={css.segmented} role="group" aria-label="Satır yoğunluğu">
          <button
            type="button"
            className={css.segmentButton({ active: density === 'comfortable' })}
            aria-pressed={density === 'comfortable'}
            onClick={() => yogunlukDegistir('comfortable')}
          >
            Rahat
          </button>
          <button
            type="button"
            className={css.segmentButton({ active: density === 'compact' })}
            aria-pressed={density === 'compact'}
            onClick={() => yogunlukDegistir('compact')}
          >
            Sıkışık
          </button>
        </div>
      ) : null}

      {toolbar?.columns === true && hideableSutunlar.length > 0 ? (
        <DropdownMenu
          label="Sütunları göster veya gizle"
          align="end"
          trigger={
            <>
              <Columns3 size={16} aria-hidden="true" className={css.toolbarIcon} /> Sütunlar
            </>
          }
        >
          {hideableSutunlar.map((sutun) => {
            const gorunur = !gizliSutunIdleri.includes(sutun.id)
            // En az bir sütun görünür kalmalı: son görünür sütunun kutusu kilitlenir.
            const sonGorunur = gorunur && gorunurSutunlar.length === 1
            return (
              <DropdownMenuCheckboxItem
                key={sutun.id}
                checked={gorunur}
                disabled={sonGorunur}
                onCheckedChange={(sonraki) => sutunGizle(sutun.id, !sonraki)}
              >
                {sutun.header}
              </DropdownMenuCheckboxItem>
            )
          })}
        </DropdownMenu>
      ) : null}

      {disaAktarmaAcik && onExport !== undefined ? (
        <DropdownMenu
          label="Dışa aktar"
          align="end"
          trigger={
            <span className={css.exportButton}>
              <Download size={16} aria-hidden="true" className={css.toolbarIcon} /> Dışa aktar
            </span>
          }
        >
          <DropdownMenuItem onSelect={() => onExport('csv', false)}>
            CSV olarak dışa aktar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onExport('xlsx', false)}>
            Excel olarak dışa aktar
          </DropdownMenuItem>
          {secimVar ? (
            <>
              <DropdownMenuItem onSelect={() => onExport('csv', true)}>
                Seçilenleri CSV olarak dışa aktar
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onExport('xlsx', true)}>
                Seçilenleri Excel olarak dışa aktar
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenu>
      ) : null}
    </div>
  ) : null

  const tumuSecili = rows.length > 0 && rows.every((r) => selectedIds.includes(anahtar(r)))
  const bazisiSecili = rows.some((r) => selectedIds.includes(anahtar(r))) && !tumuSecili

  const tumunuSec = (secili: boolean) => {
    onSelectionChange?.(secili ? rows.map(anahtar) : [])
  }

  const satirSec = (id: string, secili: boolean) => {
    onSelectionChange?.(secili ? [...selectedIds, id] : selectedIds.filter((x) => x !== id))
  }

  /*
    Sayfa-otesi secim banner'i: yalniz `totalRowCount` verildiginde ve baslik
    kutusuna basildiginda gorunur. Iki durumu var:
    1. `selectAllMode === 'page'` + tum sayfa secili: "Bu sayfadaki N kayit
       secildi. Tum X kaydi secmek icin tiklayin."
    2. `selectAllMode === 'all'`: "Tum X kayit secildi. Secimi temizle."
  */
  const sayfaOtesiBannerGorunur =
    selectable && totalRowCount !== undefined && totalRowCount > rows.length && tumuSecili

  const secimBanner = sayfaOtesiBannerGorunur ? (
    <div className={css.selectAllBanner} role="status">
      {selectAllMode === 'all' ? (
        <>
          Tüm {totalRowCount.toLocaleString('tr-TR')} kayıt seçildi.{' '}
          <button
            type="button"
            className={css.selectAllBannerLink}
            onClick={() => {
              onClearSelection?.()
            }}
          >
            Seçimi temizle.
          </button>
        </>
      ) : (
        <>
          Bu sayfadaki {rows.length.toLocaleString('tr-TR')} kayıt seçildi.{' '}
          <button
            type="button"
            className={css.selectAllBannerLink}
            onClick={() => {
              onSelectAllAcrossPages?.()
            }}
          >
            Tüm {totalRowCount.toLocaleString('tr-TR')} kaydı seç
          </button>
        </>
      )}
    </div>
  ) : null

  const siralamayiDegistir = (sutun: ColumnDef<T>, shiftKey: boolean) => {
    if (sutun.sortable !== true) return

    // Eski tek-kolon kontrollü: mevcut davranış (asc↔desc), shift yok sayılır.
    if (eskiSort) {
      const yon = sort?.columnId === sutun.id && sort.direction === 'asc' ? 'desc' : 'asc'
      onSortChange?.({ columnId: sutun.id, direction: yon })
      return
    }

    // Çoklu/yönetilen: asc → desc → (kuraldan çıkar) döngüsü. shift ikincil ekler.
    const yeniKurallar = kurallariGuncelle(efektifKurallar, sutun.id, shiftKey)
    if (cokluKontrollu) onSortRulesChange?.(yeniKurallar)
    else setYonetilenKurallar(yeniKurallar)
  }

  /*
    Yönetilen boru hattı: `rows` → toolbar filtre → başlık filtre → sıralama.
    Kontrollü modlarda ilgili adım atlanır (`rows` zaten süzülmüş/sıralı gelir).
  */
  const filtrelenmisRows = yonetilenFiltre ? filtreleRows(rows, efektifFiltreler, columns) : rows
  const baslikFiltrelenmisRows = baslikFiltreleRows(filtrelenmisRows, efektifBaslikFiltreler, columns)
  const siralanmisRows = yonetilenSort
    ? siralaRows(baslikFiltrelenmisRows, efektifKurallar, columns)
    : baslikFiltrelenmisRows

  /*
    Sanallaştırma: `virtualize` prop'una göre karar verilir.
    - `true` / obje: açık.
    - `false`: kapalı.
    - `undefined`: satır sayısı > 100 ise otomatik açılır.
    Kart modunda tablo satırları yine sanallaştırılabilir (tablo dalı ≥48rem'de
    görünür); kart dalı hiç sanallaştırılmaz.
  */
  const virtualizeResolved =
    virtualize === undefined
      ? siralanmisRows.length > 100
      : virtualize !== false
  const virtualOverscan =
    typeof virtualize === 'object' && virtualize !== null
      ? (virtualize.overscan ?? 5)
      : 5
  const defaultRowHeight = density === 'compact' ? 36 : 48
  const virtualEstimateSize =
    typeof virtualize === 'object' && virtualize !== null
      ? (virtualize.estimateSize ?? defaultRowHeight)
      : defaultRowHeight

  const scrollerRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: siralanmisRows.length,
    getScrollElement: useCallback(() => scrollerRef.current, []),
    estimateSize: useCallback(() => virtualEstimateSize, [virtualEstimateSize]),
    overscan: virtualOverscan,
  })

  const hucreIcerigi = (row: T, sutun: ColumnDef<T>) => {
    if (sutun.cell !== undefined) return sutun.cell(row)
    if (sutun.accessor !== undefined) return String(row[sutun.accessor] ?? '')
    return null
  }

  /* ── Durum blokları: veri yerine ne gösterileceği ── */

  if (error !== undefined) {
    return (
      <div className={css.wrapper({ visualStyle })}>
        <div className={css.stateBlock}>
          {/*
            Hata bloğu elle çizilmiyor, `ErrorState`'e veriliyor: eskiden burada
            `<strong>` + iki `<span>`'lik bir kopya vardı ve `onRetry` kanalı
            eklenince o kopyanın butonu, odak halkasını ve `role="alert"`'ü de
            yeniden üretmesi gerekecekti — `ErrorState`'in zaten yaptığı işi
            ikinci kez, sapma riskiyle. Kopya ayrıca ham renk taşıyordu
            (`style={{ color: 'var(--color-text-muted)' }}`).

            `section`: tablo düştü, sayfanın kalanı ayakta.
          */}
          <ErrorState
            variant="section"
            title={error.title}
            description={error.message}
            {...(error.code !== undefined && { code: error.code })}
            {...(error.retryable && onRetry !== undefined && { onRetry })}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <>
        {aracCubugu}
        <div className={css.wrapper({ visualStyle })} aria-busy="true">
          {/*
          Yükleme hâlinde de `tabIndex={0}`: iskelet satırlarda hiçbir kontrol
          yok, yani kap tam da burada klavyeye kapalı kalırdı. Gerekçe aşağıdaki
          tablo dalında ve Drawer.tsx'te.
        */}
          <div className={css.scroller} tabIndex={0}>
            <table className={css.table}>
              {/* Başlık korunur, satırlar skeleton olur: veri gelince düzen zıplamaz. */}
              <thead className={css.thead({ sticky: stickyHeader })}>
                <tr>
                  {selectable ? (
                    <th className={`${css.th({ density })} ${css.selectionCell}`}>
                      {/*
                      Boş `<th>` DEĞİL — Faz 3'te ölçüldü: axe `empty-table-header`
                      ihlali veriyordu ve a11y kapısı `'error'`'a çekildiği için
                      `selectable` bir tabloyu yükleme durumunda gösteren her
                      story düşüyordu (`ListingListPage` → `Loading`).

                      Yüklü dal bu hücreyi `hideLabel`'lı Checkbox ile dolduruyor;
                      yükleme dalında kutu **yok** (iskelette çalışan kontrol
                      sunmak yanlış olurdu), o yüzden başlığın adı düz gizli
                      metinle veriliyor. Sütunun bir adı olmak zorunda: ekran
                      okuyucu kullanıcısı sütunlar arasında gezerken adsız bir
                      sütun "boş" diye okunur.
                    */}
                      <span className={css.visuallyHidden}>Seçim</span>
                    </th>
                  ) : null}
                  {gorunurSutunlar.map((sutun) => (
                    <th
                      key={sutun.id}
                      className={css.th({ density, align: sutun.align ?? 'start' })}
                      style={sutun.width !== undefined ? { width: sutun.width } : undefined}
                    >
                      {sutun.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className={css.tr({ striped: visualStyle === 'striped' })}>
                    {Array.from({ length: sutunSayisi }, (_, j) => (
                      <td key={j} className={css.td({ density })}>
                        <Skeleton variant="text" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
            <Spinner size="sm" label="Veriler yükleniyor" />
          </span>
        </div>
      </>
    )
  }

  if (rows.length === 0) {
    return (
      <div className={css.wrapper({ visualStyle })}>
        <div className={css.stateBlock}>{emptyState ?? <span>Kayıt bulunamadı</span>}</div>
      </div>
    )
  }

  /* ── Kart / tablo görünümü ──
     `mobileMode="cards"` artık viewport'a KENDİSİ bakıyor: 48rem'in altında kart,
     üstünde tablo. İki dal da DOM'da kalır; hangisinin boyanacağına CSS medya
     sorgusu karar verir (`css.cards` yalnız <48rem, `css.tableInCards` yalnız
     ≥48rem görünür). Boyanmayan dal `display: none` ile erişilebilirlik ağacından
     da çıkar — SidebarNav'ın ray/çekmece öncülüyle aynı; ekran okuyucu kullanıcısı
     aynı satırları iki kez gezmez. Eşik 48rem, AppShell/FilterBar ile aynı.

     Tüketici ekranlar bu yüzden artık iki dalı elle render etmiyor: yalnız
     `mobileMode="cards"` diyor, doğru olanı DataTable çiziyor.

     `mobileMode="scroll"` bu dala HİÇ girmez: tabloyu koruyup yatay kaydırır,
     viewport'tan bağımsız zaten doğru. `cards` verilse de `renderMobileCard`
     verilmemişse yine tabloya düşülür — çizilecek kart şablonu yok. */

  const kartModu = mobileMode === 'cards' && renderMobileCard !== undefined

  /* ── Tek satır render fonksiyonu (hem normal hem sanal dal kullanır) ── */
  const renderRow = (row: T, index: number) => {
    const id = anahtar(row)
    const secili = selectedIds.includes(id)

    return (
      <tr
        key={id}
        className={css.tr({ striped: visualStyle === 'striped' })}
        data-selected={secili ? '' : undefined}
        data-clickable={onRowClick !== undefined ? '' : undefined}
        onClick={onRowClick !== undefined ? () => onRowClick(row) : undefined}
      >
        {selectable ? (
          <td
            className={`${css.td({ density })} ${css.selectionCell}`}
            /* Seçim kutusuna tıklamak satır tıklamasını tetiklemesin. */
            onClick={(event) => event.stopPropagation()}
          >
            {/*
              Etiket satırı tanımlar, "Satırı seç" demez: ekran okuyucu
              kullanıcısı 12 kez aynı metni duyarsa hangisini seçtiğini
              anlamaz. Ayırt edici metin `rowLabel` ile verilir; yoksa
              satır numarasına düşülür.
            */}
            <Checkbox
              label={rowLabel?.(row) ?? `${index + 1}. satırı seç`}
              hideLabel
              checked={secili}
              onCheckedChange={(next) => satirSec(id, next)}
            />
          </td>
        ) : null}

        {gorunurSutunlar.map((sutun) => (
          <td
            key={sutun.id}
            className={css.td({ density, align: sutun.align ?? 'start' })}
          >
            {hucreIcerigi(row, sutun)}
          </td>
        ))}
      </tr>
    )
  }

  /* ── Thead (her iki dal da aynı) ── */
  const theadIcerigi = (
    <thead className={css.thead({ sticky: stickyHeader })}>
      <tr>
        {selectable ? (
          <th className={`${css.th({ density })} ${css.selectionCell}`}>
            {/*
              Etiket gizli: görünürse her satırda tekrar eder, yatay alan
              yer ve tabloyu okunmaz hale getirir. Ama kaldırılamaz —
              ekran okuyucu kullanıcısı kutunun neyi seçtiğini ondan öğrenir.
            */}
            <Checkbox
              label={`Tümünü seç (${rows.length} kayıt)`}
              hideLabel
              checked={tumuSecili}
              indeterminate={bazisiSecili}
              onCheckedChange={tumunuSec}
            />
          </th>
        ) : null}

        {gorunurSutunlar.map((sutun) => {
          const kuralIndex = efektifKurallar.findIndex((k) => k.columnId === sutun.id)
          const kural = kuralIndex >= 0 ? efektifKurallar[kuralIndex] : undefined
          const sirali = kural !== undefined
          const SiralamaIkonu = !sirali
            ? ChevronsUpDown
            : kural.direction === 'asc'
              ? ArrowUp
              : ArrowDown
          // Öncelik rozeti yalnız birden çok kural varken anlamlı (1, 2…).
          const siraNo = efektifKurallar.length > 1 && sirali ? kuralIndex + 1 : null

          // Sütun-başlık-içi filtre ikonu durumu.
          const sutunFiltrelenebilir = sutun.columnFilterable === true
          const sutunFiltreAktif = sutunFiltrelenebilir && efektifBaslikFiltreler[sutun.id] !== undefined
          const popoverAcik = acikPopover === sutun.id

          const sortVeyaFilterVar = sutun.sortable === true || sutunFiltrelenebilir

          return (
            <th
              key={sutun.id}
              className={css.th({ density, align: sutun.align ?? 'start' })}
              style={{
                ...(sutun.width !== undefined ? { width: sutun.width } : {}),
                // Popover konumlandırması için relative gerekir.
                ...(sutunFiltrelenebilir ? { position: 'relative' as const } : {}),
              }}
              data-sorted={sirali ? '' : undefined}
              aria-sort={
                sirali ? (kural.direction === 'asc' ? 'ascending' : 'descending') : undefined
              }
            >
              {sortVeyaFilterVar ? (
                <span className={css.headerContent}>
                  {sutun.sortable === true ? (
                    <button
                      type="button"
                      className={css.sortButton}
                      onClick={(event) => siralamayiDegistir(sutun, event.shiftKey)}
                    >
                      {sutun.header}
                      <SiralamaIkonu size={14} className={css.sortIcon} aria-hidden="true" />
                      {siraNo !== null ? (
                        <span className={css.sortOrder} aria-hidden="true">
                          {siraNo}
                        </span>
                      ) : null}
                    </button>
                  ) : (
                    sutun.header
                  )}

                  {sutunFiltrelenebilir ? (
                    <button
                      type="button"
                      className={css.filterButton({ active: sutunFiltreAktif })}
                      aria-label={`${typeof sutun.header === 'string' ? sutun.header : sutun.id} filtrele`}
                      aria-expanded={popoverAcik}
                      onClick={(event) => {
                        event.stopPropagation()
                        setAcikPopover(popoverAcik ? null : sutun.id)
                      }}
                    >
                      {sutunFiltreAktif ? (
                        <Filter size={13} aria-hidden="true" fill="currentColor" />
                      ) : (
                        <Filter size={13} aria-hidden="true" />
                      )}
                    </button>
                  ) : null}

                  {popoverAcik ? (
                    <ColumnFilterPopover
                      columnId={sutun.id}
                      columnHeader={sutun.header}
                      filterType={sutun.columnFilterType ?? 'text'}
                      {...(sutun.columnFilterOptions !== undefined && { filterOptions: sutun.columnFilterOptions })}
                      currentValue={efektifBaslikFiltreler[sutun.id]}
                      onApply={baslikFiltreDegistir}
                      onClear={baslikFiltreTemizle}
                      onClose={() => setAcikPopover(null)}
                    />
                  ) : null}
                </span>
              ) : (
                sutun.header
              )}
            </th>
          )
        })}
      </tr>

      {toolbar?.filters === true && filtrelenebilirSutunVar ? (
        <tr className={css.filterRow}>
          {selectable ? <td className={css.selectionCell} /> : null}
          {gorunurSutunlar.map((sutun) => {
            const filtreLabel =
              typeof sutun.header === 'string' ? `${sutun.header} filtresi` : 'Sütun filtresi'
            const deger = efektifFiltreler[sutun.id] ?? ''
            return (
              <td key={sutun.id} className={css.filterCell}>
                {sutun.filterable === true ? (
                  <Input
                    size="sm"
                    aria-label={filtreLabel}
                    placeholder="Filtrele…"
                    value={deger}
                    onChange={(e) => filtreDegistir(sutun.id, e.target.value)}
                  />
                ) : null}
              </td>
            )
          })}
        </tr>
      ) : null}
    </thead>
  )

  const wrapperClass = kartModu
    ? `${css.wrapper({ visualStyle })} ${css.tableInCards}`
    : css.wrapper({ visualStyle })

  const tablo = virtualizeResolved ? (
    <div className={wrapperClass}>
      {/*
        Sanallaştırılmış dal: kaydırma kabı `ref` ile virtualizer'a bağlı.
        `tabIndex={0}` hem yatay hem dikey kaydırmayı klavyeyle açar.
        `maxHeight` varsayılan 80vh; tüketici kendi sarmalayıcısıyla kısıtlayabilir.
      */}
      <div className={css.virtualScroller} ref={scrollerRef} tabIndex={0}>
        <table className={css.table}>
          {theadIcerigi}

          <tbody
            className={css.virtualTbody}
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const row = siralanmisRows[virtualItem.index]!
              const id = anahtar(row)
              const secili = selectedIds.includes(id)

              return (
                <tr
                  key={id}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualItem.index}
                  className={`${css.tr({ striped: visualStyle === 'striped' })} ${css.virtualRow}`}
                  style={{ transform: `translateY(${virtualItem.start}px)` }}
                  data-selected={secili ? '' : undefined}
                  data-clickable={onRowClick !== undefined ? '' : undefined}
                  onClick={onRowClick !== undefined ? () => onRowClick(row) : undefined}
                >
                  {selectable ? (
                    <td
                      className={`${css.td({ density })} ${css.selectionCell}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        label={rowLabel?.(row) ?? `${virtualItem.index + 1}. satırı seç`}
                        hideLabel
                        checked={secili}
                        onCheckedChange={(next) => satirSec(id, next)}
                      />
                    </td>
                  ) : null}

                  {gorunurSutunlar.map((sutun) => (
                    <td
                      key={sutun.id}
                      className={css.td({ density, align: sutun.align ?? 'start' })}
                    >
                      {hucreIcerigi(row, sutun)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className={wrapperClass}>
      {/*
        `tabIndex={0}`: tablo dar ekranda yatay kaydırılır. Seçilebilir veya
        linkli tabloda kutular/linkler kabı klavyeye açıyordu, ama salt okunur
        bir tabloda (PromotionFlagsPanel'in özet tablosu) içeride odaklanılacak
        hiçbir şey yok ve sütunların yarısı fare olmadan görülemiyordu.
        Gerekçenin uzunu Drawer.tsx'te.
      */}
      <div className={css.scroller} tabIndex={0}>
        <table className={css.table}>
          {theadIcerigi}

          <tbody>
            {siralanmisRows.map((row, index) => renderRow(row, index))}
          </tbody>
        </table>
      </div>
    </div>
  )

  if (mobileMode === 'cards' && renderMobileCard !== undefined) {
    return (
      <>
        {aracCubugu}
        {secimBanner}
        <div className={css.cards}>
          {siralanmisRows.map((row) => {
            const id = anahtar(row)
            const secili = selectedIds.includes(id)
            return (
              <div key={id} className={css.cardRow} data-selected={secili ? '' : undefined}>
                {renderMobileCard(row)}
              </div>
            )
          })}
        </div>
        {tablo}
      </>
    )
  }

  return (
    <>
      {aracCubugu}
      {secimBanner}
      {tablo}
    </>
  )
}

/* ── Sütun filtre popover'ı (component dışında, saf) ── */

interface ColumnFilterPopoverProps {
  columnId: string
  columnHeader: React.ReactNode
  filterType: 'text' | 'select' | 'number' | 'date'
  filterOptions?: { value: string; label: string }[]
  currentValue: unknown
  onApply: (columnId: string, value: unknown) => void
  onClear: (columnId: string) => void
  onClose: () => void
}

/**
 * Sütun başlığının altında açılan filtre popover'ı. Tipine göre farklı
 * kontroller sunar: metin, seçim, sayı aralığı veya tarih aralığı.
 */
function ColumnFilterPopover({
  columnId,
  columnHeader,
  filterType,
  filterOptions,
  currentValue,
  onApply,
  onClear,
  onClose,
}: ColumnFilterPopoverProps) {
  const label = typeof columnHeader === 'string' ? columnHeader : columnId

  // Yerel geçici durum — popover açıkken değişiklikler burada tutulur, "Uygula"yla gönderilir.
  const [localText, setLocalText] = useState<string>(
    typeof currentValue === 'string' ? currentValue : '',
  )
  const [localSelect, setLocalSelect] = useState<string>(
    typeof currentValue === 'string' ? currentValue : '',
  )
  const [localMin, setLocalMin] = useState<string>(
    currentValue !== null && typeof currentValue === 'object' && 'min' in (currentValue as Record<string, unknown>)
      ? String((currentValue as Record<string, unknown>).min)
      : '',
  )
  const [localMax, setLocalMax] = useState<string>(
    currentValue !== null && typeof currentValue === 'object' && 'max' in (currentValue as Record<string, unknown>)
      ? String((currentValue as Record<string, unknown>).max)
      : '',
  )

  const handleApply = () => {
    switch (filterType) {
      case 'text':
        onApply(columnId, localText || undefined)
        break
      case 'select':
        onApply(columnId, localSelect || undefined)
        break
      case 'number': {
        const numDeger: Record<string, number> = {}
        if (localMin !== '') numDeger.min = Number(localMin)
        if (localMax !== '') numDeger.max = Number(localMax)
        onApply(columnId, Object.keys(numDeger).length > 0 ? numDeger : undefined)
        break
      }
      case 'date':
        // Tarih için şimdilik metin tabanlı basit giriş.
        onApply(columnId, localText || undefined)
        break
    }
    onClose()
  }

  const handleClear = () => {
    onClear(columnId)
    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
    }
    if (event.key === 'Enter') {
      event.stopPropagation()
      handleApply()
    }
  }

  return (
    <>
      {/* Arka plan tıklaması ile kapatma */}
      <div className={css.popoverBackdrop} onClick={onClose} />
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        className={css.columnFilterPopover}
        role="dialog"
        aria-label={`${label} filtresi`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <span className={css.popoverLabel}>{label}</span>

        {filterType === 'text' && (
          <div className={css.popoverField}>
            <input
              type="text"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              placeholder="Ara..."
              autoFocus
              style={{
                width: '100%',
                padding: '0.375rem 0.5rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.375rem',
                color: 'inherit',
                fontSize: 'inherit',
                outline: 'none',
              }}
            />
          </div>
        )}

        {filterType === 'select' && filterOptions !== undefined && (
          <div className={css.popoverField}>
            <select
              value={localSelect}
              onChange={(e) => setLocalSelect(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '0.375rem 0.5rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.375rem',
                color: 'inherit',
                fontSize: 'inherit',
                outline: 'none',
              }}
            >
              <option value="">Tumu</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {filterType === 'number' && (
          <div className={css.popoverRow}>
            <input
              type="number"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              placeholder="En az"
              autoFocus
              style={{
                flex: 1,
                padding: '0.375rem 0.5rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.375rem',
                color: 'inherit',
                fontSize: 'inherit',
                outline: 'none',
                minWidth: 0,
              }}
            />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>—</span>
            <input
              type="number"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              placeholder="En cok"
              style={{
                flex: 1,
                padding: '0.375rem 0.5rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.375rem',
                color: 'inherit',
                fontSize: 'inherit',
                outline: 'none',
                minWidth: 0,
              }}
            />
          </div>
        )}

        {filterType === 'date' && (
          <div className={css.popoverField}>
            <input
              type="date"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '0.375rem 0.5rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.375rem',
                color: 'inherit',
                fontSize: 'inherit',
                outline: 'none',
              }}
            />
          </div>
        )}

        <div className={css.popoverActions}>
          <button
            type="button"
            className={css.popoverButton({ variant: 'ghost' })}
            onClick={handleClear}
          >
            Temizle
          </button>
          <button
            type="button"
            className={css.popoverButton({ variant: 'primary' })}
            onClick={handleApply}
          >
            Uygula
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Yönetilen sıralama yardımcıları (saf; component dışında) ── */

/**
 * Bir sütuna basınca kural listesini günceller: yön döngüsü asc → desc → (çıkar).
 * `shift` ise mevcut kurallara ikincil olarak eklenir/güncellenir; değilse liste
 * o tek sütuna indirgenir.
 */
function kurallariGuncelle(kurallar: SortRule[], columnId: string, shift: boolean): SortRule[] {
  const mevcut = kurallar.find((k) => k.columnId === columnId)

  if (!shift) {
    if (mevcut === undefined) return [{ columnId, direction: 'asc' }]
    if (mevcut.direction === 'asc') return [{ columnId, direction: 'desc' }]
    return [] // desc'ten sonra sıralamayı kaldır
  }

  // Çoklu (shift): kural varsa yönünü ilerlet ya da çıkar; yoksa sona ekle.
  if (mevcut === undefined) return [...kurallar, { columnId, direction: 'asc' }]
  if (mevcut.direction === 'asc') {
    return kurallar.map((k) => (k.columnId === columnId ? { ...k, direction: 'desc' } : k))
  }
  return kurallar.filter((k) => k.columnId !== columnId)
}

/** Bir sütunun bir satırdaki sıralama değeri: `sortAccessor` önce, yoksa `accessor`. */
function siralamaDegeri<T extends { id: string }>(
  sutun: ColumnDef<T> | undefined,
  row: T,
): string | number | Date | null {
  if (sutun === undefined) return null
  if (sutun.sortAccessor !== undefined) return sutun.sortAccessor(row) ?? null
  if (sutun.accessor !== undefined) {
    const deger = row[sutun.accessor]
    if (deger === null || deger === undefined) return null
    return deger as unknown as string | number
  }
  return null
}

/** İki değeri karşılaştırır: null en sona; metin Türkçe `localeCompare`; sayı/tarih doğal. */
function karsilastir(a: string | number | Date | null, b: string | number | Date | null): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  if (a instanceof Date || b instanceof Date) {
    return Number(a instanceof Date ? a.getTime() : a) - Number(b instanceof Date ? b.getTime() : b)
  }
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), 'tr')
}

/** Bir sütunun bir satırdaki filtrelenebilir metni: `filterAccessor` önce, yoksa `accessor`. */
function filtreDegeri<T extends { id: string }>(sutun: ColumnDef<T> | undefined, row: T): string {
  if (sutun === undefined) return ''
  if (sutun.filterAccessor !== undefined) return sutun.filterAccessor(row)
  if (sutun.accessor !== undefined) {
    const deger = row[sutun.accessor]
    return deger === null || deger === undefined ? '' : String(deger)
  }
  return ''
}

/** Aktif filtreleri uygular: `select` tam eşleşme, `text` büyük/küçük harf duyarsız alt dize. */
function filtreleRows<T extends { id: string }>(
  rows: T[],
  filtreler: Record<string, string>,
  columns: ColumnDef<T>[],
): T[] {
  const aktif = Object.entries(filtreler).filter(([, v]) => v !== '')
  if (aktif.length === 0) return rows
  const sutunHaritasi = new Map(columns.map((c) => [c.id, c]))
  return rows.filter((row) =>
    aktif.every(([id, deger]) => {
      const sutun = sutunHaritasi.get(id)
      const metin = filtreDegeri(sutun, row)
      return metin.toLocaleLowerCase('tr').includes(deger.toLocaleLowerCase('tr'))
    }),
  )
}

/** Kuralları öncelik sırasıyla uygular; eşitlikte sonraki kurala geçer. Kararlı kopya. */
function siralaRows<T extends { id: string }>(
  rows: T[],
  kurallar: SortRule[],
  columns: ColumnDef<T>[],
): T[] {
  if (kurallar.length === 0) return rows
  const sutunHaritasi = new Map(columns.map((c) => [c.id, c]))
  return [...rows].sort((a, b) => {
    for (const kural of kurallar) {
      const sutun = sutunHaritasi.get(kural.columnId)
      const fark = karsilastir(siralamaDegeri(sutun, a), siralamaDegeri(sutun, b))
      if (fark !== 0) return kural.direction === 'asc' ? fark : -fark
    }
    return 0
  })
}

/**
 * Sütun başlık filtresi için ham değer çıkarır.
 * Önce filterAccessor, sonra accessor, yoksa row[columnId] dener.
 */
function baslikFiltreHamDeger<T extends { id: string }>(sutun: ColumnDef<T>, row: T): string {
  if (sutun.filterAccessor !== undefined) return sutun.filterAccessor(row)
  if (sutun.accessor !== undefined) {
    const deger = row[sutun.accessor]
    return deger === null || deger === undefined ? '' : String(deger)
  }
  // Son çare: row'da column id ile eşleşen alan
  const rowObj = row as Record<string, unknown>
  const val = rowObj[sutun.id]
  if (val !== undefined && val !== null) return String(val)
  return ''
}

/**
 * Sütun başlık filtreleri uygular.
 * - text: alt dize eşleşmesi (büyük/küçük harf duyarsız)
 * - select: tam değer eşleşmesi
 * - number: { min?, max? } aralık kontrolü
 */
function baslikFiltreleRows<T extends { id: string }>(
  rows: T[],
  filtreler: Record<string, unknown>,
  columns: ColumnDef<T>[],
): T[] {
  const aktif = Object.entries(filtreler).filter(([, v]) => v !== undefined && v !== null && v !== '')
  if (aktif.length === 0) return rows

  const sutunHaritasi = new Map(columns.map((c) => [c.id, c]))

  return rows.filter((row) =>
    aktif.every(([id, deger]) => {
      const sutun = sutunHaritasi.get(id)
      if (sutun === undefined) return true

      const filterType = sutun.columnFilterType ?? 'text'

      if (filterType === 'number') {
        // deger: { min?: number; max?: number }
        const range = deger as { min?: number; max?: number }
        const accessor = sutun.sortAccessor ?? sutun.accessor
        const sayi = typeof accessor === 'function'
          ? Number(accessor(row))
          : typeof accessor === 'string'
            ? Number((row as Record<string, unknown>)[accessor])
            : 0
        if (range.min !== undefined && sayi < range.min) return false
        if (range.max !== undefined && sayi > range.max) return false
        return true
      }

      if (filterType === 'select') {
        // Select: row'un ham alanını kontrol et (accessor, filterAccessor, veya row[columnId])
        const ham = baslikFiltreHamDeger(sutun, row)
        return ham.toLocaleLowerCase('tr').includes(String(deger).toLocaleLowerCase('tr'))
      }

      // text (default)
      const metin = baslikFiltreHamDeger(sutun, row)
      if (metin !== '') return metin.toLocaleLowerCase('tr').includes(String(deger).toLocaleLowerCase('tr'))
      // Fallback: filtreDegeri
      const fallback = filtreDegeri(sutun, row)
      return fallback.toLocaleLowerCase('tr').includes(String(deger).toLocaleLowerCase('tr'))
    }),
  )
}
