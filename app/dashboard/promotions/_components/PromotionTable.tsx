'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
            <th className="px-6 py-4 font-semibold w-16">ID</th>
            <th className="px-6 py-4 font-semibold">Tên khuyến mãi</th>
            <th className="px-6 py-4 font-semibold">Mã khuyến mãi</th>
            <th className="px-6 py-4 font-semibold text-center">Giảm giá</th>
            <th className="px-6 py-4 font-semibold text-center">Số lượng</th>
            <th className="px-6 py-4 font-semibold">Đơn tối thiểu</th>
            <th className="px-6 py-4 font-semibold">Ngày bắt đầu</th>
            <th className="px-6 py-4 font-semibold">Ngày kết thúc</th>
            <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
            <th className="px-6 py-4 font-semibold text-center w-32">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {promotions.map((promo) => (
            <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5 text-gray-600">{promo.id}</td>
              <td className="px-6 py-5 font-medium text-gray-900 max-w-[200px] truncate">
                {promo.name}
              </td>
              <td className="px-6 py-5">
                <Badge variant="outline" className="text-blue-600 border-blue-100 bg-blue-50 font-mono">
                  {promo.code}
                </Badge>
              </td>
              <td className="px-6 py-5 text-center">
                <Badge className="bg-green-50 text-green-600 border-green-100 shadow-none">
                  {promo.discount}
                </Badge>
              </td>
              <td className="px-6 py-5 text-center text-gray-600">{promo.quantity}</td>
              <td className="px-6 py-5 text-gray-600 text-xs">{promo.minOrder}</td>
              <td className="px-6 py-5 text-gray-500 text-xs">{promo.startDate}</td>
              <td className="px-6 py-5 text-gray-500 text-xs">{promo.endDate}</td>
              <td className="px-6 py-5 text-center">{getStatusBadge(promo.status)}</td>
              <td className="px-6 py-5 text-center">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 h-8 px-4 cursor-pointer text-[13px]"
                >
                  Xem chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
