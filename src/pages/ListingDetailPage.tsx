import { useNavigate, useParams } from 'react-router'
import { allMockListings } from '../mocks/listings'
import {
  AUTOMATED_CHECK_LABEL,
  AUTOMATED_CHECK_STATUS_LABEL,
  BOOLEAN_HAS_LABEL,
  BOOLEAN_IS_LABEL,
  BUILDING_AGE_LABEL,
  BUILDING_CONDITION_LABEL,
  FLOOR_LOCATION_LABEL,
  HEATING_TYPE_LABEL,
  INFRASTRUCTURE_TYPE_LABEL,
  LISTING_CATEGORY_LABEL,
  LISTING_METRIC_LABEL,
  LISTING_STATUS_LABEL,
  LISTING_SUB_CATEGORY_LABEL,
  PARKING_TYPE_LABEL,
  REJECTION_REASON_LABEL,
  ROOM_COUNT_LABEL,
  SELLER_TYPE_LABEL,
  SELLER_VERIFICATION_STATUS_LABEL,
  TRANSACTION_TYPE_LABEL,
  ZONING_STATUS_LABEL,
} from '../domain/labels'
import { formatCurrency, negotiableSuffix } from '../utils/formatCurrency'
import {
  AutomatedCheckResultStatus,
  ListingCategory,
  ListingStatus,
  type Listing,
  type ListingMetrics,
  type Money,
} from '../types/domain'
import { StatusBadge } from '../components/composites/StatusBadge'
import * as css from './ListingDetailPage.css'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getSquareMeters(attrs: Listing['attributes']): string {
  if ('grossSquareMeters' in attrs && attrs.grossSquareMeters) {
    return `${attrs.grossSquareMeters} m²`
  }
  if ('squareMeters' in attrs && attrs.squareMeters) {
    return `${attrs.squareMeters} m²`
  }
  if ('totalSquareMeters' in attrs && attrs.totalSquareMeters) {
    return `${attrs.totalSquareMeters} m²`
  }
  return '-'
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className={css.infoItem}>
      <span className={css.infoLabel}>{label}</span>
      <span className={css.infoValue}>{value}</span>
    </div>
  )
}

function checkBadgeClass(status: AutomatedCheckResultStatus): string {
  const map: Record<AutomatedCheckResultStatus, string> = {
    [AutomatedCheckResultStatus.Passed]: `${css.checkBadge} ${css.checkPassed}`,
    [AutomatedCheckResultStatus.Warning]: `${css.checkBadge} ${css.checkWarning}`,
    [AutomatedCheckResultStatus.Failed]: `${css.checkBadge} ${css.checkFailed}`,
  }
  return map[status]
}

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const listing = allMockListings.find((l) => l.id === id)

  if (!listing) {
    return (
      <div className={css.root}>
        <div className={css.notFound}>
          <span style={{ fontSize: '2rem' }}>404</span>
          <span>Ilan bulunamadi</span>
          <button
            type="button"
            className={css.ghostBtn}
            onClick={() => navigate('/listings')}
          >
            Ilanlara don
          </button>
        </div>
      </div>
    )
  }

  const status = listing.status
  const attrs = listing.attributes
  const mod = listing.moderation
  const photos = listing.photos
  const metrics = listing.metrics
  const coverPhoto = photos.find((p) => p.isCover) ?? photos[0]
  const otherPhotos = photos.filter((p) => p.id !== coverPhoto?.id).slice(0, 3)

  return (
    <div className={css.root}>
      {/* ── Section 1: Header ── */}
      <div className={css.headerRow}>
        <button
          type="button"
          className={css.backBtn}
          onClick={() => navigate('/listings')}
        >
          &larr; Ilanlar
        </button>
        <h1 className={css.titleText}>{listing.title}</h1>
        <StatusBadge status={status} size="sm" showDot />
      </div>
      <div className={css.subtitle}>Ilan No: {listing.listingNo}</div>

      {/* ── Section 2: Photo Gallery ── */}
      {photos.length > 0 ? (
        <div className={css.photoGrid}>
          {coverPhoto && (
            <div className={css.photoCover}>
              <img
                src={coverPhoto.thumbnailUrl}
                alt={coverPhoto.altText}
                className={css.photoCoverImg}
              />
              <span className={css.photoCountBadge}>{photos.length} foto</span>
            </div>
          )}
          {otherPhotos.map((photo) => (
            <div key={photo.id} className={css.photoThumb}>
              <img
                src={photo.thumbnailUrl}
                alt={photo.altText}
                className={css.photoImg}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={css.photoPlaceholder}>Fotograf yok</div>
      )}

      {/* ── Section 3: Key Facts ── */}
      <div className={css.card}>
        <div className={css.cardTitle}>Ilan Bilgileri</div>
        <div className={css.infoGrid}>
          <InfoRow
            label="FIYAT"
            value={`${formatCurrency(listing.price)}${negotiableSuffix(listing.price)}`}
          />
          <InfoRow
            label="KATEGORI"
            value={`${LISTING_CATEGORY_LABEL[listing.category]} / ${LISTING_SUB_CATEGORY_LABEL[listing.subCategory]}`}
          />
          <InfoRow
            label="ISLEM TURU"
            value={TRANSACTION_TYPE_LABEL[listing.transactionType]}
          />
          <InfoRow
            label="KONUM"
            value={`${listing.location.cityName}, ${listing.location.districtName}, ${listing.location.neighborhoodName}`}
          />
          <InfoRow label="METRE KARE" value={getSquareMeters(attrs)} />
          <InfoRow label="ILAN TARIHI" value={formatDate(listing.listingDate)} />

          {/* Residential-specific fields */}
          {listing.category === ListingCategory.Residential && 'roomCount' in attrs && (
            <>
              <InfoRow
                label="ODA SAYISI"
                value={typeof attrs.roomCount === 'string' && attrs.roomCount in ROOM_COUNT_LABEL
                  ? ROOM_COUNT_LABEL[attrs.roomCount as keyof typeof ROOM_COUNT_LABEL]
                  : String(attrs.roomCount)}
              />
              {'buildingAge' in attrs && attrs.buildingAge && (
                <InfoRow label="BINA YASI" value={BUILDING_AGE_LABEL[attrs.buildingAge]} />
              )}
              {'floorLocation' in attrs && attrs.floorLocation && (
                <InfoRow
                  label="KAT"
                  value={FLOOR_LOCATION_LABEL[attrs.floorLocation as keyof typeof FLOOR_LOCATION_LABEL] ?? attrs.floorLocation}
                />
              )}
              {'heatingType' in attrs && attrs.heatingType && (
                <InfoRow label="ISITMA" value={HEATING_TYPE_LABEL[attrs.heatingType]} />
              )}
              {'bathroomCount' in attrs && (
                <InfoRow label="BANYO SAYISI" value={String(attrs.bathroomCount)} />
              )}
              {'hasBalcony' in attrs && (
                <InfoRow label="BALKON" value={BOOLEAN_HAS_LABEL[String(attrs.hasBalcony) as 'true' | 'false']} />
              )}
              {'hasElevator' in attrs && (
                <InfoRow label="ASANSOR" value={BOOLEAN_HAS_LABEL[String(attrs.hasElevator) as 'true' | 'false']} />
              )}
              {'parkingType' in attrs && attrs.parkingType && (
                <InfoRow label="OTOPARK" value={PARKING_TYPE_LABEL[attrs.parkingType]} />
              )}
              {'furnished' in attrs && (
                <InfoRow label="ESYALI" value={BOOLEAN_IS_LABEL[String(attrs.furnished) as 'true' | 'false']} />
              )}
              {'monthlyFee' in attrs && attrs.monthlyFee && (
                <InfoRow label="AIDAT" value={formatCurrency(attrs.monthlyFee as Money)} />
              )}
            </>
          )}

          {/* Land-specific fields */}
          {listing.category === ListingCategory.Land && 'zoningStatus' in attrs && (
            <>
              {'zoningStatus' in attrs && attrs.zoningStatus && (
                <InfoRow label="IMAR DURUMU" value={ZONING_STATUS_LABEL[attrs.zoningStatus]} />
              )}
              {'block' in attrs && attrs.block && (
                <InfoRow label="ADA / PARSEL" value={`${attrs.block}${'parcel' in attrs ? ` / ${attrs.parcel}` : ''}`} />
              )}
              {'floorAreaRatio' in attrs && attrs.floorAreaRatio !== undefined && (
                <InfoRow label="EMSAL (KAKS)" value={String(attrs.floorAreaRatio)} />
              )}
              {'infrastructure' in attrs && attrs.infrastructure && (
                <InfoRow
                  label="ALTYAPI"
                  value={attrs.infrastructure
                    .map((i: keyof typeof INFRASTRUCTURE_TYPE_LABEL) => INFRASTRUCTURE_TYPE_LABEL[i])
                    .join(', ')}
                />
              )}
              {'pricePerSquareMeter' in attrs && attrs.pricePerSquareMeter && (
                <InfoRow
                  label="M2 FIYATI"
                  value={formatCurrency(attrs.pricePerSquareMeter as Money)}
                />
              )}
            </>
          )}

          {/* Commercial-specific fields */}
          {listing.category === ListingCategory.Commercial && (
            <>
              {'roomCount' in attrs && (
                <InfoRow
                  label="ODA SAYISI"
                  value={attrs.roomCount === 'acikPlan' ? 'Acik Plan' : String(attrs.roomCount)}
                />
              )}
              {'floorLocation' in attrs && attrs.floorLocation && (
                <InfoRow
                  label="KAT"
                  value={FLOOR_LOCATION_LABEL[attrs.floorLocation as keyof typeof FLOOR_LOCATION_LABEL] ?? String(attrs.floorLocation)}
                />
              )}
              {'deposit' in attrs && attrs.deposit && (
                <InfoRow label="DEPOZITO" value={formatCurrency(attrs.deposit as Money)} />
              )}
              {'buildingCondition' in attrs && attrs.buildingCondition && (
                <InfoRow label="BINA DURUMU" value={BUILDING_CONDITION_LABEL[attrs.buildingCondition]} />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Section 4: Description ── */}
      <div className={css.card}>
        <div className={css.cardTitle}>Ilan Aciklamasi</div>
        <p className={css.descriptionText}>{listing.description}</p>
      </div>

      {/* ── Section 5: Seller Info ── */}
      <div className={css.card}>
        <div className={css.cardTitle}>Satici Bilgileri</div>
        <div className={css.infoGrid}>
          <InfoRow
            label="SATICI ADI"
            value={
              <>
                {listing.seller.displayName}
                <span className={`${css.sellerBadge} ${css.sellerTypeBadge}`}>
                  {SELLER_TYPE_LABEL[listing.seller.type]}
                </span>
              </>
            }
          />
          <InfoRow
            label="DOGRULAMA DURUMU"
            value={
              <span
                className={`${css.sellerBadge} ${
                  listing.seller.verificationStatus === 'verified'
                    ? css.verifiedBadge
                    : css.unverifiedBadge
                }`}
              >
                {SELLER_VERIFICATION_STATUS_LABEL[listing.seller.verificationStatus]}
              </span>
            }
          />
          <InfoRow label="TELEFON" value={listing.contact.phone} />
          {listing.contact.email && (
            <InfoRow label="E-POSTA" value={listing.contact.email} />
          )}
        </div>
      </div>

      {/* ── Section 6: Metrics ── */}
      <div className={css.metricsRow}>
        {(Object.keys(metrics) as (keyof ListingMetrics)[]).map((key) => (
          <div key={key} className={css.metricCard}>
            <span className={css.metricValue}>
              {metrics[key].toLocaleString('tr-TR')}
            </span>
            <span className={css.metricLabel}>{LISTING_METRIC_LABEL[key]}</span>
          </div>
        ))}
      </div>

      {/* ── Section 7: Moderation Info ── */}
      <div className={css.card}>
        <div className={css.cardTitle}>Moderasyon Bilgileri</div>
        <div className={css.infoGrid}>
          <InfoRow label="DURUM" value={LISTING_STATUS_LABEL[status]} />
          {mod.submittedAt && (
            <InfoRow label="GONDERIM TARIHI" value={formatDate(mod.submittedAt)} />
          )}
          {mod.lastReviewedAt && (
            <InfoRow label="SON INCELEME" value={formatDate(mod.lastReviewedAt)} />
          )}
        </div>

        {/* Rejection reasons */}
        {mod.rejectionReasons.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div className={css.infoLabel} style={{ marginBottom: '0.5rem' }}>
              RED GEREKCELERI
            </div>
            <div>
              {mod.rejectionReasons.map((reason) => (
                <span key={reason} className={css.rejectionChip}>
                  {REJECTION_REASON_LABEL[reason]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Automated checks */}
        {mod.automatedChecks.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div className={css.infoLabel} style={{ marginBottom: '0.5rem' }}>
              OTOMATIK KONTROLLER
            </div>
            <div className={css.checkList}>
              {mod.automatedChecks.map((check) => (
                <div key={check.code} className={css.checkItem}>
                  <span className={checkBadgeClass(check.status)}>
                    {AUTOMATED_CHECK_STATUS_LABEL[check.status]}
                  </span>
                  <span>{AUTOMATED_CHECK_LABEL[check.code]}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                    {check.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review note */}
        {mod.reviewNote && (
          <div className={css.reviewNote}>{mod.reviewNote}</div>
        )}
      </div>

      {/* ── Section 8: Actions ── */}
      <div className={css.actions}>
        <button
          type="button"
          className={css.primaryBtn}
          onClick={() => navigate(`/listings/${listing.id}/edit`)}
        >
          Duzenle
        </button>

        {(status === ListingStatus.PendingReview ||
          status === ListingStatus.Draft) && (
          <button type="button" className={css.successBtn}>
            Onayla
          </button>
        )}

        {(status === ListingStatus.PendingReview ||
          status === ListingStatus.Draft) && (
          <button type="button" className={css.dangerBtn}>
            Reddet
          </button>
        )}

        {status === ListingStatus.Published && (
          <button type="button" className={css.warningBtn}>
            Askiya Al
          </button>
        )}
      </div>
    </div>
  )
}
