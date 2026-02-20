'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TableCell, TableHeaderCell, TableRow } from '@/components/table'
import { EditBookModal } from './EditBookModal'
import { toast } from 'sonner'
import { bookService } from '@/services/book.service'
import { LoadingSpinner } from '@/components/ui/loading'
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

interface Book {
  id: number
  imageUrl?: string
  title: string
  author: string
  price: number
  stockQuantity: number
  categoryIds: number[]
  categories?: {
    id: number
    name: string
  }[]
}

interface BooksTableProps {
  books: Book[]
  isLoading?: boolean
  onDeleteSuccess?: (bookId: number) => void
  onEditSuccess?: () => void
}

export function BooksTable({ books, isLoading, onDeleteSuccess, onEditSuccess }: BooksTableProps) {
  const handleDelete = async (bookId: number) => {
    try {
      await bookService.deleteBook(bookId)
      toast.success('Sách đã được xóa thành công.')
      onDeleteSuccess?.(bookId)
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const backendMessage = axiosError?.response?.data?.message
      toast.error(backendMessage || 'Có lỗi xảy ra khi xóa sách.')
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <LoadingSpinner />
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Chưa có sách nào</div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <TableHeaderCell>ID</TableHeaderCell>
            <TableHeaderCell>Ảnh</TableHeaderCell>
            <TableHeaderCell>Tên sách</TableHeaderCell>
            <TableHeaderCell>Tác giả</TableHeaderCell>
            <TableHeaderCell>Giá</TableHeaderCell>
            <TableHeaderCell>Số lượng</TableHeaderCell>
            <TableHeaderCell>Thể loại</TableHeaderCell>
            <TableHeaderCell className="text-center">Thao tác</TableHeaderCell>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.id}</TableCell>

              <TableCell>
                <div className="h-[72px] w-[54px] bg-gray-100 rounded overflow-hidden flex items-center justify-center border border-gray-50 shadow-sm">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-[10px] text-gray-400">No img</div>
                  )}
                </div>
              </TableCell>

              <TableCell className="max-w-[200px] truncate">
                {book.title}
              </TableCell>

              <TableCell className="max-w-[150px] truncate">
                {book.author}
              </TableCell>

              <TableCell>
                {book.price.toLocaleString('vi-VN')} đ
              </TableCell>

              <TableCell>
                <span
                  className={cn(
                    book.stockQuantity === 0 ? 'text-red-500' : ''
                  )}
                >
                  {book.stockQuantity}
                </span>
              </TableCell>

              <TableCell className="max-w-[150px]">
                {book.categories?.map((cat) => cat.name).join(", ") || "Chưa có thể loại"}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <EditBookModal
                    book={{
                      id: book.id,
                      image: book.imageUrl || '',
                      title: book.title,
                      author: book.author,
                      price: book.price,
                      quantity: book.stockQuantity,
                      category: book.categories?.map((cat) => cat.name).join(", ") || ""
                    }}
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
                        Bạn có chắc chắn muốn xóa sách <span className="font-medium">{book.title}</span>? 
                        Hành động này không thể hoàn tác.
                      </p>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={() => handleDelete(book.id)}
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
