'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { roleService, permissionService, type Role, type Permission, type HttpMethod } from '@/services/permission.service'

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-orange-100 text-orange-700',
  PATCH: 'bg-purple-100 text-purple-700',
  DELETE: 'bg-red-100 text-red-700',
}

const METHOD_ABBR: Record<HttpMethod, string> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PAT',
  DELETE: 'DEL',
}

const ENTITY_GROUPS: Record<string, string> = {
  API: 'API / Toàn quyền',
  BOOKS: 'Sách',
  CATEGORIES: 'Danh mục',
  ORDERS: 'Đơn hàng',
  RETURN_REQUESTS: 'Yêu cầu trả hàng',
  RTW_REQUESTS: 'Yêu cầu trả kho',
  STOCK_REQUESTS: 'Yêu cầu tồn kho',
  DISPOSAL_REQUESTS: 'Yêu cầu tiêu hủy',
  IMPORT_STOCKS: 'Nhập kho',
  PURCHASE_ORDERS: 'Đơn mua hàng',
  SUPPLIERS: 'Nhà cung cấp',
  PROMOTIONS: 'Khuyến mãi',
  CLOUDINARY: 'Cloudinary',
  PAYMENT: 'Thanh toán',
  USERS: 'Người dùng',
  NOTIFICATIONS: 'Thông báo',
  CART: 'Giỏ hàng',
  CART_ITEMS: 'Mặt hàng trong giỏ',
  ROLES: 'Vai trò',
  PERMISSIONS: 'Quyền hạn',
}

function getEntityGroup(code: string): string {
  const prefix = code.split('_')[0]
  return ENTITY_GROUPS[prefix] || prefix
}

function groupPermissions(perms: Permission[]): Record<string, Permission[]> {
  const groups: Record<string, Permission[]> = {}
  for (const perm of perms) {
    const group = getEntityGroup(perm.code)
    if (!groups[group]) groups[group] = []
    groups[group].push(perm)
  }
  const order = [
    'API / Toàn quyền', 'Sách', 'Danh mục', 'Đơn hàng',
    'Yêu cầu trả hàng', 'Yêu cầu trả kho', 'Yêu cầu tồn kho',
    'Yêu cầu tiêu hủy', 'Nhập kho', 'Đơn mua hàng', 'Nhà cung cấp',
    'Khuyến mãi', 'Cloudinary', 'Thanh toán', 'Người dùng',
    'Thông báo', 'Giỏ hàng', 'Mặt hàng trong giỏ', 'Vai trò', 'Quyền hạn',
  ]
  const sorted: Record<string, Permission[]> = {}
  for (const key of order) {
    if (groups[key]) sorted[key] = groups[key]
  }
  for (const key of Object.keys(groups)) {
    if (!sorted[key]) sorted[key] = groups[key]
  }
  return sorted
}

interface RoleTableProps {
  roles: Role[]
  loading?: boolean
  onUpdate?: (updated: Role) => void
  onDelete?: (id: number) => void
  onRefresh?: () => void
}

export function RoleTable({ roles, loading = false, onUpdate, onDelete, onRefresh }: RoleTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (id: number) => {
    setDeleting(true)
    const loadingToast = toast.loading('Đang xóa role...', { duration: Infinity })

    try {
      const success = await roleService.deleteRole(id)
      if (success) {
        toast.dismiss(loadingToast)
        toast.success('Role đã được xóa thành công.')
        onDelete?.(id)
      } else {
        toast.dismiss(loadingToast)
        toast.error('Không thể xóa role. Vui lòng thử lại.')
      }
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Có lỗi xảy ra khi xóa role.')
    } finally {
      setDeleting(false)
      setDeleteConfirmId(null)
    }
  }

  if (loading) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-2">
          <span>Không có role nào</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
        <table className="w-full text-sm">
          <thead className="bg-[#fcfcfc] border-b border-gray-50">
            <tr className="text-gray-500 font-medium">
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Code</TableHeaderCell>
              <TableHeaderCell>Tên</TableHeaderCell>
              <TableHeaderCell className="text-center">Số Permission</TableHeaderCell>
              <TableHeaderCell className="text-center">Thao tác</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {roles.map((role) => {
              return (
                <TableRow key={role.id}>
                  <TableCell className="font-medium text-gray-600">{role.id}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{role.code}</code>
                  </TableCell>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 shadow-none font-normal">
                      {(role.permissionCount ?? 0)} permission{(role.permissionCount ?? 0) !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      <RoleDetailDialog
                        role={role}
                        rolePermissions={role.permissions ?? []}
                        onRefresh={onRefresh}
                      />
                      <EditRoleModal
                        role={role}
                        onUpdate={onUpdate}
                      />
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 gap-1 px-2.5 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        onClick={() => setDeleteConfirmId(role.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </tbody>
        </table>
      </div>

      {deleteConfirmId !== null && (
        <Dialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-left">
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa role này?
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
              >
                Hủy
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
              >
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function EditRoleModal({
  role,
  onUpdate,
}: {
  role: Role
  onUpdate?: (updated: Role) => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: role.name })

  const onSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên role')
      return
    }

    setSaving(true)
    const loadingToast = toast.loading('Đang cập nhật...', { duration: Infinity })

    try {
      const result = await roleService.updateRole(role.id, { name: form.name.trim() })
      if (!result) {
        toast.dismiss(loadingToast)
        toast.error('Không thể cập nhật role.')
        return
      }

      toast.dismiss(loadingToast)
      toast.success('Role đã được cập nhật thành công.')
      onUpdate?.(result)
      setOpen(false)
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Có lỗi xảy ra khi cập nhật role.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="h-8 gap-1 px-2.5 bg-blue-600 hover:bg-blue-700 cursor-pointer">
          Sửa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sửa Role: {role.code}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Code</label>
            <Input value={role.code} disabled className="bg-gray-50 cursor-not-allowed" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tên <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="VD: Quản lý"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4 mt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={onSubmit} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RoleDetailDialog({
  role,
  onRefresh,
}: {
  role: Role
  rolePermissions: Permission[]
  onRefresh?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [selectedPerms, setSelectedPerms] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState(false)

  const [allPerms, setAllPerms] = useState<Permission[]>([])
  const [dialogMeta, setDialogMeta] = useState({ total: 0 })
  const [dialogLoading, setDialogLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const handleOpenChange = async (newOpen: boolean) => {
    if (newOpen) {
      setDialogLoading(true)
      setSearchTerm('')
      setCollapsedGroups(new Set())

      const [allResult, roleResult] = await Promise.all([
        permissionService.getAllPermissionsPaged(),
        permissionService.getPermissionsByRole(role.code),
      ])

      setAllPerms(allResult)
      setSelectedPerms(new Set(roleResult.map((p) => p.id)))
      setDialogMeta({ total: allResult.length })
      setDialogLoading(false)
    }
    setOpen(newOpen)
  }

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) {
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }

  const togglePermission = (permId: number) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev)
      if (next.has(permId)) {
        next.delete(permId)
      } else {
        next.add(permId)
      }
      return next
    })
  }

  const toggleGroupAll = (groupPerms: Permission[]) => {
    const allSelected = groupPerms.every((p) => selectedPerms.has(p.id))
    setSelectedPerms((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        groupPerms.forEach((p) => next.delete(p.id))
      } else {
        groupPerms.forEach((p) => next.add(p.id))
      }
      return next
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCollapsedGroups(new Set())
  }

  const filteredPerms = searchTerm.trim()
    ? allPerms.filter(
        (p) =>
          p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.pathPattern.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allPerms

  const groupedPerms = groupPermissions(filteredPerms)

  const handleSave = async () => {
    setSaving(true)
    const loadingToast = toast.loading('Đang lưu thay đổi...', { duration: Infinity })

    try {
      await roleService.assignPermissions(role.code, Array.from(selectedPerms))

      toast.dismiss(loadingToast)
      toast.success('Đã cập nhật permissions cho role thành công.')
      setOpen(false)
      onRefresh?.()
    } catch (error: unknown) {
      toast.dismiss(loadingToast)
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const backendMessage = axiosError?.response?.data?.message
        || axiosError?.response?.data?.error
        || 'Có lỗi xảy ra khi cập nhật permissions.';
      toast.error(backendMessage)
    } finally {
      setSaving(false)
    }
  }

  const selectedCount = selectedPerms.size

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 px-2.5 cursor-pointer">
          Phân quyền
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[88vh] flex flex-col p-0">
        <div className="px-6 pt-5 pb-4 border-b shrink-0">
          <DialogHeader className="mb-3">
            <DialogTitle>Phân quyền cho: {role.code}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Tìm kiếm theo code hoặc path..."
              className="flex-1 h-9 min-w-[200px]"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <div className="flex items-center gap-4 text-sm text-gray-600 shrink-0">
              <span>
                <span className="font-semibold text-blue-600">{selectedCount}</span> / {dialogMeta.total} quyền
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {dialogLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredPerms.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400">
              Không tìm thấy permission nào
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(groupedPerms).map(([groupName, perms]) => {
                const isCollapsed = collapsedGroups.has(groupName)
                const allSelected = perms.every((p) => selectedPerms.has(p.id))
                const someSelected = perms.some((p) => selectedPerms.has(p.id))

                return (
                  <div key={groupName} className="border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-[#fcfcfc] hover:bg-gray-100 transition-colors cursor-pointer text-left"
                      onClick={() => toggleGroup(groupName)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected && !allSelected
                          }}
                          onChange={() => toggleGroupAll(perms)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                        />
                        <span className="font-medium text-sm text-gray-800">{groupName}</span>
                        <Badge className="bg-gray-100 text-gray-500 border-none shadow-none text-xs font-normal">
                          {perms.length}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from(new Set(perms.map((p) => p.httpMethod))).map((method) => (
                            <span
                              key={method}
                              className={`${METHOD_COLORS[method]} text-[10px] font-bold px-1.5 py-0.5 rounded`}
                            >
                              {METHOD_ABBR[method]}
                            </span>
                          ))}
                        </div>
                        {isCollapsed ? (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="divide-y divide-gray-50">
                        {perms.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50/40 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPerms.has(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer shrink-0"
                            />
                            <Badge className={`${METHOD_COLORS[perm.httpMethod]} border-none shadow-none text-xs font-bold w-12 text-center shrink-0`}>
                              {perm.httpMethod}
                            </Badge>
                            <code className="text-xs text-gray-700 font-mono flex-1 truncate" title={perm.code}>
                              {perm.code}
                            </code>
                            <code className="text-xs text-gray-400 font-mono truncate max-w-[220px]" title={perm.pathPattern}>
                              {perm.pathPattern}
                            </code>
                            <span className={`text-xs font-medium shrink-0 ${perm.active ? 'text-green-600' : 'text-red-400'}`}>
                              {perm.active ? 'Active' : 'Off'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t px-6 py-4 shrink-0">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              `Lưu thay đổi (${selectedCount} quyền)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
