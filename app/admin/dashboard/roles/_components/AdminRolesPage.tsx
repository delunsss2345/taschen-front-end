'use client'

import { useEffect, useState } from 'react'
import { RoleHeader } from './RoleHeader'
import { RoleTable } from './RoleTable'
import { roleService, permissionService, type Role, type Permission } from '@/services/permission.service'
import { toast } from 'sonner'

export function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [roleList, permList] = await Promise.all([
        roleService.getAllRoles(),
        permissionService.getAllPermissions(),
      ])
      setRoles(roleList)
      setPermissions(permList)
    } catch {
      toast.error('Không thể tải danh sách role')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateRole = (created: Role) => {
    setRoles((prev) => [...prev, created])
  }

  const handleUpdateRole = (updated: Role) => {
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  const handleDeleteRole = (id: number) => {
    setRoles((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-4">
      <RoleHeader onCreate={handleCreateRole} />
      <RoleTable
        roles={roles}
        permissions={permissions}
        loading={loading}
        onUpdate={handleUpdateRole}
        onDelete={handleDeleteRole}
        onRefresh={fetchData}
      />
    </div>
  )
}
