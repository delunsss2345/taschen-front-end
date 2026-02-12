'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface CustomersHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function CustomersHeader({ searchQuery, onSearchChange }: CustomersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Khách hàng</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
