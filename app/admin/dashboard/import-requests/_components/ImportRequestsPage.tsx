'use client'

import { useState, useMemo, useEffect } from 'react'
import { ImportRequestsHeader } from './ImportRequestsHeader'
import { ImportRequestsTabs } from './ImportRequestsTabs'
import { ImportRequestsTable } from './ImportRequestsTable'
import { CreateStockRequestModal } from './CreateStockRequestModal'
import { LoadingSpinner } from '@/components/ui/loading'
import { stockRequestService, type StockRequest } from '@/services/stock-request.service'
import { toast } from 'sonner'

const TAB_STATUS_MAP: Record<string, string[]> = {
  all: [],
  pending: ['PENDING'],
  approved: ['APPROVED'],
  ordered: ['ORDERED'],
  rejected: ['REJECTED'],
}

export function ImportRequestsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [stockRequests, setStockRequests] = useState<StockRequest[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchStockRequests = async () => {
    try {
      setIsLoading(true)
      const data = await stockRequestService.getAll()
      setStockRequests(data)
    } catch (error) {
      toast.error('Không thể tải danh sách yêu cầu nhập kho')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStockRequests()
  }, [])

  const filteredRequests = useMemo(() => {
    const statuses = TAB_STATUS_MAP[activeTab]
    let filtered = statuses.length > 0
      ? stockRequests.filter((item) => statuses.includes(item.status))
      : stockRequests

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        return (
          item.bookTitle.toLowerCase().includes(query) ||
          item.reason.toLowerCase().includes(query) ||
          item.createdByName.toLowerCase().includes(query) ||
          item.id.toString().includes(query)
        )
      })
    }

    return filtered
  }, [stockRequests, activeTab, searchQuery])

  const tabCounts = useMemo(() => {
    return {
      all: stockRequests.length,
      pending: stockRequests.filter((o) => o.status === 'PENDING').length,
      approved: stockRequests.filter((o) => o.status === 'APPROVED').length,
      ordered: stockRequests.filter((o) => o.status === 'ORDERED').length,
      rejected: stockRequests.filter((o) => o.status === 'REJECTED').length,
    }
  }, [stockRequests])

  const getMode = (): 'pending' | 'approved' | 'ordered' | 'rejected' | 'all' => {
    if (activeTab === 'pending') return 'pending'
    if (activeTab === 'approved') return 'approved'
    if (activeTab === 'ordered') return 'ordered'
    if (activeTab === 'rejected') return 'rejected'
    return 'all'
  }

  return (
    <div className="space-y-6">
      <ImportRequestsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setShowCreateModal(true)}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ImportRequestsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ImportRequestsTable requests={filteredRequests} mode={getMode()} onRefresh={fetchStockRequests} />
        )}
      </div>

      <CreateStockRequestModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={fetchStockRequests}
      />
    </div>
  )
}
