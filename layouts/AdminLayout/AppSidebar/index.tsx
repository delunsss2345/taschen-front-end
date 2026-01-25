'use client'
import { NavGroup } from '@/components/common/NavGroup'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar'
import { sidebarData } from '@/layouts/data/sidebar-data'

export function AppSidebar() {
  return (
      <Sidebar> 
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
