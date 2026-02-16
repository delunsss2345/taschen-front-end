'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ImportReceiptsTable } from '../../import-receipts/_components/ImportReceiptsTable'

// Mock data tạm thời - Từ chối
const mockRejectedReceipts = [
  {
    id: 'PN003',
    supplier: 'NXB Giáo Dục Việt Nam',
    creator: 'Lê Văn Cường',
    date: '13/01/2025',
    bookTypes: 8,
    totalQuantity: 200,
    totalAmount: 6200000,
    status: 'rejected' as const,
  },
  {
    id: 'PN008',
    supplier: 'Công ty Sách Quốc tế',
    creator: 'Trương Văn Hùng',
    date: '08/01/2025',
    bookTypes: 5,
    totalQuantity: 100,
    totalAmount: 3500000,
    status: 'rejected' as const,
  },
]

export default function RejectedImportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Nhập hàng - Từ chối</h1>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp..."
            className="pl-10 h-10 bg-white border-gray-200"
          />
        </div>
      </div>
      <ImportReceiptsTable importReceipts={mockRejectedReceipts} />
    </div>
  )
}
