'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store/auth.store'
import {
  useApprovePurchaseOrderMutation,
  useCancelPurchaseOrderMutation,
  usePayPurchaseOrderMutation,
  usePurchaseOrderDetailQuery,
  useRejectPurchaseOrderMutation,
} from '@/features/purchase-order/hooks'
import { selectorPurchaseOrderActions } from '@/features/purchase-order/selectors'
import { usePurchaseOrderStore } from '@/features/purchase-order/store/purchase-order.store'
import type { PurchaseOrder, PurchaseOrderItem } from '@/types/response/purchase-order.response'
import { useState } from 'react'
import { toast } from 'sonner'
import { PurchaseOrderViewModal } from './PurchaseOrderViewModal'
import { RejectOrderModal } from './RejectOrderModal'
import { CancelOrderModal } from './CancelOrderModal'
import { PaymentOrderModal } from './PaymentOrderModal'

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
  const {
    isProcessingPayment,
    isProcessingReject,
    isProcessingCancel,
    rejectReason,
    setIsProcessingPayment,
    setIsProcessingReject,
    setIsProcessingCancel,
    setRejectReason,
  } = usePurchaseOrderStore(selectorPurchaseOrderActions)

  const { currentUser } = useAuthStore()
  const { refetch: refetchOrderDetail } = usePurchaseOrderDetailQuery(order.id, {
    enabled: false,
  })
  const { mutate: approveOrder } = useApprovePurchaseOrderMutation()
  const { mutate: rejectOrder } = useRejectPurchaseOrderMutation()
  const { mutate: cancelOrder } = useCancelPurchaseOrderMutation()
  const { mutate: payOrder } = usePayPurchaseOrderMutation()

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
    const result = await refetchOrderDetail()
    if (result.data) {
      setSelectedOrder(result.data)
      setShowViewModal(true)
      return
    }
    if (result.error) {
      toast.error('Không thể tải chi tiết đơn')
    }
  }

  const handleApproveOrder = async () => {
    if (!currentUser) return
    const loadingToast = toast.loading('Đang duyệt đơn...')
    approveOrder(
      { orderId: order.id, userId: currentUser.id },
      {
        onSuccess: () => {
          toast.success('Duyệt đơn thành công')
          onStatusChange?.()
        },
        onError: () => {
          toast.error('Duyệt đơn thất bại')
        },
        onSettled: () => {
          toast.dismiss(loadingToast)
        },
      },
    )
  }

  const handleRejectOrder = async () => {
    if (!currentUser) return
    const loadingToast = toast.loading('Đang từ chối đơn...')
    setIsProcessingReject(true)
    rejectOrder(
      { orderId: order.id, userId: currentUser.id, reason: rejectReason },
      {
        onSuccess: () => {
          toast.success('Từ chối đơn thành công')
          setShowRejectModal(false)
          setRejectReason('')
          onStatusChange?.()
        },
        onError: () => {
          toast.error('Từ chối đơn thất bại')
        },
        onSettled: () => {
          setIsProcessingReject(false)
          toast.dismiss(loadingToast)
        },
      },
    )
  }

  const handleCancelOrder = async () => {
    if (!currentUser) return
    const loadingToast = toast.loading('Đang hủy đơn...')
    setIsProcessingCancel(true)
    cancelOrder(
      { orderId: order.id, reason: rejectReason, userId: currentUser.id },
      {
        onSuccess: () => {
          toast.success('Hủy đơn thành công')
          setShowCancelModal(false)
          setRejectReason('')
          onStatusChange?.()
        },
        onError: () => {
          toast.error('Hủy đơn thất bại')
        },
        onSettled: () => {
          setIsProcessingCancel(false)
          toast.dismiss(loadingToast)
        },
      },
    )
  }

  const handlePayOrder = async () => {
    if (!currentUser) return
    const loadingToast = toast.loading('Đang thanh toán...')
    setIsProcessingPayment(true)
    payOrder(
      { orderId: order.id, userId: currentUser.id },
      {
        onSuccess: () => {
          toast.success('Thanh toán thành công')
          setShowPaymentModal(false)
          onStatusChange?.()
        },
        onError: () => {
          toast.error('Thanh toán thất bại')
        },
        onSettled: () => {
          setIsProcessingPayment(false)
          toast.dismiss(loadingToast)
        },
      },
    )
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

      <PurchaseOrderViewModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        selectedOrder={selectedOrder}
        statusConfig={statusConfig}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        calculateTotal={calculateTotal}
      />

      <RejectOrderModal
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        isProcessingReject={isProcessingReject}
        onReject={handleRejectOrder}
        onCancel={() => {
          setShowRejectModal(false)
          setRejectReason('')
        }}
      />

      <CancelOrderModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        isProcessingCancel={isProcessingCancel}
        onCancelOrder={handleCancelOrder}
        onClose={() => {
          setShowCancelModal(false)
          setRejectReason('')
        }}
      />

      <PaymentOrderModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        order={order}
        isProcessingPayment={isProcessingPayment}
        onPay={handlePayOrder}
        onClose={() => setShowPaymentModal(false)}
        formatCurrency={formatCurrency}
        calculateTotal={calculateTotal}
      />
    </>
  )
}
