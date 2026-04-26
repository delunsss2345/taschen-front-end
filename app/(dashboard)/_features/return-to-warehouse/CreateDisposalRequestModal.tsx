'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { Plus, Trash2, Package } from 'lucide-react'
import { toast } from 'sonner'
import { batchService, type Batch } from '@/services/batch.service'
import { disposalRequestService, type CreateDisposalRequestRequest } from '@/services/disposal-request.service'

interface CreateDisposalRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface SelectedBatch {
  batch: Batch
  quantity: number
}

export function CreateDisposalRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateDisposalRequestModalProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoadingBatches, setIsLoadingBatches] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState<string>('')
  const [selectedBatches, setSelectedBatches] = useState<SelectedBatch[]>([])
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quantityError, setQuantityError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchBatches()
    }
  }, [isOpen])

  const fetchBatches = async () => {
    setIsLoadingBatches(true)
    try {
      const data = await batchService.getAllBatches()
      setBatches(data.filter(b => b.remainingQuantity > 0))
    } catch {
      // Silent fail - handled gracefully
    } finally {
      setIsLoadingBatches(false)
    }
  }

  const handleAddBatch = () => {
    if (!selectedBatchId) {
      toast.warning('Vui lòng chọn lô hàng')
      return
    }

    const batch = batches.find(b => b.id === Number(selectedBatchId))
    if (!batch) return

    // Check if batch already selected
    if (selectedBatches.some(sb => sb.batch.id === batch.id)) {
      toast.warning('Lô hàng đã được chọn')
      return
    }

    setSelectedBatches([...selectedBatches, { batch, quantity: 1 }])
    setSelectedBatchId('')
  }

  const handleRemoveBatch = (batchId: number) => {
    setSelectedBatches(selectedBatches.filter(sb => sb.batch.id !== batchId))
  }

  const handleQuantityChange = (batchId: number, value: number) => {
    const batch = batches.find(b => b.id === batchId)
    if (!batch) return

    if (value > batch.remainingQuantity) {
      setQuantityError(`Số lượng không được vượt quá ${batch.remainingQuantity}`)
    } else if (value < 1) {
      setQuantityError('Số lượng phải lớn hơn 0')
    } else {
      setQuantityError('')
    }

    setSelectedBatches(
      selectedBatches.map(sb =>
        sb.batch.id === batchId ? { ...sb, quantity: value } : sb
      )
    )
  }

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.warning('Vui lòng nhập lý do')
      return
    }

    if (selectedBatches.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một lô hàng')
      return
    }

    if (quantityError) {
      toast.warning('Số lượng không hợp lệ')
      return
    }

    setIsSubmitting(true)
    try {
      const payload: CreateDisposalRequestRequest = {
        reason: reason.trim(),
        items: selectedBatches.map(sb => ({
          batchId: sb.batch.id,
          quantity: sb.quantity,
        })),
      }

      await disposalRequestService.createDisposalRequest(payload)
      toast.success('Tạo yêu cầu thành công')
      handleClose()
      onSuccess?.()
    } catch {
      toast.error('Không thể tạo yêu cầu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setReason('')
    setSelectedBatches([])
    setSelectedBatchId('')
    setQuantityError('')
    onClose()
  }

  const getTotalQuantity = () => {
    return selectedBatches.reduce((sum, sb) => sum + sb.quantity, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Tạo yêu cầu trả hàng về kho
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Lý do */}
          <div>
            <Label htmlFor="reason" className="text-sm font-medium">
              Lý do <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="reason"
              className="w-full min-h-[80px] px-3 py-2 mt-1 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Nhập lý do trả hàng về kho..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Chọn lô hàng */}
          <div>
            <Label className="text-sm font-medium">
              Chọn lô hàng <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 mt-1">
              <select
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                disabled={isLoadingBatches}
              >
                <option value="">-- Chọn lô hàng --</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.batchCode} - {batch.bookTitle} (Còn: {batch.remainingQuantity})
                  </option>
                ))}
              </select>
              <Button
                variant="default"
                onClick={handleAddBatch}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                disabled={isLoadingBatches || !selectedBatchId}
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
          </div>

          {/* Danh sách lô hàng đã chọn */}
          {selectedBatches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Danh sách lô hàng đã chọn</h4>
                <span className="text-sm text-muted-foreground">
                  Tổng: {getTotalQuantity()} sản phẩm
                </span>
              </div>
              <div className="rounded-md border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <TableHeaderCell className="text-center w-12">STT</TableHeaderCell>
                      <TableHeaderCell>Mã lô</TableHeaderCell>
                      <TableHeaderCell>Tên sách</TableHeaderCell>
                      <TableHeaderCell>Định dạng</TableHeaderCell>
                      <TableHeaderCell className="text-right">Tồn kho</TableHeaderCell>
                      <TableHeaderCell className="text-right w-24">Số lượng</TableHeaderCell>
                      <TableHeaderCell className="w-12">&nbsp;</TableHeaderCell>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {selectedBatches.map((sb, index) => (
                      <TableRow key={sb.batch.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell className="font-medium">{sb.batch.batchCode}</TableCell>
                        <TableCell>{sb.batch.bookTitle}</TableCell>
                        <TableCell>{sb.batch.variant?.formatName || '-'}</TableCell>
                        <TableCell className="text-right">{sb.batch.remainingQuantity}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min={1}
                            max={sb.batch.remainingQuantity}
                            value={sb.quantity}
                            onChange={(e) => handleQuantityChange(sb.batch.id, parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBatch(sb.batch.id)}
                            className="h-8 w-8 p-0 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </table>
              </div>
              {quantityError && (
                <p className="text-sm text-red-500 mt-1">{quantityError}</p>
              )}
            </div>
          )}

          {selectedBatches.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có lô hàng nào được chọn</p>
              <p className="text-sm">Hãy chọn lô hàng từ danh sách trên</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedBatches.length === 0 || !!quantityError}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo yêu cầu'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
