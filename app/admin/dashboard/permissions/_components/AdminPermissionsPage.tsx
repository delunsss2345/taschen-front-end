'use client'

import { useEffect, useState } from 'react'
import { PermissionHeader } from './PermissionHeader'
import { PermissionTable } from './PermissionTable'
import { permissionService, type Permission } from '@/services/permission.service'
import { roleService, type Role } from '@/services/permission.service'
import { toast } from 'sonner'

export function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMethod, setFilterMethod] = useState<string>('')
  const [filterRole, setFilterRole] = useState<string>('')
  const [filterActive, setFilterActive] = useState<string>('')

  const fetchPermissions = async () => {
    setLoading(true)
    try {
      const [perms, roleList] = await Promise.all([
        permissionService.getAllPermissions(),
        roleService.getAllRoles(),
      ])
      setPermissions(perms)
      setRoles(roleList)
    } catch {
      toast.error('Không thể tải danh sách permission')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  useEffect(() => {
    let filtered = permissions

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.code.toLowerCase().includes(term) ||
          p.pathPattern.toLowerCase().includes(term)
      )
    }

    if (filterMethod) {
      filtered = filtered.filter((p) => p.httpMethod === filterMethod)
    }

    if (filterRole) {
      filtered = filtered.filter((p) => p.roleCode === filterRole)
    }

    if (filterActive) {
      const isActive = filterActive === 'true'
      filtered = filtered.filter((p) => p.active === isActive)
    }

    setFilteredPermissions(filtered)
  }, [searchTerm, filterMethod, filterRole, filterActive, permissions])

  const handleUpdatePermission = (updated: Permission) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }

  const handleDeletePermission = (id: number) => {
    setPermissions((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCreatePermission = (created: Permission) => {
    setPermissions((prev) => [...prev, created])
  }

  return (
    <div className="space-y-4">
      <PermissionHeader
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        filterMethod={filterMethod}
        filterRole={filterRole}
        filterActive={filterActive}
        onFilterMethodChange={setFilterMethod}
        onFilterRoleChange={setFilterRole}
        onFilterActiveChange={setFilterActive}
        roles={roles}
        onCreate={handleCreatePermission}
      />
      <PermissionTable
        permissions={filteredPermissions}
        loading={loading}
        roles={roles}
        onUpdate={handleUpdatePermission}
        onDelete={handleDeletePermission}
        onCreate={handleCreatePermission}
        onRefresh={fetchPermissions}
      />
    </div>
  )
}
