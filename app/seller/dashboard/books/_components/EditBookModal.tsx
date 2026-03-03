'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
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
import { toast } from 'sonner'
import { formatService } from '@/services/format.service'

const mockCategories = [
  { value: 1, label: 'Kinh dị' },
  { value: 2, label: 'Tiểu thuyết' },
  { value: 3, label: 'Văn học' },
  { value: 4, label: 'Trinh thám' },
  { value: 5, label: 'Kỹ năng sống' },
  { value: 6, label: 'Quân sự' },
  { value: 7, label: 'Truyện tranh' },
]

export type BookEditModel = {
  id: number
  tenSach: string
  tacGia: string
  moTa: string
  namXuatBan: number
  khoiLuongGram: number
  soTrang: number
  gia: number
  soLuongTon: number
  hinhAnh: File | null
  kinhDoanh: boolean
  maTheLoai: number[]
  dinhDang: string
}

type BooksTableRow = {
  id: number
  image: string
  title: string
  author: string
  price: number
  quantity: number
  category: string
}

interface EditBookModalProps {
  trigger: React.ReactNode
  book: BooksTableRow
}

function Field({ label, children, helper }: { label: string; children: React.ReactNode; helper?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {helper && <div className="text-xs text-gray-500">{helper}</div>}
    </div>
  )
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      {title && <div className="text-sm font-semibold text-gray-900">{title}</div>}
      {children}
    </div>
  )
}

export function EditBookModal({ trigger, book }: EditBookModalProps) {
  const [open, setOpen] = useState(false)
  const [formats, setFormats] = useState<{ value: string; label: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      formatService.getAllFormats().then((fmts) => {
        setFormats(fmts.map((f) => ({ value: f.formatCode, label: f.formatName })))
      })
    }
  }, [open])

  const [form, setForm] = useState<BookEditModel>({
    id: book.id,
    tenSach: book.title,
    tacGia: book.author,
    moTa: '',
    namXuatBan: new Date().getFullYear(),
    khoiLuongGram: 0,
    soTrang: 0,
    gia: book.price,
    soLuongTon: book.quantity,
    hinhAnh: null,
    kinhDoanh: true,
    maTheLoai: [],
    dinhDang: '',
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(book.image || null)

  const canSubmit = useMemo(() => {
    return form.tenSach.trim() && form.tacGia.trim()
  }, [form.tenSach, form.tacGia])

  const onPickFile = (file: File | null) => {
    setForm((p) => ({ ...p, hinhAnh: file }))
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(file ? URL.createObjectURL(file) : book.image || null)
  }

  const onRemoveImage = () => {
    onPickFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setPreviewUrl(null)
  }

  const onSubmit = async () => {
    if (!canSubmit) return

    const promise = new Promise((resolve) => setTimeout(resolve, 1000))

    toast.promise(promise, {
      loading: 'Đang lưu...',
      success: () => {
        setOpen(false)
        return 'Thông tin sách đã được cập nhật.'
      },
      error: () => 'Có lỗi xảy ra.',
    })

    await promise
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (value) {
          setForm({
            id: book.id,
            tenSach: book.title,
            tacGia: book.author,
            moTa: '',
            namXuatBan: new Date().getFullYear(),
            khoiLuongGram: 0,
            soTrang: 0,
            gia: book.price,
            soLuongTon: book.quantity,
            hinhAnh: null,
            kinhDoanh: true,
            maTheLoai: [],
            dinhDang: '',
          })
          setPreviewUrl(book.image || null)
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[95vw] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa sách</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <Section title="Hình ảnh">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex flex-col gap-4">
                  <div className="h-48 w-full rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center relative group">
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Hình ảnh" className="h-full w-full object-contain" />
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
            </Section>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Tên sách">
                  <Input value={form.tenSach} onChange={(e) => setForm((p) => ({ ...p, tenSach: e.target.value }))} />
                </Field>
                <Field label="Tác giả">
                  <Input value={form.tacGia} onChange={(e) => setForm((p) => ({ ...p, tacGia: e.target.value }))} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Mô tả">
                    <Textarea value={form.moTa} onChange={(e) => setForm((p) => ({ ...p, moTa: e.target.value }))} />
                  </Field>
                </div>
                <Field label="Giá (VNĐ)">
                  <Input
                    type="number"
                    value={form.gia}
                    onChange={(e) => setForm((p) => ({ ...p, gia: Number(e.target.value || 0) }))}
                  />
                </Field>
                <Field label="Số lượng tồn">
                  <Input
                    type="number"
                    value={form.soLuongTon}
                    onChange={(e) => setForm((p) => ({ ...p, soLuongTon: Number(e.target.value || 0) }))}
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
                    onChange={(e) => setForm((p) => ({ ...p, namXuatBan: Number(e.target.value || 0) }))}
                  />
                </Field>
                <Field label="Khối lượng (gram)">
                  <Input
                    type="number"
                    value={form.khoiLuongGram}
                    onChange={(e) => setForm((p) => ({ ...p, khoiLuongGram: Number(e.target.value || 0) }))}
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
                <Field label="Thể loại">
                  <MultiSelectCombobox
                    options={mockCategories}
                    value={form.maTheLoai}
                    onChange={(value) => setForm((p) => ({ ...p, maTheLoai: value }))}
                    placeholder="Chọn thể loại"
                    searchPlaceholder="Tìm thể loại..."
                    emptyText="Không có thể loại"
                  />
                </Field>
                <Field label="Định dạng">
                  <Select value={form.dinhDang} onValueChange={(value) => setForm((p) => ({ ...p, dinhDang: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn định dạng" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((fmt) => (
                        <SelectItem key={fmt.value} value={fmt.value}>
                          {fmt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="flex items-center gap-2 md:col-span-2">
                  <Checkbox
                    id={`edit-kinh-doanh-${book.id}`}
                    checked={form.kinhDoanh}
                    onCheckedChange={(checked) => setForm((p) => ({ ...p, kinhDoanh: Boolean(checked) }))}
                  />
                  <label htmlFor={`edit-kinh-doanh-${book.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                    Kinh doanh
                  </label>
                </div>
              </div>
            </Section>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2 border-t pt-4">
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
