import {
  LayoutDashboard,
  ArrowDownToLine,
  ShoppingCart,
  PackageCheck,
  Boxes,
  RotateCw,
  Trash2,
  BarChart3
} from 'lucide-react'

export const warehouseSidebarData = {
  header: "WAREHOUSE",
  items: [
    {
      title: 'Dashboard',
      url: '/warehouse/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Quản lý Nhập hàng',
      url: '/warehouse/dashboard/imports',
      icon: ArrowDownToLine,
    },
    {
      title: 'Quản lý Đơn đặt hàng',
      url: '/warehouse/dashboard/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Quản lý Phiếu Nhập kho',
      url: '/warehouse/dashboard/import-receipts',
      icon: PackageCheck,
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
