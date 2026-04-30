import {
  ArrowDownToLine,
  Boxes,
  LayoutDashboard,
  PackageCheck,
  RotateCw,
  ShoppingCart,
  Trash2,
  type LucideIcon,
} from 'lucide-react'

interface SidebarItem {
  title: string
  url?: string
  icon?: LucideIcon
  items?: { title: string; url: string }[]
}

interface SidebarData {
  header: string
  items: SidebarItem[]
}

export const warehouseSidebarData: SidebarData = {
  header: "WAREHOUSE",
  items: [
    {
      title: 'Dashboard',
      url: '/warehouse/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Yêu cầu nhập kho',
      url: '/warehouse/dashboard/import-requests',
      icon: ArrowDownToLine,
    },
    {
      title: 'Phiếu Nhập kho',
      url: '/warehouse/dashboard/import',
      icon: PackageCheck,
    },
    {
      title: 'Quản lý Đơn Đặt hàng',
      url: '/warehouse/dashboard/purchase-order',
      icon: ShoppingCart,
    },
    {
      title: 'Quản lý Lô hàng',
      url: '/warehouse/dashboard/batch',
      icon: Boxes,
    },
    {
      title: 'Quản lý Trả hàng về kho',
      url: '/warehouse/dashboard/return-to-warehouse',
      icon: RotateCw,
    },
    {
      title: 'Quản lý Xuất hủy',
      url: '/warehouse/dashboard/discard',
      icon: Trash2,
    },
  ],
}
