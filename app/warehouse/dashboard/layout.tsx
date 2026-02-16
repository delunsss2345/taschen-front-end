import type { ReactNode } from 'react'
import { WarehouseLayout } from '@/layouts/WarehouseLayout'

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <WarehouseLayout>{children}</WarehouseLayout>
}
