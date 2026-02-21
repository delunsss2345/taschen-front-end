'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { orderService, type Order } from '@/services/order.service'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from 'sonner'

interface OrderDetailModalProps {
  orderId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailModal({ orderId, open, onOpenChange }: OrderDetailModalProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (orderId && open) {
      const fetchOrderDetail = async () => {
        try {
          setIsLoading(true)
          const data = await orderService.getOrderById(orderId)
          setOrder(data)
        } catch {
          toast.error('Không thể tải chi tiết đơn hàng')
        } finally {
          setIsLoading(false)
        }
      }
      fetchOrderDetail()
    }
  }, [orderId, open])

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng #{orderId}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <LoadingSpinner />
        ) : order ? (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">{order.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt</p>
                <p className="font-medium">{formatDate(order.orderDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <div className="mt-1">{getStatusBadge(order.status)}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Địa chỉ giao hàng</p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>
            </div>

            {/* Order Details Table */}
            <div>
              <p className="text-sm font-medium mb-3">Danh sách sách</p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Tên sách</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Giá</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">Số lượng</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.orderDetails?.map((detail, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4">{detail.bookTitle}</td>
                        <td className="py-3 px-4 text-center">
                          {detail.priceAtPurchase.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3 px-4 text-center">{detail.quantity}</td>
                        <td className="py-3 px-4 text-right text-red-500">
                          {detail.totalPrice.toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="py-3 px-4 font-medium text-right">
                        Tổng cộng:
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-red-500">
                        {order.totalAmount.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">Không có dữ liệu</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
