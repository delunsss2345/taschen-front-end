'use client'

import { useState, useRef, useEffect } from 'react'
import { ImagePlus, X, Upload } from 'lucide-react'
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
import { bannerService } from '@/services/banner.service'
import Image from 'next/image'

interface BannerFormModalProps {
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function BannerFormModal({ trigger, onSuccess }: BannerFormModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) {
      setName('')
      setSelectedFile(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }, [open, previewUrl])

  const onPickFile = (file: File | null) => {
    setSelectedFile(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const onRemoveImage = () => {
    setSelectedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async () => {
    if (!name.trim() || !selectedFile) {
      if (!name.trim()) toast.error('Vui lòng nhập tên banner.')
      if (!selectedFile) toast.error('Vui lòng chọn hình ảnh banner.')
      return
    }

    const loadingToast = toast.loading('Đang lưu...', {
      duration: Infinity,
    })

    try {
      setIsSubmitting(true)

      const uploadedUrl = await bannerService.uploadBannerImage(selectedFile)

      await bannerService.createBanner({
        name: name.trim(),
        imageUrl: uploadedUrl,
      })

      toast.dismiss(loadingToast)
      toast.success('Banner mới đã được thêm.')
      setOpen(false)
      setName('')
      setSelectedFile(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      onSuccess?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể thêm banner')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Thêm Banner mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên Banner</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên banner (vd: Banner Khuyến mãi mùa hè)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hình ảnh Banner</label>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="relative h-32 w-48 rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <ImagePlus className="h-6 w-6 text-gray-300" />
                        <span className="text-xs text-gray-400">Chưa có ảnh</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    {previewUrl ? 'Đổi ảnh' : 'Chọn ảnh'}
                  </Button>

                  {selectedFile && (
                    <div className="text-xs text-gray-500 bg-white p-1.5 rounded border border-gray-100 truncate">
                      {selectedFile.name}
                    </div>
                  )}

                  {(previewUrl || selectedFile) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      onClick={onRemoveImage}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Xóa ảnh
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Kích thước khuyến nghị: 1920x600px hoặc tỷ lệ 16:5. Hỗ trợ JPG, PNG, WebP.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={onSubmit}
            disabled={!name.trim() || !selectedFile || isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
