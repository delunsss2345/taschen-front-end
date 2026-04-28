'use client'

import { useEffect, useState } from 'react'
import { BannerHeader } from './BannerHeader'
import { BannerTable } from './BannerTable'
import { bannerService } from '@/services/banner.service'
import type { Banner } from '@/types/response/banner.response'
import { toast } from 'sonner'

export function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const data = await bannerService.getAllBanners()
      setBanners(data)
    } catch {
      toast.error('Không thể tải danh sách banner')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleAddSuccess = () => {
    fetchBanners()
  }
  const handleEditSuccess = () => {
    fetchBanners()
  }
  const handleDeleteSuccess = () => {
    fetchBanners()
  }

  return (
    <div className="space-y-4">
      <BannerHeader onSuccess={handleAddSuccess} />
      <BannerTable
        banners={banners}
        isLoading={isLoading}
        onEditSuccess={handleEditSuccess}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
