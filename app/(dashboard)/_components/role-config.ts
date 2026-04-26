import {
  ArrowDownToLine,
  BarChart3,
  BookOpen,
  Boxes,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  PackageCheck,
  PackagePlus,
  RotateCcw,
  RotateCw,
  ShoppingCart,
  Tags,
  TicketPercent,
  Trash2,
  Truck,
  UserRound,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'

export type DashboardRole = 'admin' | 'seller' | 'warehouse'

export const dashboardRoles: DashboardRole[] = ['admin', 'seller', 'warehouse']

export function isDashboardRole(role: string): role is DashboardRole {
  return dashboardRoles.includes(role as DashboardRole)
}

export type RoleNavItem = {
  title: string
  icon?: LucideIcon
  path?: string
  items?: {
    title: string
    path: string
  }[]
}

export type RoleSidebarData = {
  header: string
  username: string
  items: RoleNavItem[]
}

const roleBasePath: Record<DashboardRole, string> = {
  admin: '/admin/dashboard',
  seller: '/seller/dashboard',
  warehouse: '/warehouse/dashboard',
}

const withBase = (role: DashboardRole, path = '') => `${roleBasePath[role]}${path}`

export function getDashboardUsername(role: DashboardRole) {
  return getRoleSidebarData(role).username
}

export function getRoleSidebarData(role: DashboardRole): RoleSidebarData {
  switch (role) {
    case 'seller':
      return {
        header: 'SELLER',
        username: 'seller',
        items: [
          { title: 'Dashboard', path: withBase(role), icon: LayoutDashboard },
          { title: 'Báo cáo', path: withBase(role, '/reports'), icon: BarChart3 },
          { title: 'Quản lý Sách', path: withBase(role, '/books'), icon: BookOpen },
          { title: 'Quản lý Thể loại', path: withBase(role, '/categories'), icon: Tags },
          { title: 'Quản lý Đơn hàng', path: withBase(role, '/orders'), icon: ShoppingCart },
          { title: 'Quản lý Khuyến mãi', path: withBase(role, '/promotions'), icon: TicketPercent },
          { title: 'Yêu cầu Hoàn/Đổi', path: withBase(role, '/returns'), icon: RotateCcw },
          { title: 'Yêu cầu Nhập kho', path: withBase(role, '/import-requests'), icon: PackagePlus },
          { title: 'Trả về kho', path: withBase(role, '/warehouse-returns'), icon: Warehouse },
        ],
      }

    case 'warehouse':
      return {
        header: 'WAREHOUSE',
        username: 'warehouse',
        items: [
          { title: 'Dashboard', path: withBase(role), icon: LayoutDashboard },
          {
            title: 'Yêu cầu nhập kho',
            icon: ArrowDownToLine,
            items: [
              { title: 'Đang chờ', path: withBase(role, '/import-requests/pending') },
              { title: 'Đã duyệt', path: withBase(role, '/import-requests/approved') },
              { title: 'Từ chối', path: withBase(role, '/import-requests/rejected') },
            ],
          },
          { title: 'Phiếu Nhập kho', path: withBase(role, '/import'), icon: PackageCheck },
          { title: 'Quản lý Đơn Đặt hàng', path: withBase(role, '/purchase-order'), icon: ShoppingCart },
          { title: 'Quản lý Lô hàng', path: withBase(role, '/batch'), icon: Boxes },
          { title: 'Quản lý Trả hàng về kho', path: withBase(role, '/return-to-warehouse'), icon: RotateCw },
          { title: 'Quản lý Xuất hủy', path: withBase(role, '/discard'), icon: Trash2 },
        ],
      }

    case 'admin':
    default:
      return {
        header: 'ADMIN',
        username: 'admin',
        items: [
          { title: 'Dashboard', path: withBase(role), icon: LayoutDashboard },
          { title: 'Báo cáo', path: withBase(role, '/reports'), icon: BarChart3 },
          { title: 'Quản lý Sách', path: withBase(role, '/books'), icon: BookOpen },
          { title: 'Quản lý Thể loại', path: withBase(role, '/categories'), icon: Tags },
          { title: 'Quản lý Định dạng', path: withBase(role, '/formats'), icon: FileText },
          { title: 'Quản lý Tài khoản', path: withBase(role, '/accounts'), icon: Users },
          { title: 'Quản lý Đơn hàng', path: withBase(role, '/orders'), icon: ShoppingCart },
          { title: 'Quản lý Khuyến mãi', path: withBase(role, '/promotions'), icon: TicketPercent },
          { title: 'Quản lý Nhà cung cấp', path: withBase(role, '/suppliers'), icon: Truck },
          { title: 'Quản lý Đơn Đặt hàng', path: withBase(role, '/purchase-order'), icon: PackageCheck },
          { title: 'Phiếu Nhập kho', path: withBase(role, '/import'), icon: LayoutGrid },
          { title: 'Quản lý lô hàng', path: withBase(role, '/batch'), icon: Warehouse },
          { title: 'Quản lý Khách hàng', path: withBase(role, '/customers'), icon: UserRound },
          { title: 'Yêu cầu Hoàn/Đổi', path: withBase(role, '/returns'), icon: RotateCcw },
          { title: 'Trả về Kho', path: withBase(role, '/return-to-warehouse'), icon: RotateCw },
          {
            title: 'Yêu cầu Nhập kho',
            icon: PackagePlus,
            items: [
              { title: 'Đang chờ', path: withBase(role, '/import-requests/pending') },
              { title: 'Đã duyệt', path: withBase(role, '/import-requests/approved') },
              { title: 'Từ chối', path: withBase(role, '/import-requests/rejected') },
            ],
          },
        ],
      }
  }
}
