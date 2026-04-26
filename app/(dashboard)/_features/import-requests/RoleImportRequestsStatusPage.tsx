'use client'

import { useMemo, useState } from 'react'
import {
  ImportRequestsHeader as AdminImportRequestsHeader,
} from '@/app/admin/dashboard/import-requests/_components/ImportRequestsHeader'
import {
  ImportRequestsTable as AdminImportRequestsTable,
  type ImportRequest as AdminImportRequest,
  type TableMode as AdminTableMode,
} from '@/app/admin/dashboard/import-requests/_components/ImportRequestsTable'
import {
  ImportRequestsHeader as WarehouseImportRequestsHeader,
} from '@/app/warehouse/dashboard/import-requests/_components/ImportRequestsHeader'
import {
  ImportRequestsTable as WarehouseImportRequestsTable,
  type ImportRequest as WarehouseImportRequest,
  type TableMode as WarehouseTableMode,
} from '@/app/warehouse/dashboard/import-requests/_components/ImportRequestsTable'

type ImportRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
type ImportRequestMode = 'pending' | 'approved' | 'rejected'

type RoleImportRequestsStatusPageProps = {
  mode: ImportRequestMode
  role: 'admin' | 'warehouse'
}

const mockImportRequests = [
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
] satisfies (AdminImportRequest | WarehouseImportRequest)[]

const statusByMode: Record<ImportRequestMode, ImportRequestStatus> = {
  pending: 'PENDING',
  approved: 'APPROVED',
  rejected: 'REJECTED',
}

const titleByMode: Record<ImportRequestMode, string> = {
  pending: 'Yêu cầu Nhập kho - Đang chờ',
  approved: 'Yêu cầu Nhập kho - Đã duyệt',
  rejected: 'Yêu cầu Nhập kho - Từ chối',
}

export function RoleImportRequestsStatusPage({ mode, role }: RoleImportRequestsStatusPageProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRequests = useMemo(() => {
    const status = statusByMode[mode]
    const query = searchQuery.toLowerCase().trim()

    return mockImportRequests.filter((item) => {
      if (item.status !== status) return false
      if (!query) return true

      return (
        item.bookName.toLowerCase().includes(query) ||
        item.note.toLowerCase().includes(query) ||
        item.createdBy.toLowerCase().includes(query) ||
        item.id.toString().includes(query)
      )
    })
  }, [mode, searchQuery])

  if (role === 'warehouse') {
    return (
      <div className="space-y-4">
        <WarehouseImportRequestsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          title={titleByMode[mode]}
        />
        <WarehouseImportRequestsTable
          requests={filteredRequests as WarehouseImportRequest[]}
          mode={mode as WarehouseTableMode}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AdminImportRequestsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} title={titleByMode[mode]} />
      <AdminImportRequestsTable requests={filteredRequests as AdminImportRequest[]} mode={mode as AdminTableMode} />
    </div>
  )
}
