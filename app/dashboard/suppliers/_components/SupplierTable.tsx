'use client'

import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: string
}

interface SupplierTableProps {
  suppliers: Supplier[]
}

export function SupplierTable({ suppliers }: SupplierTableProps) {
  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <th className="px-6 py-4 font-semibold w-16">ID</th>
            <th className="px-6 py-4 font-semibold">Tên nhà cung cấp</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold">Số điện thoại</th>
            <th className="px-6 py-4 font-semibold">Địa chỉ</th>
            <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
            <th className="px-6 py-4 font-semibold text-center w-48">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {suppliers.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5 text-gray-600">{s.id}</td>
              <td className="px-6 py-5 font-medium text-gray-900">{s.name}</td>
              <td className="px-6 py-5 text-gray-600 truncate max-w-[200px]">{s.email}</td>
              <td className="px-6 py-5 text-gray-600">{s.phone}</td>
              <td className="px-6 py-5 text-gray-600 truncate max-w-[200px]">{s.address}</td>
              <td className="px-6 py-5 text-center">
                <Badge
                  className={
                    s.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-50 shadow-none font-normal'
                      : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-50 shadow-none font-normal'
                  }
                >
                  {s.status === 'ACTIVE' ? 'Hoạt động' : 'Vô hiệu hóa'}
                </Badge>
              </td>
              <td className="px-6 py-5 text-center">
                <UpdateSupplierModal
                  supplier={s}
                  trigger={
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 gap-1 px-3 bg-blue-600 hover:bg-blue-700 cursor-pointer w-32"
                    >
                      <Pencil className="h-3 w-3" />
                      Cập nhật
                    </Button>
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UpdateSupplierModal({ trigger, supplier }: { trigger: React.ReactNode; supplier: Supplier }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: supplier.name,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    status: supplier.status,
  })

  const onSubmit = async () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 800))

    toast.promise(promise, {
      loading: 'Đang lưu...',
      success: () => {
        setOpen(false)
        return 'Thông tin nhà cung cấp đã được cập nhật.'
      },
      error: () => 'Có lỗi xảy ra.',
    })

    await promise
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật nhà cung cấp</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <Select value={form.status} onValueChange={(value: string) => setForm({ ...form, status: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Kích hoạt</SelectItem>
                  <SelectItem value="LOCKED">Khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4 mt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={onSubmit}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}