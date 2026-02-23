'use client'

import { useState } from 'react'
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
import { promotionService, type CreatePromotionData } from '@/services/promotion.service'
import { toast } from 'sonner'

interface CreatePromotionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreatePromotionModal({ open, onOpenChange, onSuccess }: CreatePromotionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePromotionData>({
    name: '',
    code: '',
    discountPercent: 0,
    startDate: '',
    endDate: '',
    quantity: 0,
    priceOrderActive: null,
  })

  const handleChange = (field: keyof CreatePromotionData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    if (!formData.name || !formData.code || !formData.discountPercent || !formData.startDate || !formData.endDate || formData.quantity <= 0) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    // Format dates to ISO string
    const submitData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    }

    const loadingToast = toast.loading('Đang tạo khuyến mãi...', {
      duration: Infinity,
    })

    try {
      setIsLoading(true)
      await promotionService.createPromotion(submitData)
      toast.dismiss(loadingToast)
      toast.success('Tạo khuyến mãi thành công')
      onOpenChange(false)
      onSuccess()
      // Reset form
      setFormData({
        name: '',
        code: '',
        discountPercent: 0,
        startDate: '',
        endDate: '',
        quantity: 0,
        priceOrderActive: null,
      })
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Không thể tạo khuyến mãi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
          <DialogDescription>
            Điền thông tin khuyến mãi bên dưới
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Tên khuyến mãi */}
            <div className="col-span-2">
              <Label htmlFor="name">Tên khuyến mãi *</Label>
              <Input
                id="name"
                placeholder="Giảm giá 40% cho tất cả sách"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="code">Mã khuyến mãi *</Label>
              <Input
                id="code"
                placeholder="SALE40"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="discountPercent">Giảm giá (%) *</Label>
              <Input
                id="discountPercent"
                type="number"
                min="0"
                max="100"
                placeholder="30"
                value={formData.discountPercent || ''}
                onChange={(e) => handleChange('discountPercent', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Số lượng *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="100"
                value={formData.quantity || ''}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="priceOrderActive">Đơn hàng tối thiểu (VNĐ)</Label>
              <Input
                id="priceOrderActive"
                type="number"
                min="0"
                placeholder="100000"
                value={formData.priceOrderActive || ''}
                onChange={(e) => handleChange('priceOrderActive', e.target.value ? parseFloat(e.target.value) : null)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Ngày bắt đầu *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate">Ngày kết thúc *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="mt-1"
              />
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
              {isLoading ? 'Đang tạo...' : 'Tạo khuyến mãi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
