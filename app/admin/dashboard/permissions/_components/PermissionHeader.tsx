'use client'

import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { permissionService, type HttpMethod, type CreateAssignRequest, type Permission } from '@/services/permission.service'

interface PermissionHeaderProps {
  onSearch?: (term: string) => void
  searchTerm?: string
  filterMethod: string
  filterRole: string
  filterActive: string
  onFilterMethodChange: (value: string) => void
  onFilterRoleChange: (value: string) => void
  onFilterActiveChange: (value: string) => void
  roles: { id: number; code: string; name: string }[]
  onCreate?: (created: Permission) => void
}

const HTTP_METHODS: { value: HttpMethod; label: string }[] = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
]

const SYSTEM_ROLES = [
  { code: 'GUEST', name: 'Khách' },
  { code: 'USER', name: 'Người dùng thường' },
  { code: 'ADMIN', name: 'Quản trị viên' },
  { code: 'SELLER', name: 'Nhân viên bán hàng' },
  { code: 'WAREHOUSE_STAFF', name: 'Nhân viên kho' },
]

const ROLE_NAME_MAP: Record<string, string> = {
  GUEST: 'Khách',
  USER: 'Người dùng thường',
  ADMIN: 'Quản trị viên',
  SELLER: 'Nhân viên bán hàng',
  WAREHOUSE_STAFF: 'Nhân viên kho',
}

export function PermissionHeader({
  onSearch,
  searchTerm = '',
  filterMethod,
  filterRole,
  filterActive,
  onFilterMethodChange,
  onFilterRoleChange,
  onFilterActiveChange,
  roles,
  onCreate,
}: PermissionHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Permission</h1>
        <div className="flex items-center gap-2">
          <CreatePermissionModal roles={roles} onSuccess={onCreate}>
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Plus className="h-4 w-4" />
              Tạo Permission
            </Button>
          </CreatePermissionModal>
          <AssignPermissionModal roles={roles} systemRoleNames={ROLE_NAME_MAP} onSuccess={onCreate}>
            <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
              <Plus className="h-4 w-4" />
              Tạo &amp; Gán Permission
            </Button>
          </AssignPermissionModal>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm theo code hoặc path pattern"
            className="pl-10 h-10 bg-white border-gray-200"
            value={searchTerm}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        <Select value={filterMethod} onValueChange={onFilterMethodChange}>
          <SelectTrigger className="w-36 h-10 bg-white border-gray-200 cursor-pointer">
            <SelectValue placeholder="HTTP Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tất cả Method</SelectItem>
            {HTTP_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterRole} onValueChange={onFilterRoleChange}>
          <SelectTrigger className="w-52 h-10 bg-white border-gray-200 cursor-pointer">
            <SelectValue placeholder="Theo Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tất cả Role</SelectItem>
            <SelectItem value="__unassigned__">Chưa gán</SelectItem>
            {SYSTEM_ROLES.map((r) => (
              <SelectItem key={r.code} value={r.code}>{r.name} ({r.code})</SelectItem>
            ))}
            {roles.filter((r) => !SYSTEM_ROLES.find((s) => s.code === r.code)).map((r) => (
              <SelectItem key={r.code} value={r.code}>{r.name} ({r.code})</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterActive} onValueChange={onFilterActiveChange}>
          <SelectTrigger className="w-40 h-10 bg-white border-gray-200 cursor-pointer">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Tất cả</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {(filterMethod || filterRole || filterActive || searchTerm) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => {
              onSearch?.('')
              onFilterMethodChange('')
              onFilterRoleChange('')
              onFilterActiveChange('')
            }}
          >
            Xóa lọc
          </Button>
        )}
      </div>
    </div>
  )
}

function CreatePermissionModal({
  children,
  roles,
  onSuccess,
}: {
  children: React.ReactNode
  roles: { id: number; code: string; name: string }[]
  onSuccess?: (created: Permission) => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: '',
    httpMethod: 'GET' as HttpMethod,
    pathPattern: '',
    active: true,
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
    const loadingToast = toast.loading('Đang tạo permission...', { duration: Infinity })

    try {
      const result = await permissionService.createPermission({
        code: form.code.trim().toUpperCase().replace(/\s+/g, '_'),
        httpMethod: form.httpMethod,
        pathPattern: form.pathPattern.trim(),
        active: form.active,
      })

      if (!result) {
        toast.dismiss(loadingToast)
        toast.error('Không thể tạo permission. Vui lòng thử lại.')
        return
      }

      toast.dismiss(loadingToast)
      toast.success('Permission đã được tạo thành công.')
      setOpen(false)
      setForm({ code: '', httpMethod: 'GET', pathPattern: '', active: true })
      onSuccess?.(result)
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Có lỗi xảy ra khi tạo permission.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo Permission mới</DialogTitle>
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
              placeholder="VD: BOOK_CREATE, USER_GET_ALL"
            />
            <p className="text-xs text-gray-400">
              Mã định danh permission. Không trùng lặp.
            </p>
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
              placeholder="VD: /api/books/**, /api/orders/*"
            />
            <p className="text-xs text-gray-400">
              Sử dụng ** để match nhiều segment, * cho 1 segment.
            </p>
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
            {saving ? 'Đang tạo...' : 'Tạo Permission'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AssignPermissionModal({
  children,
  roles,
  systemRoleNames,
  onSuccess,
}: {
  children: React.ReactNode
  roles: { id: number; code: string; name: string }[]
  systemRoleNames: Record<string, string>
  onSuccess?: (created: Permission) => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: '',
    httpMethod: 'GET' as HttpMethod,
    pathPattern: '',
    active: true,
    roleCode: '',
  })

  const allRoles = [
    ...SYSTEM_ROLES.map((r) => ({ ...r, id: 0 })),
    ...roles.map((r) => ({
      id: r.id,
      code: r.code,
      name: systemRoleNames[r.code] || r.name,
    })),
  ]

  const onSubmit = async () => {
    if (!form.code.trim()) {
      toast.error('Vui lòng nhập mã permission')
      return
    }
    if (!form.pathPattern.trim()) {
      toast.error('Vui lòng nhập path pattern')
      return
    }
    if (!form.roleCode) {
      toast.error('Vui lòng chọn role để gán')
      return
    }

    setSaving(true)
    const loadingToast = toast.loading('Đang tạo và gán permission...', { duration: Infinity })

    try {
      const payload: CreateAssignRequest = {
        code: form.code.trim().toUpperCase().replace(/\s+/g, '_'),
        httpMethod: form.httpMethod,
        pathPattern: form.pathPattern.trim(),
        active: form.active,
        roleCode: form.roleCode,
      }

      const result = await permissionService.createAndAssign(payload)

      if (!result) {
        toast.dismiss(loadingToast)
        toast.error('Không thể tạo permission. Vui lòng thử lại.')
        return
      }

      toast.dismiss(loadingToast)
      toast.success('Permission đã được tạo và gán thành công.')
      setOpen(false)
      setForm({ code: '', httpMethod: 'GET', pathPattern: '', active: true, roleCode: '' })
      onSuccess?.(result)
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Có lỗi xảy ra khi tạo permission.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo &amp; Gán Permission</DialogTitle>
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
              placeholder="VD: BOOK_CREATE, ORDER_GET_ALL"
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
              <label className="text-sm font-medium text-gray-700">
                Role <span className="text-red-500">*</span>
              </label>
              <Select value={form.roleCode} onValueChange={(v) => setForm({ ...form, roleCode: v })}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Chọn role" />
                </SelectTrigger>
                <SelectContent>
                  {allRoles.map((r) => (
                    <SelectItem key={r.code} value={r.code}>{r.name} ({r.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              placeholder="VD: /api/books/**, /api/orders/*"
            />
            <p className="text-xs text-gray-400">
              ** match mọi path bắt đầu bằng, * match 1 segment.
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4 mt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 cursor-pointer"
            onClick={onSubmit}
            disabled={saving}
          >
            {saving ? 'Đang tạo...' : 'Tạo & Gán'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
