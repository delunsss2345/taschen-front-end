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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { purchaseOrderService, type CreatePurchaseOrderRequest } from '@/services/purchase-order.service'
import { supplierService } from '@/services/supplier.service'
import type { Supplier } from '@/types/response/supplier.response'
import { bookService } from '@/services/book.service'
import type { Book } from '@/types/response/book.response'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'

interface CreatePurchaseOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface OrderItem {
  bookId: number
  bookTitle: string
  variantId: number | null
  variantFormat: string
  quantity: number
  importPrice: number
}

export function CreatePurchaseOrderModal({ open, onOpenChange, onSuccess }: CreatePurchaseOrderModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('')
  const [note, setNote] = useState('')
  const [items, setItems] = useState<OrderItem[]>([
    { bookId: 0, bookTitle: '', variantId: null, variantFormat: '', quantity: 1, importPrice: 0 }
  ])

  useEffect(() => {
    const fetchSuppliers = async () => {
      const suppliersData = await supplierService.getAllSuppliers()
      setSuppliers(suppliersData.filter((s: Supplier) => s.active))
    }
    if (open) {
      fetchSuppliers()
    }
  }, [open])

  // Fetch books when supplier is selected
  useEffect(() => {
    const fetchBooksBySupplier = async () => {
      if (selectedSupplierId) {
        const booksData = await bookService.getBooksBySupplier(selectedSupplierId)
        setBooks(booksData.result || [])
      } else {
        setBooks([])
      }
      // Reset items when supplier changes
      setItems([{ bookId: 0, bookTitle: '', variantId: null, variantFormat: '', quantity: 1, importPrice: 0 }])
    }
    fetchBooksBySupplier()
  }, [selectedSupplierId])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedSupplierId('')
      setNote('')
      setBooks([])
      setItems([{ bookId: 0, bookTitle: '', variantId: null, variantFormat: '', quantity: 1, importPrice: 0 }])
    }
  }, [open])

  const handleAddItem = () => {
    setItems([...items, { bookId: 0, bookTitle: '', variantId: null, variantFormat: '', quantity: 1, importPrice: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items]
    if (field === 'bookId') {
      const bookId = Number(value)
      const book = books.find(b => b.id === bookId)
      newItems[index] = {
        ...newItems[index],
        bookId: bookId,
        bookTitle: book?.title || '',
        variantId: null,
        variantFormat: ''
      }
    } else if (field === 'variantId') {
      const book = books.find(b => b.id === newItems[index].bookId)
      const variantFormats = book?.variantFormats || []
      const variantId = Number(value)
      newItems[index] = {
        ...newItems[index],
        variantId: variantId > 0 ? variantId : null,
        variantFormat: variantId > 0 && variantFormats[variantId - 1] ? variantFormats[variantId - 1] : ''
      }
    } else if (field === 'quantity' || field === 'importPrice') {
      newItems[index] = {
        ...newItems[index],
        [field]: Number(value)
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value
      }
    }
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSupplierId) {
      toast.error('Vui lòng chọn nhà cung cấp')
      return
    }

    const validItems = items.filter(item => item.bookId > 0 && item.quantity > 0 && item.importPrice > 0)
    if (validItems.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm')
      return
    }

    const loadingToast = toast.loading('Đang tạo đơn đặt hàng...', {
      duration: Infinity,
    })

    try {
      setIsLoading(true)
      const payload: CreatePurchaseOrderRequest = {
        supplierId: Number(selectedSupplierId),
        note: note || undefined,
        items: validItems.map(item => ({
          bookId: item.bookId,
          variantId: item.variantId || undefined,
          quantity: item.quantity,
          importPrice: item.importPrice
        }))
      }
      await purchaseOrderService.createPurchaseOrder(payload)
      toast.dismiss(loadingToast)
      toast.success('Tạo đơn đặt hàng thành công')
      onOpenChange(false)
      onSuccess()
      // Reset form
      setSelectedSupplierId('')
      setNote('')
      setBooks([])
      setItems([{ bookId: 0, bookTitle: '', variantId: null, variantFormat: '', quantity: 1, importPrice: 0 }])
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Không thể tạo đơn đặt hàng')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1200px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo đơn đặt hàng mới</DialogTitle>
          <DialogDescription>
            Điền thông tin đơn đặt hàng bên dưới
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier">Nhà cung cấp *</Label>
              <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                <SelectTrigger className="mt-1">
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
            <div>
              <Label htmlFor="note">Ghi chú</Label>
              <Input
                id="note"
                placeholder="Đơn hàng nhập sách mới..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Danh sách sản phẩm *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                className="h-8 px-2 cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm sản phẩm
              </Button>
            </div>
            
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <TableRow>
                    <TableHeaderCell className="py-2 w-[25%]">Sách</TableHeaderCell>
                    <TableHeaderCell className="py-2 w-[20%]">Định dạng</TableHeaderCell>
                    <TableHeaderCell className="py-2 w-[15%]">Số lượng</TableHeaderCell>
                    <TableHeaderCell className="py-2 w-[20%]">Giá nhập (VNĐ)</TableHeaderCell>
                    <TableHeaderCell className="py-2 w-[10%]">Thao tác</TableHeaderCell>
                  </TableRow>
                </thead>
                <tbody className="divide-y">
                  {items.map((item, index) => {
                    const selectedBook = books.find(b => b.id === item.bookId)
                    const variantFormats = selectedBook?.variantFormats || []
                    return (
                    <TableRow key={index}>
                      <TableCell className="py-1">
                        <Select 
                          value={item.bookId > 0 ? item.bookId.toString() : ''} 
                          onValueChange={(value) => handleItemChange(index, 'bookId', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Chọn sách" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {books.map((book) => (
                              <SelectItem key={book.id} value={book.id.toString()}>
                                {book.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-1">
                        {item.bookId > 0 && variantFormats.length > 0 ? (
                          <Select 
                            value={item.variantId?.toString() || ''} 
                            onValueChange={(value) => handleItemChange(index, 'variantId', value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Chọn định dạng" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {variantFormats.map((format: string, idx: number) => (
                                <SelectItem key={idx} value={(idx + 1).toString()}>
                                  {format}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            placeholder="Định dạng"
                            value={item.variantFormat || ''}
                            onChange={(e) => handleItemChange(index, 'variantFormat', e.target.value)}
                            className="h-8"
                            disabled={item.bookId === 0}
                          />
                        )}
                      </TableCell>
                      <TableCell className="py-1">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell className="py-1">
                        <Input
                          type="number"
                          min="0"
                          value={item.importPrice}
                          onChange={(e) => handleItemChange(index, 'importPrice', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell className="py-1">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length === 1}
                          className="h-8 px-3 cursor-pointer"
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  )})}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {isLoading ? 'Đang tạo...' : 'Tạo đơn đặt hàng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
