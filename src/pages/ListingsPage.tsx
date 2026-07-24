import { useState } from 'react'
import { allMockListings } from '../mocks/listings'
import { LISTING_CATEGORY_LABEL, LISTING_STATUS_LABEL } from '../domain/labels'
import { formatCurrency } from '../utils/formatCurrency'
import type { Listing } from '../types/domain'
import * as css from './ListingsPage.css'

const STATUS_COLOR: Record<string, string> = {
  published: '#22c55e',
  pendingReview: '#f59e0b',
  rejected: '#ef4444',
  draft: '#6b7280',
  paused: '#3b82f6',
  expired: '#8b5cf6',
  changesRequested: '#f97316',
  archived: '#6b7280',
}

const PAGE_SIZE = 12

export function ListingsPage() {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)

  const filtered = allMockListings.filter((l) => {
    if (query) {
      const q = query.toLowerCase()
      if (
        !l.listingNo.toLowerCase().includes(q) &&
        !l.title.toLowerCase().includes(q) &&
        !l.seller.displayName.toLowerCase().includes(q)
      ) return false
    }
    if (statusFilter && l.status !== statusFilter) return false
    if (categoryFilter && l.category !== categoryFilter) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const start = (safePage - 1) * PAGE_SIZE + 1
  const end = Math.min(safePage * PAGE_SIZE, filtered.length)

  return (
    <div className={css.root}>
      {/* Header */}
      <div className={css.header}>
        <h1 className={css.title}>Ilanlar</h1>
        <span className={css.badge}>{filtered.length} ilan</span>
      </div>

      {/* Search */}
      <input
        className={css.search}
        placeholder="Ilan no, baslik veya kullanici ara..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1) }}
      />

      {/* Filters */}
      <button
        type="button"
        className={css.filterBtn}
        onClick={() => setShowFilters((v) => !v)}
      >
        {showFilters ? 'Filtreleri gizle' : 'Filtreler'}
      </button>

      {showFilters && (
        <div className={css.filterGrid}>
          <select
            className={css.filterSelect}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          >
            <option value="">Tum durumlar</option>
            {Object.entries(LISTING_STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            className={css.filterSelect}
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
          >
            <option value="">Tum kategoriler</option>
            {Object.entries(LISTING_CATEGORY_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      <div className={css.tableWrap}>
        <table className={css.table}>
          <thead>
            <tr>
              <th className={css.th}>Foto</th>
              <th className={css.th}>Ilan No</th>
              <th className={css.th}>Baslik</th>
              <th className={css.th}>Kategori</th>
              <th className={css.th}>Konum</th>
              <th className={css.th}>Fiyat</th>
              <th className={css.th}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((l: Listing) => (
              <tr key={l.id}>
                <td className={css.td}>
                  {l.photos[0] ? (
                    <img className={css.thumb} src={l.photos[0].thumbnailUrl} alt="" />
                  ) : (
                    <span className={css.muted}>--</span>
                  )}
                </td>
                <td className={css.td}>{l.listingNo}</td>
                <td className={css.td}>{l.title}</td>
                <td className={css.td}>
                  {LISTING_CATEGORY_LABEL[l.category]}
                </td>
                <td className={css.td}>
                  {l.location.cityName}, {l.location.districtName}
                </td>
                <td className={`${css.td} ${css.price}`}>
                  {formatCurrency(l.price)}
                </td>
                <td className={css.td}>
                  <span
                    className={css.statusDot}
                    style={{ background: STATUS_COLOR[l.status] ?? '#6b7280' }}
                  />
                  {LISTING_STATUS_LABEL[l.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={css.pager}>
        <span>{start}-{end} / {filtered.length} kayit</span>
        <div className={css.pageBtns}>
          <button
            type="button"
            className={css.pageBtn}
            disabled={safePage <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Onceki
          </button>
          <button
            type="button"
            className={css.pageBtn}
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sonraki
          </button>
        </div>
      </div>
    </div>
  )
}
