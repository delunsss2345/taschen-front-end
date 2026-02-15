import {
  LayoutDashboard,
  BookOpen,
  Tags,
  ShoppingCart,
  TicketPercent,
  UserRound,
  RotateCcw,
  BarChart3,
  PackagePlus,
  Warehouse,
  History
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
      title: 'Quản lý Thể loại',
      url: '/seller/dashboard/categories',
      icon: Tags,
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
      title: 'Trả về kho',
      url: '/seller/dashboard/warehouse-returns',
      icon: Warehouse,
    },
  ],
}
