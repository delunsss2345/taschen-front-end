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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { toast } from 'sonner'
import { permissionService, type Permission, type HttpMethod } from '@/services/permission.service'

interface PermissionTableProps {
  permissions: Permission[]
  loading?: boolean
  onUpdate?: (updated: Permission) => void
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
  GET: 'bg-green-100 text-green-700 hover:bg-green-100',
  POST: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  PUT: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  PATCH: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  DELETE: 'bg-red-100 text-red-700 hover:bg-red-100',
}

function getRoleDisplay(code: string | null | undefined): React.ReactNode {
  if (!code) {
    return <Badge variant="outline" className="text-gray-400">Chưa gán</Badge>
  }
  const codes = code.split(',').map((c) => c.trim()).filter(Boolean)
  const colorClass = (c: string) =>
    c === 'ADMIN'
      ? 'bg-red-100 text-red-700 hover:bg-red-100'
      : c === 'SELLER'
      ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
      : c === 'WAREHOUSE_STAFF'
      ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
      : c === 'USER'
      ? 'bg-green-100 text-green-700 hover:bg-green-700'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {codes.map((c) => (
        <Badge key={c} className={`${colorClass(c)} border-none shadow-none text-xs font-mono`}>
          {c}
        </Badge>
      ))}
    </div>
  )
}

export function PermissionTable({
  permissions,
  loading = false,
  onUpdate,
  onDelete,
}: PermissionTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (id: number) => {
    setDeleting(true)
    const loadingToast = toast.loading('Đang xóa permission...', { duration: Infinity })

    try {
      const result = await permissionService.deletePermission(id)
      if (result) {
        toast.dismiss(loadingToast)
        toast.success('Permission đã được xóa thành công.')
        onDelete?.(id)
      } else {
        toast.dismiss(loadingToast)
        toast.error('Không thể xóa permission. Vui lòng thử lại.')
      }
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Có lỗi xảy ra khi xóa permission.')
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

  if (permissions.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 gap-2">
          <span>Không có permission nào</span>
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
              <TableHeaderCell>HTTP Method</TableHeaderCell>
              <TableHeaderCell>Path Pattern</TableHeaderCell>
              <TableHeaderCell className="text-center">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-center">Role</TableHeaderCell>
              <TableHeaderCell className="text-center">Thao tác</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {permissions.map((perm) => (
              <TableRow key={perm.id}>
                <TableCell className="font-medium text-gray-600">{perm.id}</TableCell>
                <TableCell>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {perm.code}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge className={`${METHOD_COLORS[perm.httpMethod]} border-none shadow-none font-semibold min-w-[60px] text-center justify-center`}>
                    {perm.httpMethod}
                  </Badge>
                </TableCell>
                <TableCell>
                  <code className="text-xs text-gray-600 font-mono">{perm.pathPattern}</code>
                </TableCell>
                <TableCell className="text-center">
                  {perm.active ? (
                    <Badge className="bg-green-50 text-green-600 border-green-100 hover:bg-green-50 shadow-none font-normal">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-600 border-red-100 hover:bg-red-50 shadow-none font-normal">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {getRoleDisplay(perm.roleCode)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1.5">
                    <ViewPermissionDialog permission={perm}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 px-2.5 cursor-pointer"
                      >
                        Xem
                      </Button>
                    </ViewPermissionDialog>
                    <EditPermissionModal
                      permission={perm}
                      onUpdate={onUpdate}
                    />
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 gap-1 px-2.5 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                      onClick={() => setDeleteConfirmId(perm.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
                Bạn có chắc chắn muốn xóa permission này? Hành động này sẽ tự động gỡ permission khỏi tất cả các role liên quan.
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

function ViewPermissionDialog({
  permission,
  children,
}: {
  permission: Permission
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết Permission</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 text-left">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">ID</p>
              <p className="font-medium mt-1">{permission.id}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Trạng thái</p>
              <div className="mt-1">
                {permission.active ? (
                  <Badge className="bg-green-50 text-green-600 border-green-100 shadow-none">Active</Badge>
                ) : (
                  <Badge className="bg-red-50 text-red-600 border-red-100 shadow-none">Inactive</Badge>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs uppercase tracking-wide">Code</p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono mt-1 inline-block">
                {permission.code}
              </code>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">HTTP Method</p>
              <div className="mt-1">
                <Badge className={`${METHOD_COLORS[permission.httpMethod]} border-none shadow-none font-semibold`}>
                  {permission.httpMethod}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Role gán</p>
              <div className="mt-1">{getRoleDisplay(permission.roleCode)}</div>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs uppercase tracking-wide">Path Pattern</p>
              <code className="text-sm text-gray-700 font-mono mt-1 block">{permission.pathPattern}</code>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4 mt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditPermissionModal({
  permission,
  onUpdate,
}: {
  permission: Permission
  onUpdate?: (updated: Permission) => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: permission.code,
    httpMethod: permission.httpMethod,
    pathPattern: permission.pathPattern,
    active: permission.active,
  })

  const onSubmit = async () => {
    if (!form.code.trim()) {
      toast.error('Vui lòng nhập mã permission')
      return
    }
    if (!form.pathPattern.trim()) {
      toast.error('Vui lòng nhập path pattern')
      return
    }

    setSaving(true)
    const loadingToast = toast.loading('Đang cập nhật...', { duration: Infinity })

    try {
      const result = await permissionService.updatePermission(permission.id, {
        code: form.code.trim().toUpperCase().replace(/\s+/g, '_'),
        httpMethod: form.httpMethod,
        pathPattern: form.pathPattern.trim(),
        active: form.active,
      })

      if (!result) {
        toast.dismiss(loadingToast)
        toast.error('Không thể cập nhật permission. Vui lòng thử lại.')
        return
      }

      toast.dismiss(loadingToast)
      toast.success('Permission đã được cập nhật thành công.')
      onUpdate?.(result)
      setOpen(false)
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Có lỗi xảy ra khi cập nhật permission.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="h-8 gap-1 px-2.5 bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Sửa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sửa Permission: {permission.code}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Code <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              placeholder="VD: BOOK_CREATE"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                HTTP Method <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.httpMethod}
                onValueChange={(v) => setForm({ ...form, httpMethod: v as HttpMethod })}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HTTP_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái</label>
              <Select
                value={form.active ? 'true' : 'false'}
                onValueChange={(v) => setForm({ ...form, active: v === 'true' })}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Path Pattern <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.pathPattern}
              onChange={(e) => setForm({ ...form, pathPattern: e.target.value })}
              placeholder="VD: /api/books/**"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4 mt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={onSubmit}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
