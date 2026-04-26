'use client'

import { TableHeaderCell } from '@/components/table'
import { type Batch } from '@/services/batch.service'
import { BatchRow } from './BatchRow'

interface BatchTableProps {
  batches: Batch[]
}

export function BatchTable({ batches }: BatchTableProps) {
  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Mã lô</TableHeaderCell>
            <TableHeaderCell className="min-w-[200px]">Tên sách</TableHeaderCell>
            <TableHeaderCell className="text-right w-32">Số lượng</TableHeaderCell>
            <TableHeaderCell className="text-right w-32">SL còn lại</TableHeaderCell>
            <TableHeaderCell className="text-right w-32">Giá nhập</TableHeaderCell>
            <TableHeaderCell className="text-right w-32">Giá bán</TableHeaderCell>
            <TableHeaderCell className="w-32">Định dạng</TableHeaderCell>
            <TableHeaderCell className="w-40">Ngày sản xuất</TableHeaderCell>
            <TableHeaderCell className="min-w-[160px]">Nhà cung cấp</TableHeaderCell>
            <TableHeaderCell className="min-w-[140px]">Người tạo</TableHeaderCell>
            <TableHeaderCell className="text-center w-32">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {batches.map((batch) => (
            <BatchRow key={batch.id} batch={batch} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
