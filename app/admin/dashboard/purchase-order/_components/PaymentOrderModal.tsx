'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import type { PurchaseOrder } from '@/types/response/purchase-order.response'

interface PaymentOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: PurchaseOrder
  isProcessingPayment: boolean
  onPay: () => void
  onClose: () => void
  formatCurrency: (amount: number) => string
  calculateTotal: (items: PurchaseOrder['items']) => number
}

export function PaymentOrderModal({
  open,
  onOpenChange,
  order,
  isProcessingPayment,
  onPay,
  onClose,
  formatCurrency,
  calculateTotal,
}: PaymentOrderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <span className="font-medium">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : '-'}
              </span>
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
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
              disabled={isProcessingPayment}
              onClick={onPay}
            >
              {isProcessingPayment ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
