'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { type Address } from '@/services/user.service'
import { UpdateAccountModal } from './UpdateAccountModal'
import { ViewAddressesDialog } from './ViewAddressesDialog'

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
