'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface RejectOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rejectReason: string
  setRejectReason: (value: string) => void
  isProcessingReject: boolean
  onReject: () => void
  onCancel: () => void
}

export function RejectOrderModal({
  open,
  onOpenChange,
  rejectReason,
  setRejectReason,
  isProcessingReject,
  onReject,
  onCancel,
}: RejectOrderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Từ chối đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Lý do từ chối</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded-md"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              disabled={!rejectReason.trim() || isProcessingReject}
              onClick={onReject}
            >
              {isProcessingReject ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
