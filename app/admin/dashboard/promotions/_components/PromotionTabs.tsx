'use client'

import { cn } from '@/lib/utils'

const tabs = [
  { id: 'all', label: 'Tất cả', count: 5 },
  { id: 'active', label: 'Đang hoạt động', count: 1 },
  { id: 'pending', label: 'Chờ duyệt', count: 0 },
  { id: 'approved', label: 'Đã duyệt', count: 2 },
  { id: 'rejected', label: 'Đã từ chối', count: 2 },
  { id: 'deleted', label: 'Đã xóa mềm', count: 1 },
  { id: 'logs', label: 'Nhật ký hoạt động', count: null },
]

interface PromotionTabsProps {
  activeTab: string
  onTabChange: (id: string) => void
}

export function PromotionTabs({ activeTab, onTabChange }: PromotionTabsProps) {
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
            {tab.label} {tab.count !== null ? `(${tab.count})` : ''}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
