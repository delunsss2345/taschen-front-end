'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'

interface Promotion {
  id: number
  name: string
  code: string
  discount: string
  quantity: number
  minOrder: string
  startDate: string
  endDate: string
  status: string
}

interface PromotionTableProps {
  promotions: Promotion[]
}

export function PromotionTable({ promotions }: PromotionTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-green-100 shadow-none font-normal">
            Đang hoạt động
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge className="bg-orange-50 text-orange-500 hover:bg-orange-50 border-orange-100 shadow-none font-normal">
            Chờ duyệt
          </Badge>
        )
      case 'NOT_STARTED':
        return (
          <Badge className="bg-gray-50 text-gray-500 hover:bg-gray-50 border-gray-200 shadow-none font-normal">
            Chưa bắt đầu
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
            <TableHeaderCell className="w-16">ID</TableHeaderCell>
            <TableHeaderCell>Tên khuyến mãi</TableHeaderCell>
            <TableHeaderCell>Mã khuyến mãi</TableHeaderCell>
            <TableHeaderCell className="text-center">Giảm giá</TableHeaderCell>
            <TableHeaderCell className="text-center">Số lượng</TableHeaderCell>
            <TableHeaderCell>Đơn tối thiểu</TableHeaderCell>
            <TableHeaderCell>Ngày bắt đầu</TableHeaderCell>
            <TableHeaderCell>Ngày kết thúc</TableHeaderCell>
            <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
            <TableHeaderCell className="text-center w-32">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell>{promo.id}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {promo.name}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-blue-600 border-blue-100 bg-blue-50 font-mono">
                  {promo.code}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-green-50 text-green-600 border-green-100 shadow-none">
                  {promo.discount}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{promo.quantity}</TableCell>
              <TableCell>{promo.minOrder}</TableCell>
              <TableCell>{promo.startDate}</TableCell>
              <TableCell>{promo.endDate}</TableCell>
              <TableCell className="text-center">{getStatusBadge(promo.status)}</TableCell>
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
