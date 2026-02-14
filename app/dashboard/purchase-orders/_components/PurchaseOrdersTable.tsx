'use client'

import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'

// Interface cho dữ liệu PO
interface PurchaseOrder {
  id: string
  supplier: string
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
  createdBy: string
  approvedBy: string | null
  createdAt: string
}

interface PurchaseOrdersTableProps {
  data: PurchaseOrder[]
}

const statusConfig = {
  APPROVED: {
    label: 'Đã duyệt',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  PENDING: {
    label: 'Chờ duyệt',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  REJECTED: {
    label: 'Từ chối',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

export function PurchaseOrdersTable({ data }: PurchaseOrdersTableProps) {
  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell className="w-24 text-center">ID</TableHeaderCell>
            <TableHeaderCell>Nhà cung cấp</TableHeaderCell>
            <TableHeaderCell className="w-28">Trạng thái</TableHeaderCell>
            <TableHeaderCell className="w-28">Người tạo</TableHeaderCell>
            <TableHeaderCell className="w-38">Người duyệt</TableHeaderCell>
            <TableHeaderCell className="text-center w-32">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {data.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="text-center font-medium text-blue-600">{order.id}</TableCell>
              <TableCell>{order.supplier}</TableCell>
              <TableCell>
                <Badge className={`${statusConfig[order.status].className} cursor-default`}>
                  {statusConfig[order.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{order.createdBy}</TableCell>
              <TableCell className="text-muted-foreground">{order.approvedBy || '-'}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="default"
                  size="sm"
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
  )
}
