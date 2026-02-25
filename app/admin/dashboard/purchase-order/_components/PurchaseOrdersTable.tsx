'use client'

import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PurchaseOrder, PurchaseOrderItem } from '@/types/response/purchase-order.response'
import { useState } from 'react'
import { toast } from 'sonner'
import { purchaseOrderService } from '@/services/purchase-order.service'
import { useAuthStore } from '@/features/auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface PurchaseOrdersTableProps {
  orders: PurchaseOrder[]
  onStatusChange?: () => void
}

const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Nháp', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
  PENDING: { label: 'Chờ duyệt', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  REJECTED: { label: 'Từ chối', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  ORDERED: { label: 'Đã đặt', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-gray-200 text-gray-700 hover:bg-gray-200' },
}

export function PurchaseOrdersTable({ orders, onStatusChange }: PurchaseOrdersTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const calculateTotal = (items: PurchaseOrder['items']) => {
    return (items || []).reduce((sum: number, item: PurchaseOrderItem) => sum + (item.importPrice || 0) * (item.quantity || 0), 0)
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg">Không có đơn đặt hàng nào</p>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell className="w-28">Mã đơn</TableHeaderCell>
            <TableHeaderCell>Nhà cung cấp</TableHeaderCell>
            <TableHeaderCell>Người tạo</TableHeaderCell>
            <TableHeaderCell>Người duyệt</TableHeaderCell>
            <TableHeaderCell>Ngày tạo</TableHeaderCell>
            <TableHeaderCell className="text-center">Số sách</TableHeaderCell>
            <TableHeaderCell>Định dạng</TableHeaderCell>
            <TableHeaderCell className="text-right">Tổng tiền</TableHeaderCell>
            <TableHeaderCell className="w-32 text-center">Trạng thái</TableHeaderCell>
            <TableHeaderCell className="text-center">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell variant="primary">#{order.id}</TableCell>
              <TableCell>{order.supplierName}</TableCell>
              <TableCell>{order.createdByName}</TableCell>
              <TableCell>{order.approvedByName || '-'}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell className="text-center">{order.items.length}</TableCell>
              <TableCell>
                {order.items.map((item, idx) => (
                  <div key={idx} className="text-xs">
                    {item.variantFormat || '-'}
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-right">{formatCurrency(calculateTotal(order.items))}</TableCell>
              <TableCell className="text-center">
                <Badge className={statusConfig[order.status]?.className || 'bg-gray-100 text-gray-800'}>
                  {statusConfig[order.status]?.label || order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <OrderActions 
                  order={order} 
                  onStatusChange={onStatusChange} 
                />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OrderActions({ 
  order, 
  onStatusChange 
}: { 
  order: PurchaseOrder
  onStatusChange?: () => void 
}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const currentUser = useAuthStore.getState().currentUser

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const calculateTotal = (items: PurchaseOrder['items']) => {
    return (items || []).reduce((sum: number, item: PurchaseOrderItem) => sum + (item.importPrice || 0) * (item.quantity || 0), 0)
  }

  const handleApprove = async () => {
    const loadingToast = toast.loading('Đang xử lý...', { duration: Infinity })
    try {
      setIsProcessing(true)
      await purchaseOrderService.approvePurchaseOrder(order.id, currentUser!.id)
      toast.dismiss(loadingToast)
      toast.success('Duyệt đơn thành công')
      onStatusChange?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể duyệt đơn')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    const loadingToast = toast.loading('Đang xử lý...', { duration: Infinity })
    try {
      setIsProcessing(true)
      await purchaseOrderService.rejectPurchaseOrder(order.id, currentUser!.id, 'Từ chối đơn hàng')
      toast.dismiss(loadingToast)
      toast.success('Từ chối đơn thành công')
      onStatusChange?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể từ chối đơn')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy')
      return
    }
    const loadingToast = toast.loading('Đang xử lý...', { duration: Infinity })
    try {
      setIsProcessing(true)
      await purchaseOrderService.cancelPurchaseOrder(order.id, cancelReason, currentUser?.id)
      toast.dismiss(loadingToast)
      toast.success('Hủy đơn thành công')
      setShowCancelModal(false)
      setCancelReason('')
      onStatusChange?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể hủy đơn')
    } finally {
      setIsProcessing(false)
    }
  }

  const isDraft = order.status === 'DRAFT'
  const isPending = order.status === 'PENDING'
  const isApproved = order.status === 'APPROVED'
  const isApprovedOrOrdered = order.status === 'APPROVED' || order.status === 'ORDERED'
  const isPaid = order.status === 'ORDERED'
  const isDisabled = isProcessing || (!isDraft && !isPending)

  const handlePayment = async () => {
    const loadingToast = toast.loading('Đang xử lý...', { duration: Infinity })
    try {
      setIsProcessing(true)
      const currentUser = useAuthStore.getState().currentUser
      if (!currentUser?.id) {
        throw new Error('User not logged in')
      }
      await purchaseOrderService.payPurchaseOrder(order.id, currentUser.id)
      toast.dismiss(loadingToast)
      toast.success('Thanh toán thành công')
      onStatusChange?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể thanh toán')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {isDraft || isPending ? (
          <>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 h-8 px-3 cursor-pointer text-[13px]"
              disabled={isDisabled}
              onClick={handleApprove}
            >
              Duyệt
            </Button>
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 h-8 px-3 cursor-pointer text-[13px]"
              disabled={isDisabled}
              onClick={handleReject}
            >
              Từ chối
            </Button>
          </>
        ) : null}
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 h-8 px-4 cursor-pointer text-[13px]"
          onClick={async () => {
            try {
              const orderDetail = await purchaseOrderService.getPurchaseOrderById(order.id)
              setSelectedOrder(orderDetail)
              setShowViewModal(true)
            } catch {
              toast.error('Không thể tải chi tiết đơn')
            }
          }}
        >
          Xem
        </Button>
        {isApproved && !isPaid && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 h-8 px-3 cursor-pointer text-[13px]"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            Thanh toán
          </Button>
        )}
        {isApprovedOrOrdered && !isPaid && (
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 h-8 px-3 cursor-pointer text-[13px]"
            onClick={() => setShowCancelModal(true)}
          >
            Hủy
          </Button>
        )}
      </div>

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hủy đơn đặt hàng</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do hủy đơn #{order.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Nhập lý do hủy..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Hủy bỏ
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={handleCancel}
              disabled={isProcessing}
            >
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn đặt hàng #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nhà cung cấp</p>
                  <p className="font-medium">{selectedOrder.supplierName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                  <Badge className={statusConfig[selectedOrder.status]?.className || 'bg-gray-100'}>
                    {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Người tạo</p>
                  <p>{selectedOrder.createdByName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Người duyệt</p>
                  <p>{selectedOrder.approvedByName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày duyệt</p>
                  <p>{selectedOrder.approvedAt ? formatDate(selectedOrder.approvedAt) : '-'}</p>
                </div>
                {selectedOrder.note && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Ghi chú</p>
                    <p>{selectedOrder.note}</p>
                  </div>
                )}
                {selectedOrder.cancelReason && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Lý do hủy</p>
                    <p className="text-red-600">{selectedOrder.cancelReason}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Danh sách sách</p>
                <div className="border rounded-md">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <TableHeaderCell className="text-left">Tên sách</TableHeaderCell>
                        <TableHeaderCell className="text-right">Số lượng</TableHeaderCell>
                        <TableHeaderCell className="text-right">Giá nhập</TableHeaderCell>
                        <TableHeaderCell className="text-right">Thành tiền</TableHeaderCell>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <TableCell>{item.bookTitle}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.importPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.quantity * item.importPrice)}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium">
                      <tr>
                        <TableCell colSpan={3}>Tổng cộng</TableCell>
                        <TableCell className="text-right">{formatCurrency(calculateTotal(selectedOrder.items))}</TableCell>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
