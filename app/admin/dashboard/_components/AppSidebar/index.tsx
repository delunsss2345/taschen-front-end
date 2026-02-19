'use client'

import { adminSidebarData } from '@/app/admin/dashboard/_components/data/admin-sidebar-data'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function AppSidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

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
            const isActive = item.url ? pathname === item.url : false
            const hasSubmenu = !!item.items?.length
            const isOpen = !!openMenus[item.title]

            const baseClass = cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive ? 'bg-[#E8F2FF] text-[#3B82F6] font-medium' : 'text-gray-600 hover:bg-gray-50',
            )

            const iconClass = cn('h-4 w-4', isActive ? 'text-[#3B82F6]' : 'text-gray-400')

            // Nếu có submenu và không có url -> dùng button để toggle
            if (hasSubmenu && !item.url) {
              return (
                <div key={item.title}>
                  <button type="button" onClick={() => toggleMenu(item.title)} className={cn(baseClass, 'w-full')}>
                    {Icon ? <Icon className={iconClass} /> : null}
                    <span className="truncate">{item.title}</span>
                  </button>

                  {isOpen ? (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.items!.map((sub) => {
                        const subActive = sub.url ? pathname === sub.url : false
                        return (
                          <Link
                            key={sub.title}
                            href={sub.url || '#'}
                            className={cn(
                              'block px-3 py-2 rounded-lg text-sm',
                              subActive ? 'bg-[#E8F2FF] text-[#3B82F6] font-medium' : 'text-gray-600 hover:bg-gray-50',
                            )}
                          >
                            {sub.title}
                          </Link>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              )
            }

            // Item thường (có url)
            return (
              <Link key={item.title} href={item.url || '#'} className={baseClass}>
                {Icon ? <Icon className={iconClass} /> : null}
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
