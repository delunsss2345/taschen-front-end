'use client'

import { OrderHeader } from './OrderHeader'
import { OrderTabs } from './OrderTabs'
import { OrderTable } from './OrderTable'
import { useState, useEffect, useMemo } from 'react'
import { orderService, type Order } from '@/services/order.service'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from 'sonner'

const TAB_STATUS_MAP: Record<string, string | null> = {
  all: null,
  pending: 'PENDING',
  processing: 'PROCESSING',
  delivering: 'DELIVERING',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
  returned: 'RETURNED',
}

export function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const data = await orderService.getAllOrders()
      setOrders(data)
    } catch {
      toast.error('Không thể tải danh sách đơn hàng')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    const status = TAB_STATUS_MAP[activeTab]
    if (!status) return orders
    return orders.filter((order) => order.status === status)
  }, [orders, activeTab])

  const tabCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'PENDING').length,
      processing: orders.filter((o) => o.status === 'PROCESSING').length,
      delivering: orders.filter((o) => o.status === 'DELIVERING').length,
      completed: orders.filter((o) => o.status === 'COMPLETED').length,
      cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
      returned: orders.filter((o) => o.status === 'RETURNED').length,
    }
  }, [orders])

  return (
    <div className="space-y-6">
      <OrderHeader />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <OrderTable orders={filteredOrders} onStatusChange={fetchOrders} />
        )}
      </div>
    </div>
  )
}
