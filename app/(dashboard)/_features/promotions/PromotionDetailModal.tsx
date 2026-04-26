'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { promotionService, type Promotion } from '@/services/promotion.service'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from 'sonner'

interface PromotionDetailModalProps {
  promotionId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PromotionDetailModal({ promotionId, open, onOpenChange }: PromotionDetailModalProps) {
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (promotionId && open) {
      const fetchPromotionDetail = async () => {
        try {
          setIsLoading(true)
          const data = await promotionService.getPromotionById(promotionId)
          setPromotion(data)
        } catch {
          toast.error('Không thể tải chi tiết khuyến mãi')
        } finally {
          setIsLoading(false)
        }
      }
      fetchPromotionDetail()
    }
  }, [promotionId, open])

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết khuyến mãi #{promotionId}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <LoadingSpinner />
        ) : promotion ? (
          <div className="space-y-6">
            {/* Promotion Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Tên khuyến mãi</p>
                <p className="font-medium">{promotion.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mã khuyến mãi</p>
                <Badge variant="outline" className="text-blue-600 border-blue-100 bg-blue-50 font-mono mt-1">
                  {promotion.code}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Giảm giá</p>
                <Badge className="bg-green-50 text-green-600 border-green-100 shadow-none mt-1">
                  {promotion.discountPercent}%
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số lượng</p>
                <p className="font-medium">{promotion.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Đơn hàng tối thiểu</p>
                <p className="font-medium">
                  {promotion.priceOrderActive 
                    ? `${promotion.priceOrderActive.toLocaleString('vi-VN')} đ` 
                    : 'Không giới hạn'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                <p className="font-medium">{formatDate(promotion.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày kết thúc</p>
                <p className="font-medium">{formatDate(promotion.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <div className="mt-1">{getStatusBadge(promotion.status)}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hoạt động</p>
                <div className="mt-1">
                  {promotion.isActive ? (
                    <Badge className="bg-green-50 text-green-600 border-green-100 shadow-none font-normal">
                      Có
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-500 border-red-100 shadow-none font-normal">
                      Không
                    </Badge>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Người tạo</p>
                <p className="font-medium">{promotion.createdByName}</p>
              </div>
              {promotion.approvedByName && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Người duyệt</p>
                  <p className="font-medium">{promotion.approvedByName}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">Không có dữ liệu</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
