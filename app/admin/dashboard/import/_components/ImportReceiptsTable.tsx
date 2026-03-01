'use client'

import { useState } from 'react'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImportStock, importStockService, BatchResult } from '@/services/import-stock.service'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ImportReceiptsTableProps {
  importReceipts: ImportStock[]
  onRefresh?: () => void
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Chưa nhập', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  RECEIVED: { label: 'Đã nhập', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
}

export function ImportReceiptsTable({ importReceipts, onRefresh }: ImportReceiptsTableProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<ImportStock | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [receivingId, setReceivingId] = useState<number | null>(null)
  const [receiveResult, setReceiveResult] = useState<BatchResult[]>([])
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const { currentUser } = useAuthStore()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const handleView = (receipt: ImportStock) => {
    setSelectedReceipt(receipt)
    setShowViewModal(true)
  }

  const handleReceive = async (receipt: ImportStock) => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập')
      return
    }

    if (receipt.received) {
      toast.error('Phiếu nhập kho này đã được nhập kho rồi')
      return
    }

    const loadingToast = toast.loading('Đang nhập kho...')
    setReceivingId(receipt.id)
    try {
      const result = await importStockService.receive(receipt.id, currentUser.id)
      setReceiveResult(result.batchResults)
      setShowReceiveModal(true)
      toast.success('Nhập kho thành công')
      onRefresh?.()
    } catch (error) {
      const err = error as { response?: { data?: { error?: string; message?: string } } }
      toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Nhập kho thất bại')
    } finally {
      setReceivingId(null)
      toast.dismiss(loadingToast)
    }
  }

  const items = selectedReceipt?.details || selectedReceipt?.items || []

  return (
    <>
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
        <table className="w-full text-sm">
          <thead className="bg-[#fcfcfc] border-b border-gray-50">
            <tr className="text-gray-500 font-medium">
              <TableHeaderCell className="w-28">Mã phiếu</TableHeaderCell>
              <TableHeaderCell>Nhà cung cấp</TableHeaderCell>
              <TableHeaderCell>Người tạo</TableHeaderCell>
              <TableHeaderCell>Ngày nhập</TableHeaderCell>
              <TableHeaderCell className="text-center">Số loại sách</TableHeaderCell>
              <TableHeaderCell className="text-center">Tổng số lượng</TableHeaderCell>
              <TableHeaderCell className="text-right">Tổng tiền</TableHeaderCell>
              <TableHeaderCell className="text-center w-28">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-center w-40">Thao tác</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {importReceipts.map((receipt) => {
              const displayStatus = receipt.received ? 'RECEIVED' : 'PENDING'
              const totalQuantity = (receipt.details || receipt.items || []).reduce((sum, item) => sum + item.quantity, 0)
              const totalAmount = (receipt.details || receipt.items || []).reduce((sum, item) => sum + (item.importPrice * item.quantity), 0)
              const bookTypes = (receipt.details || receipt.items || []).length

              return (
                <TableRow key={receipt.id}>
                  <TableCell variant="primary">#{receipt.id}</TableCell>
                  <TableCell>{receipt.supplierName}</TableCell>
                  <TableCell>{receipt.createdByName}</TableCell>
                  <TableCell>{formatDate(receipt.importDate)}</TableCell>
                  <TableCell className="text-center">{bookTypes}</TableCell>
                  <TableCell className="text-center">{totalQuantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totalAmount)}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusConfig[displayStatus]?.className || 'bg-gray-100'}>
                      {statusConfig[displayStatus]?.label || displayStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {!receipt.received && (
                        <Button 
                          className="h-8 px-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white text-xs"
                          onClick={() => handleReceive(receipt)}
                          disabled={receivingId !== null}
                        >
                          {receivingId === receipt.id ? 'Đang...' : 'Nhập kho'}
                        </Button>
                      )}
                      <Button 
                        className="h-8 px-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        onClick={() => handleView(receipt)}
                      >
                        Xem
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết phiếu nhập kho #{selectedReceipt?.id}</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nhà cung cấp</p>
                  <p className="font-medium">{selectedReceipt.supplierName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Người tạo</p>
                  <p>{selectedReceipt.createdByName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày nhập</p>
                  <p>{formatDate(selectedReceipt.importDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                  <Badge className={statusConfig[selectedReceipt.received ? 'RECEIVED' : 'PENDING']?.className}>
                    {statusConfig[selectedReceipt.received ? 'RECEIVED' : 'PENDING']?.label}
                  </Badge>
                </div>
                {selectedReceipt.purchaseOrderId && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mã đơn đặt hàng</p>
                    <p>#{selectedReceipt.purchaseOrderId}</p>
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
                        <TableHeaderCell className="text-center">Variant</TableHeaderCell>
                        <TableHeaderCell className="text-right">Số lượng</TableHeaderCell>
                        <TableHeaderCell className="text-right">Giá nhập</TableHeaderCell>
                        <TableHeaderCell className="text-right">Thành tiền</TableHeaderCell>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.bookTitle}</TableCell>
                          <TableCell className="text-center">{item.variantName || item.variantFormat || '-'}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.importPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.quantity * item.importPrice)}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium">
                      <tr>
                        <TableCell colSpan={4} className="text-right">Tổng cộng</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(items.reduce((sum, item) => sum + item.quantity * item.importPrice, 0))}
                        </TableCell>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receive Result Modal */}
      <Dialog open={showReceiveModal} onOpenChange={setShowReceiveModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kết quả nhập kho</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-green-600 font-medium">Nhập kho thành công!</p>
            
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeaderCell className="text-left">Mã lô</TableHeaderCell>
                    <TableHeaderCell className="text-left">Tên sách</TableHeaderCell>
                    <TableHeaderCell className="text-center">Variant</TableHeaderCell>
                    <TableHeaderCell className="text-right">Số lượng</TableHeaderCell>
                    <TableHeaderCell className="text-right">Giá nhập</TableHeaderCell>
                    <TableHeaderCell className="text-center">Loại</TableHeaderCell>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {receiveResult.map((batch, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{batch.batchCode}</TableCell>
                      <TableCell>{batch.bookTitle}</TableCell>
                      <TableCell className="text-center">{batch.variantName || '-'}</TableCell>
                      <TableCell className="text-right">{batch.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(batch.importPrice)}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={batch.isNew ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                          {batch.isNew ? 'Mới' : 'Cộng dồn'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setShowReceiveModal(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
