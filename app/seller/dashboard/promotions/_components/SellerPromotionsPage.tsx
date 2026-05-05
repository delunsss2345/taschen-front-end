'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { PromotionHeader } from './PromotionHeader'
import { PromotionTabs } from './PromotionTabs'
import { PromotionTable } from './PromotionTable'
import { CreatePromotionModal } from './CreatePromotionModal'
import { PromotionDetailModal } from '@/app/admin/dashboard/promotions/_components/PromotionDetailModal'
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
  rejected: 'REJECTED',
  paused: 'PAUSED',
}

export function SellerPromotionsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedPromotionId, setSelectedPromotionId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await promotionService.getAllPromotions()

      const mapped: Promotion[] = data.map((promo: PromotionType) => ({
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

      setPromotions(mapped)
    } catch {
      toast.error('Không thể tải danh sách khuyến mãi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPromotions()
  }, [fetchPromotions])

  const filteredPromotions = useMemo(() => {
    const statusFilter = TAB_FILTERS[activeTab]

    let filtered = promotions

    if (statusFilter) {
      filtered = filtered.filter((p) => p.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.code.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [activeTab, promotions, searchQuery])

  const tabCounts = useMemo(() => {
    return {
      all: promotions.length,
      active: promotions.filter((p) => p.status === 'ACTIVE').length,
      pending: promotions.filter((p) => p.status === 'PENDING').length,
      rejected: promotions.filter((p) => p.status === 'REJECTED').length,
      paused: promotions.filter((p) => p.status === 'PAUSED').length,
    }
  }, [promotions])

  const handleViewClick = (id: number) => {
    setSelectedPromotionId(id)
    setIsDetailModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <PromotionHeader
        onCreateClick={() => setIsCreateModalOpen(true)}
        onSearchChange={setSearchQuery}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <PromotionTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
        />
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <PromotionTable promotions={filteredPromotions} onViewClick={handleViewClick} />
        )}
      </div>
      <CreatePromotionModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchPromotions}
      />
      <PromotionDetailModal
        promotionId={selectedPromotionId}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
    </div>
  )
}
