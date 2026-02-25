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
  LayoutGrid,
  FileText
} from 'lucide-react'

export const adminSidebarData = {
  header: "ADMIN",
  items: [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Báo cáo',
      url: '/admin/dashboard/reports',
      icon: BarChart3,
    },
    {
      title: 'Quản lý Sách',
      url: '/admin/dashboard/books',
      icon: BookOpen,
    },
    {
      title: 'Quản lý Thể loại',
      url: '/admin/dashboard/categories',
      icon: Tags,
    },
    {
      title: 'Quản lý Định dạng',
      url: '/admin/dashboard/formats',
      icon: FileText,
    },
    {
      title: 'Quản lý Tài khoản',
      url: '/admin/dashboard/accounts',
      icon: Users,
    },
    {
      title: 'Quản lý Đơn hàng',
      url: '/admin/dashboard/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Quản lý Khuyến mãi',
      url: '/admin/dashboard/promotions',
      icon: TicketPercent,
    },
    {
      title: 'Quản lý Nhà cung cấp',
      url: '/admin/dashboard/suppliers',
      icon: Truck,
    },
    {
      title: 'Quản lý Đơn Đặt hàng',
      url: '/admin/dashboard/purchase-order',
      icon: PackageCheck,
    },
    {
      title: 'Quản lý Khách hàng',
      url: '/admin/dashboard/customers',
      icon: UserRound,
    },
    {
      title: 'Quản lý lô hàng',
      url: '/admin/dashboard/batch',
      icon: Warehouse,
    },
    {
      title: 'Yêu cầu Hoàn/Đổi',
      url: '/admin/dashboard/returns',
      icon: RotateCcw,
    },
    {
      title: 'Trả về Kho',
      url: '/admin/dashboard/return-to-warehouse',
      icon: RotateCw,
    },
    {
      title: 'Phiếu Nhập kho',
      url: '/admin/dashboard/import',
      icon: LayoutGrid,
    },
    {
      title: 'Yêu cầu Nhập kho',
      icon: PackagePlus,
      items: [
        {
          title: 'Đang chờ',
          url: '/admin/dashboard/import-requests/pending',
        },
        {
          title: 'Đã duyệt',
          url: '/admin/dashboard/import-requests/approved',
        },
        {
          title: 'Từ chối',
          url: '/admin/dashboard/import-requests/rejected',
        },
      ],
    },
    {
      title: 'Lịch sử Hoạt động',
      url: '/admin/dashboard/activities',
      icon: History,
    },
  ],
}
