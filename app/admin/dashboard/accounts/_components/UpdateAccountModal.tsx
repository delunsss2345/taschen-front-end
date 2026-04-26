'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
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
import { toast } from 'sonner'
import { useUpdateUserMutation } from '@/features/user/hooks'
import type { Account } from './AccountTable'

interface UpdateAccountModalProps {
  trigger: React.ReactNode
  account: Account
  onUpdate?: (updatedAccount: Account) => void
  onRefresh?: () => void
}

export function UpdateAccountModal({
  trigger,
  account,
  onUpdate,
  onRefresh,
}: UpdateAccountModalProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    fullName: account.fullName === '-' ? '' : account.fullName,
    phone: account.phone === '-' ? '' : account.phone,
    role: account.role,
    status: account.status ? 'ACTIVE' : 'INACTIVE',
  })

  const { mutate: updateUser, isPending: saving } = useUpdateUserMutation()

  const onSubmit = () => {
    const nameParts = form.fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined

    const updatePayload: Record<string, unknown> = {}
    if (firstName) updatePayload.firstName = firstName
    if (lastName) updatePayload.lastName = lastName
    if (form.phone) updatePayload.phoneNumber = form.phone
    if (form.role) updatePayload.roles = [form.role]
    if (form.status) updatePayload.active = form.status === 'ACTIVE'

    updateUser(
      { userId: account.id, payload: updatePayload },
      {
        onSuccess: () => {
          const updatedAccount: Account = {
            ...account,
            fullName: form.fullName,
            phone: form.phone,
            role: form.role,
            status: form.status === 'ACTIVE',
          }
          onUpdate?.(updatedAccount)
          onRefresh?.()
          toast.success('Thông tin tài khoản đã được cập nhật.')
          setOpen(false)
        },
        onError: (error: unknown) => {
          const axiosError = error as { response?: { data?: { message?: string } } }
          const errorMessage = axiosError?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản.'
          toast.error(errorMessage)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản: {account.username}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Họ tên</label>
              <Input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Khóa</SelectItem>
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
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
