'use client'

import { WarehouseImportReceiptsHeader } from './WarehouseImportReceiptsHeader'
import { WarehouseImportReceiptsTable } from './WarehouseImportReceiptsTable'

// Mock data tạm thời - chỉ lấy những item đã duyệt
const mockImportReceipts = [
  {
    id: 'PN002',
    supplier: 'Công ty Sách Đại NAM',
    creator: 'Trần Thị Bình',
    date: '14/01/2025',
    bookTypes: 3,
    totalQuantity: 80,
    totalAmount: 2800000,
    status: 'APPROVED' as const,
  },
  {
    id: 'PN007',
    supplier: 'NXB Tổng hợp TP.HCM',
    creator: 'Đặng Văn Hùng',
    date: '09/01/2025',
    bookTypes: 7,
    totalQuantity: 250,
    totalAmount: 7500000,
    status: 'APPROVED' as const,
  },
]

export function WarehouseImportReceiptsPage() {
  return (
    <div className="space-y-6">
      <WarehouseImportReceiptsHeader />
      <WarehouseImportReceiptsTable importReceipts={mockImportReceipts} />
    </div>
  )
}
