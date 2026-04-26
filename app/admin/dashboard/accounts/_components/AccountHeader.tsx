'use client'

import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateAccountModal } from './CreateAccountModal'

interface AccountHeaderProps {
  onRefresh?: () => void
  onSearch?: (term: string) => void
  searchTerm?: string
}

export function AccountHeader({ onRefresh, onSearch, searchTerm = '' }: AccountHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Tài khoản</h1>
        <CreateAccountModal onSuccess={onRefresh}>
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <Plus className="h-4 w-4" />
            Tạo tài khoản nhân viên
          </Button>
        </CreateAccountModal>
      </div>

      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm theo tên đăng nhập hoặc email"
          className="pl-10 h-10 bg-white border-gray-200"
          value={searchTerm}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </div>
  )
}
