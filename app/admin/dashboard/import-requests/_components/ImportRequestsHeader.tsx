'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ImportRequestsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ImportRequestsHeader({ searchQuery, onSearchChange }: ImportRequestsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Yêu cầu Nhập kho</h1>
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
        <Select>
          <SelectTrigger className="w-40 h-10 bg-white border-gray-200 cursor-pointer">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
        <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white gap-1.5 h-10">
          <Plus className="h-4 w-4" />
          Tạo yêu cầu
        </Button>
      </div>
    </div>
  )
}
