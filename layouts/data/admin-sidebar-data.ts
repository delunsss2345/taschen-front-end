import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Users,
  ShoppingCart,
  TicketPercent,
  Truck,
  PackageCheck,
  UserRound,
  RotateCcw,
  BarChart3,
  PackagePlus,
  Warehouse,
  History,
  RotateCw,
  LayoutGrid
} from 'lucide-react'

export const adminSidebarData = {
  header: "ADMIN",
  items: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Báo cáo',
      url: '/dashboard/reports',
      icon: BarChart3,
    },
    {
      title: 'Quản lý Sách',
      url: '/dashboard/books',
      icon: BookOpen,
    },
    {
      title: 'Quản lý Thể loại',
      url: '/dashboard/categories',
      icon: Tags,
    },
    {
      title: 'Quản lý Tài khoản',
      url: '/dashboard/accounts',
      icon: Users,
    },
    {
      title: 'Quản lý Đơn hàng',
      url: '/dashboard/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Quản lý Khuyến mãi',
      url: '/dashboard/promotions',
      icon: TicketPercent,
    },
    {
      title: 'Quản lý Nhà cung cấp',
      url: '/dashboard/suppliers',
      icon: Truck,
    },
    {
      title: 'Quản lý Phiếu nhập kho',
      url: '/dashboard/import-receipts',
      icon: PackageCheck,
    },
    {
      title: 'Quản lý Khách hàng',
      url: '/dashboard/customers',
      icon: UserRound,
    },
    {
      title: 'Yêu cầu Hoàn/Đổi',
      url: '/dashboard/returns',
      icon: RotateCcw,
    },
    {
      title: 'Trả về Kho',
      url: '/dashboard/return-to-warehouse',
      icon: RotateCw,
    },
    {
      title: 'Đơn Đặt hàng',
      url: '/dashboard/purchase-orders',
      icon: LayoutGrid,
    },
    {
      title: 'Yêu cầu Nhập kho',
      url: '/dashboard/import-requests',
      icon: PackagePlus,
    },
    {
      title: 'Kiểm kê Tồn kho',
      url: '/dashboard/inventory',
      icon: Warehouse,
    },
    {
      title: 'Lịch sử Hoạt động',
      url: '/dashboard/activities',
      icon: History,
    },
  ],
}
