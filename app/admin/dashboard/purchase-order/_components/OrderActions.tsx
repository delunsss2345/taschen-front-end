'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PurchaseOrder, PurchaseOrderItem } from '@/types/response/purchase-order.response'
import { toast } from 'sonner'
import { purchaseOrderService } from '@/services/purchase-order.service'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { usePurchaseOrderStore } from '@/features/purchase-order/store/purchase-order.store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'

interface OrderActionsProps {
  order: PurchaseOrder
  importStockMap?: Record<number, boolean>
  onOpenImportModal?: (order: PurchaseOrder) => void
  onStatusChange?: () => void
  statusConfig: Record<string, { label: string; className: string }>
}

export function OrderActions({
  order,
  importStockMap,
  onOpenImportModal,
  onStatusChange,
  statusConfig,
}: OrderActionsProps) {
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const isProcessingPayment = usePurchaseOrderStore((state) => state.isProcessingPayment)
  const isProcessingReject = usePurchaseOrderStore((state) => state.isProcessingReject)
  const isProcessingCancel = usePurchaseOrderStore((state) => state.isProcessingCancel)
  const rejectReason = usePurchaseOrderStore((state) => state.rejectReason)
  const setIsProcessingPayment = usePurchaseOrderStore((state) => state.setIsProcessingPayment)
  const setIsProcessingReject = usePurchaseOrderStore((state) => state.setIsProcessingReject)
  const setIsProcessingCancel = usePurchaseOrderStore((state) => state.setIsProcessingCancel)
  const setRejectReason = usePurchaseOrderStore((state) => state.setRejectReason)
  const { currentUser } = useAuthStore()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const calculateTotal = (items: PurchaseOrder['items']) => {
    return (items || []).reduce((sum: number, item: PurchaseOrderItem) => sum + (item.importPrice || 0) * (item.quantity || 0), 0)
  }

  const handleViewOrder = async () => {
    try {
      const orderDetail = await purchaseOrderService.getPurchaseOrderById(order.id)
      setSelectedOrder(orderDetail)
      setShowViewModal(true)
    } catch {
      toast.error('Không thể tải chi tiết đơn')
    }
  }

  const handleApproveOrder = async () => {
    if (!currentUser) return
    const loadingToast = toast.loading('Đang duyệt đơn...')
    try {
      await purchaseOrderService.approvePurchaseOrder(order.id, currentUser.id)
      toast.success('Duyệt đơn thành công')
      onStatusChange?.()
    } catch {
      toast.error('Duyệt đơn thất bại')
    } finally {
      toast.dismiss(loadingToast)
    }
  }

  const handleRejectOrder = async () => {
    if (!currentUser) return
    const loadingToast = toast.loading('Đang từ chối đơn...')
    setIsProcessingReject(true)
    try {
      await purchaseOrderService.rejectPurchaseOrder(order.id, currentUser.id, rejectReason)
      toast.success('Từ chối đơn thành công')
      setShowRejectModal(false)
      setRejectReason('')
      onStatusChange?.()
    } catch {
      toast.error('Từ chối đơn thất bại')
    } finally {
      setIsProcessingReject(false)
      toast.dismiss(loadingToast)
    }
  }

  const handleCancelOrder = async () => {
    if (!currentUser) return
    const loadingToast = toast.loading('Đang hủy đơn...')
    setIsProcessingCancel(true)
    try {
      await purchaseOrderService.cancelPurchaseOrder(order.id, rejectReason, currentUser.id)
      toast.success('Hủy đơn thành công')
      setShowCancelModal(false)
      setRejectReason('')
      onStatusChange?.()
    } catch {
      toast.error('Hủy đơn thất bại')
    } finally {
      setIsProcessingCancel(false)
      toast.dismiss(loadingToast)
    }
  }

  const handlePayOrder = async () => {
    if (!currentUser) return
    const loadingToast = toast.loading('Đang thanh toán...')
    setIsProcessingPayment(true)
    try {
      await purchaseOrderService.payPurchaseOrder(order.id, currentUser.id)
      toast.success('Thanh toán thành công')
      setShowPaymentModal(false)
      onStatusChange?.()
    } catch {
      toast.error('Thanh toán thất bại')
    } finally {
      setIsProcessingPayment(false)
      toast.dismiss(loadingToast)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 h-8 px-4 cursor-pointer text-[13px]"
          onClick={handleViewOrder}
        >
          Xem
        </Button>

        {order.status === 'PENDING' && (
          <>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 h-8 px-3 cursor-pointer text-[13px]"
              onClick={handleApproveOrder}
            >
              Duyệt
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 h-8 px-3 cursor-pointer text-[13px]"
              onClick={() => {
                setShowRejectModal(true)
              }}
            >
              Từ chối
            </Button>
          </>
        )}

        {order.status === 'APPROVED' && (
          <>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 h-8 px-3 cursor-pointer text-[13px]"
              onClick={() => setShowPaymentModal(true)}
            >
              Thanh toán
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 h-8 px-3 cursor-pointer text-[13px]"
              onClick={() => setShowCancelModal(true)}
            >
              Hủy
            </Button>
          </>
        )}

        {order.status === 'ORDERED' && !importStockMap?.[order.id] && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 h-8 px-4 cursor-pointer text-[13px]"
            onClick={() => onOpenImportModal?.(order)}
          >
            Tạo đơn nhập
          </Button>
        )}
      </div>

      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="min-w-[800px] max-w-[800px] max-h-[90vh] overflow-y-auto">
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
                        <TableHeaderCell className="text-center">Định dạng</TableHeaderCell>
                        <TableHeaderCell className="text-right">Số lượng</TableHeaderCell>
                        <TableHeaderCell className="text-right">Giá nhập</TableHeaderCell>
                        <TableHeaderCell className="text-right">Thành tiền</TableHeaderCell>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <TableCell>{item.bookTitle}</TableCell>
                          <TableCell className="text-center">{item.variantFormat || '-'}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.importPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.quantity * item.importPrice)}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium">
                      <tr>
                        <TableCell colSpan={4}>Tổng cộng</TableCell>
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

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Từ chối đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Lý do từ chối</label>
              <textarea
                className="w-full mt-1 px-3 py-2 border rounded-md"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setShowRejectModal(false)
                setRejectReason('')
              }}>
                Hủy
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                disabled={!rejectReason.trim() || isProcessingReject}
                onClick={handleRejectOrder}
              >
                {isProcessingReject ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Lý do hủy</label>
              <textarea
                className="w-full mt-1 px-3 py-2 border rounded-md"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do hủy..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setShowCancelModal(false)
                setRejectReason('')
              }}>
                Hủy
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
                disabled={!rejectReason.trim() || isProcessingCancel}
                onClick={handleCancelOrder}
              >
                {isProcessingCancel ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="min-w-[900px] max-w-[900px] max-h-[95vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Thanh toán đơn hàng #{order.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nhà cung cấp:</span>
                <span className="font-medium">{order.supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày tạo:</span>
                <span className="font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-medium text-purple-600">{formatCurrency(calculateTotal(order.items || []))}</span>
              </div>
            </div>

            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeaderCell className="text-center w-16">STT</TableHeaderCell>
                    <TableHeaderCell>Tên sách</TableHeaderCell>
                    <TableHeaderCell className="text-center">Variant</TableHeaderCell>
                    <TableHeaderCell className="text-right">Số lượng</TableHeaderCell>
                    <TableHeaderCell className="text-right">Giá nhập</TableHeaderCell>
                    <TableHeaderCell className="text-right">Thành tiền</TableHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell>{item.bookTitle}</TableCell>
                      <TableCell className="text-center">{item.variantFormat || '-'}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.importPrice)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.quantity * item.importPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                Hủy
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
                disabled={isProcessingPayment}
                onClick={handlePayOrder}
              >
                {isProcessingPayment ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
