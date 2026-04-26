'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import type { Supplier } from '@/types/response/supplier.response'
import { UpdateSupplierModal } from './UpdateSupplierModal'

interface SupplierTableProps {
  suppliers: Supplier[]
  isLoading: boolean
  onEditSuccess?: () => void
}

export function SupplierTable({ suppliers, isLoading, onEditSuccess }: SupplierTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
        </div>
      </div>
    )
  }

  if (suppliers.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">Không có nhà cung cấp nào</p>
          <p className="text-sm">Hãy thêm nhà cung cấp mới</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Tên nhà cung cấp</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Số điện thoại</TableHeaderCell>
            <TableHeaderCell>Địa chỉ</TableHeaderCell>
            <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
            <TableHeaderCell className="text-center w-48">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {suppliers.map((s) => (
            <TableRow key={s.id}>
              <TableCell variant="secondary">{s.id}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell className="truncate max-w-[200px]">{s.email}</TableCell>
              <TableCell>{s.phone}</TableCell>
              <TableCell className="truncate max-w-[200px]">{s.address}</TableCell>
              <TableCell className="text-center">
                <Badge
                  className={
                    s.active
                      ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-50 shadow-none font-normal'
                      : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-50 shadow-none font-normal'
                  }
                >
                  {s.active ? 'Hoạt động' : 'Vô hiệu hóa'}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                  <UpdateSupplierModal
                    supplier={s}
                    onSuccess={onEditSuccess}
                    trigger={
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 gap-1 px-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      Cập nhật
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}
