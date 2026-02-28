'use client'

import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PurchaseOrder, PurchaseOrderItem } from '@/types/response/purchase-order.response'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { purchaseOrderService } from '@/services/purchase-order.service'
import { useAuthStore } from '@/features/auth/store/auth.store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { importStockService } from '@/services/import-stock.service'

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
  IMPORTED: { label: 'Đã tạo phiếu nhập', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-gray-200 text-gray-700 hover:bg-gray-200' },
}

export function PurchaseOrdersTable({ orders, onStatusChange }: PurchaseOrdersTableProps) {
  const [importStockMap, setImportStockMap] = useState<Record<number, boolean>>({})
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Import modal states
  const [showImportModal, setShowImportModal] = useState(false)
  const [poDetails, setPoDetails] = useState<PurchaseOrder | null>(null)
  const [isLoadingPo, setIsLoadingPo] = useState(false)
  const [editableItems, setEditableItems] = useState<{ id: number; bookId: number; variantId: number | null; bookTitle: string; variantFormat: string; quantity: number; importPrice: number }[]>([])
  const [isCreatingImport, setIsCreatingImport] = useState(false)
  
  const { currentUser: user } = useAuthStore()

  const refreshImportStocks = useCallback(async () => {
    try {
      const importStocks = await importStockService.getAll()
      const map: Record<number, boolean> = {}
      importStocks.forEach(stock => {
        if (stock.purchaseOrderId) {
          map[stock.purchaseOrderId] = true
        }
      })
      setImportStockMap(map)
    } catch (error) {
      console.error('Failed to load import stocks:', error)
    }
  }, [])

  // Load import stocks on mount
  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true)
      refreshImportStocks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  const handleOpenImportModal = async (order: PurchaseOrder) => {
    setIsLoadingPo(true)
    setShowImportModal(true)
    try {
      const details = await purchaseOrderService.getPurchaseOrderById(order.id)
      if (!details || !details.items) {
        throw new Error('Invalid response')
      }
      setPoDetails(details)
      setEditableItems(
        details.items.map(item => ({
          id: item.id,
          bookId: item.bookId,
          variantId: item.variantId ?? null,
          bookTitle: item.bookTitle,
          variantFormat: item.variantFormat || '',
          quantity: item.quantity,
          importPrice: item.importPrice
        }))
      )
    } catch {
      toast.error('Không thể tải thông tin đơn đặt hàng')
      setShowImportModal(false)
    } finally {
      setIsLoadingPo(false)
    }
  }

  const handleItemQuantityChange = (index: number, value: number) => {
    const newItems = [...editableItems]
    newItems[index].quantity = Math.max(1, value)
    setEditableItems(newItems)
  }

  const handleItemPriceChange = (index: number, value: number) => {
    const newItems = [...editableItems]
    newItems[index].importPrice = Math.max(0, value)
    setEditableItems(newItems)
  }

  const calculateModalTotal = () => {
    return editableItems.reduce((sum, item) => sum + item.quantity * item.importPrice, 0)
  }

  const handleCreateImportOrder = async () => {
    if (!poDetails || !user) return
    
    const loadingToast = toast.loading('Đang tạo đơn nhập...')
    setIsCreatingImport(true)
    try {
      await importStockService.createFromPO({
        supplierId: poDetails.supplierId,
        createdById: user.id,
        purchaseOrderId: poDetails.id,
        details: editableItems.map(item => ({
          bookId: item.bookId,
          variantId: item.variantId && item.variantId > 0 ? item.variantId : null,
          quantity: item.quantity,
          importPrice: item.importPrice,
          supplierId: poDetails.supplierId
        }))
      })
      toast.success('Tạo đơn nhập kho thành công')
      setShowImportModal(false)
      refreshImportStocks()
      if (onStatusChange) onStatusChange()
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err?.response?.data?.error || 'Tạo đơn nhập thất bại')
    } finally {
      setIsCreatingImport(false)
      toast.dismiss(loadingToast)
    }
  }

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
                {(() => {
                  const isImported = importStockMap[order.id]
                  const displayStatus = isImported && order.status === 'ORDERED' ? 'IMPORTED' : order.status
                  return (
                    <Badge className={statusConfig[displayStatus]?.className || 'bg-gray-100 text-gray-800'}>
                      {statusConfig[displayStatus]?.label || order.status}
                    </Badge>
                  )
                })()}
              </TableCell>
              <TableCell className="text-center">
                <OrderActions 
                  order={order} 
                  importStockMap={importStockMap}
                  onOpenImportModal={handleOpenImportModal}
                  onStatusChange={onStatusChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>

      {/* Import Stock Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="min-w-[900px] max-w-[900px] max-h-[95vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Tạo đơn nhập kho</DialogTitle>
          </DialogHeader>
          
          {isLoadingPo ? (
            <div className="py-10 text-center text-gray-500">Đang tải...</div>
          ) : poDetails && (
            <div className="space-y-4">
              {/* PO Info */}
              <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-xs text-gray-500">Mã PO</p>
                  <p className="font-medium">#{poDetails.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{formatDate(poDetails.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nhà cung cấp</p>
                  <p className="font-medium">{poDetails.supplierName}</p>
                </div>
              </div>

              {/* Table */}
              <div className="border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <TableHeaderCell className="text-center w-12">STT</TableHeaderCell>
                      <TableHeaderCell className="text-left">Tên sách</TableHeaderCell>
                      <TableHeaderCell className="text-center w-28">Số lượng</TableHeaderCell>
                      <TableHeaderCell className="text-right w-32">Giá nhập</TableHeaderCell>
                      <TableHeaderCell className="text-right w-32">Thành tiền</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {editableItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="font-medium">{item.bookTitle}</div>
                          <div className="text-xs text-gray-500">{item.variantFormat || '-'}</div>
                        </TableCell>
                        <TableCell>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemQuantityChange(index, parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1 border rounded text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="number"
                            min="0"
                            value={item.importPrice}
                            onChange={(e) => handleItemPriceChange(index, parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border rounded text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.quantity * item.importPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-medium">
                    <tr>
                      <TableCell colSpan={4} className="text-right">Tổng cộng</TableCell>
                      <TableCell className="text-right">{formatCurrency(calculateModalTotal())}</TableCell>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowImportModal(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateImportOrder} disabled={isCreatingImport} className="bg-green-600 hover:bg-green-700 cursor-pointer">
                  {isCreatingImport ? 'Đang tạo...' : 'Xác nhận'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OrderActions({ 
  order,
  importStockMap,
  onOpenImportModal,
  onStatusChange
}: { 
  order: PurchaseOrder
  importStockMap?: Record<number, boolean>
  onOpenImportModal?: (order: PurchaseOrder) => void
  onStatusChange?: () => void
}) {
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isProcessingReject, setIsProcessingReject] = useState(false)
  const [isProcessingCancel, setIsProcessingCancel] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
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

  return (
    <>
      <div className="flex items-center justify-center gap-2">
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
        
        {order.status === 'PENDING' && (
          <>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 h-8 px-3 cursor-pointer text-[13px]"
              onClick={async () => {
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
              }}
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
                onClick={async () => {
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
                }}
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
                onClick={async () => {
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
                }}
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
                onClick={async () => {
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
                }}
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
