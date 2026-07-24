import { useState } from 'react'
import { useNavigate } from 'react-router'
import { allMockListings } from '../mocks/listings'
import { LISTING_CATEGORY_LABEL, LISTING_STATUS_LABEL, TRANSACTION_TYPE_LABEL } from '../domain/labels'
import { formatCurrency } from '../utils/formatCurrency'
import type { Listing } from '../types/domain'
import type { ColumnDef, SelectOption } from '../types/component-props'
import { DataTable } from '../components/composites/DataTable'
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

/* ── Advanced column definitions ── */

const COLUMNS: ColumnDef<Listing>[] = [
  {
    id: 'listingNo',
    header: 'Ilan No',
    accessor: 'listingNo',
    sortable: true,
    columnFilterable: true,
    columnFilterType: 'text',
    width: '9rem',
  },
  {
    id: 'title',
    header: 'Baslik',
    cell: (row) => (
      <span style={{ maxWidth: '18rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
        {row.title}
      </span>
    ),
    sortable: true,
    sortAccessor: (row) => row.title,
    filterable: true,
    filterAccessor: (row) => row.title,
    columnFilterable: true,
    columnFilterType: 'text',
  },
  {
    id: 'category',
    header: 'Kategori',
    cell: (row) => LISTING_CATEGORY_LABEL[row.category],
    sortable: true,
    sortAccessor: (row) => LISTING_CATEGORY_LABEL[row.category],
    columnFilterable: true,
    columnFilterType: 'select',
    columnFilterOptions: KATEGORI_SEC,
  },
  {
    id: 'transactionType',
    header: 'Islem Turu',
    cell: (row) => TRANSACTION_TYPE_LABEL[row.transactionType],
    sortable: true,
    sortAccessor: (row) => TRANSACTION_TYPE_LABEL[row.transactionType],
    columnFilterable: true,
    columnFilterType: 'select',
    columnFilterOptions: ISLEM_SEC,
  },
  {
    id: 'location',
    header: 'Konum',
    cell: (row) => `${row.location.cityName}, ${row.location.districtName}`,
    sortable: true,
    sortAccessor: (row) => `${row.location.cityName}, ${row.location.districtName}`,
    columnFilterable: true,
    columnFilterType: 'text',
  },
  {
    id: 'price',
    header: 'Fiyat',
    cell: (row) => formatCurrency(row.price),
    sortable: true,
    align: 'end',
    sortAccessor: (row) => row.price.amount,
    columnFilterable: true,
    columnFilterType: 'number',
  },
  {
    id: 'status',
    header: 'Durum',
    cell: (row) => <StatusBadge status={row.status} size="sm" showDot />,
    sortable: true,
    sortAccessor: (row) => row.status,
    columnFilterable: true,
    columnFilterType: 'select',
    columnFilterOptions: DURUM_SEC,
  },
]

export function ListingsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

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

  return (
    <div className={css.root}>
      <div className={css.header}>
        <h1 className={css.title}>Ilanlar</h1>
        <span className={css.badge}>{filtered.length} ilan</span>
        <button
          type="button"
          style={{
            marginLeft: 'auto',
            padding: '0.5rem 1rem',
            background: 'rgba(99,102,241,0.8)',
            border: 'none',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.95)',
            fontSize: '0.8125rem',
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
        onChange={(e) => setQuery(e.target.value)}
      />

      <DataTable<Listing>
        rows={filtered}
        columns={COLUMNS}
        selectable
        density="compact"
        onRowClick={(row) => navigate(`/listings/${row.id}`)}
      />
    </div>
  )
}
