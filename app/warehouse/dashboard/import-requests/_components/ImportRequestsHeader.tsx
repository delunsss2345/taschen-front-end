'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'

interface ImportRequestsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  title?: string
  showCreateButton?: boolean
}

export function ImportRequestsHeader({ searchQuery, onSearchChange, title, showCreateButton = false }: ImportRequestsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title || 'Yêu cầu Nhập kho'}</h1>
        {showCreateButton && (
          <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white gap-1.5 h-10">
            <Plus className="h-4 w-4" />
            Tạo yêu cầu
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên sách, ghi chú..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-white border-gray-200"
          />
        </div>
      </div>
    </div>
  )
}
