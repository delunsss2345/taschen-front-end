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
import { useCreateCategoryMutation } from '@/features/category/hooks'

interface AddCategoryModalProps {
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function AddCategoryModal({ trigger, onSuccess }: AddCategoryModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const { mutate: createCategory, isPending } = useCreateCategoryMutation()

  const onSubmit = () => {
    if (!name.trim()) return

    const categoryCode = code.trim() || name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_')
    
    createCategory(
      { name, code: categoryCode },
      {
        onSuccess: () => {
          toast.success('Thể loại mới đã được thêm.')
          setOpen(false)
          setName('')
          setCode('')
          onSuccess?.()
        },
        onError: () => {
          toast.error('Không thể thêm thể loại')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
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
            disabled={!name.trim() || isPending}
          >
            {isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
