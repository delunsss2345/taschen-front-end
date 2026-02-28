'use client'

import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { toast } from 'sonner'
import { type Batch } from '@/services/batch.service'

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
            <TableHeaderCell className="text-right w-28">Số lượng</TableHeaderCell>
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

function BatchRow({ batch }: { batch: Batch }) {
  const [open, setOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ'
  }

  return (
    <>
      <TableRow>
        <TableCell variant="secondary">{batch.id}</TableCell>
        <TableCell variant="primary">{batch.batchCode}</TableCell>
        <TableCell className="truncate max-w-[200px]">{batch.bookTitle}</TableCell>
        <TableCell className="text-right">{batch.quantity}</TableCell>
        <TableCell className="text-right">{batch.remainingQuantity}</TableCell>
        <TableCell className="text-right text-red-500">{formatPrice(batch.importPrice)}</TableCell>
        <TableCell className="text-right text-green-600">{batch.sellingPrice ? formatPrice(batch.sellingPrice) : '-'}</TableCell>
        <TableCell>{batch.variant?.formatName || '-'}</TableCell>
        <TableCell>{formatDate(batch.productionDate)}</TableCell>
        <TableCell>{batch.supplierName}</TableCell>
        <TableCell>{batch.createdByName}</TableCell>
        <TableCell className="text-center">
          <Button
            variant="default"
            size="sm"
            className="h-8 gap-1 px-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            
            Xem chi tiết
          </Button>
        </TableCell>
      </TableRow>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết Lô hàng</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Mã lô</p>
                <p className="font-medium text-blue-600">{batch.batchCode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{batch.id}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Tên sách</p>
              <p className="font-medium">{batch.bookTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Số lượng</p>
                <p className="font-medium">{batch.quantity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Số lượng còn lại</p>
                <p className="font-medium">{batch.remainingQuantity}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Giá nhập</p>
                <p className="font-medium text-red-500">{formatPrice(batch.importPrice)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Giá bán</p>
                <p className="font-medium text-green-600">{batch.sellingPrice ? formatPrice(batch.sellingPrice) : '-'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Định dạng</p>
                <p className="font-medium">{batch.variant?.formatName || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Ngày sản xuất</p>
                <p className="font-medium">{formatDate(batch.productionDate)}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Nhà cung cấp</p>
              <p className="font-medium">{batch.supplierName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Người tạo</p>
                <p className="font-medium">{batch.createdByName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">{formatDate(batch.createdAt)}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 border-t pt-4 mt-4">
            <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
