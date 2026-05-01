'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PermissionHeader } from './PermissionHeader'
import { PermissionTable } from './PermissionTable'
import { permissionService, roleService, type Permission, type Role } from '@/services/permission.service'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Meta = { page: number; pageSize: number; pages: number; total: number }

const PAGE_SIZE = 10

export function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [meta, setMeta] = useState<Meta>({ page: 1, pageSize: PAGE_SIZE, pages: 1, total: 0 })
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [filterMethod, setFilterMethod] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterActive, setFilterActive] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleSearch = (term: string) => {
    setKeyword(term)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedKeyword(term)
      setPage(1)
    }, 300)
  }

  const fetchPermissions = useCallback(async () => {
    setLoading(true)
    try {
      const result = await permissionService.getPermissionsPaged({
        page,
        size: PAGE_SIZE,
        keyword: debouncedKeyword,
      })
      setPermissions(result.permissions)
      setMeta((prev) => ({ ...prev, ...result.meta }))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh sách permission'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [page, debouncedKeyword])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  useEffect(() => {
    roleService.getAllRoles().then(setRoles).catch(() => {})
  }, [])

  const filtered = permissions.filter((p) => {
    if (filterMethod && filterMethod !== '__all__' && p.httpMethod !== filterMethod) return false
    if (filterRole === '__unassigned__' && p.roleCode) return false
    if (filterRole && filterRole !== '__all__' && filterRole !== '__unassigned__' && !p.roleCode?.split(',').map((c) => c.trim()).includes(filterRole)) return false
    if (filterActive && filterActive !== '__all__') {
      if ((filterActive === 'true') !== p.active) return false
    }
    return true
  })

  const handleUpdatePermission = (updated: Permission) => {
    setPermissions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  return (
    <div className="space-y-4">
      <PermissionHeader
        onSearch={handleSearch}
        searchTerm={keyword}
        filterMethod={filterMethod}
        filterRole={filterRole}
        filterActive={filterActive}
        onFilterMethodChange={setFilterMethod}
        onFilterRoleChange={setFilterRole}
        onFilterActiveChange={setFilterActive}
        roles={roles}
        onCreate={() => fetchPermissions()}
      />
      <PermissionTable
        permissions={filtered}
        loading={loading}
        onUpdate={handleUpdatePermission}
        onDelete={() => fetchPermissions()}
        onRefresh={fetchPermissions}
      />
      {!loading && meta.total > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-500">
            Trang {meta.page} / {meta.pages} · Tổng {meta.total} quyền
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 cursor-pointer"
              disabled={page >= meta.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Tiếp
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
