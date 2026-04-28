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
import { roleService, permissionService, type Role, type Permission, type HttpMethod } from '@/services/permission.service'

interface RoleTableProps {
  roles: Role[]
  permissions: Permission[]
  loading?: boolean
  onUpdate?: (updated: Role) => void
  onDelete?: (id: number) => void
  onRefresh?: () => void
}

const HTTP_METHODS: { value: HttpMethod; label: string }[] = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
]

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-orange-100 text-orange-700',
  PATCH: 'bg-purple-100 text-purple-700',
  DELETE: 'bg-red-100 text-red-700',
}

export function RoleTable({ roles, permissions, loading = false, onUpdate, onDelete, onRefresh }: RoleTableProps) {
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
              const rolePerms = permissions.filter((p) => p.roleCode === role.code)
              return (
                <TableRow key={role.id}>
                  <TableCell className="font-medium text-gray-600">{role.id}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{role.code}</code>
                  </TableCell>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 shadow-none font-normal">
                      {rolePerms.length} permission{rolePerms.length !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      <RoleDetailDialog
                        role={role}
                        permissions={permissions}
                        rolePermissions={rolePerms}
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

      {/* Delete Confirmation Dialog */}
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
  permissions,
  rolePermissions,
  onRefresh,
}: {
  role: Role
  permissions: Permission[]
  rolePermissions: Permission[]
  onRefresh?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [selectedPerms, setSelectedPerms] = useState<Set<number>>(
    new Set(rolePermissions.map((p) => p.id))
  )
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMethod, setFilterMethod] = useState<string>('')
  const [currentPerms, setCurrentPerms] = useState(rolePermissions)

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setSelectedPerms(new Set(rolePermissions.map((p) => p.id)))
      setCurrentPerms(rolePermissions)
      setSearchTerm('')
      setFilterMethod('')
    }
    setOpen(newOpen)
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

  let filteredPerms = permissions
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase()
    filteredPerms = filteredPerms.filter(
      (p) =>
        p.code.toLowerCase().includes(term) ||
        p.pathPattern.toLowerCase().includes(term)
    )
  }
  if (filterMethod) {
    filteredPerms = filteredPerms.filter((p) => p.httpMethod === filterMethod)
  }

  const handleSave = async () => {
    setSaving(true)
    const loadingToast = toast.loading('Đang lưu thay đổi...', { duration: Infinity })

    try {
      const toRemove = rolePermissions
        .filter((p) => !selectedPerms.has(p.id))
        .map((p) => p.id)

      const toAdd = permissions.filter(
        (p) => selectedPerms.has(p.id) && !rolePermissions.some((rp) => rp.id === p.id)
      )

      for (const permId of toRemove) {
        await permissionService.deletePermission(permId)
      }

      for (const perm of toAdd) {
        await permissionService.createAndAssign({
          code: perm.code,
          httpMethod: perm.httpMethod,
          pathPattern: perm.pathPattern,
          active: perm.active,
          roleCode: role.code,
        })
      }

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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 px-2.5 cursor-pointer">
          Phân quyền
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Phân quyền cho: {role.name} ({role.code})</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3 py-2">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="Tìm theo code hoặc path..."
              className="pl-9 h-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="h-9 px-3 border border-gray-200 rounded-md text-sm bg-white cursor-pointer"
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="">Tất cả Method</option>
            {HTTP_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-[#fcfcfc] border-b sticky top-0">
              <tr className="text-gray-500 font-medium">
                <TableHeaderCell className="w-12 text-center">
                  <span className="sr-only">Chọn</span>
                </TableHeaderCell>
                <TableHeaderCell>Code</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Path Pattern</TableHeaderCell>
                <TableHeaderCell className="text-center">Active</TableHeaderCell>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {filteredPerms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Không có permission nào
                  </td>
                </tr>
              ) : (
                filteredPerms.map((perm) => (
                  <TableRow key={perm.id}>
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedPerms.has(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                        {perm.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${METHOD_COLORS[perm.httpMethod]} border-none shadow-none text-xs font-semibold`}>
                        {perm.httpMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-gray-600 font-mono">{perm.pathPattern}</code>
                    </TableCell>
                    <TableCell className="text-center">
                      {perm.active ? (
                        <span className="text-green-600 text-xs font-medium">Yes</span>
                      ) : (
                        <span className="text-red-500 text-xs font-medium">No</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </table>
        </div>

        <DialogFooter className="gap-2 border-t pt-4 mt-4 shrink-0">
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
              `Lưu (${selectedPerms.size} permissions)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
