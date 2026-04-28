'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BannerFormModal } from './BannerFormModal'

interface BannerHeaderProps {
  banners?: { id: number; name: string; imageUrl: string }[]
  onSuccess?: () => void
}

export function BannerHeader({ onSuccess }: BannerHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Banner</h1>
        <BannerFormModal
          onSuccess={onSuccess}
          trigger={
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Plus className="h-4 w-4" />
              Thêm Banner mới
            </Button>
          }
        />
      </div>

      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm theo tên banner"
          className="pl-10 h-10 bg-white border-gray-200"
        />
      </div>
    </div>
  )
}
