'use client'

import { useState, useEffect, useMemo } from 'react'
import { PromotionHeader } from './PromotionHeader'
import { PromotionTabs } from './PromotionTabs'
import { PromotionTable } from './PromotionTable'
import { PromotionDetailModal } from './PromotionDetailModal'
import { CreatePromotionModal } from './CreatePromotionModal'
import { promotionService, type Promotion as PromotionType } from '@/services/promotion.service'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from 'sonner'

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

const TAB_FILTERS: Record<string, string | null> = {
  all: null,
  active: 'ACTIVE',
  pending: 'PENDING',
  approved: 'ACTIVE', // Hiển thị khuyến mãi đang hoạt động (đã duyệt)
  rejected: 'REJECTED',
  deleted: 'DELETED',
}

export function AdminPromotionsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchPromotions = async () => {
    try {
      const data = await promotionService.getAllPromotions()
      
      const mappedPromotions: Promotion[] = data.map((promo: PromotionType) => ({
        id: promo.id,
        name: promo.name,
        code: promo.code,
        discount: `${promo.discountPercent}%`,
        quantity: promo.quantity,
        minOrder: promo.priceOrderActive 
          ? `${promo.priceOrderActive.toLocaleString('vi-VN')} đ` 
          : 'Không giới hạn',
        startDate: new Date(promo.startDate).toLocaleDateString('vi-VN'),
        endDate: new Date(promo.endDate).toLocaleDateString('vi-VN'),
        status: promo.status,
      }))
      
      setPromotions(mappedPromotions)
    } catch (err) {
      console.error('Failed to fetch promotions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  // Filter promotions based on active tab
  const filteredPromotions = useMemo(() => {
    const statusFilter = TAB_FILTERS[activeTab]
    if (!statusFilter) return promotions
    return promotions.filter(promo => promo.status === statusFilter)
  }, [activeTab, promotions])

  // Calculate counts for tabs
  const tabCounts = useMemo(() => {
    const activeCount = promotions.filter(p => p.status === 'ACTIVE').length
    return {
      all: promotions.length,
      active: activeCount,
      pending: promotions.filter(p => p.status === 'PENDING').length,
      approved: activeCount, // Tab Đã duyệt cũng hiển thị ACTIVE
      rejected: promotions.filter(p => p.status === 'REJECTED').length,
      deleted: promotions.filter(p => p.status === 'DELETED').length,
    }
  }, [promotions])

  const handleView = (id: number) => {
    setSelectedPromotionId(id)
    setIsDetailModalOpen(true)
  }

  const handleApprove = async (id: number) => {
    const loadingToast = toast.loading('Đang duyệt khuyến mãi...')
    try {
      await promotionService.approvePromotion(id)
      toast.dismiss(loadingToast)
      toast.success('Duyệt khuyến mãi thành công')
      await fetchPromotions()
    } catch (err) {
      console.error('Failed to approve promotion:', err)
      toast.dismiss(loadingToast)
      toast.error('Không thể duyệt khuyến mãi')
    }
  }

  const handleReject = async (id: number) => {
    const loadingToast = toast.loading('Đang từ chối khuyến mãi...')
    try {
      await promotionService.rejectPromotion(id)
      toast.dismiss(loadingToast)
      toast.success('Từ chối khuyến mãi thành công')
      await fetchPromotions()
    } catch (err) {
      console.error('Failed to reject promotion:', err)
      toast.dismiss(loadingToast)
      toast.error('Không thể từ chối khuyến mãi')
    }
  }

  const handlePause = async (id: number) => {
    const loadingToast = toast.loading('Đang dừng khuyến mãi...')
    try {
      await promotionService.pausePromotion(id)
      toast.dismiss(loadingToast)
      toast.success('Dừng khuyến mãi thành công')
      await fetchPromotions()
    } catch (err) {
      console.error('Failed to pause promotion:', err)
      toast.dismiss(loadingToast)
      toast.error('Không thể dừng khuyến mãi')
    }
  }

  return (
    <div className="space-y-6">
      <PromotionHeader onCreateClick={() => setIsCreateModalOpen(true)} />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <PromotionTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={tabCounts}
        />
        {loading ? (
          <LoadingSpinner/>
        ) : (
          <PromotionTable 
            promotions={filteredPromotions} 
            onView={handleView} 
            onApprove={handleApprove}
            onReject={handleReject}
            onPause={handlePause}
          />
        )}
      </div>
      <PromotionDetailModal 
        promotionId={selectedPromotionId} 
        open={isDetailModalOpen} 
        onOpenChange={setIsDetailModalOpen} 
      />
      <CreatePromotionModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchPromotions}
      />
    </div>
  )
}
