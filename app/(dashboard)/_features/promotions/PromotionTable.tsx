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
  onView?: (id: number) => void
  onApprove?: (id: number) => void
  onReject?: (id: number) => void
  onPause?: (id: number) => void
  onResume?: (id: number) => void
}

export function PromotionTable({ promotions, onView, onApprove, onReject, onPause, onResume }: PromotionTableProps) {
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
      case 'APPROVED':
        return (
          <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100 shadow-none font-normal">
            Đã duyệt
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-red-50 text-red-500 hover:bg-red-50 border-red-100 shadow-none font-normal">
            Đã từ chối
          </Badge>
        )
      case 'DELETED':
        return (
          <Badge className="bg-gray-50 text-gray-400 hover:bg-gray-50 border-gray-200 shadow-none font-normal">
            Đã dừng
          </Badge>
        )
      case 'PAUSED':
        return (
          <Badge className="bg-orange-50 text-orange-500 hover:bg-orange-50 border-orange-100 shadow-none font-normal">
            Đã tạm dừng
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

  if (promotions.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        Không có khuyến mãi nào
      </div>
    )
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
            <TableHeaderCell className="text-center w-[240px]">Thao tác</TableHeaderCell>
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
                <div className="flex items-center justify-center gap-1 min-w-[230px]">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 h-8 px-2 cursor-pointer text-[13px] w-[55px]"
                    onClick={() => onView?.(promo.id)}
                  >
                    Xem
                  </Button>
                  {promo.status === 'PENDING' && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-8 px-2 cursor-pointer text-[13px] w-[55px]"
                        onClick={() => onApprove?.(promo.id)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 h-8 px-2 cursor-pointer text-[13px] w-[65px]"
                        onClick={() => onReject?.(promo.id)}
                      >
                        Từ chối
                      </Button>
                    </>
                  )}
                  {promo.status === 'ACTIVE' && (
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 h-8 px-2 cursor-pointer text-[13px] w-[55px]"
                      onClick={() => onPause?.(promo.id)}
                    >
                      Dừng
                    </Button>
                  )}
                  {promo.status === 'PAUSED' && (
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 h-8 px-2 cursor-pointer text-[13px] w-[65px]"
                      onClick={() => onResume?.(promo.id)}
                    >
                      Tiếp tục
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}
