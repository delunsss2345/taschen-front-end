'use client'

import { ImportReceiptsHeader } from './ImportReceiptsHeader'
import { ImportReceiptsTable } from './ImportReceiptsTable'

// Mock data tạm thời
const mockImportReceipts = [
  {
    id: 'PN001',
    supplier: 'Nhà xuất bản Kim Đồng',
    creator: 'Nguyễn Văn An',
    date: '15/01/2025',
    bookTypes: 5,
    totalQuantity: 150,
    totalAmount: 4500000,
    status: 'DRAFT' as const,
  },
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
    id: 'PN003',
    supplier: 'NXB Giáo Dục Việt Nam',
    creator: 'Lê Văn Cường',
    date: '13/01/2025',
    bookTypes: 8,
    totalQuantity: 200,
    totalAmount: 6200000,
    status: 'REJECTED' as const,
  },
  {
    id: 'PN004',
    supplier: 'Nhà xuất bản Trẻ',
    creator: 'Phạm Thị Dung',
    date: '12/01/2025',
    bookTypes: 4,
    totalQuantity: 120,
    totalAmount: 3600000,
    status: 'ORDERED' as const,
  },
  {
    id: 'PN005',
    supplier: 'Công ty Sách Hồng Ân',
    creator: 'Hoàng Văn Em',
    date: '11/01/2025',
    bookTypes: 6,
    totalQuantity: 180,
    totalAmount: 5400000,
    status: 'CANCELLED' as const,
  },
  {
    id: 'PN006',
    supplier: 'Công ty Sách Minh Khai',
    creator: 'Vũ Thị Hoa',
    date: '10/01/2025',
    bookTypes: 2,
    totalQuantity: 50,
    totalAmount: 1500000,
    status: 'DRAFT' as const,
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

export function ImportReceiptsPage() {
  return (
    <div className="space-y-6">
      <ImportReceiptsHeader />
      <ImportReceiptsTable importReceipts={mockImportReceipts} />
    </div>
  )
}
