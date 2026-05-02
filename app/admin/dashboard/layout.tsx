"use client";

import { AppSidebar } from '@/app/admin/dashboard/_components/AppSidebar';
import { AdminRealtimeSubscriptions } from '@/app/admin/dashboard/_components/AdminRealtimeSubscriptions';
import { Header } from '@/app/admin/dashboard/_components/Header';
import RoleGuard from '@/app/_components/RoleGuard';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <SidebarProvider className="w-full">
        <AdminRealtimeSubscriptions />
        <div className="min-h-screen w-full bg-[#f6f7fb]">
          <Header />
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
    </RoleGuard>
  )
}
