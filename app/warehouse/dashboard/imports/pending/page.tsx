'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ImportReceiptsTable } from '../../import-receipts/_components/ImportReceiptsTable'

// Mock data tạm thời - Đang chờ
const mockPendingReceipts = [
  {
    id: 'PN001',
    supplier: 'Nhà xuất bản Kim Đồng',
    creator: 'Nguyễn Văn An',
    date: '15/01/2025',
    bookTypes: 5,
    totalQuantity: 150,
    totalAmount: 4500000,
    status: 'pending' as const,
  },
  {
    id: 'PN004',
    supplier: 'Nhà xuất bản Trẻ',
    creator: 'Phạm Thị Dung',
    date: '12/01/2025',
    bookTypes: 4,
    totalQuantity: 120,
    totalAmount: 3600000,
    status: 'pending' as const,
  },
  {
    id: 'PN006',
    supplier: 'Công ty Sách Thanh Niên',
    creator: 'Vũ Văn Giang',
    date: '10/01/2025',
    bookTypes: 7,
    totalQuantity: 210,
    totalAmount: 6300000,
    status: 'pending' as const,
  },
]

export default function PendingImportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Nhập hàng - Đang chờ</h1>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp..."
            className="pl-10 h-10 bg-white border-gray-200"
          />
        </div>
      </div>
      <ImportReceiptsTable importReceipts={mockPendingReceipts} />
    </div>
  )
}
