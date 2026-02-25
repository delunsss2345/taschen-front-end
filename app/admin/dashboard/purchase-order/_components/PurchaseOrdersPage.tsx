'use client'

import { useState, useEffect, useMemo } from 'react'
import { PurchaseOrdersHeader } from './PurchaseOrdersHeader'
import { PurchaseOrdersTable } from './PurchaseOrdersTable'
import { CreatePurchaseOrderModal } from './CreatePurchaseOrderModal'
import { purchaseOrderService, type PurchaseOrder } from '@/services/purchase-order.service'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from 'sonner'
import { PromotionTabs } from '@/app/admin/dashboard/promotions/_components/PromotionTabs'

const TAB_STATUS_MAP: Record<string, string | null> = {
  all: null,
  pending: 'PENDING',
  approved: 'APPROVED',
  rejected: 'REJECTED',
  ordered: 'ORDERED',
  cancelled: 'CANCELLED',
}

const purchaseOrderTabs = [
  { id: 'all', label: 'Tất cả', countKey: 'all' },
  { id: 'pending', label: 'Chờ duyệt', countKey: 'pending' },
  { id: 'approved', label: 'Đã duyệt', countKey: 'approved' },
  { id: 'rejected', label: 'Từ chối', countKey: 'rejected' },
  { id: 'ordered', label: 'Đã đặt', countKey: 'ordered' },
  { id: 'cancelled', label: 'Đã hủy', countKey: 'cancelled' },
]

export function PurchaseOrdersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await purchaseOrderService.getAllPurchaseOrders()
      setOrders(data)
    } catch {
      toast.error('Không thể tải danh sách đơn đặt hàng')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    const status = TAB_STATUS_MAP[activeTab]
    let result = orders

    if (status) {
      result = result.filter((order) => order.status === status)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (order) =>
          order.id.toString().includes(query) ||
          order.supplierName.toLowerCase().includes(query) ||
          order.createdByName.toLowerCase().includes(query)
      )
    }

    return result
  }, [orders, activeTab, searchQuery])

  const tabCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      approved: orders.filter((o) => o.status === 'APPROVED').length,
      rejected: orders.filter((o) => o.status === 'REJECTED').length,
      ordered: orders.filter((o) => o.status === 'ORDERED').length,
      cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
    }
  }, [orders])

  return (
    <div className="space-y-6">
      <PurchaseOrdersHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setShowCreateModal(true)}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <PromotionTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
          tabs={purchaseOrderTabs}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <PurchaseOrdersTable 
            orders={filteredOrders} 
            onStatusChange={fetchOrders} 
          />
        )}
      </div>
      <CreatePurchaseOrderModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={fetchOrders}
      />
    </div>
  )
}
