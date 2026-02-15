import type { ReactNode } from 'react'
import { SellerLayout } from '@/layouts/SellerLayout'

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <SellerLayout>{children}</SellerLayout>
}
