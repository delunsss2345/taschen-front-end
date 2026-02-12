'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'

interface Customer {
  id: number
  username: string
  email: string
  fullName: string
  phone: string
  totalOrders: number
  totalSpent: number
  status: string
  joinDate: string
}

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className="bg-green-50 text-green-600 border-green-100 hover:bg-green-50 shadow-none font-normal">
            Hoạt động
          </Badge>
        )
      case 'LOCKED':
        return (
          <Badge className="bg-red-50 text-red-600 border-red-100 hover:bg-red-50 shadow-none font-normal">
            Khóa
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell className="w-16">ID</TableHeaderCell>
            <TableHeaderCell>Tên đăng nhập</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Họ tên</TableHeaderCell>
            <TableHeaderCell>Số điện thoại</TableHeaderCell>
            <TableHeaderCell className="text-center">Tổng đơn</TableHeaderCell>
            <TableHeaderCell className="text-right">Tổng chi tiêu</TableHeaderCell>
            <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
            <TableHeaderCell>Ngày tham gia</TableHeaderCell>
            <TableHeaderCell className="text-center w-32">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell variant="primary">{customer.id}</TableCell>
              <TableCell>{customer.username}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.fullName}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell className="text-center">{customer.totalOrders}</TableCell>
              <TableCell className="text-right text-red-500">
                {customer.totalSpent.toLocaleString('vi-VN')} đ
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(customer.status)}
              </TableCell>
              <TableCell>{customer.joinDate}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}
