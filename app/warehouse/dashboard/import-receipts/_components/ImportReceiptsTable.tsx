'use client'

import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ImportReceipt {
  id: string
  supplier: string
  creator: string
  date: string
  bookTypes: number
  totalQuantity: number
  totalAmount: number
  status: 'pending' | 'approved' | 'rejected'
}

interface ImportReceiptsTableProps {
  importReceipts: ImportReceipt[]
}

const statusConfig = {
  pending: { label: 'Đang chờ', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  approved: { label: 'Đã duyệt', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  rejected: { label: 'Từ chối', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
}

export function ImportReceiptsTable({ importReceipts }: ImportReceiptsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  return (
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
            <TableHeaderCell className="text-center w-28">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {importReceipts.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell variant="primary">{receipt.id}</TableCell>
              <TableCell>{receipt.supplier}</TableCell>
              <TableCell>{receipt.creator}</TableCell>
              <TableCell>{receipt.date}</TableCell>
              <TableCell className="text-center">{receipt.bookTypes}</TableCell>
              <TableCell className="text-center">{receipt.totalQuantity}</TableCell>
              <TableCell className="text-right">{formatCurrency(receipt.totalAmount)}</TableCell>
              <TableCell className="text-center">
                <Badge className={statusConfig[receipt.status].className}>
                  {statusConfig[receipt.status].label}
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
