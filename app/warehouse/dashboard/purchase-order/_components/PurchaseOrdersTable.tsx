'use client'

import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PurchaseOrder {
  id: string
  supplier: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  createdBy: string
  approvedBy: string | null
  createdAt: string
  books: {
    name: string
    quantity: number
    price: number
  }[]
}

interface PurchaseOrdersTableProps {
  data: PurchaseOrder[]
}

const statusConfig: Record<PurchaseOrder['status'], { label: string; className: string }> = {
  APPROVED: { label: 'Đã duyệt', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  PENDING: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  REJECTED: { label: 'Từ chối', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
}

export function PurchaseOrdersTable({ data }: PurchaseOrdersTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  const calculateTotal = (books: PurchaseOrder['books']) => {
    return books.reduce((sum, book) => sum + book.price * book.quantity, 0)
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell className="w-28">Mã đơn</TableHeaderCell>
            <TableHeaderCell>Nhà cung cấp</TableHeaderCell>
            <TableHeaderCell>Người tạo</TableHeaderCell>
            <TableHeaderCell>Ngày tạo</TableHeaderCell>
            <TableHeaderCell className="text-center">Số sách</TableHeaderCell>
            <TableHeaderCell className="text-right">Tổng tiền</TableHeaderCell>
            <TableHeaderCell className="text-center w-28">Trạng thái</TableHeaderCell>
            <TableHeaderCell className="text-center w-28">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {data.map((order) => (
            <TableRow key={order.id}>
              <TableCell variant="primary">{order.id}</TableCell>
              <TableCell>{order.supplier}</TableCell>
              <TableCell>{order.createdBy}</TableCell>
              <TableCell>{order.createdAt}</TableCell>
              <TableCell className="text-center">{order.books.length}</TableCell>
              <TableCell className="text-right">{formatCurrency(calculateTotal(order.books))}</TableCell>
              <TableCell className="text-center">
                <Badge className={statusConfig[order.status].className}>
                  {statusConfig[order.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  className="h-8 gap-1 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}
