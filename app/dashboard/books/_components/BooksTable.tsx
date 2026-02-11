'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EditBookModal } from './EditBookModal'
import Swal from 'sweetalert2'

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
    const result = await Swal.fire({
      title: 'Bạn chắc chắn muốn xóa?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    })

    if (result.isConfirmed) {
      // TODO: gọi API xóa tại đây nếu có
      // await deleteBook(bookId)

      await Swal.fire({
        title: 'Đã xóa!',
        text: 'Sách đã được xóa thành công.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
      })
    }
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
            <tr key={book.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-5 text-gray-600">{book.id}</td>

              <td className="px-6 py-5">
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
              </td>

              <td className="px-6 py-5 font-medium text-gray-900 max-w-[200px] truncate">
                {book.title}
              </td>

              <td className="px-6 py-5 text-gray-600 truncate">
                {book.author}
              </td>

              <td className="px-6 py-5 text-gray-600 font-medium">
                {book.price.toLocaleString('vi-VN')} đ
              </td>

              <td className="px-6 py-5">
                <span
                  className={cn(
                    'font-medium',
                    book.quantity === 0 ? 'text-red-500' : 'text-gray-600'
                  )}
                >
                  {book.quantity}
                </span>
              </td>

              <td className="px-6 py-5 text-gray-500 italic text-xs max-w-[150px]">
                {book.category}
              </td>

              <td className="px-6 py-5">
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

                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 gap-1 px-3 cursor-pointer"
                    onClick={() => handleDelete(book.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Xóa
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
