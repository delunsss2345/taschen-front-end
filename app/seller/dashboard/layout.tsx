'use client'

import { Header } from '@/app/admin/dashboard/_components/Header'
import { SidebarProvider } from '@/components/ui/sidebar'
import type { ReactNode } from 'react'
import { SellerSidebar } from './_components/SellerSidebar'

export default function SellerLayout({
  children,
  username = 'seller',
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
            <SellerSidebar />
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
