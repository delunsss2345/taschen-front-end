'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ImportReceiptsTable } from '../../import-receipts/_components/ImportReceiptsTable'

// Mock data tạm thời - Đã duyệt
const mockConfirmedReceipts = [
  {
    id: 'PN002',
    supplier: 'Công ty Sách Đại NAM',
    creator: 'Trần Thị Bình',
    date: '14/01/2025',
    bookTypes: 3,
    totalQuantity: 80,
    totalAmount: 2800000,
    status: 'approved' as const,
  },
  {
    id: 'PN005',
    supplier: 'Công ty Sách Hồng Ân',
    creator: 'Hoàng Văn Em',
    date: '11/01/2025',
    bookTypes: 6,
    totalQuantity: 180,
    totalAmount: 5400000,
    status: 'approved' as const,
  },
  {
    id: 'PN007',
    supplier: 'NXB Tổng hợp TP.HCM',
    creator: 'Đặng Thị Hương',
    date: '09/01/2025',
    bookTypes: 9,
    totalQuantity: 300,
    totalAmount: 9000000,
    status: 'approved' as const,
  },
]

export default function ConfirmedImportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Nhập hàng - Đã duyệt</h1>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp..."
            className="pl-10 h-10 bg-white border-gray-200"
          />
        </div>
      </div>
      <ImportReceiptsTable importReceipts={mockConfirmedReceipts} />
    </div>
  )
}
