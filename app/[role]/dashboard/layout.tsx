import { DashboardShell } from '@/app/(dashboard)/_components/DashboardShell'
import { isDashboardRole } from '@/app/(dashboard)/_components/role-config'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

type RoleDashboardLayoutProps = {
  children: ReactNode
  params: Promise<{
    role: string
  }>
}

export default async function RoleDashboardLayout({ children, params }: RoleDashboardLayoutProps) {
  const { role } = await params

  if (!isDashboardRole(role)) {
    notFound()
  }

  return <DashboardShell role={role}>{children}</DashboardShell>
}
