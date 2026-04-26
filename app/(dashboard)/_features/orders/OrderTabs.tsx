'use client'

import { cn } from '@/lib/utils'

const tabs = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Chờ xác nhận' },
  { id: 'processing', label: 'Đang xử lý' },
  { id: 'delivering', label: 'Đang giao' },
  { id: 'completed', label: 'Đã hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
  { id: 'returned', label: 'Đã trả lại' },
]

interface OrderTabsProps {
  activeTab: string
  onTabChange: (id: string) => void
  counts?: {
    all: number
    pending: number
    processing: number
    delivering: number
    completed: number
    cancelled: number
    returned: number
  }
}

export function OrderTabs({ activeTab, onTabChange, counts }: OrderTabsProps) {
  return (
    <div className="border-b border-gray-100 bg-white px-4">
      <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'py-4 text-sm font-medium transition-all relative cursor-pointer whitespace-nowrap',
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label} ({counts?.[tab.id as keyof typeof counts] ?? 0})
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
