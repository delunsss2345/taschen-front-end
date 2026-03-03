'use client'

import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PurchaseOrdersHeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onCreateClick: () => void
}

export function PurchaseOrdersHeader({ searchValue, onSearchChange, onCreateClick }: PurchaseOrdersHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Đơn Đặt hàng</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={onCreateClick}>
          <Plus className="h-4 w-4" />
          Tạo đơn đặt hàng
        </Button>
      </div>
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm theo mã đơn, tên nhà cung cấp..."
          className="pl-10 h-10 bg-white border-gray-200"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
