'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import type { Order } from '@/services/order.service'
import { useState } from 'react'
import { orderService } from '@/services/order.service'
import { toast } from 'sonner'
import { OrderDetailModal } from './OrderDetailModal'

interface OrderTableProps {
  orders: Order[]
  onStatusChange?: () => void
}

export function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  const [approvingId, setApprovingId] = useState<number | null>(null)
  const [shippingId, setShippingId] = useState<number | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CANCELLED':
        return (
          <Badge className="bg-red-50 text-red-500 hover:bg-red-50 border-red-100 shadow-none font-normal">
            Đã hủy
          </Badge>
        )
      case 'UNPAID':
        return (
          <Badge className="bg-gray-50 text-gray-500 hover:bg-gray-50 border-gray-200 shadow-none font-normal">
            Chưa thanh toán
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge className="bg-orange-50 text-orange-500 hover:bg-orange-50 border-orange-100 shadow-none font-normal">
            Chờ xác nhận
          </Badge>
        )
      case 'PROCESSING':
        return (
          <Badge className="bg-blue-50 text-blue-500 hover:bg-blue-50 border-blue-100 shadow-none font-normal">
            Đang xử lý
          </Badge>
        )
      case 'DELIVERING':
        return (
          <Badge className="bg-purple-50 text-purple-500 hover:bg-purple-50 border-purple-100 shadow-none font-normal">
            Đang giao hàng
          </Badge>
        )
      case 'COMPLETED':
        return (
          <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-green-100 shadow-none font-normal">
            Đã hoàn thành
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleApprove = async (orderId: number) => {
    const loadingToast = toast.loading('Đang duyệt đơn hàng...', {
      duration: Infinity,
    })

    try {
      setApprovingId(orderId)
      await orderService.updateOrderStatus(orderId, 'PROCESSING')
      toast.dismiss(loadingToast)
      toast.success('Đơn hàng đã được duyệt')
      onStatusChange?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể duyệt đơn hàng')
    } finally {
      setApprovingId(null)
    }
  }

  const handleShip = async (orderId: number) => {
    const loadingToast = toast.loading('Đang chuyển giao hàng...', {
      duration: Infinity,
    })

    try {
      setShippingId(orderId)
      await orderService.updateOrderStatus(orderId, 'DELIVERING')
      toast.dismiss(loadingToast)
      toast.success('Đơn hàng đã chuyển sang giao hàng')
      onStatusChange?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể chuyển sang giao hàng')
    } finally {
      setShippingId(null)
    }
  }

  const handleView = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsModalOpen(true)
  }

  return (
    <div className="w-full overflow-x-auto text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell className="w-32">Mã đơn</TableHeaderCell>
            <TableHeaderCell>Khách hàng</TableHeaderCell>
            <TableHeaderCell>Ngày đặt</TableHeaderCell>
            <TableHeaderCell>Tổng tiền</TableHeaderCell>
            <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
            <TableHeaderCell className="text-center w-32">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                Chưa có đơn hàng nào
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {order.userName}
                </TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell className="text-red-500">
                  {order.totalAmount.toLocaleString('vi-VN')} đ
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {order.status === 'PENDING' && (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-8 px-3 cursor-pointer text-[13px]"
                        onClick={() => handleApprove(order.id)}
                        disabled={approvingId === order.id}
                      >
                        {approvingId === order.id ? 'Đang duyệt...' : 'Duyệt'}
                      </Button>
                    )}
                    {order.status === 'PROCESSING' && (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 h-8 px-3 cursor-pointer text-[13px]"
                        onClick={() => handleShip(order.id)}
                        disabled={shippingId === order.id}
                      >
                        {shippingId === order.id ? 'Đang giao...' : 'Giao hàng'}
                      </Button>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 h-8 px-4 cursor-pointer text-[13px]"
                      onClick={() => handleView(order.id)}
                    >
                      Xem
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </table>

      <OrderDetailModal
        orderId={selectedOrderId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
