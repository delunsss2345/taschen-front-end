'use client'

import { ReturnToWarehouseHeader } from './ReturnToWarehouseHeader'
import { ReturnToWarehouseTable } from './ReturnToWarehouseTable'

// Interface cho dữ liệu
interface ReturnRequest {
  id: string
  bookName: string
  quantity: number
  notes: string
  status: 'pending' | 'approved' | 'rejected'
  createdBy: string | null
  processedBy: string | null
  createdAt: string
  processedAt: string | null
}

// Mock data tạm thời
const mockData: ReturnRequest[] = [
  {
    id: 'RWH001',
    bookName: 'Đắc Nhân Tâm',
    quantity: 5,
    notes: 'Sách cũ, bìa hỏng nhẹ',
    status: 'pending',
    createdBy: 'nguyenvana',
    processedBy: null,
    createdAt: '2024-01-15 10:30',
    processedAt: null,
  },
  {
    id: 'RWH002',
    bookName: 'Harry Potter và Hòn Đá Phù Thủy',
    quantity: 3,
    notes: 'Sách không bán được, tồn kho lâu',
    status: 'approved',
    createdBy: 'tranb',
    processedBy: 'admin01',
    createdAt: '2024-01-14 09:15',
    processedAt: '2024-01-14 14:20',
  },
  {
    id: 'RWH003',
    bookName: 'Sherlock Holmes - Tập 1',
    quantity: 2,
    notes: 'Sách lỗi in ấn',
    status: 'rejected',
    createdBy: 'lehong',
    processedBy: 'admin01',
    createdAt: '2024-01-13 16:45',
    processedAt: '2024-01-13 17:00',
  },
  {
    id: 'RWH004',
    bookName: 'Nhà Giả Kim',
    quantity: 10,
    notes: 'Hàng tồn kho cần thanh lý',
    status: 'pending',
    createdBy: 'phamt',
    processedBy: null,
    createdAt: '2024-01-12 11:20',
    processedAt: null,
  },
  {
    id: 'RWH005',
    bookName: 'Sapiens - Lịch Sử Ngắn Gọn Của Loài Người',
    quantity: 1,
    notes: 'Sách trưng bày, không bán',
    status: 'approved',
    createdBy: 'dangm',
    processedBy: 'admin02',
    createdAt: '2024-01-11 08:00',
    processedAt: '2024-01-11 10:30',
  },
]

export default function ReturnToWarehousePage() {
  return (
    <div className="space-y-6">
      <ReturnToWarehouseHeader />
      <ReturnToWarehouseTable data={mockData} />
    </div>
  )
}
