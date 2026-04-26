'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CancelOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rejectReason: string
  setRejectReason: (value: string) => void
  isProcessingCancel: boolean
  onCancelOrder: () => void
  onClose: () => void
}

export function CancelOrderModal({
  open,
  onOpenChange,
  rejectReason,
  setRejectReason,
  isProcessingCancel,
  onCancelOrder,
  onClose,
}: CancelOrderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hủy đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Lý do hủy</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded-md"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do hủy..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              disabled={!rejectReason.trim() || isProcessingCancel}
              onClick={onCancelOrder}
            >
              {isProcessingCancel ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
