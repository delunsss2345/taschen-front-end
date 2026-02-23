'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
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
import { toast } from 'sonner'
import { categoryService } from '@/services/category.service'

interface CategoryHeaderProps {
  onSuccess?: () => void
}

export function CategoryHeader({ onSuccess }: CategoryHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Thể loại</h1>
        <AddCategoryModal
          onSuccess={onSuccess}
          trigger={
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Plus className="h-4 w-4" />
              Thêm thể loại mới
            </Button>
          }
        />
      </div>

      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm theo tên thể loại"
          className="pl-10 h-10 bg-white border-gray-200"
        />
      </div>
    </div>
  )
}

function AddCategoryModal({ trigger, onSuccess }: { trigger: React.ReactNode; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async () => {
    if (!name.trim()) return

    const loadingToast = toast.loading('Đang lưu...', {
      duration: Infinity,
    })

    try {
      setIsSubmitting(true)
      const categoryCode = code.trim() || name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_')
      await categoryService.createCategory({ name, code: categoryCode })
      toast.dismiss(loadingToast)
      toast.success('Thể loại mới đã được thêm.')
      setOpen(false)
      setName('')
      setCode('')
      onSuccess?.()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Không thể thêm thể loại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm thể loại mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mã thể loại</label>
            <Input
              placeholder="Nhập mã (vd: SCIENCE)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên thể loại</label>
            <Input
              placeholder="Nhập tên thể loại (vd: Trinh thám)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={onSubmit}
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
