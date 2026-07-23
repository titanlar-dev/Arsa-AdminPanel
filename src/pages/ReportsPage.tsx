import { useState } from 'react'
import {
  AdminPermission,
  AdminRole,
  ROLE_PERMISSIONS,
  type ISODateTime,
  type Listing,
  type ListingReport,
  type Paginated,
  type UserAccount,
} from '../types/domain'
import type { ReportFilterValues } from '../types/component-props'
import {
  adminUserFixtures,
  allListingFixtures,
  allReportFixtures,
  allUserFixtures,
} from '../fixtures'
import { ReportManagementPage } from '../screens/ReportManagementPage/ReportManagementPage'

const KULLANICILAR: Record<string, UserAccount> = Object.fromEntries(
  [...allUserFixtures, ...adminUserFixtures].map((u): [string, UserAccount] => [u.id, u]),
)

const ILANLAR: Record<string, Listing> = Object.fromEntries(
  allListingFixtures.map((ilan): [string, Listing] => [ilan.id, ilan]),
)

const BOS_FILTRELER: ReportFilterValues = {
  reasons: [],
  statuses: [],
  severities: [],
  dateRange: {},
}

const SIMDI: ISODateTime = '2026-07-16T10:00:00+03:00'

function sayfa(items: ListingReport[]): Paginated<ListingReport> {
  return {
    items,
    page: 1,
    pageSize: 20,
    totalItems: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / 20)),
  }
}

const TAM_YETKI: AdminPermission[] = [...ROLE_PERMISSIONS[AdminRole.SuperAdmin]]

export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilterValues>(BOS_FILTRELER)

  return (
    <ReportManagementPage
      state={{ status: 'success', data: sayfa(allReportFixtures) }}
      filters={filters}
      availablePermissions={TAM_YETKI}
      now={SIMDI}
      usersById={KULLANICILAR}
      listingsById={ILANLAR}
      onFiltersChange={setFilters}
      onPageChange={() => {}}
      onReportOpen={() => {}}
      onResolve={() => {}}
      onDismiss={() => {}}
      onEscalate={() => {}}
      onRetry={() => {}}
    />
  )
}
