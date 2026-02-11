'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
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

interface Category {
  id: number
  name: string
}

interface CategoryTableProps {
  categories: Category[]
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const handleDelete = async (cat: Category) => {
    const result = await Swal.fire({
      title: 'Bạn chắc chắn muốn xóa?',
      text: `Thể loại "${cat.name}" sẽ bị xóa khỏi hệ thống.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      customClass: { container: 'z-[9999]' },
    })

    if (result.isConfirmed) {
      await Swal.fire({
        title: 'Đã xóa!',
        text: 'Thể loại đã được xóa thành công.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
        customClass: { container: 'z-[9999]' },
      })
    }
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <th className="px-6 py-4 font-semibold w-24">ID</th>
            <th className="px-6 py-4 font-semibold">Tên thể loại</th>
            <th className="px-6 py-4 font-semibold text-center w-48">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5 text-gray-600">{cat.id}</td>
              <td className="px-6 py-5 font-medium text-gray-900">{cat.name}</td>
              <td className="px-6 py-5">
                <div className="flex items-center justify-end gap-2">
                  <EditCategoryModal
                    category={cat}
                    trigger={
                      <Button
                        variant="default"
                        size="sm"
                        className="h-8 gap-1 px-3 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        Sửa
                      </Button>
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 gap-1 px-3 cursor-pointer"
                    onClick={() => handleDelete(cat)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Xóa
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EditCategoryModal({ trigger, category }: { trigger: React.ReactNode; category: Category }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category.name)

  const onSubmit = async () => {
    if (!name.trim()) return

    const result = await Swal.fire({
      title: 'Xác nhận cập nhật?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cập nhật',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      customClass: { container: 'z-[9999]' },
    })

    if (!result.isConfirmed) return

    Swal.fire({
      title: 'Đang xử lý...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      customClass: { container: 'z-[9999]' },
    })

    await new Promise((resolve) => setTimeout(resolve, 800))

    Swal.close()
    await Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Thông tin thể loại đã được cập nhật.',
      confirmButtonColor: '#2563eb',
      customClass: { container: 'z-[9999]' },
    })

    setOpen(false)
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
      <DialogContent className="sm:max-w-[425px]">
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
            disabled={!name.trim() || name === category.name}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
