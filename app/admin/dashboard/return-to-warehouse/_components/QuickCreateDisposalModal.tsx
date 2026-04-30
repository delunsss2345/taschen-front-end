'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { batchService, type Batch } from '@/services/batch.service'
import { disposalRequestService, type DisposalRequest } from '@/services/disposal-request.service'

interface QuickCreateDisposalModalProps {
  isOpen: boolean
  onClose: () => void
  request: DisposalRequest
  onSuccess?: () => void
}

export function QuickCreateDisposalModal({
  isOpen,
  onClose,
  request,
  onSuccess,
}: QuickCreateDisposalModalProps) {
  const firstItem = request.items[0]
  const bookId = firstItem?.batch?.bookId
  const bookTitle = firstItem?.batch?.bookTitle ?? '—'
  const defaultQty = request.items.reduce((sum, item) => sum + item.quantity, 0)

  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoadingBatches, setIsLoadingBatches] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState('')
  const [quantity, setQuantity] = useState(defaultQty.toString())
  const [reason, setReason] = useState(request.reason)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSelectedBatchId('')
      setQuantity(defaultQty.toString())
      setReason(request.reason)
      setBatches([])
      return
    }
    if (!bookId) return

    setIsLoadingBatches(true)
    batchService.getBatchesByBookId(bookId)
      .then(setBatches)
      .catch(() => toast.error('Không thể tải danh sách lô hàng'))
      .finally(() => setIsLoadingBatches(false))
  }, [isOpen, bookId])

  const selectedBatch = batches.find((b) => b.id.toString() === selectedBatchId)
  const maxQty = selectedBatch?.remainingQuantity ?? Infinity
  const hasNoBatches = !isLoadingBatches && batches.length === 0

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do')
      return
    }
    if (!selectedBatchId) {
      toast.error('Vui lòng chọn lô hàng')
      return
    }
    const qty = Number(quantity)
    if (!qty || qty <= 0) {
      toast.error('Số lượng phải lớn hơn 0')
      return
    }
    if (selectedBatch && qty > selectedBatch.remainingQuantity) {
      toast.error(`Số lượng vượt quá tồn kho của lô (còn ${selectedBatch.remainingQuantity})`)
      return
    }

    setIsSubmitting(true)
    try {
      await disposalRequestService.createDisposalRequest({
        reason: reason.trim(),
        items: [{ batchId: Number(selectedBatchId), quantity: qty }],
      })
      toast.success('Tạo yêu cầu xuất hủy thành công', { duration: 4000 })
      onClose()
      onSuccess?.()
    } catch (error) {
      const err = error as { response?: { data?: { message?: string; error?: string } } }
      toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Tạo yêu cầu thất bại', { duration: 4000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg font-sans">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu xuất hủy</DialogTitle>
          <DialogDescription>
            Tạo phiếu xuất hủy từ yêu cầu trả kho #{request.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Book - display only */}
          <div className="grid gap-2">
            <Label>Sách</Label>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
              {bookTitle}
            </p>
          </div>

          {/* Reason - editable */}
          <div className="grid gap-2">
            <Label htmlFor="reason">Lý do xuất hủy</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do xuất hủy..."
            />
          </div>

          {/* Batch select */}
          <div className="grid gap-2">
            <Label>Lô hàng</Label>
            {hasNoBatches ? (
              <p className="text-sm text-gray-400 italic">
                Không có lô hàng khả dụng cho sách này
              </p>
            ) : (
              <Select
                value={selectedBatchId}
                onValueChange={setSelectedBatchId}
                disabled={isLoadingBatches || hasNoBatches}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingBatches ? 'Đang tải...' : 'Chọn lô hàng'} />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.id.toString()}>
                      {b.batchCode}
                      {b.variant ? ` — ${b.variant.formatName}` : ''}
                      {' — '}Còn {b.remainingQuantity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Quantity - editable */}
          <div className="grid gap-2">
            <Label htmlFor="quantity">
              Số lượng
              {selectedBatch && (
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  (tối đa {selectedBatch.remainingQuantity})
                </span>
              )}
            </Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={maxQty === Infinity ? undefined : maxQty}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Nhập số lượng"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || hasNoBatches}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo xuất hủy'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
