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
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Category {
  id: number
  name: string
}

interface CategoryTableProps {
  categories: Category[]
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const handleDelete = async (cat: Category) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 500))
    
    toast.promise(promise, {
      loading: 'Đang xóa...',
      success: () => `Thể loại "${cat.name}" đã được xóa.`,
      error: () => 'Có lỗi xảy ra.',
    })

    await promise
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 gap-1 px-3 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        Xóa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                      </AlertDialogHeader>
                      <p className="text-sm text-gray-600">
                        Bạn có chắc chắn muốn xóa thể loại <span className="font-medium">{cat.name}</span>? 
                        Hành động này không thể hoàn tác.
                      </p>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={() => handleDelete(cat)}
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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

    const promise = new Promise((resolve) => setTimeout(resolve, 800))

    toast.promise(promise, {
      loading: 'Đang xử lý...',
      success: () => {
        setOpen(false)
        return 'Thông tin thể loại đã được cập nhật.'
      },
      error: () => 'Có lỗi xảy ra.',
    })

    await promise
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
