import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  TicketPercent,
  PackageCheck,
  UserRound,
  RotateCcw,
  BarChart3,
  PackagePlus,
  Warehouse,
  History,
  DollarSign,
  Settings,
  Store
} from 'lucide-react'

export const sellerSidebarData = {
  header: "SELLER",
  items: [
    {
      title: 'Dashboard',
      url: '/seller/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Báo cáo',
      url: '/seller/dashboard/reports',
      icon: BarChart3,
    },
    {
      title: 'Quản lý Sách',
      url: '/seller/dashboard/books',
      icon: BookOpen,
    },
    {
      title: 'Quản lý Đơn hàng',
      url: '/seller/dashboard/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Quản lý Khuyến mãi',
      url: '/seller/dashboard/promotions',
      icon: TicketPercent,
    },
    {
      title: 'Quản lý Khách hàng',
      url: '/seller/dashboard/customers',
      icon: UserRound,
    },
    {
      title: 'Quản lý Phiếu nhập kho',
      url: '/seller/dashboard/import-receipts',
      icon: PackageCheck,
    },
    {
      title: 'Yêu cầu Hoàn/Đổi',
      url: '/seller/dashboard/returns',
      icon: RotateCcw,
    },
    {
      title: 'Yêu cầu Nhập kho',
      url: '/seller/dashboard/import-requests',
      icon: PackagePlus,
    },
    {
      title: 'Lịch sử Hoạt động',
      url: '/seller/dashboard/activities',
      icon: History,
    },
    {
      title: 'Doanh thu',
      url: '/seller/dashboard/revenue',
      icon: DollarSign,
    },
    {
      title: 'Cửa hàng',
      url: '/seller/dashboard/store',
      icon: Store,
    },
    {
      title: 'Cài đặt',
      url: '/seller/dashboard/settings',
      icon: Settings,
    },
  ],
}
