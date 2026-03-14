'use client'

import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useReceiveImportStockMutation } from '@/features/import-stock/hooks'
import { BatchResult, ImportStock } from '@/services/import-stock.service'
import { useState } from 'react'
import { toast } from 'sonner'
import { ImportReceiptViewModal } from './ImportReceiptViewModal'
import { ImportReceiptResultModal } from './ImportReceiptResultModal'

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
  const { mutate: receiveImportStock } = useReceiveImportStockMutation()

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

  const handleReceive = (receipt: ImportStock) => {
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
    receiveImportStock(
      { importStockId: receipt.id, userId: currentUser.id },
      {
        onSuccess: (result) => {
          setReceiveResult(result.batchResults)
          setShowReceiveModal(true)
          toast.success('Nhập kho thành công')
          onRefresh?.()
        },
        onError: (error) => {
          const err = error as { response?: { data?: { error?: string; message?: string } } }
          toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Nhập kho thất bại')
        },
        onSettled: () => {
          setReceivingId(null)
          toast.dismiss(loadingToast)
        },
      },
    )
  }

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

      <ImportReceiptViewModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        selectedReceipt={selectedReceipt}
        statusConfig={statusConfig}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      <ImportReceiptResultModal
        open={showReceiveModal}
        onOpenChange={setShowReceiveModal}
        receiveResult={receiveResult}
        formatCurrency={formatCurrency}
      />
    </>
  )
}
