'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { batchService, type CreateBatchRequest } from '@/services/batch.service'
import { bookService } from '@/services/book.service'
import type { Book } from '@/types/response/book.response'
import { bookVariantService, type BookVariant } from '@/services/bookVariant.service'
import { supplierService } from '@/services/supplier.service'
import type { Supplier } from '@/types/response/supplier.response'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { toast } from 'sonner'

interface AddBatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface FormData {
  bookId: string
  variantId: string
  quantity: string
  importPrice: string
  sellingPrice: string
  productionDate: string
  supplierId: string
}

interface BookWithVariants extends Book {
  _variantId?: number
}

export function AddBatchDialog({ open, onOpenChange, onSuccess }: AddBatchDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [books, setBooks] = useState<BookWithVariants[]>([])
  const [variants, setVariants] = useState<BookVariant[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoadingBooks, setIsLoadingBooks] = useState(false)
  const [isLoadingVariants, setIsLoadingVariants] = useState(false)
  
  const { currentUser } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const selectedBookId = watch('bookId')

  // Find selected book to get basic info
  const selectedBook = books.find(b => b.id === Number(selectedBookId))

  useEffect(() => {
    if (open) {
      loadBooks()
      loadSuppliers()
      reset()
      setVariants([])
    }
  }, [open])

  // Load variants when book is selected
  useEffect(() => {
    if (selectedBookId && selectedBookId !== 'all') {
      loadVariants(Number(selectedBookId))
    } else {
      setVariants([])
    }
  }, [selectedBookId])

  const loadBooks = async () => {
    setIsLoadingBooks(true)
    try {
      const data = await bookService.getAllBooks({ pageSize: 1000 })
      setBooks(data.result)
    } catch {
      toast.error('Không thể tải danh sách sách')
    } finally {
      setIsLoadingBooks(false)
    }
  }

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getAllSuppliers()
      setSuppliers(data)
    } catch {
      // Ignore error
    }
  }

  const loadVariants = async (bookId: number) => {
    setIsLoadingVariants(true)
    try {
      const data = await bookVariantService.getVariantsByBookId(bookId)
      console.log('Variants loaded:', JSON.stringify(data, null, 2))
      setVariants(data)
    } catch {
      setVariants([])
    } finally {
      setIsLoadingVariants(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!currentUser?.id) {
      toast.error('Không tìm thấy thông tin người dùng')
      return
    }

    setIsSubmitting(true)
    try {
      const variantIdValue = data.variantId && data.variantId !== 'none' ? Number(data.variantId) : null
      console.log('Submitting variantId:', data.variantId, '->', variantIdValue)
      
      const payload: CreateBatchRequest = {
        bookId: Number(data.bookId),
        variantId: variantIdValue,
        createdById: currentUser.id,
        quantity: Number(data.quantity),
        importPrice: Number(data.importPrice),
        sellingPrice: data.sellingPrice ? Number(data.sellingPrice) : null,
        productionDate: data.productionDate,
        supplierId: Number(data.supplierId),
      }
      
      await batchService.createBatch(payload)
      onSuccess()
    } catch {
      toast.error('Thêm lô hàng thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm lô hàng mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookId">Sách *</Label>
              <Select
                onValueChange={(value) => setValue('bookId', value)}
                defaultValue={watch('bookId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingBooks ? "Đang tải..." : "Chọn sách"} />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={String(book.id)}>
                      {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('bookId', { required: 'Vui lòng chọn sách' })} />
              {errors.bookId && (
                <p className="text-sm text-red-500">{errors.bookId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="variantId">Định dạng</Label>
              <Select
                onValueChange={(value) => setValue('variantId', value)}
                defaultValue={watch('variantId')}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingVariants ? "Đang tải..." : (watch('variantId') && watch('variantId') !== 'none') ? variants.find(v => String(v.variantId) === watch('variantId'))?.variantFormatName || "Định dạng" : "Chọn định dạng"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có</SelectItem>
                  {variants.map((variant) => (
                    <SelectItem key={variant.variantId} value={String(variant.variantId)}>
                      {variant.variantFormatName || variant.variantFormatCode || `Variant ${variant.variantId}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register('variantId')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Nhập số lượng"
                {...register('quantity', { 
                  required: 'Vui lòng nhập số lượng',
                  min: { value: 1, message: 'Số lượng phải lớn hơn 0' }
                })}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="importPrice">Giá nhập *</Label>
              <Input
                id="importPrice"
                type="number"
                min="0"
                placeholder="Giá nhập"
                {...register('importPrice', { 
                  required: 'Vui lòng nhập giá nhập',
                  min: { value: 0, message: 'Giá nhập phải lớn hơn hoặc bằng 0' }
                })}
              />
              {errors.importPrice && (
                <p className="text-sm text-red-500">{errors.importPrice.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Giá bán (không bắt buộc)</Label>
              <Input
                id="sellingPrice"
                type="number"
                min="0"
                placeholder="Giá bán"
                {...register('sellingPrice', {
                  min: { value: 0, message: 'Giá bán phải lớn hơn hoặc bằng 0' }
                })}
              />
              {errors.sellingPrice && (
                <p className="text-sm text-red-500">{errors.sellingPrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="productionDate">Ngày sản xuất *</Label>
              <Input
                id="productionDate"
                type="date"
                {...register('productionDate', { required: 'Vui lòng chọn ngày sản xuất' })}
              />
              {errors.productionDate && (
                <p className="text-sm text-red-500">{errors.productionDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierId">Nhà cung cấp *</Label>
            <Select
              value={watch('supplierId')}
              onValueChange={(value) => setValue('supplierId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhà cung cấp" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={String(supplier.id)}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('supplierId', { required: 'Vui lòng chọn nhà cung cấp' })} />
            {errors.supplierId && (
              <p className="text-sm text-red-500">{errors.supplierId.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Thêm lô hàng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
