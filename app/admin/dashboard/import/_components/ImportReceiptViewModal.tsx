'use client'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import type { ImportStock } from '@/services/import-stock.service'

interface ImportReceiptViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedReceipt: ImportStock | null
  statusConfig: Record<string, { label: string; className: string }>
  formatDate: (dateString: string) => string
  formatCurrency: (amount: number) => string
}

export function ImportReceiptViewModal({
  open,
  onOpenChange,
  selectedReceipt,
  statusConfig,
  formatDate,
  formatCurrency,
}: ImportReceiptViewModalProps) {
  const items = selectedReceipt?.details || selectedReceipt?.items || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  )
}
