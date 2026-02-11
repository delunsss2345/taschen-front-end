'use client'

import type { ReactNode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'

export function AdminLayout({
  children,
  username = 'admin',
}: {
  children: ReactNode
  username?: string
}) {
  return (
    <SidebarProvider className="w-full">
      <div className="min-h-screen w-full bg-[#f6f7fb]">
        <Header username={username} />
        <div className="flex w-full">
          <div className="h-[calc(100vh-4rem)]">
            <AppSidebar />
        </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex-1 min-w-0 p-6">
              <div className="min-h-[calc(100vh-4rem)] rounded-xl bg-white shadow-sm border border-gray-100 p-6">
                {children}
          </div>
        </div>
            </div>
            </div>
          </div>
    </SidebarProvider>
  )
}
