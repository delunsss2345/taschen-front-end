'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
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
import { supplierService } from '@/services/supplier.service'

interface SupplierHeaderProps {
  onSuccess?: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  statusFilter: 'all' | 'active' | 'inactive'
  onStatusChange: (value: 'all' | 'active' | 'inactive') => void
}

export function SupplierHeader({ onSuccess, searchValue, onSearchChange, statusFilter, onStatusChange }: SupplierHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Nhà cung cấp</h1>
        <AddSupplierModal
          onSuccess={onSuccess}
          trigger={
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Plus className="h-4 w-4" />
              Thêm nhà cung cấp
            </Button>
          }
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="pl-10 h-10 bg-white border-gray-200"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => onStatusChange(value)}>
          <SelectTrigger className="w-40 h-10 bg-white border-gray-200 cursor-pointer">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function AddSupplierModal({ trigger, onSuccess }: { trigger: React.ReactNode; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    active: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async () => {
    if (!form.name.trim()) return

    const loadingToast = toast.loading('Đang lưu...', {
      duration: Infinity,
    })

    try {
      setIsSubmitting(true)
      await supplierService.createSupplier({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        active: form.active,
      })
      toast.dismiss(loadingToast)
      toast.success('Nhà cung cấp mới đã được thêm.')
      setOpen(false)
      setForm({ name: '', email: '', phone: '', address: '', active: true })
      onSuccess?.()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Không thể thêm nhà cung cấp')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setForm({ name: '', email: '', phone: '', address: '', active: true })
    }
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
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
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
