'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supplierService } from '@/services/supplier.service'
import type { Supplier } from '@/types/response/supplier.response'
import type { StockRequest } from '@/services/stock-request.service'
import { http } from '@/utils/http'
import { getResponseData, type ApiResponseEnvelope } from '@/services/helpers/response'
import { Textarea } from '@/components/ui/textarea'

interface CreatePurchaseOrderFromStockRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stockRequest: StockRequest | null
  onSuccess: () => void
}

interface PurchaseOrderResponse {
  id: number
  createdAt: string
  approvedAt: string | null
  note: string | null
  cancelReason: string | null
  status: string
  supplierId: number
  supplierName: string
  createdById: number
  createdByName: string
  approvedById: number | null
  approvedByName: string | null
  purchaseOrderItems: {
    id: number
    quantity: number
    importPrice: number
    bookId: number
    bookTitle: string
    variantId: number | null
    variantName: string
  }[]
}

export function CreatePurchaseOrderFromStockRequestModal({
  open,
  onOpenChange,
  stockRequest,
  onSuccess,
}: CreatePurchaseOrderFromStockRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const { currentUser } = useAuthStore()
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('')
  const [importPrice, setImportPrice] = useState<string>('')
  const [note, setNote] = useState('')

  useEffect(() => {
    const fetchSuppliers = async () => {
      const suppliersData = await supplierService.getAllSuppliers()
      setSuppliers(suppliersData.filter((s: Supplier) => s.active))
    }
    if (open) {
      fetchSuppliers()
    }
  }, [open])

  // Reset form when modal opens with new stock request
  useEffect(() => {
    if (stockRequest) {
      setSelectedSupplierId('')
      setImportPrice('')
      setNote('')
    }
  }, [stockRequest, open])

  const handleSubmit = async () => {
    if (!stockRequest || !currentUser) {
      toast.error('Thiếu thông tin yêu cầu nhập kho')
      return
    }

    if (!selectedSupplierId) {
      toast.error('Vui lòng chọn nhà cung cấp')
      return
    }

    const importPriceNum = Number(importPrice)
    if (!importPrice || importPriceNum <= 0) {
      toast.error('Giá nhập phải lớn hơn 0')
      return
    }

    try {
      setIsLoading(true)
      
      const response = await http.post<ApiResponseEnvelope<PurchaseOrderResponse>>(
        'purchase-orders/from-stock-request',
        {
          stockRequestId: stockRequest.id,
          supplierId: Number(selectedSupplierId),
          createdById: currentUser.id,
          importPrice: importPriceNum,
          note: note || undefined,
        }
      )
      
      const result = getResponseData(response)
      
      if (result) {
        toast.success('Tạo đơn nhập hàng thành công')
        onSuccess()
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error creating purchase order:', error)
      toast.error('Không thể tạo đơn nhập hàng')
    } finally {
      setIsLoading(false)
    }
  }

  if (!stockRequest) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo đơn nhập hàng</DialogTitle>
          <DialogDescription>
            Tạo đơn nhập hàng từ yêu cầu nhập kho đã duyệt
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* stockRequestId - Hidden */}
          <input type="hidden" value={stockRequest.id} />

          {/* bookTitle - Read only */}
          <div className="grid gap-2">
            <Label htmlFor="bookTitle">Tên sách</Label>
            <Input
              id="bookTitle"
              value={stockRequest.bookTitle}
              readOnly
              className="bg-gray-50"
            />
          </div>

          {/* variantName - Read only */}
          <div className="grid gap-2">
            <Label htmlFor="variantName">Loại bìa</Label>
            <Input
              id="variantName"
              value={stockRequest.variantName || 'Không có'}
              readOnly
              className="bg-gray-50"
            />
          </div>

          {/* quantity - Read only */}
          <div className="grid gap-2">
            <Label htmlFor="quantity">Số lượng</Label>
            <Input
              id="quantity"
              value={stockRequest.quantity}
              readOnly
              className="bg-gray-50"
            />
          </div>

          {/* supplierId - Dropdown */}
          <div className="grid gap-2">
            <Label htmlFor="supplier">Nhà cung cấp</Label>
            <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhà cung cấp" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* importPrice - Input number */}
          <div className="grid gap-2">
            <Label htmlFor="importPrice">Giá nhập (VNĐ)</Label>
            <Input
              id="importPrice"
              type="number"
              min="0"
              value={importPrice}
              onChange={(e) => setImportPrice(e.target.value)}
              placeholder="Nhập giá nhập"
            />
          </div>

          {/* note - Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="note">Ghi chú (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú (nếu có)"
              rows={3}
            />
          </div>

          {/* createdById - Hidden */}
          <input type="hidden" value={currentUser?.id || ''} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Đang tạo...' : 'Tạo đơn nhập'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
