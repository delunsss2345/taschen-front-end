'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { LoadingSpinner } from '@/components/ui/loading'
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
import type { Category } from '@/types/response/category.response'
import { categoryService } from '@/services/category.service'

interface CategoryTableProps {
  categories: Category[]
  isLoading?: boolean
  onEditSuccess?: () => void
  onDeleteSuccess?: () => void
}

export function CategoryTable({ categories, isLoading, onEditSuccess, onDeleteSuccess }: CategoryTableProps) {
  
  const handleDelete = async (cat: Category) => {
    try {
      await categoryService.deleteCategory(cat.id)
      toast.success(`Thể loại "${cat.name}" đã được xóa.`)
      onDeleteSuccess?.()
    } catch (error: unknown) {
      // Handle AxiosError
      let errorMessage = 'Đã xảy ra lỗi không xác định'
      
      if (typeof error === 'object' && error !== null && 'response' in error) {
        // AxiosError - try to get backend message
        const axiosError = error as { response?: { data?: { message?: string; error?: string } } }
        const backendMsg = axiosError.response?.data?.message || axiosError.response?.data?.error
        if (backendMsg) {
          errorMessage = backendMsg
        } else {
          errorMessage = 'Lỗi HTTP 400 - Yêu cầu không hợp lệ'
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Check for associated books error
      const errMsg = String(error)
      if (errMsg.includes('associated book') || errMsg.includes('Cannot delete category') || errorMessage.includes('associated book') || errorMessage.includes('Cannot delete category')) {
        toast.error('Không thể xóa thể loại!\nThể loại này đang gắn với một sách.')
      } else {
        toast.error('Lỗi khi xóa thể loại: ' + errorMessage)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <LoadingSpinner />
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Chưa có thể loại nào</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell className="w-24">ID</TableHeaderCell>
            <TableHeaderCell>Mã thể loại</TableHeaderCell>
            <TableHeaderCell>Tên thể loại</TableHeaderCell>
            <TableHeaderCell className="text-center w-48">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.id}</TableCell>
              <TableCell>{cat.code || '-'}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <EditCategoryModal
                    category={cat}
                    onSuccess={onEditSuccess}
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
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EditCategoryModal({ trigger, category, onSuccess }: { trigger: React.ReactNode; category: Category; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category.name)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async () => {
    if (!name.trim()) return

    try {
      setIsSubmitting(true)
      await categoryService.updateCategory(category.id, { name })
      toast.success('Thông tin thể loại đã được cập nhật.')
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Không thể cập nhật thể loại')
    } finally {
      setIsSubmitting(false)
    }
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
            disabled={!name.trim() || name === category.name || isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
