'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

interface ReturnRequest {
  id: string
  bookName: string
  quantity: number
  notes: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  processedAt: string | null
}

interface ReturnToWarehouseDetailModalProps {
  isOpen: boolean
  onClose: () => void
  request: ReturnRequest | null
}

const statusConfig = {
  pending: {
    label: 'Chờ duyệt',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  approved: {
    label: 'Đã duyệt',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  rejected: {
    label: 'Từ chối',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

export function ReturnToWarehouseDetailModal({
  isOpen,
  onClose,
  request,
}: ReturnToWarehouseDetailModalProps) {
  if (!request) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết yêu cầu trả hàng về kho
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về yêu cầu trả sách về kho
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* ID và Trạng thái */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mã yêu cầu:</span>
              <span className="font-semibold text-blue-600">{request.id}</span>
            </div>
            <Badge className={`${statusConfig[request.status].className} cursor-default`}>
              {statusConfig[request.status].label}
            </Badge>
          </div>

          {/* Thông tin sách */}
          <div className="rounded-lg bg-gray-50 p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Thông tin sách</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tên sách:</p>
                <p className="font-medium">{request.bookName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số lượng:</p>
                <p className="font-medium">{request.quantity} quyển</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ghi chú:</p>
              <p className="text-gray-700">{request.notes}</p>
            </div>
          </div>

          {/* Thông tin ngày tạo và xử lý */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Ngày tạo: </span>
                <span className="font-medium">{request.createdAt}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Ngày xử lý: </span>
                <span className="font-medium">{request.processedAt || '-'}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
