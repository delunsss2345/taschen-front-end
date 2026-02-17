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
  status: 'DRAFT' | 'APPROVED' | 'REJECTED' | 'ORDERED'
}

interface ImportReceiptsTableProps {
  importReceipts: ImportReceipt[]
}

const statusConfig: Record<ImportReceipt['status'], { label: string; className: string }> = {
  DRAFT: { label: 'Chờ phê duyệt', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  REJECTED: { label: 'Từ chối', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  ORDERED: { label: 'Đã đặt hàng', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
}

export function WarehouseImportReceiptsTable({ importReceipts }: ImportReceiptsTableProps) {
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
            <TableHeaderCell className="text-center w-40">Thao tác</TableHeaderCell>
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
                <div className="flex items-center justify-center gap-1">
                  <Button className="h-8 px-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white text-xs">
                    Nhập kho
                  </Button>
                  <Button className="h-8 px-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white text-xs">
                    Hủy nhập
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}
