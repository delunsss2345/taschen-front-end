'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useUpdateSupplierMutation } from '@/features/supplier/hooks'
import type { Supplier } from '@/types/response/supplier.response'

interface UpdateSupplierModalProps {
  trigger: React.ReactNode
  supplier: Supplier
  onSuccess?: () => void
}

export function UpdateSupplierModal({
  trigger,
  supplier,
  onSuccess,
}: UpdateSupplierModalProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: supplier.name,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    active: supplier.active,
  })

  const { mutate: updateSupplier, isPending: isSubmitting } = useUpdateSupplierMutation()

  const onSubmit = () => {
    if (!form.name.trim()) return

    updateSupplier(
      { supplierId: supplier.id, payload: form },
      {
        onSuccess: () => {
          toast.success('Thông tin nhà cung cấp đã được cập nhật.')
          setOpen(false)
          onSuccess?.()
        },
        onError: (error: unknown) => {
          const axiosError = error as { response?: { data?: { message?: string } } }
          const errorMessage = axiosError?.response?.data?.message || 'Không thể cập nhật thông tin nhà cung cấp'
          toast.error(errorMessage)
        },
      }
    )
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setForm({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        active: supplier.active,
      })
    }
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Cập nhật nhà cung cấp</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nhập tên nhà cung cấp"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0123456789"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <Select 
                value={form.active ? 'active' : 'inactive'} 
                onValueChange={(value: string) => setForm({ ...form, active: value === 'active' })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4 mt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer" 
            onClick={onSubmit}
            disabled={!form.name.trim() || isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
