'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import Swal from 'sweetalert2'

export function AccountHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Tài khoản</h1>
      <CreateAccountModal
        trigger={
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <Plus className="h-4 w-4" />
            Tạo tài khoản nhân viên
          </Button>
        }
      />
    </div>
  )
}

function CreateAccountModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'SELLER_STAFF',
  })

  const onSubmit = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận tạo tài khoản?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Tạo',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      customClass: { container: 'z-[9999]' },
    })

    if (!result.isConfirmed) return

    Swal.fire({
      title: 'Đang xử lý...',
      didOpen: () => Swal.showLoading(),
      customClass: { container: 'z-[9999]' },
    })

    await new Promise((r) => setTimeout(r, 1000))

    Swal.close()
    await Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Tài khoản nhân viên đã được tạo.',
      confirmButtonColor: '#2563eb',
      customClass: { container: 'z-[9999]' },
    })

    setOpen(false)
    setForm({ username: '', email: '', password: '', fullName: '', phone: '', role: 'SELLER_STAFF' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản nhân viên</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên đăng nhập</label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vai trò</label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="SELLER_STAFF">SELLER_STAFF</SelectItem>
                  <SelectItem value="WAREHOUSE_STAFF">WAREHOUSE_STAFF</SelectItem>
                  <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ tên</label>
              <Input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={onSubmit}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
