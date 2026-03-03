'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth'
import { stockRequestService } from '@/services/stock-request.service'
import { bookService } from '@/services/book.service'
import { bookVariantService, type VariantOption } from '@/services/bookVariant.service'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

type BookOption = {
  id: number
  title: string
}

interface CreateStockRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateStockRequestModal({ open, onOpenChange, onSuccess }: CreateStockRequestModalProps) {
  const { currentUser } = useAuthStore()
  
  const [books, setBooks] = useState<BookOption[]>([])
  const [selectedBookId, setSelectedBookId] = useState<string>('')
  const [variants, setVariants] = useState<VariantOption[]>([])
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedBookId('')
      setVariants([])
      setSelectedVariantId('')
      setQuantity('')
      setReason('')
    }
  }, [open])

  // Fetch books when modal opens
  useEffect(() => {
    if (open) {
      fetchBooks()
    }
  }, [open])

  // Fetch variants when book is selected
  useEffect(() => {
    if (selectedBookId) {
      fetchVariants(Number(selectedBookId))
    } else {
      setVariants([])
      setSelectedVariantId('')
    }
  }, [selectedBookId])

  const fetchBooks = async () => {
    setIsLoadingBooks(true)
    try {
      const data = await bookService.getAllBooks({ page: 1, pageSize: 1000 })
      setBooks(data.result || [])
    } catch (error) {
      console.error('Failed to fetch books:', error)
      toast.error('Không thể tải danh sách sách')
    } finally {
      setIsLoadingBooks(false)
    }
  }

  const fetchVariants = async (bookId: number) => {
    try {
      const variantList = await bookVariantService.getVariantsByBookId(bookId)
      setVariants(variantList)
    } catch (error) {
      console.error('Failed to fetch variants:', error)
      setVariants([])
    }
  }

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập')
      return
    }

    if (!selectedBookId) {
      toast.error('Vui lòng chọn sách')
      return
    }

    const quantityNum = Number(quantity)
    if (!quantity || quantityNum <= 0) {
      toast.error('Số lượng phải lớn hơn 0')
      return
    }

    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do')
      return
    }

    try {
      setIsLoading(true)
      await stockRequestService.create({
        bookId: Number(selectedBookId),
        quantity: quantityNum,
        reason: reason.trim(),
        createdById: currentUser.id,
        variantId: selectedVariantId ? Number(selectedVariantId) : undefined
      })
      
      toast.success('Tạo yêu cầu nhập kho thành công')
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      const err = error as { response?: { data?: { message?: string; error?: string } } }
      toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Tạo yêu cầu thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg font-sans">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu nhập kho</DialogTitle>
          <DialogDescription>
            Tạo yêu cầu nhập hàng mới
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Book Selection */}
          <div className="grid gap-2">
            <Label htmlFor="book">Sách</Label>
            <Select 
              value={selectedBookId} 
              onValueChange={setSelectedBookId}
              disabled={isLoadingBooks}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingBooks ? "Đang tải..." : "Chọn sách"} />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id.toString()}>
                    {book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Variant Selection */}
          <div className="grid gap-2">
            <Label htmlFor="variant">Định dạng (tùy chọn)</Label>
            <Select 
              value={selectedVariantId} 
              onValueChange={setSelectedVariantId}
              disabled={!selectedBookId || variants.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={!selectedBookId ? "Chọn sách trước" : variants.length === 0 ? "Sách không có định dạng" : "Chọn định dạng"} />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant) => (
                  <SelectItem key={variant.variantId} value={variant.variantId.toString()}>
                    {variant.variantFormatName || `Định dạng ${variant.variantId}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="grid gap-2">
            <Label htmlFor="quantity">Số lượng</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Nhập số lượng"
            />
          </div>

          {/* Reason */}
          <div className="grid gap-2">
            <Label htmlFor="reason">Lý do</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do nhập kho"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? 'Đang tạo...' : 'Tạo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
