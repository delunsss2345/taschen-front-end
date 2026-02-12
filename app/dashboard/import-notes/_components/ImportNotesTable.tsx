'use client'

import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImportNote {
  id: string
  supplier: string
  creator: string
  date: string
  bookTypes: number
  totalQuantity: number
  totalAmount: number
}

interface ImportNotesTableProps {
  importNotes: ImportNote[]
}

export function ImportNotesTable({ importNotes }: ImportNotesTableProps) {
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
            <th className="px-6 py-4 font-semibold w-24">Mã phiếu</th>
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
          {importNotes.map((note) => (
            <tr key={note.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5 font-medium text-blue-600">{note.id}</td>
              <td className="px-6 py-5 text-gray-900">{note.supplier}</td>
              <td className="px-6 py-5 text-gray-600">{note.creator}</td>
              <td className="px-6 py-5 text-gray-600">{note.date}</td>
              <td className="px-6 py-5 text-center text-gray-600">{note.bookTypes}</td>
              <td className="px-6 py-5 text-center text-gray-600">{note.totalQuantity}</td>
              <td className="px-6 py-5 text-right font-medium text-gray-900">
                {formatCurrency(note.totalAmount)}
              </td>
              <td className="px-6 py-5 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 px-3 cursor-pointer"
                >
                  <Eye className="h-3 w-3" />
                  Chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
