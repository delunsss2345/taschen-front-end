import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layouts/AdminLayout/AppSidebar";
import type { ReactNode } from "react";



export default  function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <SidebarProvider  className="w-full">
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  </SidebarProvider>
    
}
