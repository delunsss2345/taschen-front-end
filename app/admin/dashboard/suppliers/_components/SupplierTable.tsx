'use client'

import { Pencil, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { toast } from 'sonner'
import { supplierService } from '@/services/supplier.service'
import type { Supplier } from '@/types/response/supplier.response'

interface SupplierTableProps {
  suppliers: Supplier[]
  isLoading: boolean
  onEditSuccess?: () => void
}

export function SupplierTable({ suppliers, isLoading, onEditSuccess }: SupplierTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
        </div>
      </div>
    )
  }

  if (suppliers.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">Không có nhà cung cấp nào</p>
          <p className="text-sm">Hãy thêm nhà cung cấp mới</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Tên nhà cung cấp</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Số điện thoại</TableHeaderCell>
            <TableHeaderCell>Địa chỉ</TableHeaderCell>
            <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
            <TableHeaderCell className="text-center w-48">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {suppliers.map((s) => (
            <TableRow key={s.id}>
              <TableCell variant="secondary">{s.id}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell className="truncate max-w-[200px]">{s.email}</TableCell>
              <TableCell>{s.phone}</TableCell>
              <TableCell className="truncate max-w-[200px]">{s.address}</TableCell>
              <TableCell className="text-center">
                <Badge
                  className={
                    s.active
                      ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-50 shadow-none font-normal'
                      : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-50 shadow-none font-normal'
                  }
                >
                  {s.active ? 'Hoạt động' : 'Vô hiệu hóa'}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <UpdateSupplierModal
                  supplier={s}
                  onSuccess={onEditSuccess}
                  trigger={
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 gap-1 px-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                      Cập nhật
                    </Button>
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UpdateSupplierModal({ 
  trigger, 
  supplier, 
  onSuccess 
}: { 
  trigger: React.ReactNode; 
  supplier: Supplier;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: supplier.name,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    active: supplier.active,
  })

  const onSubmit = async () => {
    if (!form.name.trim()) return

    const loadingToast = toast.loading('Đang lưu...', {
      duration: Infinity,
    })

    try {
      setIsSubmitting(true)
      await supplierService.updateSupplier(supplier.id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        active: form.active,
      })
      toast.dismiss(loadingToast)
      toast.success('Thông tin nhà cung cấp đã được cập nhật.')
      setOpen(false)
      onSuccess?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể cập nhật thông tin nhà cung cấp')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when closing
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
      <DialogContent className="sm:max-w-[600px]">
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
