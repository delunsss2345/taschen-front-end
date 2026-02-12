'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function ImportNotesHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Phiếu nhập kho</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp..."
            className="pl-10 h-10 bg-white border-gray-200"
          />
        </div>
      </div>
    </div>
  )
}
