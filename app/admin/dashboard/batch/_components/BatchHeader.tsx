'use client'

import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface BatchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddBatch: () => void
}

export function BatchHeader({ searchQuery, onSearchChange, onAddBatch }: BatchHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Lô hàng</h1>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          onClick={onAddBatch}
        >
          <Plus className="h-4 w-4" />
          Thêm lô hàng
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo mã lô, tên sách..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-white border-gray-200"
          />
        </div>
      </div>
    </div>
  )
}
