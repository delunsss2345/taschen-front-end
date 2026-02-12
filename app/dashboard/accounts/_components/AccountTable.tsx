'use client'

import { Pencil } from 'lucide-react'
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

interface Account {
  id: number
  username: string
  email: string
  fullName: string
  phone: string
  role: string
  status: boolean
}

interface AccountTableProps {
  accounts: Account[]
}

export function AccountTable({ accounts }: AccountTableProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none shadow-none">ADMIN</Badge>
      case 'SELLER_STAFF':
        return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-none shadow-none">SELLER_STAFF</Badge>
      case 'WAREHOUSE_STAFF':
        return <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none shadow-none">WAREHOUSE_STAFF</Badge>
      case 'CUSTOMER':
        return <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-none shadow-none">CUSTOMER</Badge>
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

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Tên đăng nhập</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Họ tên</TableHeaderCell>
            <TableHeaderCell>Số điện thoại</TableHeaderCell>
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
                  <UpdateAccountModal
                    account={acc}
                    trigger={
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 gap-1 px-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
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

function UpdateAccountModal({ trigger, account }: { trigger: React.ReactNode; account: Account }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    fullName: account.fullName === '-' ? '' : account.fullName,
    phone: account.phone === '-' ? '' : account.phone,
    role: account.role,
    status: account.status ? 'ACTIVE' : 'INACTIVE',
  })

  const onSubmit = async () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 800))

    toast.promise(promise, {
      loading: 'Đang lưu...',
      success: () => {
        setOpen(false)
        return 'Thông tin tài khoản đã được cập nhật.'
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
                  <SelectItem value="SELLER_STAFF">SELLER_STAFF</SelectItem>
                  <SelectItem value="WAREHOUSE_STAFF">WAREHOUSE_STAFF</SelectItem>
                  <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
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
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={onSubmit}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
