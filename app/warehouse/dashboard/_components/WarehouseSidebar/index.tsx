'use client'

import { warehouseSidebarData } from '@/app/warehouse/dashboard/data/warehouse-sidebar-data'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function WarehouseSidebar() {
    const pathname = usePathname()
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }))
    }

    return (
        <Sidebar className="border-r bg-white h-[calc(100vh-4rem)] top-16">
            <SidebarHeader className="h-1" />

            <SidebarContent className="pt-2 pb-4 overflow-y-auto">
                <div className="px-6 mb-3">
                    <div className="text-[20px] leading-none font-extrabold text-[#050505] uppercase tracking-normal text-center">
                        {warehouseSidebarData.header}
                    </div>
                </div>

                <div className="px-3 space-y-1">
                    {warehouseSidebarData.items.map((item) => {
                        const Icon = item.icon
                        const isActive = item.url ? pathname === item.url : false
                        const hasSubmenu = item.items && item.items.length > 0
                        const isOpen = openMenus[item.title]

                        // Check if any submenu item is active
                        const isSubmenuActive = hasSubmenu && item.items?.some(
                            (subItem) => pathname === subItem.url
                        )

                        return (
                            <div key={item.title}>
                                {hasSubmenu ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.title)}
                                            className={cn(
                                                'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                                isSubmenuActive
                                                    ? 'bg-[#E8F2FF] text-[#3B82F6] font-medium'
                                                    : 'text-gray-600 hover:bg-gray-50',
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                {Icon && (
                                                    <Icon
                                                        className={cn(
                                                            'h-4 w-4',
                                                            isSubmenuActive ? 'text-[#3B82F6]' : 'text-gray-400',
                                                        )}
                                                    />
                                                )}
                                                <span className="truncate">{item.title}</span>
                                            </div>
                                            <ChevronDown
                                                className={cn(
                                                    'h-4 w-4 transition-transform',
                                                    isOpen ? 'rotate-180' : ''
                                                )}
                                            />
                                        </button>
                                        {isOpen && (
                                            <div className="ml-6 mt-1 space-y-1">
                                                {item.items?.map((subItem) => {
                                                    const isSubItemActive = pathname === subItem.url
                                                    return (
                                                        <Link
                                                            key={subItem.title}
                                                            href={subItem.url}
                                                            className={cn(
                                                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                                                isSubItemActive
                                                                    ? 'bg-[#E8F2FF] text-[#3B82F6] font-medium'
                                                                    : 'text-gray-500 hover:bg-gray-50',
                                                            )}
                                                        >
                                                            <span className="truncate">{subItem.title}</span>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.url || '#'}
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
                                )}
                            </div>
                        )
                    })}
                </div>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
