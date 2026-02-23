'use client'

import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface PromotionHeaderProps {
  onCreateClick: () => void
  onSearchChange?: (search: string) => void
}

export function PromotionHeader({ onCreateClick, onSearchChange }: PromotionHeaderProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    onSearchChange?.(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Khuyến mãi</h1>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          onClick={onCreateClick}
        >
          <Plus className="h-4 w-4" />
          Tạo khuyến mãi mới
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm theo tên hoặc mã khuyến mãi"
            className="pl-10 h-10 bg-white border-gray-200"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>
    </div>
  )
}
