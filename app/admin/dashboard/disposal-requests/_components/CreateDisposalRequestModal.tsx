'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { disposalRequestService } from '@/services/disposal-request.service'
import { batchService, type Batch } from '@/services/batch.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

interface DisposalItem {
  batchId: string
  quantity: string
}

interface CreateDisposalRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateDisposalRequestModal({ open, onOpenChange, onSuccess }: CreateDisposalRequestModalProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoadingBatches, setIsLoadingBatches] = useState(false)
  const [reason, setReason] = useState('')
  const [items, setItems] = useState<DisposalItem[]>([{ batchId: '', quantity: '' }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setReason('')
      setItems([{ batchId: '', quantity: '' }])
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setIsLoadingBatches(true)
      batchService.getAllBatches()
        .then(setBatches)
        .catch(() => toast.error('Không thể tải danh sách lô hàng'))
        .finally(() => setIsLoadingBatches(false))
    }
  }, [open])

  const addItem = () => {
    setItems((prev) => [...prev, { batchId: '', quantity: '' }])
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof DisposalItem, value: string) => {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  const getSelectedBatch = (batchId: string) =>
    batches.find((b) => b.id.toString() === batchId)

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do xuất hủy')
      return
    }
    if (items.length === 0) {
      toast.error('Vui lòng thêm ít nhất một lô hàng')
      return
    }
    for (const item of items) {
      if (!item.batchId) {
        toast.error('Vui lòng chọn lô hàng cho tất cả các dòng')
        return
      }
      const qty = Number(item.quantity)
      if (!item.quantity || qty <= 0) {
        toast.error('Số lượng phải lớn hơn 0')
        return
      }
      const batch = getSelectedBatch(item.batchId)
      if (batch && qty > batch.remainingQuantity) {
        toast.error(`Số lượng xuất hủy vượt quá tồn kho của lô ${batch.batchCode} (còn ${batch.remainingQuantity})`)
        return
      }
    }

    setIsSubmitting(true)
    try {
      await disposalRequestService.createDisposalRequest({
        reason: reason.trim(),
        items: items.map((item) => ({
          batchId: Number(item.batchId),
          quantity: Number(item.quantity),
        })),
      })
      toast.success('Tạo yêu cầu xuất hủy thành công', { duration: 4000 })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      const err = error as { response?: { data?: { message?: string; error?: string } } }
      toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Tạo yêu cầu thất bại', { duration: 4000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  const usedBatchIds = items.map((i) => i.batchId).filter(Boolean)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu xuất hủy</DialogTitle>
          <DialogDescription>
            Tạo yêu cầu xuất hủy lô hàng để chờ admin duyệt
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Reason */}
          <div className="grid gap-2">
            <Label htmlFor="reason">Lý do xuất hủy</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do xuất hủy..."
            />
          </div>

          {/* Items */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Danh sách lô hàng</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 gap-1 cursor-pointer"
                onClick={addItem}
              >
                <Plus className="h-3.5 w-3.5" />
                Thêm lô
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Lô hàng</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 w-28">Tồn kho</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500 w-32">SL xuất hủy</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => {
                    const batch = getSelectedBatch(item.batchId)
                    return (
                      <tr key={index}>
                        <td className="py-2 px-3">
                          <Select
                            value={item.batchId}
                            onValueChange={(val) => updateItem(index, 'batchId', val)}
                            disabled={isLoadingBatches}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder={isLoadingBatches ? 'Đang tải...' : 'Chọn lô hàng'} />
                            </SelectTrigger>
                            <SelectContent>
                              {batches
                                .filter((b) => b.remainingQuantity > 0 && (!usedBatchIds.includes(b.id.toString()) || b.id.toString() === item.batchId))
                                .map((b) => (
                                  <SelectItem key={b.id} value={b.id.toString()}>
                                    {b.batchCode} — {b.bookTitle}
                                    {b.variant ? ` (${b.variant.formatName})` : ''}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 px-3 text-center text-gray-500 text-sm">
                          {batch ? batch.remainingQuantity : '—'}
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            min="1"
                            max={batch?.remainingQuantity}
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            placeholder="0"
                            className="h-9 text-center"
                          />
                        </td>
                        <td className="py-2 px-3">
                          {items.length > 1 && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-gray-400 hover:text-red-500 cursor-pointer"
                              onClick={() => removeItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo yêu cầu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
