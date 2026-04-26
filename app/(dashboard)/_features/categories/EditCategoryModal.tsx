'use client'

import { useState } from 'react'
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
import type { Category } from '@/types/response/category.response'
import { useUpdateCategoryMutation } from '@/features/category/hooks'

interface EditCategoryModalProps {
  trigger: React.ReactNode
  category: Category
  onSuccess?: () => void
}

export function EditCategoryModal({ trigger, category, onSuccess }: EditCategoryModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category.name)
  const { mutate: updateCategory, isPending } = useUpdateCategoryMutation()

  const onSubmit = () => {
    if (!name.trim()) return

    updateCategory(
      { categoryId: category.id, payload: { name } },
      {
        onSuccess: () => {
          toast.success('Thông tin thể loại đã được cập nhật.')
          setOpen(false)
          onSuccess?.()
        },
        onError: () => {
          toast.error('Không thể cập nhật thể loại')
        }
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (val) setName(category.name)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thể loại</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên thể loại</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={onSubmit}
            disabled={!name.trim() || name === category.name || isPending}
          >
            {isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
