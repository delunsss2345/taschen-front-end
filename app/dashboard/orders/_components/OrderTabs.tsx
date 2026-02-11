'use client'

import { cn } from '@/lib/utils'

const tabs = [
  { id: 'all', label: 'Tất cả', count: 14 },
  { id: 'pending', label: 'Chờ xác nhận', count: 2 },
  { id: 'processing', label: 'Đang xử lý', count: 1 },
  { id: 'shipping', label: 'Đang giao', count: 0 },
  { id: 'completed', label: 'Đã hoàn thành', count: 7 },
  { id: 'cancelled', label: 'Đã hủy', count: 2 },
  { id: 'returned', label: 'Đã trả lại', count: 1 },
]

interface OrderTabsProps {
  activeTab: string
  onTabChange: (id: string) => void
}

export function OrderTabs({ activeTab, onTabChange }: OrderTabsProps) {
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
            {tab.label} ({tab.count})
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
