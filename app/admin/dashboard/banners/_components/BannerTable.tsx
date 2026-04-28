'use client'

import { useState, useRef, useEffect } from 'react'
import { Pencil, Trash2, ImagePlus, X, Upload } from 'lucide-react'
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
import type { Banner } from '@/types/response/banner.response'
import { bannerService } from '@/services/banner.service'
import Image from 'next/image'

interface BannerTableProps {
  banners: Banner[]
  isLoading?: boolean
  onEditSuccess?: () => void
  onDeleteSuccess?: () => void
}

export function BannerTable({
  banners,
  isLoading,
  onEditSuccess,
  onDeleteSuccess,
}: BannerTableProps) {
  const handleDelete = async (banner: Banner) => {
    const loadingToast = toast.loading('Đang xóa...', {
      duration: Infinity,
    })

    try {
      await bannerService.deleteBanner(banner.id)
      toast.dismiss(loadingToast)
      toast.success(`Banner "${banner.name}" đã được xóa.`)
      onDeleteSuccess?.()
    } catch (error: unknown) {
      toast.dismiss(loadingToast)

      let errorMessage = 'Đã xảy ra lỗi không xác định'

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string; error?: string } }
        }
        const backendMsg =
          axiosError.response?.data?.message || axiosError.response?.data?.error
        if (backendMsg) {
          errorMessage = backendMsg
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error('Lỗi khi xóa banner: ' + errorMessage)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <LoadingSpinner />
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Chưa có banner nào</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm text-left font-sans">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell className="w-20">ID</TableHeaderCell>
            <TableHeaderCell>Tên Banner</TableHeaderCell>
            <TableHeaderCell>Tag</TableHeaderCell>
            <TableHeaderCell className="max-w-xs">Subtitle</TableHeaderCell>
            <TableHeaderCell className="w-48">Hình ảnh</TableHeaderCell>
            <TableHeaderCell className="text-center w-48">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>{banner.id}</TableCell>
              <TableCell className="font-medium text-gray-900 max-w-xs truncate">
                {banner.name}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {banner.tag || 'Featured'}
                </span>
              </TableCell>
              <TableCell className="text-gray-500 max-w-xs truncate">
                {banner.subtitle || '-'}
              </TableCell>
              <TableCell>
                <div className="relative h-16 w-32 rounded-md overflow-hidden border border-gray-100 bg-gray-50">
                  {banner.imageUrl ? (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400 text-xs">Không có ảnh</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <EditBannerModal
                    banner={banner}
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
                        Bạn có chắc chắn muốn xóa banner{' '}
                        <span className="font-medium">{banner.name}</span>? Hành
                        động này không thể hoàn tác.
                      </p>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                          Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={() => handleDelete(banner)}
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

function EditBannerModal({
  trigger,
  banner,
  onSuccess,
}: {
  trigger: React.ReactNode
  banner: Banner
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(banner.name)
  const [subtitle, setSubtitle] = useState(banner.subtitle)
  const [tag, setTag] = useState(banner.tag)
  const [imageUrl, setImageUrl] = useState(banner.imageUrl)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    banner.imageUrl || null,
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onPickFile = (file: File | null) => {
    setSelectedFile(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const onRemoveImage = () => {
    setSelectedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setImageUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async () => {
    if (!name.trim()) return

    const loadingToast = toast.loading('Đang lưu...', {
      duration: Infinity,
    })

    try {
      setIsSubmitting(true)

      let finalImageUrl = imageUrl

      if (selectedFile) {
        const uploadedUrl = await bannerService.uploadBannerImage(selectedFile)
        finalImageUrl = uploadedUrl
      }

      await bannerService.updateBanner(banner.id, {
        name: name.trim(),
        imageUrl: finalImageUrl,
        subtitle: subtitle.trim(),
        tag: tag.trim(),
      })

      toast.dismiss(loadingToast)
      toast.success('Thông tin banner đã được cập nhật.')
      setOpen(false)
      onSuccess?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Không thể cập nhật banner')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (open) {
      setName(banner.name)
      setSubtitle(banner.subtitle)
      setTag(banner.tag)
      setImageUrl(banner.imageUrl)
      setPreviewUrl(banner.imageUrl || null)
      setSelectedFile(null)
    }
  }, [open, banner.name, banner.subtitle, banner.tag, banner.imageUrl])

  const hasChanged =
    name.trim() !== (banner.name || '') ||
    subtitle.trim() !== (banner.subtitle || '') ||
    tag.trim() !== (banner.tag || '') ||
    selectedFile !== null

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (val) {
          setName(banner.name)
          setSubtitle(banner.subtitle)
          setTag(banner.tag)
          setImageUrl(banner.imageUrl)
          setPreviewUrl(banner.imageUrl || null)
          setSelectedFile(null)
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Banner</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-left">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên Banner</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên banner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dòng phụ (Subtitle)</label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Nhập dòng phụ mô tả banner (vd: Giảm đến 50%)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nhãn (Tag)</label>
            <Input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Nhập nhãn cho banner (vd: Featured, Khuyến mãi, Sách mới)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hình ảnh</label>
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
            disabled={!name.trim() || !hasChanged || isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
