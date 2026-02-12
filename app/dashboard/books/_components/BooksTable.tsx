'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TableCell, TableRow } from '@/components/table'
import { EditBookModal } from './EditBookModal'
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

interface Book {
  id: number
  image: string
  title: string
  author: string
  price: number
  quantity: number
  category: string
}

interface BooksTableProps {
  books: Book[]
}

export function BooksTable({ books }: BooksTableProps) {
  const handleDelete = async (bookId: number) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 500))

    toast.promise(promise, {
      loading: 'Đang xóa...',
      success: () => 'Sách đã được xóa thành công.',
      error: () => 'Có lỗi xảy ra.',
    })

    await promise
  }

  return (
    <div className="rounded-md bg-white border border-gray-100 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-[#fcfcfc] border-b border-gray-50">
          <tr className="text-gray-500 font-medium">
            <th className="px-6 py-4 text-left font-semibold">ID</th>
            <th className="px-6 py-4 text-left font-semibold">Ảnh</th>
            <th className="px-6 py-4 text-left font-semibold">Tên sách</th>
            <th className="px-6 py-4 text-left font-semibold">Tác giả</th>
            <th className="px-6 py-4 text-left font-semibold">Giá</th>
            <th className="px-6 py-4 text-left font-semibold">Số lượng</th>
            <th className="px-6 py-4 text-left font-semibold">Thể loại</th>
            <th className="px-6 py-4 text-center font-semibold">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.id}</TableCell>

              <TableCell>
                <div className="h-[72px] w-[54px] bg-gray-100 rounded overflow-hidden flex items-center justify-center border border-gray-50 shadow-sm">
                  {book.image ? (
                    <img
                      src={book.image}
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
                    book.quantity === 0 ? 'text-red-500' : ''
                  )}
                >
                  {book.quantity}
                </span>
              </TableCell>

              <TableCell className="max-w-[150px]">
                {book.category}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <EditBookModal
                    book={book}
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
