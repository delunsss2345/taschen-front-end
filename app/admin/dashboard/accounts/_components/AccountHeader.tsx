'use client'

import { Plus, Search, Loader2 } from 'lucide-react'
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
import { toast } from 'sonner'
import { userService } from '@/services/user.service'

interface AccountHeaderProps {
  onRefresh?: () => void
  onSearch?: (term: string) => void
  searchTerm?: string
}

export function AccountHeader({ onRefresh, onSearch, searchTerm = '' }: AccountHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Tài khoản</h1>
        <CreateAccountModal onSuccess={onRefresh}>
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <Plus className="h-4 w-4" />
            Tạo tài khoản nhân viên
          </Button>
        </CreateAccountModal>
      </div>

      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm theo tên đăng nhập hoặc email"
          className="pl-10 h-10 bg-white border-gray-200"
          value={searchTerm}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </div>
  )
}

function CreateAccountModal({ 
  children, 
  onSuccess 
}: { 
  children: React.ReactNode
  onSuccess?: () => void 
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'USER',
  })

  const onSubmit = async () => {
    if (!form.email || !form.password || !form.firstName) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
      return
    }

    const loadingToast = toast.loading('Đang tạo tài khoản...', {
      duration: Infinity,
    })

    setSaving(true)
    try {
      const result = await userService.createUser({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName || undefined,
        phoneNumber: form.phone || undefined,
      })

      if (!result) {
        toast.dismiss(loadingToast)
        toast.error('Không thể tạo tài khoản. Vui lòng thử lại.')
        return
      }

      toast.dismiss(loadingToast)
      toast.success('Tài khoản đã được tạo thành công.')
      setOpen(false)
      setForm({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'USER' })
      onSuccess?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Có lỗi xảy ra khi tạo tài khoản.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản nhân viên</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Họ <span className="text-red-500">*</span></label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Nhập họ"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên</label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Nhập tên"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Nhập email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mật khẩu <span className="text-red-500">*</span></label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div className="grid grid-cols-2 gap-">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vai trò</label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value })}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="SELLER">SELLER</SelectItem>
                  <SelectItem value="WAREHOUSE_STAFF">WAREHOUSE_STAFF</SelectItem>
                  <SelectItem value="USER">USER</SelectItem>
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
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
