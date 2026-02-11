'use client'

import { useState } from 'react'
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
import Swal from 'sweetalert2'

export function CategoryHeader() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Thể loại</h1>
      <AddCategoryModal
        trigger={
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <Plus className="h-4 w-4" />
            Thêm thể loại mới
          </Button>
        }
      />
    </div>
  )
}

function AddCategoryModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const onSubmit = async () => {
    if (!name.trim()) return

    const result = await Swal.fire({
      title: 'Xác nhận thêm thể loại?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Thêm',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      customClass: {
        container: 'z-[9999]',
      },
    })

    if (!result.isConfirmed) return

    Swal.fire({
      title: 'Đang lưu...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      customClass: { container: 'z-[9999]' },
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    Swal.close()
    await Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Thể loại mới đã được thêm.',
      confirmButtonColor: '#2563eb',
      customClass: { container: 'z-[9999]' },
    })

    setOpen(false)
    setName('')
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
            disabled={!name.trim()}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
