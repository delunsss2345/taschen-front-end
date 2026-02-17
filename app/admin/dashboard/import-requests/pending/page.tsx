'use client'

import { useState, useMemo } from 'react'
import { ImportRequestsHeader } from '../_components/ImportRequestsHeader'
import { ImportRequestsTable, type ImportRequest } from '../_components/ImportRequestsTable'

const mockImportRequests: ImportRequest[] = [
  {
    id: 1,
    bookName: 'Đắc Nhân Tâm',
    quantity: 50,
    status: 'APPROVED',
    createdBy: 'Nguyễn Văn Test1',
    processedBy: 'Admin',
    note: 'Nhập thêm hàng tồn kho',
    feedback: 'Đơn hàng hợp lệ, đã duyệt',
    createdAt: '2024-12-01',
    processedAt: '2024-12-02',
  },
  {
    id: 2,
    bookName: 'Nhà Giả Kim',
    quantity: 30,
    status: 'PENDING',
    createdBy: 'Trần Thị Test2',
    processedBy: null,
    note: 'Bổ sung hàng cho cửa hàng',
    feedback: '',
    createdAt: '2024-12-03',
    processedAt: null,
  },
  {
    id: 3,
    bookName: 'Tư Duy Nhanh Và Chậm',
    quantity: 25,
    status: 'REJECTED',
    createdBy: 'Lê Hoàng Test3',
    processedBy: 'Admin',
    note: 'Yêu cầu nhập gấp',
    feedback: 'Số lượng vượt quá giới hạn cho phép',
    createdAt: '2024-12-01',
    processedAt: '2024-12-01',
  },
  {
    id: 4,
    bookName: 'Harry Potter và Hòn Đá Phù Thủy',
    quantity: 100,
    status: 'PENDING',
    createdBy: 'Phạm Minh Test4',
    processedBy: null,
    note: 'Nhập hàng chuẩn bị cho mùa cao điểm',
    feedback: '',
    createdAt: '2024-12-04',
    processedAt: null,
  },
  {
    id: 5,
    bookName: 'Cuộc Sống Không Giới Hạn',
    quantity: 45,
    status: 'APPROVED',
    createdBy: 'Hoàng Đức Test5',
    processedBy: 'Admin',
    note: 'Bổ sung sách bán chạy',
    feedback: 'Đã duyệt, chuyển kho',
    createdAt: '2024-11-28',
    processedAt: '2024-11-29',
  },
  {
    id: 6,
    bookName: 'Sức Mạnh Của Thói Quen',
    quantity: 20,
    status: 'PENDING',
    createdBy: 'Vũ Thị Test6',
    processedBy: null,
    note: 'Nhập mới cho cửa hàng',
    feedback: '',
    createdAt: '2024-12-05',
    processedAt: null,
  },
]

export default function PendingPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRequests = useMemo(() => {
    let filtered = mockImportRequests.filter((item) => item.status === 'PENDING')

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        return (
          item.bookName.toLowerCase().includes(query) ||
          item.note.toLowerCase().includes(query) ||
          item.createdBy.toLowerCase().includes(query) ||
          item.id.toString().includes(query)
        )
      })
    }

    return filtered
  }, [searchQuery])

  return (
    <div className="space-y-4">
      <ImportRequestsHeader 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      
      />
      <ImportRequestsTable requests={filteredRequests} mode="pending" />
    </div>
  )
}
