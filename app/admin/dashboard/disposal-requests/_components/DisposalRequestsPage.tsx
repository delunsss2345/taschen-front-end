'use client'

import { useState, useMemo } from 'react'
import { DisposalRequestsHeader } from './DisposalRequestsHeader'
import { DisposalRequestsTabs } from './DisposalRequestsTabs'
import { DisposalTable } from './DisposalTable'
import { CreateDisposalRequestModal } from './CreateDisposalRequestModal'
import { LoadingSpinner } from '@/components/ui/loading'
import { useDisposalRequestsQuery } from '@/features/disposal/hooks'
import { useAuthStore } from '@/features/auth'

const TAB_STATUS_MAP: Record<string, string[]> = {
  all: [],
  pending: ['PENDING'],
  approved: ['APPROVED'],
  rejected: ['REJECTED'],
}

interface DisposalRequestsPageProps {
  canCreate?: boolean
  canUpdateStatus?: boolean
  filterByCurrentUser?: boolean
}

export function DisposalRequestsPage({
  canCreate = true,
  canUpdateStatus = true,
  filterByCurrentUser = false,
}: DisposalRequestsPageProps = {}) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { currentUser } = useAuthStore()
  const { data: allRequests = [], isLoading, refetch } = useDisposalRequestsQuery()

  const requests = useMemo(
    () =>
      filterByCurrentUser && currentUser
        ? allRequests.filter((r) => r.createdBy?.id === currentUser.id)
        : allRequests,
    [allRequests, filterByCurrentUser, currentUser],
  )

  const filteredRequests = useMemo(() => {
    const statuses = TAB_STATUS_MAP[activeTab]
    let filtered = statuses.length > 0
      ? requests.filter((r) => statuses.includes(r.status))
      : requests

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (r) =>
          r.reason.toLowerCase().includes(q) ||
          r.createdBy?.email.toLowerCase().includes(q) ||
          r.id.toString().includes(q),
      )
    }

    return filtered
  }, [requests, activeTab, searchQuery])

  const tabCounts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter((r) => r.status === 'PENDING').length,
      approved: requests.filter((r) => r.status === 'APPROVED').length,
      rejected: requests.filter((r) => r.status === 'REJECTED').length,
    }),
    [requests],
  )

  return (
    <div className="space-y-6">
      <DisposalRequestsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setShowCreateModal(true)}
        canCreate={canCreate}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DisposalRequestsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DisposalTable
            requests={filteredRequests}
            onRefresh={() => refetch()}
            canUpdateStatus={canUpdateStatus}
          />
        )}
      </div>

      {canCreate && (
        <CreateDisposalRequestModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  )
}
