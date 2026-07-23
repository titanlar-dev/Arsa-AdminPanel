import { useState } from 'react'
import { Check, CheckCircle2, ImageOff, Square, SquareCheck, X, XCircle } from 'lucide-react'
import { AssetModerationStatus, RejectionReason, type ListingPhoto } from '../../../types/domain'
import {
  ASSET_MODERATION_STATUS_LABEL,
  REJECTION_REASON_DESCRIPTION,
  REJECTION_REASON_LABEL,
} from '../../../domain/labels'
import { PHOTO_REJECTION_REASONS } from '../../../domain/moderationActions'
import { Badge } from '../../primitives/Badge'
import { Button } from '../../primitives/Button'
import { Modal } from '../../primitives/Modal'
import { Select } from '../../primitives/Select'
import { Skeleton } from '../../primitives/Skeleton'
import { Textarea } from '../../primitives/Textarea'
import { EmptyState } from '../EmptyState'
import type { ImageGalleryProps, SelectOption } from '../../../types/component-props'
import * as css from './ImageGallery.css'

const DURUM_TONU = {
  [AssetModerationStatus.Pending]: 'neutral',
  [AssetModerationStatus.Approved]: 'success',
  [AssetModerationStatus.Rejected]: 'danger',
} as const satisfies Record<AssetModerationStatus, 'neutral' | 'success' | 'danger'>

/** Serit noktasinin recipe varyant adi; enum degerleriyle birebir. */
const DURUM_NOKTASI = {
  [AssetModerationStatus.Pending]: 'pending',
  [AssetModerationStatus.Approved]: 'approved',
  [AssetModerationStatus.Rejected]: 'rejected',
} as const satisfies Record<AssetModerationStatus, 'pending' | 'approved' | 'rejected'>

const GEREKCE_SECENEKLERI: SelectOption[] = PHOTO_REJECTION_REASONS.map((reason) => ({
  value: reason,
  label: REJECTION_REASON_LABEL[reason],
  description: REJECTION_REASON_DESCRIPTION[reason],
}))

/**
 * Ilan fotograflarini inceleme ve tek tek moderasyon.
 *
 * Buyuk gorsel `object-fit: contain` ile gosterilir, `cover` ile degil:
 * kirpilan kenarda filigran, telefon numarasi veya uygunsuz bir detay olabilir
 * ve gormedigin seyi onaylamak moderasyon degildir.
 *
 * **Bozuk gorsel bir durumdur, kaza degil.** Yuklenemeyen fotografin yerine
 * tarayicinin kirik ikonu degil, ne oldugunu soyleyen bir kutu konur --
 * moderator "fotograf uygunsuz" ile "fotograf acilmiyor" arasindaki farki
 * gormeli; ikincisinde karar vermek yerine altyapiya bakilir.
 *
 * `activePhotoId` verilirse galeri kontrolludur; verilmezse secimi kendisi
 * tutar -- tek basina da calisir.
 *
 * Fotograf reddi gerekce ister ama **not istemez**: gerekce ilan sahibine hangi
 * fotografin neden kaldirildigini zaten soyler, not yalniz somutlastirir.
 * Gerekceler `PHOTO_REJECTION_REASONS` ile sinirli -- "Fiyat Hatasi" bir
 * fotografin sucu olamaz.
 *
 * @example
 * <ImageGallery photos={listing.photos} allowModeration onPhotoReject={fotografiReddet} />
 */
export function ImageGallery({
  photos,
  activePhotoId,
  variant = 'mosaic',
  loading = false,
  allowModeration = false,
  onActivePhotoChange,
  onPhotoApprove,
  onPhotoReject,
  onBatchApprove,
  onBatchReject,
}: ImageGalleryProps) {
  const [iceriSecili, setIceriSecili] = useState<string | undefined>(undefined)
  const [bozukUrller, setBozukUrller] = useState<readonly string[]>([])
  const [redAcik, setRedAcik] = useState(false)
  const [redGerekce, setRedGerekce] = useState<string | undefined>(undefined)
  const [redNot, setRedNot] = useState('')

  // Toplu moderasyon state
  const [seciliIdler, setSeciliIdler] = useState<readonly string[]>([])
  const [topluRedAcik, setTopluRedAcik] = useState(false)
  const [topluRedGerekce, setTopluRedGerekce] = useState<string | undefined>(undefined)
  const [topluRedNot, setTopluRedNot] = useState('')
  const [topluIslem, setTopluIslem] = useState<'approve' | 'reject' | null>(null)

  if (loading) {
    return (
      <div className={css.root({ variant })}>
        <div className={css.stage}>
          {/* Olculer gercek duzenle ayni: veri gelince yukseklik degismez, sayfa ziplamaz. */}
          <Skeleton variant="rectangle" height="18rem" />
        </div>
      </div>
    )
  }

  const sirali = [...photos].sort((a, b) => a.order - b.order)
  const [ilk] = sirali

  if (ilk === undefined) {
    return (
      <EmptyState
        variant="compact"
        title="Bu ilanda fotoğraf yok"
        description="İlan sahibi henüz fotoğraf yüklemedi. Fotoğrafsız ilan yayına alınamaz."
      />
    )
  }

  const varsayilan = sirali.find((photo) => photo.isCover) ?? ilk
  const aktif = sirali.find((photo) => photo.id === (activePhotoId ?? iceriSecili)) ?? varsayilan
  const aktifSira = sirali.findIndex((photo) => photo.id === aktif.id) + 1

  const bozuk = (url: string) => bozukUrller.includes(url)
  const bozuldu = (url: string) =>
    setBozukUrller((onceki) => (onceki.includes(url) ? onceki : [...onceki, url]))

  const sec = (photo: ListingPhoto) => {
    setIceriSecili(photo.id)
    onActivePhotoChange?.(photo.id)
  }

  const moderasyonVar =
    allowModeration && (onPhotoApprove !== undefined || onPhotoReject !== undefined)

  const topluModerasyon =
    allowModeration && (onBatchApprove !== undefined || onBatchReject !== undefined)

  // Durum sayilari
  const bekleyenler = sirali.filter((p) => p.moderationStatus === AssetModerationStatus.Pending)
  const onaylananlar = sirali.filter((p) => p.moderationStatus === AssetModerationStatus.Approved)
  const reddedilenler = sirali.filter((p) => p.moderationStatus === AssetModerationStatus.Rejected)

  const bekleyenIdler = bekleyenler.map((p) => p.id)

  // Secim islemleri
  const secimToogle = (photoId: string) => {
    setSeciliIdler((onceki) =>
      onceki.includes(photoId) ? onceki.filter((id) => id !== photoId) : [...onceki, photoId],
    )
  }

  const tumunuSec = () => {
    setSeciliIdler(sirali.map((p) => p.id))
  }

  const secimiTemizle = () => {
    setSeciliIdler([])
  }

  const tumSeciliMi = seciliIdler.length === sirali.length && sirali.length > 0

  // Secili fotograflardaki bekleyenler
  const seciliBekleyenler = sirali.filter(
    (p) => seciliIdler.includes(p.id) && p.moderationStatus === AssetModerationStatus.Pending,
  )

  const reddet = () => {
    if (redGerekce === undefined) return

    const temizNot = redNot.trim()
    onPhotoReject?.(aktif.id, redGerekce as RejectionReason, temizNot === '' ? undefined : temizNot)

    setRedAcik(false)
    setRedGerekce(undefined)
    setRedNot('')
  }

  const topluOnayla = (idler: string[]) => {
    if (onBatchApprove === undefined || idler.length === 0) return
    setTopluIslem('approve')
    onBatchApprove(idler)
    setTopluIslem(null)
    setSeciliIdler([])
  }

  const topluReddet = () => {
    if (topluRedGerekce === undefined) return

    const hedefIdler = seciliIdler.length > 0 ? seciliBekleyenler.map((p) => p.id) : bekleyenIdler
    const temizNot = topluRedNot.trim()

    onBatchReject?.(hedefIdler, topluRedGerekce, temizNot === '' ? undefined : temizNot)

    setTopluRedAcik(false)
    setTopluRedGerekce(undefined)
    setTopluRedNot('')
    setTopluIslem(null)
    setSeciliIdler([])
  }

  return (
    <div className={css.root({ variant })}>
      {/* Toplu moderasyon arac cubugu */}
      {topluModerasyon ? (
        <div className={css.batchToolbar} data-testid="batch-toolbar">
          <span className={css.batchSummary}>
            {sirali.length} fotoğraf{' \u00B7 '}
            {bekleyenler.length} beklemede{' \u00B7 '}
            {onaylananlar.length} onaylandı{' \u00B7 '}
            {reddedilenler.length} reddedildi
          </span>

          <div className={css.batchActions}>
            {/* Secim kontrolleri */}
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={tumSeciliMi ? <SquareCheck size={16} /> : <Square size={16} />}
              onClick={tumSeciliMi ? secimiTemizle : tumunuSec}
            >
              {tumSeciliMi ? 'Seçimi temizle' : 'Tümünü seç'}
            </Button>

            {seciliIdler.length > 0 ? (
              <>
                <span className={css.batchSummary}>{seciliIdler.length} fotoğraf seçili</span>

                {onBatchApprove !== undefined ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    leadingIcon={<CheckCircle2 size={16} />}
                    disabled={seciliBekleyenler.length === 0}
                    loading={topluIslem === 'approve'}
                    onClick={() => topluOnayla(seciliBekleyenler.map((p) => p.id))}
                  >
                    Seçilenleri onayla
                  </Button>
                ) : null}

                {onBatchReject !== undefined ? (
                  <Button
                    variant="danger"
                    size="sm"
                    leadingIcon={<XCircle size={16} />}
                    disabled={seciliBekleyenler.length === 0}
                    loading={topluIslem === 'reject'}
                    onClick={() => {
                      setTopluIslem('reject')
                      setTopluRedAcik(true)
                    }}
                  >
                    Seçilenleri reddet
                  </Button>
                ) : null}
              </>
            ) : (
              <>
                {onBatchApprove !== undefined ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    leadingIcon={<CheckCircle2 size={16} />}
                    disabled={bekleyenler.length === 0}
                    loading={topluIslem === 'approve'}
                    onClick={() => topluOnayla(bekleyenIdler)}
                  >
                    Tümünü onayla
                  </Button>
                ) : null}

                {onBatchReject !== undefined ? (
                  <Button
                    variant="danger"
                    size="sm"
                    leadingIcon={<XCircle size={16} />}
                    disabled={bekleyenler.length === 0}
                    loading={topluIslem === 'reject'}
                    onClick={() => {
                      setTopluIslem('reject')
                      setTopluRedAcik(true)
                    }}
                  >
                    Tümünü reddet
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}

      <div className={css.stage}>
        <figure className={css.frame} style={{ margin: 0 }}>
          {bozuk(aktif.url) ? (
            <div className={css.broken}>
              <ImageOff size={32} aria-hidden="true" />
              <span>Görsel yüklenemedi. Dosya sunucuda bulunamadı veya bozuk.</span>
            </div>
          ) : (
            <img
              className={css.image}
              src={aktif.url}
              alt={aktif.altText}
              onError={() => bozuldu(aktif.url)}
            />
          )}

          <span className={css.badgeSlot}>
            <Badge tone={DURUM_TONU[aktif.moderationStatus]} variant="solid">
              {ASSET_MODERATION_STATUS_LABEL[aktif.moderationStatus]}
            </Badge>
          </span>

          {aktif.isCover ? (
            <span className={css.coverSlot}>
              <Badge tone="info" variant="solid">
                Kapak
              </Badge>
            </span>
          ) : null}
        </figure>

        <div className={css.toolbar}>
          <span className={css.toolbarNote}>
            {aktifSira} / {sirali.length}
            {aktif.moderationStatus === AssetModerationStatus.Rejected &&
            aktif.rejectionReason !== undefined
              ? ` \u2014 ${REJECTION_REASON_LABEL[aktif.rejectionReason]}`
              : ''}
          </span>

          {moderasyonVar && onPhotoApprove !== undefined ? (
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={<Check size={16} />}
              disabled={aktif.moderationStatus === AssetModerationStatus.Approved}
              onClick={() => onPhotoApprove(aktif.id)}
            >
              Uygun
            </Button>
          ) : null}

          {moderasyonVar && onPhotoReject !== undefined ? (
            <Button
              variant="danger"
              size="sm"
              leadingIcon={<X size={16} />}
              onClick={() => setRedAcik(true)}
            >
              Uygunsuz
            </Button>
          ) : null}
        </div>
      </div>

      <ul className={css.thumbs({ variant })}>
        {sirali.map((photo, index) => (
          <li key={photo.id} className={css.thumbItem}>
            <button
              type="button"
              className={`${css.thumb}${seciliIdler.includes(photo.id) ? ` ${css.thumbSelected}` : ''}`}
              aria-current={photo.id === aktif.id}
              aria-label={`${index + 1}. fotoğraf, ${ASSET_MODERATION_STATUS_LABEL[photo.moderationStatus]}${
                photo.isCover ? ', kapak' : ''
              }`}
              onClick={() => sec(photo)}
            >
              {topluModerasyon ? (
                <span
                  className={css.thumbCheckbox}
                  role="checkbox"
                  aria-checked={seciliIdler.includes(photo.id)}
                  aria-label={`${index + 1}. fotoğrafı seç`}
                  onClick={(e) => {
                    e.stopPropagation()
                    secimToogle(photo.id)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      e.stopPropagation()
                      secimToogle(photo.id)
                    }
                  }}
                  tabIndex={0}
                >
                  {seciliIdler.includes(photo.id) ? (
                    <Check size={14} />
                  ) : null}
                </span>
              ) : null}

              {bozuk(photo.thumbnailUrl) ? (
                <span className={css.brokenThumb}>
                  <ImageOff size={16} aria-hidden="true" />
                </span>
              ) : (
                <img
                  className={css.thumbImage}
                  src={photo.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  onError={() => bozuldu(photo.thumbnailUrl)}
                />
              )}

              <span
                className={css.thumbStatus({ status: DURUM_NOKTASI[photo.moderationStatus] })}
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Tekil red modali */}
      <Modal
        open={redAcik}
        size="sm"
        title={`${aktifSira}. fotoğrafı uygunsuz işaretle`}
        description="Gerekçe ilan sahibine iletilir. Yalnız bu fotoğraf kaldırılır, ilanın kendisi etkilenmez."
        onOpenChange={(next) => {
          if (!next) setRedAcik(false)
        }}
        footer={
          <div className={css.footer}>
            <Button variant="secondary" onClick={() => setRedAcik(false)}>
              Vazgeç
            </Button>
            <Button variant="danger" disabled={redGerekce === undefined} onClick={reddet}>
              Uygunsuz işaretle
            </Button>
          </div>
        }
      >
        <div className={css.dialogBody}>
          <Select
            label="Gerekçe"
            placeholder="Gerekçe seçin"
            required
            options={GEREKCE_SECENEKLERI}
            value={redGerekce}
            onValueChange={setRedGerekce}
          />

          <Textarea
            label="Not"
            helperText="İsteğe bağlı. Gerekçeyi somutlaştırır: neyin, fotoğrafın neresinde olduğu."
            value={redNot}
            rows={2}
            maxLength={300}
            showCharacterCount
            onChange={(event) => setRedNot(event.target.value)}
          />
        </div>
      </Modal>

      {/* Toplu red modali */}
      <Modal
        open={topluRedAcik}
        size="sm"
        title={
          seciliIdler.length > 0
            ? `${seciliBekleyenler.length} fotoğrafı toplu reddet`
            : `${bekleyenler.length} bekleyen fotoğrafı toplu reddet`
        }
        description="Seçilen gerekçe tüm fotoğraflara uygulanır."
        onOpenChange={(next) => {
          if (!next) {
            setTopluRedAcik(false)
            setTopluIslem(null)
          }
        }}
        footer={
          <div className={css.footer}>
            <Button
              variant="secondary"
              onClick={() => {
                setTopluRedAcik(false)
                setTopluIslem(null)
              }}
            >
              Vazgeç
            </Button>
            <Button variant="danger" disabled={topluRedGerekce === undefined} onClick={topluReddet}>
              Toplu reddet
            </Button>
          </div>
        }
      >
        <div className={css.dialogBody}>
          <Select
            label="Gerekçe"
            placeholder="Gerekçe seçin"
            required
            options={GEREKCE_SECENEKLERI}
            value={topluRedGerekce}
            onValueChange={setTopluRedGerekce}
          />

          <Textarea
            label="Not"
            helperText="İsteğe bağlı. Tüm fotoğraflara ortak not."
            value={topluRedNot}
            rows={2}
            maxLength={300}
            showCharacterCount
            onChange={(event) => setTopluRedNot(event.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}
