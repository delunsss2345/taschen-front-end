'use client'

import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  countKey?: string
}

interface TabCounts {
  [key: string]: number
}

interface PromotionTabsProps {
  activeTab: string
  onTabChange: (id: string) => void
  counts: TabCounts
  tabs?: TabItem[]
}

const defaultTabs: TabItem[] = [
  { id: 'all', label: 'Tất cả', countKey: 'all' },
  { id: 'active', label: 'Đang hoạt động', countKey: 'active' },
  { id: 'pending', label: 'Chờ duyệt', countKey: 'pending' },
  { id: 'approved', label: 'Đã duyệt', countKey: 'approved' },
  { id: 'rejected', label: 'Đã từ chối', countKey: 'rejected' },
  { id: 'paused', label: 'Đã dừng', countKey: 'paused' },
]

export function PromotionTabs({ activeTab, onTabChange, counts, tabs = defaultTabs }: PromotionTabsProps) {
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
            {tab.label} ({counts[tab.countKey || tab.id] ?? 0})
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
