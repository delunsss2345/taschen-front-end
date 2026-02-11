'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { adminSidebarData } from '@/app/dashboard/_components/admin-sidebar-data'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r bg-white h-[calc(100vh-4rem)] top-16">
      <SidebarHeader className="h-1" />

      <SidebarContent className="pt-2 pb-4 overflow-y-auto">
        <div className="px-6 mb-3">
          <div className="text-[20px] leading-none font-extrabold text-[#050505] uppercase tracking-normal text-center">
            {adminSidebarData.header}
          </div>
        </div>

        <div className="px-3 space-y-1">
          {adminSidebarData.items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url

            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-[#E8F2FF] text-[#3B82F6] font-medium'
                    : 'text-gray-600 hover:bg-gray-50',
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      isActive ? 'text-[#3B82F6]' : 'text-gray-400',
                    )}
                  />
                )}
                <span className="truncate">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
