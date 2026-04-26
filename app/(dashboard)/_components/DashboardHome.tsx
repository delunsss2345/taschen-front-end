import type { DashboardRole } from './role-config'

type DashboardHomeProps = {
  role: DashboardRole
}

const titleByRole: Record<DashboardRole, string> = {
  admin: 'Admin Dashboard',
  seller: 'Seller Dashboard',
  warehouse: 'Warehouse Dashboard',
}

export function DashboardHome({ role }: DashboardHomeProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-700">{titleByRole[role]}</h2>
        <p className="mt-2 text-gray-500">Coming soon...</p>
      </div>
    </div>
  )
}
