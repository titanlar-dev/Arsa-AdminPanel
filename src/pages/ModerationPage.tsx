import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  AdminPermission,
  AdminRole,
  ROLE_PERMISSIONS,
  type Listing,
  type Paginated,
} from '../types/domain'
import type { ModerationCapabilities } from '../types/component-props'
import { allListingFixtures, moderatorUser } from '../fixtures'
import { ApprovalQueue } from '../screens/ApprovalQueue/ApprovalQueue'

/**
 * Pending ilanlardan olusan kuyruk verisi. Gercek uygulamada sunucu yalnizca
 * pending ilanlar dondurur; burada fixture'larin hepsini aktariyoruz.
 */
const KUYRUK: Paginated<Listing> = {
  items: allListingFixtures.slice(0, 5),
  page: 1,
  pageSize: 10,
  totalItems: 12,
  totalPages: 2,
}

function yetkiler(role: AdminRole): ModerationCapabilities {
  const izinler: readonly AdminPermission[] = ROLE_PERMISSIONS[role]
  return {
    canApprove: izinler.includes(AdminPermission.ListingApprove),
    canReject: izinler.includes(AdminPermission.ListingReject),
    canRequestChanges: izinler.includes(AdminPermission.ListingRequestChanges),
    canPause: izinler.includes(AdminPermission.ListingPause),
    canArchive: izinler.includes(AdminPermission.ListingArchive),
  }
}

export function ModerationPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState('');

  return (
    <ApprovalQueue
      state={{ status: 'success', data: KUYRUK }}
      selectedListingId={selectedId}
      currentAdminId={moderatorUser.id}
      capabilities={yetkiler(AdminRole.Moderator)}
      onSelectListing={(id) => setSelectedId(id)}
      onAssignToSelf={() => {}}
      onSkip={() => {}}
      onOpenDetail={(listing: string) => navigate(`/listings/${listing}`)}
      onApprove={() => {}}
      onReject={() => {}}
      onRequestChanges={() => {}}
      onRetry={() => {}}
    />
  )
}
