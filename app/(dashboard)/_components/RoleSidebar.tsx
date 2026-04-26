'use client'

import { getRoleSidebarData, type DashboardRole, type RoleNavItem } from './role-config'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

type RoleSidebarProps = {
  role: DashboardRole
}

function isActivePath(pathname: string, path?: string) {
  return path ? pathname === path : false
}

export function RoleSidebar({ role }: RoleSidebarProps) {
  const pathname = usePathname()
  const sidebarData = getRoleSidebarData(role)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const renderLink = (item: RoleNavItem) => {
    const Icon = item.icon
    const isActive = isActivePath(pathname, item.path)

    return (
      <Link
        key={item.title}
        href={item.path || '#'}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
          isActive ? 'bg-[#E8F2FF] text-[#3B82F6] font-medium' : 'text-gray-600 hover:bg-gray-50',
        )}
      >
        {Icon ? <Icon className={cn('h-4 w-4', isActive ? 'text-[#3B82F6]' : 'text-gray-400')} /> : null}
        <span className="truncate">{item.title}</span>
      </Link>
    )
  }

  return (
    <Sidebar className="border-r bg-white h-[calc(100vh-4rem)] top-16">
      <SidebarHeader className="h-1" />

      <SidebarContent className="pt-2 pb-4 overflow-y-auto">
        <div className="px-6 mb-3">
          <div className="text-[20px] leading-none font-extrabold text-[#050505] uppercase tracking-normal text-center">
            {sidebarData.header}
          </div>
        </div>

        <div className="px-3 space-y-1">
          {sidebarData.items.map((item) => {
            const Icon = item.icon
            const hasSubmenu = !!item.items?.length
            const isSubmenuActive = hasSubmenu && item.items?.some((subItem) => isActivePath(pathname, subItem.path))
            const isOpen = !!openMenus[item.title] || isSubmenuActive

            if (!hasSubmenu) {
              return renderLink(item)
            }

            return (
              <div key={item.title}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    isSubmenuActive ? 'bg-[#E8F2FF] text-[#3B82F6] font-medium' : 'text-gray-600 hover:bg-gray-50',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {Icon ? (
                      <Icon className={cn('h-4 w-4', isSubmenuActive ? 'text-[#3B82F6]' : 'text-gray-400')} />
                    ) : null}
                    <span className="truncate">{item.title}</span>
                  </span>
                  <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', isOpen ? 'rotate-180' : '')} />
                </button>

                {isOpen ? (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.items?.map((subItem) => {
                      const isActive = isActivePath(pathname, subItem.path)

                      return (
                        <Link
                          key={subItem.title}
                          href={subItem.path}
                          className={cn(
                            'block px-3 py-2 rounded-lg text-sm transition-colors',
                            isActive ? 'bg-[#E8F2FF] text-[#3B82F6] font-medium' : 'text-gray-600 hover:bg-gray-50',
                          )}
                        >
                          {subItem.title}
                        </Link>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
