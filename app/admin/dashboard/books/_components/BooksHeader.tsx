'use client'

import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddBookModal } from './AddBookModal'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const statusOptions = [
  { value: 'active', label: 'Đang kinh doanh' },
  { value: 'deleted', label: 'Đã xóa mềm' },
  { value: 'all', label: 'Tất cả' },
]

interface BooksHeaderProps {
  onSuccess?: () => void
  onSearch?: (search: string) => void
  status: string
  onStatusChange: (status: string) => void
}

export function BooksHeader({ onSuccess, onSearch, status, onStatusChange }: BooksHeaderProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchValue)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Sách</h1>
        <AddBookModal
          trigger={
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Plus className="h-4 w-4" />
              Thêm sách mới
            </Button>
          }
          onSuccess={onSuccess}
        />
      </div>

      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm theo tên hoặc tác giả"
            className="pl-10 h-10 bg-white border-gray-200"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-44 h-10 bg-white border-gray-200 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
