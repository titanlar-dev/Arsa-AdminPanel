import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  AdminPermission,
  AdminRole,
  ROLE_PERMISSIONS,
  type Paginated,
  type UserAccount,
} from '../types/domain'
import type { UserFilterValues } from '../types/component-props'
import { allUserFixtures } from '../fixtures'
import { UserManagementPage } from '../screens/UserManagementPage/UserManagementPage'

const KULLANICI_SAYFASI: Paginated<UserAccount> = {
  items: allUserFixtures,
  page: 1,
  pageSize: 10,
  totalItems: allUserFixtures.length,
  totalPages: 1,
}

const VARSAYILAN_FILTRELER: UserFilterValues = { types: [], statuses: [], roles: [] }
const TAM_YETKI: AdminPermission[] = [...ROLE_PERMISSIONS[AdminRole.SuperAdmin]]

export function UsersPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<UserFilterValues>(VARSAYILAN_FILTRELER)

  return (
    <UserManagementPage
      state={{ status: 'success', data: KULLANICI_SAYFASI }}
      filters={filters}
      availablePermissions={TAM_YETKI}
      onFiltersChange={setFilters}
      onPageChange={() => {}}
      onUserOpen={(user) => navigate(`/users/${user.id}`)}
      onSuspend={() => {}}
      onBan={() => {}}
      onRoleChange={() => {}}
      onRetry={() => {}}
    />
  )
}
