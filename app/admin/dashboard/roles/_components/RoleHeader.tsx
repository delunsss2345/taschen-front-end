'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { Loader2 } from 'lucide-react'
import { roleService } from '@/services/permission.service'

interface RoleHeaderProps {
  onCreate?: (created: { id: number; code: string; name: string }) => void
}

export function RoleHeader({ onCreate }: RoleHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Role</h1>
        <CreateRoleModal onSuccess={onCreate}>
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <Plus className="h-4 w-4" />
            Tạo Role
          </Button>
        </CreateRoleModal>
      </div>
    </div>
  )
}

function CreateRoleModal({
  children,
  onSuccess,
}: {
  children: React.ReactNode
  onSuccess?: (created: { id: number; code: string; name: string }) => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: '',
    name: '',
  })

  const onSubmit = async () => {
    if (!form.code.trim()) {
      toast.error('Vui lòng nhập mã role')
      return
    }
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên role')
      return
    }

    setSaving(true)
    const loadingToast = toast.loading('Đang tạo role...', { duration: Infinity })

    try {
      const result = await roleService.createRole({
        code: form.code.trim().toUpperCase().replace(/\s+/g, '_'),
        name: form.name.trim(),
      })

      if (!result) {
        toast.dismiss(loadingToast)
        toast.error('Không thể tạo role. Vui lòng thử lại.')
        return
      }

      toast.dismiss(loadingToast)
      toast.success('Role đã được tạo thành công.')
      setOpen(false)
      setForm({ code: '', name: '' })
      onSuccess?.(result)
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Có lỗi xảy ra khi tạo role.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo Role mới</DialogTitle>
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
              placeholder="VD: MANAGER, SUPERVISOR"
            />
            <p className="text-xs text-gray-400">
              Mã định danh role. Nên viết HOA, không dấu.
            </p>
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
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={onSubmit}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo Role'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
