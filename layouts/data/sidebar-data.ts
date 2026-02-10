import { SidebarData } from '@/types/layouts/sidebar.type'
import {
  LayoutDashboard,
  BookOpen,
  Tags,
  UserCircle,
  ShoppingCart,
  Percent,
  Truck,
  FileDown,
  Users,
  Undo2,
  BarChart3,
  TicketPercent,
  PackageSearch,
  Warehouse
} from 'lucide-react'

export const sidebarData: SidebarData = {
  user: {
    name: 'admin',
    email: 'admin@sebook.com',
    avatar : ""
  },
  navGroups: [
    {
      title: 'ADMIN',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
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
          icon: UserCircle,
        },
        {
          title: 'Quản lý Đơn hàng',
          url: '/dashboard/orders',
          icon: ShoppingCart,
        },
        {
          title: 'Quản lý Khuyến mãi',
          url: '/dashboard/promotions',
          icon: Percent,
        },
        {
          title: 'Quản lý Nhà cung cấp',
          url: '/dashboard/suppliers',
          icon: Truck,
        },
        {
          title: 'Quản lý Phiếu nhập kho',
          url: '/dashboard/import-notes',
          icon: FileDown,
        },
        {
          title: 'Quản lý Khách hàng',
          url: '/dashboard/customers',
          icon: Users,
        },
        {
          title: 'Yêu cầu Hoàn/Đổi',
          url: '/dashboard/returns',
          icon: Undo2,
        },
        {
          title: 'Báo cáo',
          url: '/dashboard/reports',
          icon: BarChart3,
        },
        {
          title: 'Phân tích Khuyến mãi',
          url: '/dashboard/promotion-analysis',
          icon: TicketPercent,
        },
        {
          title: 'Yêu cầu Nhập kho',
          url: '/dashboard/import-requests',
          icon: PackageSearch,
        },
        {
          title: 'Kiểm kê Tồn kho',
          url: '/dashboard/inventory',
          icon: Warehouse,
        },
      ],
    }
  ],
}
