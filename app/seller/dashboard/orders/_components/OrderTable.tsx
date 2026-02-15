'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'

interface Order {
  id: string
  customer: string
  date: string
  total: number
  status: string
}

interface OrderTableProps {
  orders: Order[]
}

export function OrderTable({ orders }: OrderTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CANCELLED':
        return (
          <Badge className="bg-red-50 text-red-500 hover:bg-red-50 border-red-100 shadow-none font-normal">
            Đã hủy
          </Badge>
        )
      case 'UNPAID':
        return (
          <Badge className="bg-gray-50 text-gray-500 hover:bg-gray-50 border-gray-200 shadow-none font-normal">
            Chưa thanh toán
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge className="bg-orange-50 text-orange-500 hover:bg-orange-50 border-orange-100 shadow-none font-normal">
            Chờ xác nhận
          </Badge>
        )
      case 'COMPLETED':
        return (
          <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-green-100 shadow-none font-normal">
            Đã hoàn thành
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="w-full overflow-x-auto text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell className="w-24">Mã đơn</TableHeaderCell>
            <TableHeaderCell>Khách hàng</TableHeaderCell>
            <TableHeaderCell>Ngày đặt</TableHeaderCell>
            <TableHeaderCell>Tổng tiền</TableHeaderCell>
            <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
            <TableHeaderCell className="text-center w-32">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell className="truncate max-w-[200px]">
                {order.customer}
              </TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell className="text-red-500">
                {order.total.toLocaleString('vi-VN')} đ
              </TableCell>
              <TableCell className="text-center">{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 h-8 px-4 cursor-pointer text-[13px]"
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
