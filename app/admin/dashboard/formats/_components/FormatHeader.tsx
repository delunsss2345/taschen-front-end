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
import { formatService } from '@/services/format.service'

interface FormatHeaderProps {
  onSuccess?: () => void
}

export function FormatHeader({ onSuccess }: FormatHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Định dạng</h1>
        <AddFormatModal
          onSuccess={onSuccess}
          trigger={
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Plus className="h-4 w-4" />
              Thêm định dạng mới
            </Button>
          }
        />
      </div>

      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm theo tên định dạng"
          className="pl-10 h-10 bg-white border-gray-200"
        />
      </div>
    </div>
  )
}

function AddFormatModal({ trigger, onSuccess }: { trigger: React.ReactNode; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [formatCode, setFormatCode] = useState('')
  const [formatName, setFormatName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    if (!formatCode.trim() || !formatName.trim()) return

    const loadingToast = toast.loading('Đang lưu...', {
      duration: Infinity,
    })

    try {
      setIsLoading(true)
      await formatService.createFormat({
        formatCode: formatCode.trim(),
        formatName: formatName.trim(),
      })
      toast.dismiss(loadingToast)
      toast.success('Định dạng mới đã được thêm.')
      setOpen(false)
      setFormatCode('')
      setFormatName('')
      onSuccess?.()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Không thể thêm định dạng')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm định dạng mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mã định dạng</label>
            <Input
              placeholder="Mã (vd: HB, PB, EB)"
              value={formatCode}
              onChange={(e) => setFormatCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên định dạng</label>
            <Input
              placeholder="Tên (vd: Bìa mềm, E-book)"
              value={formatName}
              onChange={(e) => setFormatName(e.target.value)}
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
            disabled={!formatCode.trim() || !formatName.trim() || isLoading}
          >
            {isLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
