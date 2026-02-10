'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BooksHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Sách</h1>
      <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
        <Plus className="h-4 w-4" />
        Thêm sách mới
      </Button>
    </div>
  )
}
