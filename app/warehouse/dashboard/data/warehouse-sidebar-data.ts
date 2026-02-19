import {
  ArrowDownToLine,
  Boxes,
  LayoutDashboard,
  PackageCheck,
  RotateCw,
  ShoppingCart,
  Trash2
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
      title: 'Yêu cầu nhập kho',
      icon: ArrowDownToLine,
      items: [
        {
          title: 'Đang chờ',
          url: '/warehouse/dashboard/import-requests/pending',
        },
        {
          title: 'Đã duyệt',
          url: '/warehouse/dashboard/import-requests/approved',
        },
        {
          title: 'Từ chối',
          url: '/warehouse/dashboard/import-requests/rejected',
        },
      ],
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
