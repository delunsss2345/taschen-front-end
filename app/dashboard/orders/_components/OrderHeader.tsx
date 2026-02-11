'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function OrderHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Đơn hàng</h1>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm theo mã đơn hoặc email khách hàng"
          className="pl-10 h-10 bg-white border-gray-200"
        />
      </div>
    </div>
  )
}
