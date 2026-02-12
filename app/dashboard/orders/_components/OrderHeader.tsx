'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function OrderHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Đơn hàng</h1>
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm theo mã đơn hoặc email..."
          className="pl-10 h-9 bg-white border-gray-200"
        />
      </div>
    </div>
  )
}
