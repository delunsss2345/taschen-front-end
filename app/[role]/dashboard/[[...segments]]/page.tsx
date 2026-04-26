import { DashboardHome } from '@/app/(dashboard)/_components/DashboardHome'
import {
  BooksDashboardPage,
  CategoriesDashboardPage,
  OrdersDashboardPage,
  PromotionsDashboardPage,
  ReturnToWarehouseDashboardPage,
  ReturnsDashboardPage,
} from '@/app/(dashboard)/_components/dashboard-pages'
import { isDashboardRole, type DashboardRole } from '@/app/(dashboard)/_components/role-config'
import { ComingSoonPage } from '@/app/(dashboard)/_features/coming-soon/ComingSoonPage'
import { EmptyDashboardPage } from '@/app/(dashboard)/_features/empty/EmptyDashboardPage'
import { RoleImportRequestsStatusPage } from '@/app/(dashboard)/_features/import-requests/RoleImportRequestsStatusPage'
import { AdminAccountsPage } from '@/app/admin/dashboard/accounts/_components/AdminAccountsPage'
import { BatchPage } from '@/app/admin/dashboard/batch/_components/BatchPage'
import { CustomersPage } from '@/app/admin/dashboard/customers/_components/CustomersPage'
import { AdminFormatsPage } from '@/app/admin/dashboard/formats/_components/AdminFormatsPage'
import { ImportReceiptsPage } from '@/app/admin/dashboard/import/_components/ImportReceiptsPage'
import { PurchaseOrdersPage as AdminPurchaseOrdersPage } from '@/app/admin/dashboard/purchase-order/_components/PurchaseOrdersPage'
import { AdminSuppliersPage } from '@/app/admin/dashboard/suppliers/_components/AdminSuppliersPage'
import { SellerImportRequestsPage } from '@/app/seller/dashboard/import-requests/_components/SellerImportRequestsPage'
import { WarehouseImportReceiptsPage } from '@/app/warehouse/dashboard/import/_components/WarehouseImportReceiptsPage'
import { PurchaseOrdersPage as WarehousePurchaseOrdersPage } from '@/app/warehouse/dashboard/purchase-order/_components/PurchaseOrdersPage'
import { notFound, redirect } from 'next/navigation'
import type { ComponentType } from 'react'

type RoleDashboardPageProps = {
  params: Promise<{
    role: string
    segments?: string[]
  }>
}

type DashboardPageMap = Record<DashboardRole, Record<string, ComponentType>>

function roleHome(role: DashboardRole) {
  function RoleHomePage() {
    return <DashboardHome role={role} />
  }

  return RoleHomePage
}

function importRequestsStatus(role: 'admin' | 'warehouse', mode: 'pending' | 'approved' | 'rejected') {
  function ImportRequestsStatusPage() {
    return <RoleImportRequestsStatusPage role={role} mode={mode} />
  }

  return ImportRequestsStatusPage
}

const pages: DashboardPageMap = {
  admin: {
    '': roleHome('admin'),
    accounts: AdminAccountsPage,
    batch: BatchPage,
    books: BooksDashboardPage,
    categories: CategoriesDashboardPage,
    'coming-soon': ComingSoonPage,
    customers: CustomersPage,
    formats: AdminFormatsPage,
    import: ImportReceiptsPage,
    'import-requests/pending': importRequestsStatus('admin', 'pending'),
    'import-requests/approved': importRequestsStatus('admin', 'approved'),
    'import-requests/rejected': importRequestsStatus('admin', 'rejected'),
    orders: OrdersDashboardPage,
    promotions: PromotionsDashboardPage,
    'purchase-order': AdminPurchaseOrdersPage,
    reports: ComingSoonPage,
    'return-to-warehouse': ReturnToWarehouseDashboardPage,
    returns: ReturnsDashboardPage,
    suppliers: AdminSuppliersPage,
  },
  seller: {
    '': roleHome('seller'),
    books: BooksDashboardPage,
    categories: CategoriesDashboardPage,
    'import-requests': SellerImportRequestsPage,
    orders: OrdersDashboardPage,
    promotions: PromotionsDashboardPage,
    reports: ComingSoonPage,
    returns: ReturnsDashboardPage,
    'warehouse-returns': ReturnToWarehouseDashboardPage,
  },
  warehouse: {
    '': roleHome('warehouse'),
    batch: EmptyDashboardPage,
    discard: EmptyDashboardPage,
    import: WarehouseImportReceiptsPage,
    'import-requests/pending': importRequestsStatus('warehouse', 'pending'),
    'import-requests/approved': importRequestsStatus('warehouse', 'approved'),
    'import-requests/rejected': importRequestsStatus('warehouse', 'rejected'),
    'purchase-order': WarehousePurchaseOrdersPage,
    'return-to-warehouse': EmptyDashboardPage,
  },
}

export default async function RoleDashboardPage({ params }: RoleDashboardPageProps) {
  const { role, segments = [] } = await params

  if (!isDashboardRole(role)) {
    notFound()
  }

  const path = segments.join('/')

  if ((role === 'admin' || role === 'warehouse') && path === 'import-requests') {
    redirect(`/${role}/dashboard/import-requests/pending`)
  }

  const Page = pages[role][path]

  if (!Page) {
    notFound()
  }

  return <Page />
}
