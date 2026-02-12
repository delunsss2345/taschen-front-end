'use client'

import { TableCell, TableRow } from '@/components/table'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImportReceipt {
  id: string
  supplier: string
  creator: string
  date: string
  bookTypes: number
  totalQuantity: number
  totalAmount: number
}

interface ImportReceiptsTableProps {
  importReceipts: ImportReceipt[]
}

export function ImportReceiptsTable({ importReceipts }: ImportReceiptsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <th className="px-6 py-4 font-semibold w-28">Mã phiếu</th>
            <th className="px-6 py-4 font-semibold">Nhà cung cấp</th>
            <th className="px-6 py-4 font-semibold">Người tạo</th>
            <th className="px-6 py-4 font-semibold">Ngày nhập</th>
            <th className="px-6 py-4 font-semibold text-center">Số loại sách</th>
            <th className="px-6 py-4 font-semibold text-center">Tổng số lượng</th>
            <th className="px-6 py-4 font-semibold text-right">Tổng tiền</th>
            <th className="px-6 py-4 font-semibold text-center w-28">Thao tác</th>
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
                <Button
                  className="h-8 gap-1 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="h-3 w-3" />
                  Chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}
