'use client'

import { useState, useMemo } from 'react'
import { ReturnsHeader } from './ReturnsHeader'
import { ReturnsTable } from './ReturnsTable'

const mockReturns = [
  {
    id: 1,
    orderCode: 'DH001',
    orderTotal: 150000,
    reason: 'Sách bị rách bìa trong quá trình vận chuyển',
    status: 'PENDING',
    createdBy: 'Nguyễn Văn Test1',
    processedBy: null,
    createdAt: '2024-12-01',
    processedAt: null,
  },
  {
    id: 2,
    orderCode: 'DH002',
    orderTotal: 85000,
    reason: 'Sai sách so với mô tả trên web',
    status: 'PENDING',
    createdBy: 'Trần Thị Test2',
    processedBy: null,
    createdAt: '2024-12-02',
    processedAt: null,
  },
  {
    id: 3,
    orderCode: 'DH003',
    orderTotal: 220000,
    reason: 'Sách có nhiều trang bị in mờ, không đọc được',
    status: 'APPROVED',
    createdBy: 'Lê Hoàng Test3',
    processedBy: 'Seller',
    createdAt: '2024-11-28',
    processedAt: '2024-11-29',
  },
  {
    id: 4,
    orderCode: 'DH004',
    orderTotal: 95000,
    reason: 'Không đúng sách mà khách hàng đặt',
    status: 'REJECTED',
    createdBy: 'Phạm Minh Test4',
    processedBy: 'Seller',
    createdAt: '2024-11-25',
    processedAt: '2024-11-26',
  },
  {
    id: 5,
    orderCode: 'DH005',
    orderTotal: 180000,
    reason: 'Sách bị ẩm mốc, không sử dụng được',
    status: 'PENDING',
    createdBy: 'Hoàng Đức Test5',
    processedBy: null,
    createdAt: '2024-12-03',
    processedAt: null,
  },
]

export function SellerReturnsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReturns = useMemo(() => {
    if (!searchQuery.trim()) return mockReturns

    const query = searchQuery.toLowerCase().trim()

    return mockReturns.filter((item) => {
      return (
        item.orderCode.toLowerCase().includes(query) ||
        item.reason.toLowerCase().includes(query) ||
        item.createdBy.toLowerCase().includes(query) ||
        item.createdAt.includes(query)
      )
    })
  }, [searchQuery])

  return (
    <div className="space-y-4">
      <ReturnsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <ReturnsTable returns={filteredReturns} />
    </div>
  )
}
