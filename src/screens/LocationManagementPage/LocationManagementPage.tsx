import { useId, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Plus, Trash2 } from 'lucide-react'
import { Badge } from '../../components/primitives/Badge'
import { Button } from '../../components/primitives/Button'
import { Input } from '../../components/primitives/Input'
import { SearchInput } from '../../components/primitives/SearchInput'
import { Switch } from '../../components/primitives/Switch'
import { ConfirmDialog } from '../../components/composites/ConfirmDialog'
import { EmptyState } from '../../components/composites/EmptyState'
import { StatCard } from '../../components/composites/StatCard'
import type {
  LocationManagementPageProps,
  LocationNode,
  LocationUpdatePayload,
} from '../../types/component-props'
import * as css from './LocationManagementPage.css'

/* ── Yardimci fonksiyonlar ─────────────────────────────────────────────── */

/** Agacta bir dugumu kimligiyle bulur. */
function dugumBul(nodes: LocationNode[], id: string): LocationNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    const bulunan = dugumBul(node.children ?? [], id)
    if (bulunan !== undefined) return bulunan
  }
  return undefined
}

/** Hedef dugumun atalarinin adlarini doner (breadcrumb icin). */
function ataYolu(nodes: LocationNode[], hedefId: string): string[] | undefined {
  for (const node of nodes) {
    if (node.id === hedefId) return []
    const altYol = ataYolu(node.children ?? [], hedefId)
    if (altYol !== undefined) return [node.name, ...altYol]
  }
  return undefined
}

/** Agaci arama terimine gore suzer; hiyerarsiyi korur. */
function filterTree(nodes: LocationNode[], term: string): LocationNode[] {
  const lower = term.toLocaleLowerCase('tr-TR')
  return nodes.reduce<LocationNode[]>((sonuc, node) => {
    const etiketEslesiyor = node.name.toLocaleLowerCase('tr-TR').includes(lower)
    const suzulmusCocuklar = filterTree(node.children ?? [], term)
    if (etiketEslesiyor || suzulmusCocuklar.length > 0) {
      sonuc.push({
        ...node,
        children: suzulmusCocuklar.length > 0 ? suzulmusCocuklar : (node.children ?? []),
      })
    }
    return sonuc
  }, [])
}

/** Seviye etiketi. */
const SEVIYE_ETIKET: Record<LocationNode['level'], string> = {
  il: 'Il',
  ilce: 'Ilce',
  mahalle: 'Mahalle',
}

/** Alt seviye belirleme. */
const ALT_SEVIYE: Record<LocationNode['level'], LocationNode['level'] | null> = {
  il: 'ilce',
  ilce: 'mahalle',
  mahalle: null,
}

type MobilPano = 'agac' | 'detay'

/**
 * Konum yonetimi ekrani: il/ilce/mahalle hiyerarsisi.
 *
 * Genis ekranda agac ve detay yan yana (split); dar ekranda drill-down.
 * Veri cekmez: her sey prop olarak gelir.
 */
export function LocationManagementPage({
  locations,
  selectedLocationId,
  onSelectLocation,
  onSaveLocation,
  onDeleteLocation,
  onCreateLocation,
  stats,
}: LocationManagementPageProps) {
  const idOneki = useId()
  const agacBaslikId = `${idOneki}-agac`
  const detayBaslikId = `${idOneki}-detay`

  const [mobilPano, setMobilPano] = useState<MobilPano>('agac')
  const [aramaTerimi, setAramaTerimi] = useState('')
  const [acikIdler, setAcikIdler] = useState<string[]>([])

  /* Duzenleme formu state'leri */
  const [editName, setEditName] = useState('')
  const [editActive, setEditActive] = useState(true)
  const [editLat, setEditLat] = useState('')
  const [editLng, setEditLng] = useState('')
  const [formDirty, setFormDirty] = useState(false)

  /* Silme onayi */
  const [silmeOnayAcik, setSilmeOnayAcik] = useState(false)

  /* Yeni konum ekleme */
  const [createParentId, setCreateParentId] = useState<string | null>(null)
  const [createLevel, setCreateLevel] = useState<LocationNode['level']>('il')
  const [createName, setCreateName] = useState('')
  const [createFormOpen, setCreateFormOpen] = useState(false)

  const seciliDugum = selectedLocationId !== undefined
    ? dugumBul(locations, selectedLocationId)
    : undefined

  /* Secim degistiginde form state'ini guncelle */
  const [izlenenSecim, setIzlenenSecim] = useState<string | undefined>(undefined)
  if (selectedLocationId !== izlenenSecim) {
    setIzlenenSecim(selectedLocationId)
    if (seciliDugum !== undefined) {
      setEditName(seciliDugum.name)
      setEditActive(seciliDugum.active)
      setEditLat(seciliDugum.coordinates?.lat?.toString() ?? '')
      setEditLng(seciliDugum.coordinates?.lng?.toString() ?? '')
      setFormDirty(false)
    }
  }

  /* Breadcrumb */
  const breadcrumbParts = selectedLocationId !== undefined
    ? ataYolu(locations, selectedLocationId)
    : undefined

  const breadcrumbText = seciliDugum !== undefined
    ? [...(breadcrumbParts ?? []), seciliDugum.name].join(' > ')
    : undefined

  /* Filtrelenmis agac */
  const aramaAktif = aramaTerimi !== ''
  const gosterilecekAgac = aramaAktif ? filterTree(locations, aramaTerimi) : locations

  /* Agacta bir konuma tiklandiginda */
  const konumSecildi = (id: string) => {
    if (id === selectedLocationId) {
      setMobilPano('detay')
      return
    }
    onSelectLocation(id)
    setMobilPano('detay')
  }

  /* Kaydetme */
  const kaydet = () => {
    if (seciliDugum === undefined) return
    const payload: LocationUpdatePayload = {
      id: seciliDugum.id,
      name: editName,
      active: editActive,
    }
    const lat = parseFloat(editLat)
    const lng = parseFloat(editLng)
    if (!isNaN(lat) && !isNaN(lng)) {
      payload.coordinates = { lat, lng }
    }
    void onSaveLocation(payload)
    setFormDirty(false)
  }

  /* Iptal */
  const iptal = () => {
    if (seciliDugum === undefined) return
    setEditName(seciliDugum.name)
    setEditActive(seciliDugum.active)
    setEditLat(seciliDugum.coordinates?.lat?.toString() ?? '')
    setEditLng(seciliDugum.coordinates?.lng?.toString() ?? '')
    setFormDirty(false)
  }

  /* Yeni konum ekleme formu ac */
  const yeniKonumFormAc = (parentId: string | null, level: LocationNode['level']) => {
    setCreateParentId(parentId)
    setCreateLevel(level)
    setCreateName('')
    setCreateFormOpen(true)
  }

  /* Yeni konum olustur */
  const yeniKonumOlustur = () => {
    if (createName.trim() === '') return
    void onCreateLocation(createParentId, createName.trim(), createLevel)
    setCreateFormOpen(false)
    setCreateName('')
  }

  /* ── Agac dallarini ciz ─────────────────────────────────────────────── */

  const dallariCiz = (liste: LocationNode[], seviye: number): ReactNode =>
    liste.map((node) => {
      const cocuklar = node.children ?? []
      const acilabilir = cocuklar.length > 0
      const acik = acilabilir && acikIdler.includes(node.id)
      const secili = node.id === selectedLocationId
      const altSeviye = ALT_SEVIYE[node.level]

      return (
        <li key={node.id} className={css.treeItem}>
          <div
            className={css.treeRow}
            data-selected={secili || undefined}
            data-passive={!node.active || undefined}
            onClick={() => konumSecildi(node.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                konumSecildi(node.id)
              }
            }}
          >
            {acilabilir ? (
              <span
                className={css.treeToggle}
                aria-hidden="true"
                onClick={(e) => {
                  e.stopPropagation()
                  if (acik) {
                    setAcikIdler(acikIdler.filter((id) => id !== node.id))
                  } else {
                    setAcikIdler([...acikIdler, node.id])
                  }
                }}
              >
                <ChevronRight
                  size={14}
                  className={css.chevron}
                  data-open={acik || undefined}
                />
              </span>
            ) : (
              <span className={css.treeTogglePlaceholder} />
            )}

            <span className={css.treeLabel}>{node.name}</span>

            {!node.active ? (
              <Badge tone="neutral" size="sm">Pasif</Badge>
            ) : null}

            <span className={css.treeCount}>
              {node.activeListingCount.toLocaleString('tr-TR')}
            </span>
          </div>

          {acik ? (
            <ul className={css.treeChildren}>
              {dallariCiz(cocuklar, seviye + 1)}
              {altSeviye !== null ? (
                <li className={css.treeItem}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={css.addButton}
                    leadingIcon={<Plus size={14} />}
                    onClick={() => yeniKonumFormAc(node.id, altSeviye)}
                  >
                    Yeni {SEVIYE_ETIKET[altSeviye].toLocaleLowerCase('tr-TR')} ekle
                  </Button>
                </li>
              ) : null}
            </ul>
          ) : null}
        </li>
      )
    })

  /* ── Detay paneli ───────────────────────────────────────────────────── */

  const detayGovdesi = (): ReactNode => {
    if (seciliDugum === undefined) {
      return (
        <EmptyState
          variant="compact"
          title="Konum secilmedi"
          description="Detaylari gormek icin soldan bir konum secin."
        />
      )
    }

    const silinebilir = seciliDugum.activeListingCount === 0

    return (
      <>
        {/* Breadcrumb */}
        {breadcrumbText !== undefined ? (
          <p className={css.breadcrumb}>
            <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
            {breadcrumbText}
          </p>
        ) : null}

        {/* Ilan istatistikleri */}
        <div className={css.block}>
          <h3 className={css.blockTitle}>Ilan Istatistikleri</h3>
          <div className={css.statsRow}>
            <StatCard label="Toplam Ilan" value={seciliDugum.listingCount} />
            <StatCard label="Aktif Ilan" value={seciliDugum.activeListingCount} />
            <StatCard
              label="Bekleyen"
              value={seciliDugum.listingCount - seciliDugum.activeListingCount}
            />
          </div>
        </div>

        {/* Duzenleme formu */}
        <div className={css.block}>
          <h3 className={css.blockTitle}>Konum Bilgileri</h3>

          <Input
            label="Konum Adi"
            value={editName}
            onChange={(e) => {
              setEditName(e.target.value)
              setFormDirty(true)
            }}
          />

          <Switch
            checked={editActive}
            label="Durum"
            description={editActive ? 'Aktif - Ilan formunda gorunur' : 'Pasif - Ilan formunda gorunmez'}
            onCheckedChange={(next) => {
              setEditActive(next)
              setFormDirty(true)
            }}
          />

          <div className={css.block}>
            <h3 className={css.blockTitle}>Koordinatlar (opsiyonel)</h3>
            <div className={css.coordRow}>
              <Input
                label="Enlem (Lat)"
                value={editLat}
                onChange={(e) => {
                  setEditLat(e.target.value)
                  setFormDirty(true)
                }}
              />
              <Input
                label="Boylam (Lng)"
                value={editLng}
                onChange={(e) => {
                  setEditLng(e.target.value)
                  setFormDirty(true)
                }}
              />
            </div>
          </div>

          <div className={css.actions}>
            <Button variant="primary" onClick={kaydet} disabled={!formDirty}>
              Kaydet
            </Button>
            <Button variant="secondary" onClick={iptal} disabled={!formDirty}>
              Iptal
            </Button>
          </div>
        </div>

        {/* Silme bolumu */}
        <div className={css.dangerZone}>
          <h3 className={css.blockTitle}>Tehlikeli Bolge</h3>
          <p className={css.breadcrumb}>
            {silinebilir
              ? 'Bu konumu kalici olarak silebilirsiniz.'
              : `Bu konum silinemez: ${seciliDugum.activeListingCount.toLocaleString('tr-TR')} aktif ilan mevcut.`}
          </p>
          <div>
            <Button
              variant="danger"
              size="sm"
              leadingIcon={<Trash2 size={14} />}
              disabled={!silinebilir}
              onClick={() => setSilmeOnayAcik(true)}
            >
              Konumu Sil
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={css.root} data-mobil-pano={mobilPano}>
      {/* Ozet istatistikler */}
      {stats !== undefined ? (
        <div className={css.statsRow}>
          <StatCard label="Toplam Il" value={stats.totalIl} icon={<MapPin size={20} />} />
          <StatCard label="Toplam Ilce" value={stats.totalIlce} icon={<MapPin size={20} />} />
          <StatCard label="Toplam Mahalle" value={stats.totalMahalle} icon={<MapPin size={20} />} />
          <StatCard label="Aktif Konum" value={stats.activeCount} icon={<MapPin size={20} />} />
        </div>
      ) : null}

      {/* Split layout */}
      <div className={css.split}>
        {/* Sol panel: Agac */}
        <section className={css.treePane} aria-labelledby={agacBaslikId}>
          <h2 id={agacBaslikId} className={css.paneTitle}>Konumlar</h2>

          <SearchInput
            label="Konum ara"
            placeholder="Il, ilce veya mahalle ara..."
            onSearch={setAramaTerimi}
            onClear={() => setAramaTerimi('')}
            debounceMs={300}
            size="sm"
          />

          {gosterilecekAgac.length === 0 ? (
            <EmptyState
              variant="compact"
              title="Sonuc bulunamadi"
              description="Aramanizla eslesen konum bulunamadi."
            />
          ) : (
            <ul className={css.treeList} role="tree" aria-label="Konum agaci">
              {dallariCiz(gosterilecekAgac, 1)}
            </ul>
          )}

          <Button
            variant="ghost"
            size="sm"
            className={css.addButton}
            leadingIcon={<Plus size={14} />}
            onClick={() => yeniKonumFormAc(null, 'il')}
          >
            Yeni il ekle
          </Button>
        </section>

        {/* Sag panel: Detay */}
        <section className={css.detailPane} aria-labelledby={detayBaslikId}>
          <Button
            className={css.backButton}
            variant="ghost"
            size="sm"
            leadingIcon={<ChevronLeft size={16} />}
            onClick={() => setMobilPano('agac')}
          >
            Konum agacina don
          </Button>

          <div className={css.paneHeading}>
            <h2 id={detayBaslikId} className={css.paneTitle}>
              {seciliDugum !== undefined
                ? `${seciliDugum.name} detaylari`
                : 'Konum Detayi'}
            </h2>
            {seciliDugum !== undefined && !seciliDugum.active ? (
              <Badge tone="neutral">Pasif konum</Badge>
            ) : null}
          </div>

          {detayGovdesi()}
        </section>
      </div>

      {/* Yeni konum ekleme formu */}
      {createFormOpen ? (
        <div className={css.createForm}>
          <h3 className={css.blockTitle}>
            Yeni {SEVIYE_ETIKET[createLevel]} Ekle
          </h3>
          <Input
            label={`${SEVIYE_ETIKET[createLevel]} Adi`}
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
          />
          <div className={css.createFormActions}>
            <Button variant="primary" size="sm" onClick={yeniKonumOlustur}>
              Ekle
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setCreateFormOpen(false)}>
              Vazgec
            </Button>
          </div>
        </div>
      ) : null}

      {/* Silme onay dialog'u */}
      {seciliDugum !== undefined ? (
        <ConfirmDialog
          open={silmeOnayAcik}
          title={`${seciliDugum.name} konumunu sil`}
          description={`"${seciliDugum.name}" konumu kalici olarak silinecek. Bu islem geri alinamaz.`}
          confirmLabel="Sil"
          tone="danger"
          onConfirm={() => {
            void onDeleteLocation(seciliDugum.id)
            setSilmeOnayAcik(false)
          }}
          onCancel={() => setSilmeOnayAcik(false)}
        />
      ) : null}
    </div>
  )
}
