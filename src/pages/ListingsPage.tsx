import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ImageOff } from 'lucide-react'
import { allMockListings } from '../mocks/listings'
import {
  LISTING_CATEGORY_LABEL,
  LISTING_FIELD_LABEL,
  LISTING_METRIC_LABEL,
  LISTING_STATUS_LABEL,
  LISTING_SUB_CATEGORY_LABEL,
  PROMOTION_TYPE_LABEL,
  SELLER_TYPE_LABEL,
  TRANSACTION_TYPE_LABEL,
} from '../domain/labels'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDateTime'
import { PromotionType, type Listing, type PromotionFlags } from '../types/domain'
import type { ColumnDef, SelectOption } from '../types/component-props'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DataTable } from '../components/composites/DataTable'
import { Badge } from '../components/primitives/Badge'
import { StatusBadge } from '../components/composites/StatusBadge'
import * as css from './ListingsPage.css'

/* ── Filter options ── */

const KATEGORI_SEC: SelectOption[] = [
  { value: 'konut', label: 'Konut' },
  { value: 'arsa', label: 'Arsa' },
  { value: 'isyeri', label: 'Is Yeri' },
  { value: 'bina', label: 'Bina' },
]

const DURUM_SEC: SelectOption[] = Object.entries(LISTING_STATUS_LABEL).map(([k, v]) => ({
  value: k,
  label: v,
}))

const ISLEM_SEC: SelectOption[] = Object.entries(TRANSACTION_TYPE_LABEL).map(([k, v]) => ({
  value: k,
  label: v,
}))

/* ── Promotion helpers ── */

const PROMOSYON_BAYRAGI = {
  [PromotionType.Featured]: 'oneCikan',
  [PromotionType.Urgent]: 'acil',
  [PromotionType.Showcase]: 'vitrin',
  [PromotionType.HomepageShowcase]: 'anasayfaVitrini',
  [PromotionType.CategoryFeatured]: 'kategoriOneCikan',
} satisfies Record<PromotionType, keyof PromotionFlags>

function acikPromosyonlar(flags: PromotionFlags): PromotionType[] {
  return Object.values(PromotionType).filter((tip) => flags[PROMOSYON_BAYRAGI[tip]])
}

const sayi = (deger: number) => deger.toLocaleString('tr-TR')

/* ── Column definitions ── */

const COLUMNS: ColumnDef<Listing>[] = [
  {
    id: 'cover',
    header: LISTING_FIELD_LABEL.photos,
    cell: (row) => {
      const kapak = row.photos.find((foto) => foto.isCover) ?? row.photos[0]
      return kapak !== undefined ? (
        <img className={css.cover} src={kapak.thumbnailUrl} alt="" loading="lazy" />
      ) : (
        <span className={css.coverMissing}>
          <ImageOff size={16} aria-hidden="true" />
        </span>
      )
    },
  },
  {
    id: 'listingNo',
    header: LISTING_FIELD_LABEL.listingNo,
    cell: (row) => <span className={css.identifier}>{row.listingNo}</span>,
    sortable: true,
    columnFilterable: true,
    columnFilterType: 'text',
    width: '9rem',
  },
  {
    id: 'title',
    header: LISTING_FIELD_LABEL.title,
    cell: (row) => (
      <span className={css.cellPrimary} style={{ maxWidth: '16rem', display: 'block' }}>
        {row.title}
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => row.title,
    filterable: true,
    filterAccessor: (row) => row.title,
  },
  {
    id: 'category',
    header: LISTING_FIELD_LABEL.category,
    cell: (row) => (
      <span className={css.cellStack}>
        <span className={css.cellPrimary}>{LISTING_CATEGORY_LABEL[row.category]}</span>
        <span className={css.cellSecondary}>{LISTING_SUB_CATEGORY_LABEL[row.subCategory]}</span>
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => LISTING_CATEGORY_LABEL[row.category],
    columnFilterable: true,
    columnFilterType: 'select',
    columnFilterOptions: KATEGORI_SEC,
  },
  {
    id: 'transactionType',
    header: LISTING_FIELD_LABEL.transactionType,
    cell: (row) => TRANSACTION_TYPE_LABEL[row.transactionType],
    sortable: true,
    sortAccessor: (row) => TRANSACTION_TYPE_LABEL[row.transactionType],
    columnFilterable: true,
    columnFilterType: 'select',
    columnFilterOptions: ISLEM_SEC,
  },
  {
    id: 'location',
    header: LISTING_FIELD_LABEL.location,
    cell: (row) => (
      <span className={css.cellStack}>
        <span className={css.cellPrimary}>
          {row.location.districtName}, {row.location.cityName}
        </span>
        <span className={css.cellSecondary}>{row.location.neighborhoodName}</span>
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => `${row.location.cityName}, ${row.location.districtName}`,
    columnFilterable: true,
    columnFilterType: 'text',
  },
  {
    id: 'price',
    header: LISTING_FIELD_LABEL.price,
    cell: (row) => <span className={css.metric}>{formatCurrency(row.price)}</span>,
    sortable: true,
    align: 'end',
    sortAccessor: (row) => row.price.amount,
    columnFilterable: true,
    columnFilterType: 'number',
  },
  {
    id: 'seller',
    header: 'Kimden',
    cell: (row) => (
      <span className={css.cellStack}>
        <span className={css.cellPrimary}>{SELLER_TYPE_LABEL[row.seller.type]}</span>
        <span className={css.cellSecondary}>{row.seller.displayName}</span>
      </span>
    ),
  },
  {
    id: 'status',
    header: LISTING_FIELD_LABEL.status,
    cell: (row) => <StatusBadge status={row.status} size="sm" showDot />,
    sortable: true,
    sortAccessor: (row) => row.status,
    columnFilterable: true,
    columnFilterType: 'select',
    columnFilterOptions: DURUM_SEC,
  },
  {
    id: 'listingDate',
    header: LISTING_FIELD_LABEL.listingDate,
    cell: (row) => <span className={css.cellSecondary}>{formatDate(row.listingDate)}</span>,
    sortable: true,
    sortAccessor: (row) => row.listingDate,
  },
  {
    id: 'updatedAt',
    header: LISTING_FIELD_LABEL.updatedAt,
    cell: (row) => <span className={css.cellSecondary}>{formatDate(row.updatedAt)}</span>,
    sortable: true,
    sortAccessor: (row) => row.updatedAt,
  },
  {
    id: 'reviewer',
    header: 'Inceleyen',
    cell: (row) =>
      row.moderation.currentReviewerId !== undefined ? (
        <span className={css.cellPrimary}>Atanmis</span>
      ) : (
        <span className={css.empty}>—</span>
      ),
  },
  {
    id: 'promotions',
    header: LISTING_FIELD_LABEL.promotionFlags,
    cell: (row) => {
      const acik = acikPromosyonlar(row.promotionFlags)
      if (acik.length === 0) return <span className={css.empty}>—</span>
      return (
        <span className={css.badgeList}>
          {acik.map((tip) => (
            <Badge key={tip} tone="primary" variant="soft" size="sm">
              {PROMOTION_TYPE_LABEL[tip]}
            </Badge>
          ))}
        </span>
      )
    },
  },
  {
    id: 'viewCount',
    header: LISTING_METRIC_LABEL.viewCount,
    align: 'end',
    cell: (row) => <span className={css.metric}>{sayi(row.metrics.viewCount)}</span>,
    sortable: true,
    sortAccessor: (row) => row.metrics.viewCount,
  },
  {
    id: 'reportCount',
    header: LISTING_METRIC_LABEL.reportCount,
    align: 'end',
    cell: (row) =>
      row.metrics.reportCount > 0 ? (
        <Badge tone="danger" variant="soft" size="sm">
          {sayi(row.metrics.reportCount)}
        </Badge>
      ) : (
        <span className={css.metric}>0</span>
      ),
    sortable: true,
    sortAccessor: (row) => row.metrics.reportCount,
  },
]

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
const DEFAULT_PAGE_SIZE = 10

export function ListingsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const filtered = query
    ? allMockListings.filter((l) => {
        const q = query.toLocaleLowerCase('tr')
        return (
          l.listingNo.toLocaleLowerCase('tr').includes(q) ||
          l.title.toLocaleLowerCase('tr').includes(q) ||
          l.seller.displayName.toLocaleLowerCase('tr').includes(q)
        )
      })
    : allMockListings

  const totalItems = filtered.length
  const start = (page - 1) * pageSize
  const paginatedRows = filtered.slice(start, start + pageSize)

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  return (
    <div className={css.root}>
      <div className={css.header}>
        <h1 className={css.title}>Ilanlar</h1>
        <span className={css.badge}>{totalItems} ilan</span>
        <button
          type="button"
          style={{
            marginLeft: 'auto',
            padding: '0.375rem 0.75rem',
            background: 'rgba(99,102,241,0.8)',
            border: 'none',
            borderRadius: '6px',
            color: 'rgba(255,255,255,0.95)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/listings/new/edit')}
        >
          Ilan Ekle
        </button>
      </div>

      <input
        className={css.search}
        placeholder="Ilan no, baslik veya kullanici ara..."
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
      />

      <DataTable<Listing>
        rows={paginatedRows}
        columns={COLUMNS}
        selectable
        density="compact"
        onRowClick={(row) => navigate(`/listings/${row.id}`)}
      />

      <div className={css.paginationBar}>
        <span className={css.paginationInfo}>
          {start + 1}–{Math.min(start + pageSize, totalItems)} / {totalItems}
        </span>

        <div className={css.paginationPages}>
          <button
            type="button"
            className={css.paginationBtn}
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            aria-label="Onceki sayfa"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.ceil(totalItems / pageSize) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={css.paginationBtn}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className={css.paginationBtn}
            disabled={page >= Math.ceil(totalItems / pageSize)}
            onClick={() => setPage(page + 1)}
            aria-label="Sonraki sayfa"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        <div className={css.pageSizeWrap}>
          <span className={css.paginationInfo}>Sayfa:</span>
          <select
            className={css.pageSizeSelect}
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
