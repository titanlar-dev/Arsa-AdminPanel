import { useNavigate, useParams } from 'react-router'
import { allMockListings } from '../mocks/listings'
import {
  LISTING_CATEGORY_LABEL,
  SELLER_TYPE_LABEL,
  TRANSACTION_TYPE_LABEL,
} from '../domain/labels'
import { formatCurrency } from '../utils/formatCurrency'
import { ListingStatus } from '../types/domain'
import { StatusBadge } from '../components/composites/StatusBadge'
import * as css from './ListingDetailPage.css'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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

  return (
    <div className={css.root}>
      {/* Header */}
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

      {/* Info card */}
      <div className={css.card}>
        <div className={css.cardTitle}>Ilan Bilgileri</div>
        <div className={css.infoGrid}>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Ilan No</span>
            <span className={css.infoValue}>{listing.listingNo}</span>
          </div>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Kategori</span>
            <span className={css.infoValue}>
              {LISTING_CATEGORY_LABEL[listing.category]}
            </span>
          </div>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Islem Turu</span>
            <span className={css.infoValue}>
              {TRANSACTION_TYPE_LABEL[listing.transactionType]}
            </span>
          </div>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Fiyat</span>
            <span className={css.infoValue}>
              {formatCurrency(listing.price)}
            </span>
          </div>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Konum</span>
            <span className={css.infoValue}>
              {listing.location.cityName}, {listing.location.districtName},{' '}
              {listing.location.neighborhoodName}
            </span>
          </div>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Metre Kare</span>
            <span className={css.infoValue}>
              {'grossSquareMeters' in listing.attributes
                ? `${listing.attributes.grossSquareMeters} m²`
                : 'squareMeters' in listing.attributes
                  ? `${listing.attributes.squareMeters} m²`
                  : 'totalSquareMeters' in listing.attributes
                    ? `${listing.attributes.totalSquareMeters} m²`
                    : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Seller card */}
      <div className={css.card}>
        <div className={css.cardTitle}>Satici Bilgileri</div>
        <div className={css.infoGrid}>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Satici Adi</span>
            <span className={css.infoValue}>{listing.seller.displayName}</span>
          </div>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Satici Tipi</span>
            <span className={css.infoValue}>
              {SELLER_TYPE_LABEL[listing.seller.type]}
            </span>
          </div>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Ilan Tarihi</span>
            <span className={css.infoValue}>
              {formatDate(listing.listingDate)}
            </span>
          </div>
          <div className={css.infoItem}>
            <span className={css.infoLabel}>Guncellenme Tarihi</span>
            <span className={css.infoValue}>
              {formatDate(listing.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Description card */}
      <div className={css.card}>
        <div className={css.cardTitle}>Ilan Aciklamasi</div>
        <p className={css.descriptionText}>{listing.description}</p>
      </div>

      {/* Actions */}
      <div className={css.actions}>
        <button
          type="button"
          className={css.primaryBtn}
          onClick={() => navigate(`/listings/${listing.id}/edit`)}
        >
          Duzenle
        </button>

        {/* Contextual status actions */}
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
