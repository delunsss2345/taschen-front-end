'use client'

import { Loader2 } from 'lucide-react'
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
import { userService, type Address } from '@/services/user.service'

export interface Account {
  id: number
  username: string
  email: string
  fullName: string
  phone: string
  role: string
  status: boolean
  addresses: Address[]
}

interface AccountTableProps {
  accounts: Account[]
  loading?: boolean
  onUpdate?: (updatedAccount: Account) => void
  onRefresh?: () => void
}

export function AccountTable({ accounts, loading = false, onUpdate, onRefresh }: AccountTableProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none shadow-none">ADMIN</Badge>
      case 'SELLER':
        return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-none shadow-none">SELLER</Badge>
      case 'WAREHOUSE_STAFF':
        return <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none shadow-none">WAREHOUSE_STAFF</Badge>
      case 'USER':
        return <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-none shadow-none">USER</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-50 text-green-600 border-green-100 hover:bg-green-50 shadow-none font-normal">
        Hoạt động
      </Badge>
    ) : (
      <Badge className="bg-red-50 text-red-600 border-red-100 hover:bg-red-50 shadow-none font-normal">
        Khóa
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-64 text-gray-500">
          Không có tài khoản nào
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
            <TableHeaderCell>Tên đăng nhập</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Họ tên</TableHeaderCell>
            <TableHeaderCell className="w-36">Số điện thoại</TableHeaderCell>
            <TableHeaderCell>Vai trò</TableHeaderCell>
            <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
            <TableHeaderCell className="text-center">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {accounts.map((acc) => (
            <TableRow key={acc.id}>
              <TableCell>{acc.id}</TableCell>
              <TableCell>{acc.username}</TableCell>
              <TableCell>{acc.email}</TableCell>
              <TableCell>{acc.fullName}</TableCell>
              <TableCell>{acc.phone}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-2 items-start">
                  {getRoleBadge(acc.role)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(acc.status)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <ViewAddressesDialog
                    account={acc}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 px-3 cursor-pointer"
                      >
                        Xem
                      </Button>
                    }
                  />
                  <UpdateAccountModal
                    account={acc}
                    onUpdate={onUpdate}
                    onRefresh={onRefresh}
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UpdateAccountModal({ 
  trigger, 
  account, 
  onUpdate, 
  onRefresh 
}: { 
  trigger: React.ReactNode; 
  account: Account
  onUpdate?: (updatedAccount: Account) => void
  onRefresh?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    fullName: account.fullName === '-' ? '' : account.fullName,
    phone: account.phone === '-' ? '' : account.phone,
    role: account.role,
    status: account.status ? 'ACTIVE' : 'INACTIVE',
  })

  const onSubmit = async () => {
    setSaving(true)
    
    const nameParts = form.fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined

    const updatePayload: Record<string, unknown> = {}
    
    if (firstName) updatePayload.firstName = firstName
    if (lastName) updatePayload.lastName = lastName
    if (form.phone) updatePayload.phoneNumber = form.phone
    if (form.role) updatePayload.roles = [form.role]
    if (form.status) updatePayload.active = form.status === 'ACTIVE'

    try {
      const result = await userService.updateUser(account.id, updatePayload)

      if (!result) {
        toast.error('Không thể cập nhật tài khoản. Vui lòng thử lại.')
        setSaving(false)
        return
      }

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
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      const errorMessage = axiosError?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản.'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
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

function ViewAddressesDialog({ 
  trigger, 
  account 
}: { 
  trigger: React.ReactNode
  account: Account 
}) {
  const [open, setOpen] = useState(false)
  const addresses = account.addresses || []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Địa chỉ của: {account.fullName}</DialogTitle>
        </DialogHeader>
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Người dùng chưa có địa chỉ nào
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <TableHeaderCell>Loại</TableHeaderCell>
                <TableHeaderCell>Người nhận</TableHeaderCell>
                <TableHeaderCell>Địa chỉ</TableHeaderCell>
                <TableHeaderCell>Điện thoại</TableHeaderCell>
                <TableHeaderCell>Mặc định</TableHeaderCell>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {addresses.map((addr) => (
                <TableRow key={addr.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {addr.addressType === 'HOME' ? 'Nhà riêng' : addr.addressType === 'OFFICE' ? 'Văn phòng' : addr.addressType}
                    </Badge>
                  </TableCell>
                  <TableCell>{addr.recipientName}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                    </div>
                  </TableCell>
                  <TableCell>{addr.phoneNumber}</TableCell>
                  <TableCell>
                    {addr.isDefault && (
                      <Badge className="bg-green-100 text-green-700 border-none shadow-none">
                        Mặc định
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        )}
      </DialogContent>
    </Dialog>
  )
}
