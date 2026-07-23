import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  AdminPermission,
  AdminRole,
  ROLE_PERMISSIONS,
  type Listing,
  type Paginated,
} from '../types/domain'
import type { ListingFilterValues, ListingFilterOptions } from '../types/component-props'
import { allListingFixtures, adminUserFixtures } from '../fixtures'
import { ListingListPage } from '../screens/ListingListPage/ListingListPage'

const BASARILI_VERI: Paginated<Listing> = {
  items: allListingFixtures,
  page: 1,
  pageSize: 12,
  totalItems: 36,
  totalPages: 3,
}

const BOS_FILTRELER: ListingFilterValues = {
  categories: [],
  statuses: [],
  currencies: [],
  sellerTypes: [],
  dateRange: {},
  promotionTypes: [],
}

const FILTRE_SECENEKLERI: ListingFilterOptions = {
  cities: [
    { value: '34', label: 'Istanbul' },
    { value: '06', label: 'Ankara' },
    { value: '35', label: 'Izmir' },
  ],
  districts: [
    { value: 'kadikoy', label: 'Kadikoy' },
    { value: 'besiktas', label: 'Besiktas' },
    { value: 'cankaya', label: 'Cankaya' },
  ],
  reviewers: adminUserFixtures.map((admin) => ({
    value: admin.id,
    label: admin.fullName,
  })),
}

const TAM_YETKI: AdminPermission[] = [...ROLE_PERMISSIONS[AdminRole.SuperAdmin]]

export function ListingsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ListingFilterValues>(BOS_FILTRELER)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  return (
    <ListingListPage
      state={{ status: 'success', data: BASARILI_VERI }}
      filters={filters}
      selectedIds={selectedIds}
      availablePermissions={TAM_YETKI}
      filterOptions={FILTRE_SECENEKLERI}
      onFiltersChange={setFilters}
      onSelectionChange={setSelectedIds}
      onPageChange={() => {}}
      onListingOpen={(listing) => navigate(`/listings/${listing.id}`)}
      onBulkAction={() => {}}
      onRetry={() => {}}
    />
  )
}
