import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock, FileText, XCircle } from 'lucide-react'
import { Alert } from '../../components/primitives/Alert'
import { Avatar } from '../../components/primitives/Avatar'
import { Badge } from '../../components/primitives/Badge'
import { Button } from '../../components/primitives/Button'
import { Modal } from '../../components/primitives/Modal'
import { Select } from '../../components/primitives/Select'
import { Textarea } from '../../components/primitives/Textarea'
import { EmptyState } from '../../components/composites/EmptyState'
import { StatCard } from '../../components/composites/StatCard'
import { formatDateTime } from '../../utils/formatDateTime'
import type { SelectOption, SellerVerificationPageProps, VerificationRequest } from '../../types/component-props'
import * as css from './SellerVerificationPage.css'

/* ────────────────────────────────────────────────────────────────────────────
   Etiketler
   ──────────────────────────────────────────────────────────────────────────── */

const BELGE_TURU_ETIKETI: Record<VerificationRequest['documentType'], string> = {
  kimlik: 'Kimlik Karti',
  ehliyet: 'Ehliyet',
  isyeri_ruhsati: 'Isyeri Ruhsati',
  ticaret_sicil: 'Ticaret Sicil Belgesi',
}

const DURUM_ETIKETI: Record<VerificationRequest['status'], string> = {
  beklemede: 'Beklemede',
  inceleniyor: 'Inceleniyor',
  onaylandi: 'Onaylandi',
  reddedildi: 'Reddedildi',
  ek_belge_bekleniyor: 'Ek Belge Bekleniyor',
}

const DURUM_TONU: Record<VerificationRequest['status'], 'neutral' | 'info' | 'success' | 'danger' | 'warning'> = {
  beklemede: 'neutral',
  inceleniyor: 'info',
  onaylandi: 'success',
  reddedildi: 'danger',
  ek_belge_bekleniyor: 'warning',
}

const ONCELIK_ETIKETI: Record<VerificationRequest['priority'], string> = {
  normal: 'Normal',
  yuksek: 'Yuksek',
  acil: 'Acil',
}

const ONCELIK_TONU: Record<VerificationRequest['priority'], 'neutral' | 'warning' | 'danger'> = {
  normal: 'neutral',
  yuksek: 'warning',
  acil: 'danger',
}

const HESAP_TURU_ETIKETI: Record<'bireysel' | 'kurumsal', string> = {
  bireysel: 'Bireysel',
  kurumsal: 'Kurumsal',
}

/** Red nedeni secenekleri. */
const RED_NEDENLERI: SelectOption[] = [
  { value: 'belge_okunamiyor', label: 'Belge okunamiyor' },
  { value: 'belge_suresi_dolmus', label: 'Belge suresi dolmus' },
  { value: 'belge_bilgileri_uyusmuyor', label: 'Belge bilgileri uyusmuyor' },
  { value: 'sahte_belge_suphesi', label: 'Sahte belge suphesi' },
  { value: 'diger', label: 'Diger' },
]

/** Filtre secenekleri. */
const BELGE_TURU_FILTRE: SelectOption[] = [
  { value: '', label: 'Tum belgeler' },
  { value: 'kimlik', label: 'Kimlik Karti' },
  { value: 'ehliyet', label: 'Ehliyet' },
  { value: 'isyeri_ruhsati', label: 'Isyeri Ruhsati' },
  { value: 'ticaret_sicil', label: 'Ticaret Sicil Belgesi' },
]

const DURUM_FILTRE: SelectOption[] = [
  { value: '', label: 'Tum durumlar' },
  { value: 'beklemede', label: 'Beklemede' },
  { value: 'inceleniyor', label: 'Inceleniyor' },
  { value: 'onaylandi', label: 'Onaylandi' },
  { value: 'reddedildi', label: 'Reddedildi' },
  { value: 'ek_belge_bekleniyor', label: 'Ek Belge Bekleniyor' },
]

const SIRALAMA_SECENEKLERI: SelectOption[] = [
  { value: 'newest', label: 'En yeni' },
  { value: 'oldest', label: 'En eski' },
  { value: 'priority', label: 'Oncelik' },
]

/** Belge numarasini maskeler: "****1234". */
function maskDocumentNumber(num: string | undefined): string {
  if (num === undefined) return '—'
  if (num.length <= 4) return num
  return `****${num.slice(-4)}`
}

/* ────────────────────────────────────────────────────────────────────────────
   Ekran
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Satici dogrulama ekrani: kuyruk + detay bolunmus gorunum.
 *
 * Veri **cekmez** — prop'lardan gelir. Kabuk degildir, en ust basligi `<h2>`.
 * Sol panel dogrulama isteklerini siralar, sag panel secili istegi detaylar.
 * Mobilde (< 48rem) drill-down: secili varken kuyruk gizlenir.
 */
export function SellerVerificationPage({
  requests,
  selectedRequestId,
  onSelectRequest,
  onApprove,
  onReject,
  onRequestDocuments,
  onClaimRequest: _onClaimRequest,
  stats,
  capabilities,
}: SellerVerificationPageProps) {
  /* ── Yerel durum ── */

  const [belgeTuruFiltre, setBelgeTuruFiltre] = useState('')
  const [durumFiltre, setDurumFiltre] = useState('')
  const [siralama, setSiralama] = useState('newest')
  const [redModalAcik, setRedModalAcik] = useState(false)
  const [redNedeni, setRedNedeni] = useState('')
  const [redNotu, setRedNotu] = useState('')
  const [zoomGorsel, setZoomGorsel] = useState<{ url: string; label: string } | undefined>(undefined)
  const [ekBelgeMesaji, setEkBelgeMesaji] = useState('')
  const [ekBelgeModalAcik, setEkBelgeModalAcik] = useState(false)

  /* ── Filtreleme ve siralama ── */

  let filtrelenmis = requests.filter((r) => {
    if (belgeTuruFiltre !== '' && r.documentType !== belgeTuruFiltre) return false
    if (durumFiltre !== '' && r.status !== durumFiltre) return false
    return true
  })

  const oncelikSirasi: Record<string, number> = { acil: 0, yuksek: 1, normal: 2 }

  filtrelenmis = [...filtrelenmis].sort((a, b) => {
    if (siralama === 'newest') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    if (siralama === 'oldest') return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    /* priority */
    return (oncelikSirasi[a.priority] ?? 2) - (oncelikSirasi[b.priority] ?? 2)
  })

  const secili = requests.find((r) => r.id === selectedRequestId)
  const izinOnayla = capabilities?.canApprove !== false
  const izinReddet = capabilities?.canReject !== false

  /* ── Red modal onay ── */

  const redGecerli = redNedeni.trim().length > 0

  const redOnayla = () => {
    if (secili === undefined || !redGecerli) return
    void onReject(secili.id, redNedeni, redNotu.trim() || undefined)
    setRedModalAcik(false)
    setRedNedeni('')
    setRedNotu('')
  }

  /* ── Ek belge istegi onay ── */

  const ekBelgeGecerli = ekBelgeMesaji.trim().length > 0

  const ekBelgeOnayla = () => {
    if (secili === undefined || !ekBelgeGecerli) return
    void onRequestDocuments(secili.id, ekBelgeMesaji.trim())
    setEkBelgeModalAcik(false)
    setEkBelgeMesaji('')
  }

  /* ── Kuyruk satiri ── */

  const satirCiz = (request: VerificationRequest) => {
    const isSecili = request.id === selectedRequestId
    return (
      <li key={request.id}>
        <div
          className={css.queueItem({ selected: isSecili })}
          role="button"
          tabIndex={0}
          aria-current={isSecili ? 'true' : undefined}
          onClick={() => onSelectRequest(request.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelectRequest(request.id)
            }
          }}
        >
          <Avatar name={request.seller.name} {...(request.seller.avatarUrl !== undefined && { src: request.seller.avatarUrl })} size="sm" />

          <div className={css.queueItemBody}>
            <p className={css.queueItemName}>{request.seller.name}</p>
            <p className={css.queueItemMeta}>
              {BELGE_TURU_ETIKETI[request.documentType]} · {formatDateTime(request.submittedAt)}
            </p>
            <div className={css.queueItemActions}>
              <Badge tone={DURUM_TONU[request.status]} size="sm">
                {DURUM_ETIKETI[request.status]}
              </Badge>
              {request.priority !== 'normal' ? (
                <Badge tone={ONCELIK_TONU[request.priority]} size="sm" variant="solid">
                  {ONCELIK_ETIKETI[request.priority]}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </li>
    )
  }

  /* ── Detay paneli ── */

  const detayCiz = (request: VerificationRequest) => {
    const seller = request.seller
    return (
      <div className={css.detailPanel}>
        {/* Mobilde geri butonu */}
        <div className={css.backButton}>
          <Button
            variant="ghost"
            size="sm"
            leadingIcon={<ArrowLeft size={16} />}
            onClick={() => {
              /* Secimi kaldirmak icin bos id gonder: drill-down'dan cik. */
              onSelectRequest('')
            }}
          >
            Listeye don
          </Button>
        </div>

        {/* Satici header */}
        <div className={css.sellerHeader}>
          <Avatar name={seller.name} {...(seller.avatarUrl !== undefined && { src: seller.avatarUrl })} size="lg" />
          <div className={css.sellerInfo}>
            <h3 className={css.sellerName}>{seller.name}</h3>
            <p className={css.sellerMeta}>{seller.email}</p>
            {seller.phone !== undefined ? <p className={css.sellerMeta}>{seller.phone}</p> : null}
            <div className={css.queueItemActions}>
              <Badge tone="neutral" size="sm">
                {HESAP_TURU_ETIKETI[seller.type]}
              </Badge>
              <Badge tone={DURUM_TONU[request.status]} size="sm">
                {DURUM_ETIKETI[request.status]}
              </Badge>
            </div>
          </div>
        </div>

        <hr className={css.divider} />

        {/* Belge bilgileri */}
        <h4 className={css.sectionTitle}>
          <FileText size={16} aria-hidden="true" /> Belge Bilgileri
        </h4>

        <dl className={css.facts}>
          <dt className={css.factTerm}>Belge turu</dt>
          <dd className={css.factValue}>
            <Badge tone="info" size="sm">{BELGE_TURU_ETIKETI[request.documentType]}</Badge>
          </dd>

          <dt className={css.factTerm}>Belge numarasi</dt>
          <dd className={css.factValue}>{maskDocumentNumber(request.documentNumber)}</dd>

          <dt className={css.factTerm}>Yukleme tarihi</dt>
          <dd className={css.factValue}>{formatDateTime(request.submittedAt)}</dd>

          <dt className={css.factTerm}>Kayit tarihi</dt>
          <dd className={css.factValue}>{formatDateTime(seller.registeredAt)}</dd>
        </dl>

        {/* Belge gorselleri */}
        {request.documentImages.length > 0 ? (
          <>
            <h4 className={css.sectionTitle}>Belge Gorselleri</h4>
            <div className={css.documentGrid}>
              {request.documentImages.map((img) => (
                <div key={img.label} className={css.documentCard}>
                  <img
                    className={css.documentImage}
                    src={img.url}
                    alt={img.label}
                    onClick={() => setZoomGorsel(img)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setZoomGorsel(img)
                      }
                    }}
                  />
                  <p className={css.documentLabel}>{img.label}</p>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <hr className={css.divider} />

        {/* Satici istatistikleri */}
        <h4 className={css.sectionTitle}>Satici Istatistikleri</h4>
        <div className={css.sellerStats}>
          <span className={css.sellerStatItem}>
            <span className={css.sellerStatLabel}>Toplam ilan:</span>
            <span className={css.sellerStatValue}>{seller.listingCount}</span>
          </span>
          <span className={css.sellerStatItem}>
            <span className={css.sellerStatLabel}>Aktif:</span>
            <span className={css.sellerStatValue}>{seller.activeListingCount}</span>
          </span>
          <span className={css.sellerStatItem}>
            <span className={css.sellerStatLabel}>Sikayet:</span>
            <span className={css.sellerStatValue}>{seller.reportCount}</span>
          </span>
        </div>

        {/* Dogrulama gecmisi */}
        {request.history !== undefined && request.history.length > 0 ? (
          <>
            <hr className={css.divider} />
            <h4 className={css.sectionTitle}>Dogrulama Gecmisi</h4>
            <ul className={css.timeline}>
              {request.history.map((entry, index) => (
                <li key={index} className={css.timelineItem}>
                  <span className={css.timelineDot} aria-hidden="true" />
                  <div className={css.timelineContent}>
                    <span className={css.timelineDate}>{formatDateTime(entry.date)}</span>
                    <span className={css.timelineAction}>
                      {entry.action} — {entry.actor}
                    </span>
                    {entry.note !== undefined ? (
                      <span className={css.timelineNote}>{entry.note}</span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {/* Ek belge bekleniyor uyarisi */}
        {request.status === 'ek_belge_bekleniyor' ? (
          <Alert
            tone="warning"
            title="Ek belge bekleniyor"
            description="Saticidan ek belge talep edildi. Belgeler yuklendiginde bu basvuru tekrar incelenebilir."
          />
        ) : null}

        {/* Eylem cubugu */}
        <div className={css.actionBar}>
          {izinOnayla ? (
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<CheckCircle2 size={16} />}
              onClick={() => void onApprove(request.id)}
            >
              Onayla
            </Button>
          ) : null}

          {izinReddet ? (
            <Button
              variant="danger"
              size="sm"
              leadingIcon={<XCircle size={16} />}
              onClick={() => {
                setRedNedeni('')
                setRedNotu('')
                setRedModalAcik(true)
              }}
            >
              Reddet
            </Button>
          ) : null}

          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<FileText size={16} />}
            onClick={() => {
              setEkBelgeMesaji('')
              setEkBelgeModalAcik(true)
            }}
          >
            Ek belge iste
          </Button>
        </div>
      </div>
    )
  }

  /* ── Kuyruk paneli ── */

  const bekleyenSayisi = requests.filter((r) => r.status === 'beklemede').length
  const hasSplit = secili !== undefined

  return (
    <div className={css.root}>
      <h2 className={css.title}>Satici Dogrulama</h2>

      {/* Ozet istatistikleri */}
      {stats !== undefined ? (
        <div className={css.statsRow}>
          <StatCard
            label="Bekleyen Basvuru"
            value={stats.pending}
            icon={<Clock size={20} />}
            variant="accent"
          />
          <StatCard
            label="Bugun Onaylanan"
            value={stats.approvedToday}
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            label="Bugun Reddedilen"
            value={stats.rejectedToday}
            icon={<XCircle size={20} />}
          />
          <StatCard
            label="Ort. Islem Suresi"
            value={`${stats.avgProcessingTime} dk`}
            description="Ortalama"
          />
        </div>
      ) : null}

      <div className={css.layout({ split: hasSplit })}>
        {/* Sol panel: kuyruk */}
        <div className={`${css.queuePanel} ${hasSplit ? css.queuePanelHidden : ''}`}>
          <div className={css.queueHeader}>
            <h3 className={css.sectionTitle}>Basvurular</h3>
            <p className={css.countBadge}>{bekleyenSayisi} basvuru bekliyor</p>
          </div>

          <div className={css.filterRow}>
            <Select
              label="Belge turu"
              size="sm"
              options={BELGE_TURU_FILTRE}
              value={belgeTuruFiltre}
              onValueChange={(v) => setBelgeTuruFiltre(v ?? '')}
            />
            <Select
              label="Durum"
              size="sm"
              options={DURUM_FILTRE}
              value={durumFiltre}
              onValueChange={(v) => setDurumFiltre(v ?? '')}
            />
            <Select
              label="Siralama"
              size="sm"
              options={SIRALAMA_SECENEKLERI}
              value={siralama}
              onValueChange={(v) => setSiralama(v ?? 'newest')}
            />
          </div>

          {filtrelenmis.length === 0 ? (
            <div className={css.emptyQueue}>
              <EmptyState
                title="Basvuru bulunamadi"
                description="Secili filtrelere uyan dogrulama basvurusu yok."
                illustration={<CheckCircle2 size={48} />}
              />
            </div>
          ) : (
            <ul className={css.queue}>
              {filtrelenmis.map(satirCiz)}
            </ul>
          )}
        </div>

        {/* Sag panel: detay */}
        {secili !== undefined ? detayCiz(secili) : null}
      </div>

      {/* Red modal */}
      {redModalAcik && secili !== undefined ? (
        <Modal
          open
          size="sm"
          title="Basvuruyu reddet"
          description={`${secili.seller.name} adli saticinin dogrulama basvurusunu reddetmek uzeresiniz.`}
          closeOnBackdrop={false}
          onOpenChange={(acik) => {
            if (!acik) setRedModalAcik(false)
          }}
          footer={
            <div className={css.dialogActions}>
              <Button variant="secondary" onClick={() => setRedModalAcik(false)}>
                Vazgec
              </Button>
              <Button
                variant="danger"
                disabled={!redGecerli}
                onClick={redOnayla}
              >
                Reddet
              </Button>
            </div>
          }
        >
          <div className={css.rejectBody}>
            <Select
              label="Red nedeni"
              required
              size="sm"
              placeholder="Neden secin"
              options={RED_NEDENLERI}
              value={redNedeni}
              onValueChange={(v) => setRedNedeni(v ?? '')}
            />

            <Textarea
              label="Ek not"
              helperText="Opsiyonel: red karariniz hakkinda ek aciklama yazabilirsiniz."
              rows={3}
              showCharacterCount
              maxLength={500}
              value={redNotu}
              onChange={(e) => setRedNotu(e.target.value)}
            />
          </div>
        </Modal>
      ) : null}

      {/* Ek belge isteme modal */}
      {ekBelgeModalAcik && secili !== undefined ? (
        <Modal
          open
          size="sm"
          title="Ek belge iste"
          description={`${secili.seller.name} adli saticidan ek belge talep edin.`}
          closeOnBackdrop={false}
          onOpenChange={(acik) => {
            if (!acik) setEkBelgeModalAcik(false)
          }}
          footer={
            <div className={css.dialogActions}>
              <Button variant="secondary" onClick={() => setEkBelgeModalAcik(false)}>
                Vazgec
              </Button>
              <Button
                variant="primary"
                disabled={!ekBelgeGecerli}
                onClick={ekBelgeOnayla}
              >
                Gonder
              </Button>
            </div>
          }
        >
          <div className={css.rejectBody}>
            <Textarea
              label="Mesaj"
              required
              helperText="Saticiya gonderilecek ek belge talebi mesajini yazin."
              rows={3}
              showCharacterCount
              maxLength={500}
              value={ekBelgeMesaji}
              onChange={(e) => setEkBelgeMesaji(e.target.value)}
            />
          </div>
        </Modal>
      ) : null}

      {/* Belge zoom modal */}
      {zoomGorsel !== undefined ? (
        <Modal
          open
          size="lg"
          title={zoomGorsel.label}
          onOpenChange={(acik) => {
            if (!acik) setZoomGorsel(undefined)
          }}
        >
          <img
            className={css.zoomImage}
            src={zoomGorsel.url}
            alt={zoomGorsel.label}
          />
        </Modal>
      ) : null}
    </div>
  )
}
