'use client'

import { useState, useMemo } from 'react'
import { ReturnToWarehouseHeader } from './_components/ReturnToWarehouseHeader'
import { ReturnToWarehouseTable } from './_components/ReturnToWarehouseTable'

// Interface cho dữ liệu
interface ReturnRequest {
  id: string
  bookName: string
  quantity: number
  notes: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  processedAt: string | null
}

// Mock data - tất cả yêu cầu của seller (của bản thân)
const mockData: ReturnRequest[] = [
  {
    id: 'RWH001',
    bookName: 'Đắc Nhân Tâm',
    quantity: 5,
    notes: 'Sách cũ, bìa hỏng nhẹ',
    status: 'pending',
    createdAt: '2024-01-15 10:30',
    processedAt: null,
  },
  {
    id: 'RWH002',
    bookName: 'Harry Potter và Hòn Đá Phù Thủy',
    quantity: 3,
    notes: 'Sách không bán được, tồn kho lâu',
    status: 'approved',
    createdAt: '2024-01-14 09:15',
    processedAt: '2024-01-14 14:20',
  },
  {
    id: 'RWH003',
    bookName: 'Sherlock Holmes - Tập 1',
    quantity: 2,
    notes: 'Sách lỗi in ấn',
    status: 'rejected',
    createdAt: '2024-01-13 16:45',
    processedAt: '2024-01-13 17:00',
  },
  {
    id: 'RWH004',
    bookName: 'Nhà Giả Kim',
    quantity: 10,
    notes: 'Hàng tồn kho cần thanh lý',
    status: 'pending',
    createdAt: '2024-01-12 11:20',
    processedAt: null,
  },
  {
    id: 'RWH005',
    bookName: 'Sapiens - Lịch Sử Ngắn Gọn Của Loài Người',
    quantity: 1,
    notes: 'Sách trưng bày, không bán',
    status: 'approved',
    createdAt: '2024-01-11 08:00',
    processedAt: '2024-01-11 10:30',
  },
]

export default function SellerWarehouseReturnsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return mockData

    const query = searchQuery.toLowerCase().trim()

    return mockData.filter((item) => {
      return (
        item.id.toLowerCase().includes(query) ||
        item.bookName.toLowerCase().includes(query) ||
        item.notes.toLowerCase().includes(query)
      )
    })
  }, [searchQuery])

  return (
    <div className="space-y-6">
      <ReturnToWarehouseHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <ReturnToWarehouseTable data={filteredData} />
    </div>
  )
}
