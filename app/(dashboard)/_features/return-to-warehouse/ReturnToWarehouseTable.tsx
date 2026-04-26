'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { ReturnToWarehouseDetailModal } from './ReturnToWarehouseDetailModal'
import type { DisposalRequest } from '@/services/disposal-request.service'

interface ReturnToWarehouseTableProps {
  data: DisposalRequest[]
  onRefresh?: () => void
}

const statusConfig = {
  PENDING: {
    label: 'Chờ duyệt',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  APPROVED: {
    label: 'Đã duyệt',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  REJECTED: {
    label: 'Từ chối',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

export function ReturnToWarehouseTable({ data, onRefresh }: ReturnToWarehouseTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<DisposalRequest | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleViewDetail = (request: DisposalRequest) => {
    setSelectedRequest(request)
    setIsDetailModalOpen(true)
  }

  const getTotalQuantity = (request: DisposalRequest) => {
    return request.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <>
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#fcfcfc] border-b border-gray-50">
            <tr className="text-gray-500 font-medium">
              <TableHeaderCell className="w-16">ID</TableHeaderCell>
              <TableHeaderCell>Lý do</TableHeaderCell>
              <TableHeaderCell className="text-center w-20">Số lượng</TableHeaderCell>
              <TableHeaderCell className="w-28">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="w-40">Người tạo</TableHeaderCell>
              <TableHeaderCell className="w-40">Người xử lý</TableHeaderCell>
              <TableHeaderCell className="w-32">Ngày tạo</TableHeaderCell>
              <TableHeaderCell className="text-center w-28">Thao tác</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {data.map((request) => (
              <TableRow key={request.id}>
                <TableCell variant="primary">{request.id}</TableCell>
                <TableCell className="max-w-[250px] truncate" title={request.reason}>
                  {request.reason}
                </TableCell>
                <TableCell className="text-center">{getTotalQuantity(request)}</TableCell>
                <TableCell>
                  <Badge className={`${statusConfig[request.status].className} cursor-default`}>
                    {statusConfig[request.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {request.createdBy?.email || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {request.processedBy?.email || '-'}
                </TableCell>
                <TableCell>{new Date(request.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleViewDetail(request)}
                    className="h-8 gap-1 px-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      <ReturnToWarehouseDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        request={selectedRequest}
        onRefresh={onRefresh}
      />
    </>
  )
}
