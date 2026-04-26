'use client'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Button } from '@/components/ui/button'
import type { BatchResult } from '@/services/import-stock.service'

interface ImportReceiptResultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  receiveResult: BatchResult[]
  formatCurrency: (amount: number) => string
}

export function ImportReceiptResultModal({
  open,
  onOpenChange,
  receiveResult,
  formatCurrency,
}: ImportReceiptResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
