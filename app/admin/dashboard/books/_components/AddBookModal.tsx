'use client'

import { useMemo, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MultiSelectCombobox } from './MultiSelectCombobox'
import { ImagePlus } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { bookService } from '@/services/book.service'
import { categoryService } from '@/services/category.service'
import { uploadService } from '@/services/upload.service'
import { useEffect } from 'react'

const mockFormats = [
  { value: 'Bìa cứng', label: 'Bìa cứng' },
  { value: 'Bìa mềm', label: 'Bìa mềm' },
  { value: 'E-book', label: 'E-book' },
]

export type BookCreateModel = {
  tenSach: string
  tacGia: string
  moTa: string
  namXuatBan: number
  khoiLuongGram: number
  soTrang: number
  gia: number
  soLuongTon: number
  hinhAnh: File | null
  kichHoat: boolean
  maTheLoai: number[]
  dinhDang: string
}

const defaultValues: BookCreateModel = {
  tenSach: '',
  tacGia: '',
  moTa: '',
  namXuatBan: new Date().getFullYear(),
  khoiLuongGram: 0,
  soTrang: 0,
  gia: 0,
  soLuongTon: 0,
  hinhAnh: null,
  kichHoat: true,
  maTheLoai: [],
  dinhDang: '',
}

function Field({
  label,
  children,
  helper,
}: {
  label: string
  children: React.ReactNode
  helper?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {helper ? <div className="text-xs text-gray-500">{helper}</div> : null}
    </div>
  )
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {title ? (
        <div className="text-sm font-semibold text-gray-900">{title}</div>
      ) : null}
      {children}
    </div>
  )
}

export function AddBookModal({ 
  trigger, 
  onSuccess 
}: { 
  trigger: React.ReactNode
  onSuccess?: () => void 
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<BookCreateModel>(defaultValues)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [categories, setCategories] = useState<{ value: number; label: string }[]>([])

  useEffect(() => {
    if (open) {
      categoryService.getAllCategories().then((cats) => {
        setCategories(cats.map((c) => ({ value: c.id, label: c.name })))
      })
    }
  }, [open])

  const canSubmit = useMemo(() => {
    return form.tenSach.trim().length > 0 && form.tacGia.trim().length > 0
  }, [form.tenSach, form.tacGia])

  const resetForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setForm(defaultValues)
  }

  const onPickFile = (file: File | null) => {
    setForm((p) => ({ ...p, hinhAnh: file }))
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const onRemoveImage = () => {
    onPickFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async () => {
    if (!canSubmit) return

    const loadingToast = toast.loading('Đang lưu sách...', {
      duration: Infinity,
    })
    
    setIsSubmitting(true)
    
    try {
      let imageUrl = ''

      // Upload image to Cloudinary first if exists
      if (form.hinhAnh) {
        imageUrl = await uploadService.uploadImage(form.hinhAnh, 'books')
      }

      const payload = {
        title: form.tenSach,
        author: form.tacGia,
        description: form.moTa,
        publicationYear: form.namXuatBan,
        weightGrams: form.khoiLuongGram,
        pageCount: form.soTrang,
        price: form.gia,
        stockQuantity: form.soLuongTon,
        imageUrl: imageUrl,
        isActive: form.kichHoat,
        categoryIds: form.maTheLoai,
        variantFormats: form.dinhDang ? [form.dinhDang] : [],
      }

      await bookService.createBook(payload)
      
      toast.dismiss(loadingToast)
      toast.success('Sách đã được thêm thành công.')
      setOpen(false)
      resetForm()
      onSuccess?.()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Có lỗi xảy ra khi thêm sách.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) resetForm()
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[95vw] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sách mới</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <Section title="Hình ảnh">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-col gap-4">
                  <div className="h-48 w-full rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center relative group">
                    {previewUrl ? (
                      <>
                        <div className="relative h-full w-full">
                          <Image 
                            src={previewUrl} 
                            alt="Hình ảnh" 
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-8 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Đổi ảnh
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-8 cursor-pointer"
                            onClick={onRemoveImage}
                          >
                            Xóa
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div 
                        className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                        <div className="text-xs text-gray-400">Chọn ảnh bìa sách</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                    />

                    {form.hinhAnh && (
                      <div className="text-[11px] text-gray-500 bg-white p-2 rounded border border-gray-100 truncate">
                        File: {form.hinhAnh.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Section>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Tên sách" helper="Bắt buộc">
                  <Input
                    value={form.tenSach}
                    onChange={(e) => setForm((p) => ({ ...p, tenSach: e.target.value }))}
                    placeholder="Ví dụ: Nhà giả kim"
                  />
                </Field>

                <Field label="Tác giả" helper="Bắt buộc">
                  <Input
                    value={form.tacGia}
                    onChange={(e) => setForm((p) => ({ ...p, tacGia: e.target.value }))}
                    placeholder="Ví dụ: Paulo Coelho"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Mô tả">
                    <Textarea
                      value={form.moTa}
                      onChange={(e) => setForm((p) => ({ ...p, moTa: e.target.value }))}
                      placeholder="Nhập mô tả ngắn về sách"
                    />
                  </Field>
                </div>
              </div>
            </Section>

            <Section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Giá (VNĐ)">
                  <Input
                    type="number"
                    value={form.gia}
                    onChange={(e) => setForm((p) => ({ ...p, gia: Number(e.target.value || 0) }))}
                    placeholder="50000"
                  />
                </Field>

                <Field label="Số lượng tồn">
                  <Input
                    type="number"
                    value={form.soLuongTon}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, soLuongTon: Number(e.target.value || 0) }))
                    }
                    placeholder="100"
                  />
                </Field>
              </div>
            </Section>

            <Section title="Thông số">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Năm xuất bản">
                  <Input
                    type="number"
                    value={form.namXuatBan}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, namXuatBan: Number(e.target.value || 0) }))
                    }
                  />
                </Field>

                <Field label="Khối lượng (gram)">
                  <Input
                    type="number"
                    value={form.khoiLuongGram}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, khoiLuongGram: Number(e.target.value || 0) }))
                    }
                  />
                </Field>

                <Field label="Số trang">
                  <Input
                    type="number"
                    value={form.soTrang}
                    onChange={(e) => setForm((p) => ({ ...p, soTrang: Number(e.target.value || 0) }))}
                  />
                </Field>
              </div>
            </Section>

            <Section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Thể loại" helper="Có thể chọn nhiều">
                  <MultiSelectCombobox
                    options={categories}
                    value={form.maTheLoai}
                    onChange={(value) => setForm((p) => ({ ...p, maTheLoai: value }))}
                    placeholder="Chọn thể loại"
                    searchPlaceholder="Tìm thể loại..."
                    emptyText="Không có thể loại"
                  />
                </Field>

                <Field label="Định dạng" helper="Chọn 1 định dạng">
                  <Select
                    value={form.dinhDang}
                    onValueChange={(value) => setForm((p) => ({ ...p, dinhDang: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn định dạng" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockFormats.map((fmt) => (
                        <SelectItem key={fmt.value} value={fmt.value}>
                          {fmt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  checked={form.kichHoat}
                  onCheckedChange={(checked) =>
                    setForm((p) => ({ ...p, kichHoat: Boolean(checked) }))
                  }
                />
                <span className="text-sm text-gray-700">Kinh doanh</span>
              </div>
            </Section>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            disabled={!canSubmit || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
