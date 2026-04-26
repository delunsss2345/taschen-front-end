'use client'

import type { PurchaseOrder } from '@/types/response/purchase-order.response'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TableCell, TableHeaderCell } from '@/components/table'

interface PurchaseOrderViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedOrder: PurchaseOrder | null
  statusConfig: Record<string, { label: string; className: string }>
  formatDate: (dateString: string) => string
  formatCurrency: (amount: number) => string
  calculateTotal: (items: PurchaseOrder['items']) => number
}

export function PurchaseOrderViewModal({
  open,
  onOpenChange,
  selectedOrder,
  statusConfig,
  formatDate,
  formatCurrency,
  calculateTotal,
}: PurchaseOrderViewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  )
}
