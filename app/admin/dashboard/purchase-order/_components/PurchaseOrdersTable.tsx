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
import { OrderActions } from './OrderActions'

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
                  statusConfig={statusConfig}
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
