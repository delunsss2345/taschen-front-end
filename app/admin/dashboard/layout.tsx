import type { ReactNode } from 'react'
import { AdminLayout } from '@/layouts/AdminLayout'

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <AdminLayout>{children}</AdminLayout>
}
