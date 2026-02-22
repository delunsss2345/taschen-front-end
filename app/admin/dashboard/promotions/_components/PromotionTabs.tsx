'use client'

import { cn } from '@/lib/utils'

interface TabCounts {
  all: number
  active: number
  pending: number
  approved: number
  rejected: number
  deleted: number
}

interface PromotionTabsProps {
  activeTab: string
  onTabChange: (id: string) => void
  counts: TabCounts
}

const tabs = [
  { id: 'all', label: 'Tất cả', countKey: 'all' as keyof TabCounts },
  { id: 'active', label: 'Đang hoạt động', countKey: 'active' as keyof TabCounts },
  { id: 'pending', label: 'Chờ duyệt', countKey: 'pending' as keyof TabCounts },
  { id: 'approved', label: 'Đã duyệt', countKey: 'approved' as keyof TabCounts },
  { id: 'rejected', label: 'Đã từ chối', countKey: 'rejected' as keyof TabCounts },
  { id: 'deleted', label: 'Đã dừng', countKey: 'deleted' as keyof TabCounts },
]

export function PromotionTabs({ activeTab, onTabChange, counts }: PromotionTabsProps) {
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
            {tab.label} ({counts[tab.countKey]})
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
