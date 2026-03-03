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
import type { Format } from '@/types/response/format.response'
import { formatService } from '@/services/format.service'

interface FormatTableProps {
  formats: Format[]
  isLoading?: boolean
  onEditSuccess?: () => void
  onDeleteSuccess?: () => void
}

export function FormatTable({ formats, isLoading, onEditSuccess, onDeleteSuccess }: FormatTableProps) {
  const handleDelete = async (fmt: Format) => {
    const loadingToast = toast.loading('Đang xóa...', {
      duration: Infinity,
    })

    try {
      await formatService.deleteFormat(fmt.id)
      toast.dismiss(loadingToast)
      toast.success(`Định dạng "${fmt.formatName}" đã được xóa.`)
      onDeleteSuccess?.()
    } catch (error: unknown) {
      toast.dismiss(loadingToast)
      let errorMessage = 'Đã xảy ra lỗi không xác định'
      
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string } } }
        const backendMsg = axiosError.response?.data?.message || axiosError.response?.data?.error
        if (backendMsg) {
          errorMessage = backendMsg
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error('Lỗi khi xóa định dạng: ' + errorMessage)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <LoadingSpinner />
      </div>
    )
  }

  if (formats.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Chưa có định dạng nào</span>
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
            <TableHeaderCell>Mã định dạng</TableHeaderCell>
            <TableHeaderCell>Tên định dạng</TableHeaderCell>
            <TableHeaderCell className="text-center w-48">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {formats.map((fmt) => (
            <TableRow key={fmt.id}>
              <TableCell>{fmt.id}</TableCell>
              <TableCell>{fmt.formatCode}</TableCell>
              <TableCell>{fmt.formatName}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <EditFormatModal
                    format={fmt}
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
                        Bạn có chắc chắn muốn xóa định dạng <span className="font-medium">{fmt.formatName}</span>? 
                        Hành động này không thể hoàn tác.
                      </p>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={() => handleDelete(fmt)}
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

function EditFormatModal({ trigger, format, onSuccess }: { trigger: React.ReactNode; format: Format; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [formatCode, setFormatCode] = useState(format.formatCode)
  const [formatName, setFormatName] = useState(format.formatName)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpen = (val: boolean) => {
    setOpen(val)
    if (val) {
      setFormatCode(format.formatCode)
      setFormatName(format.formatName)
    }
  }

  const onSubmit = async () => {
    if (!formatCode.trim() || !formatName.trim()) return

    const loadingToast = toast.loading('Đang lưu...', {
      duration: Infinity,
    })

    try {
      setIsLoading(true)
      await formatService.updateFormat(format.id, {
        formatCode: formatCode.trim(),
        formatName: formatName.trim(),
      })
      toast.dismiss(loadingToast)
      toast.success('Thông tin định dạng đã được cập nhật.')
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Không thể cập nhật định dạng')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa định dạng</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mã định dạng</label>
            <Input value={formatCode} onChange={(e) => setFormatCode(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên định dạng</label>
            <Input value={formatName} onChange={(e) => setFormatName(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={onSubmit}
            disabled={!formatCode.trim() || !formatName.trim() || isLoading || (formatCode === format.formatCode && formatName === format.formatName)}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
