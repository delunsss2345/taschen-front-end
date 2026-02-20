'use client'

import { useEffect, useState } from 'react'
import { BooksHeader } from './BooksHeader'
import { BooksTable } from './BooksTable'
import { Pagination } from '@/components/ui/pagination'
import { bookService } from '@/services/book.service'
import { toast } from 'sonner'
import type { Book, BookListMeta } from '@/types/response/book.response'

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [meta, setMeta] = useState<BookListMeta | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const fetchBooks = async () => {
    try {
      setIsLoading(true)
      const response = await bookService.getAllBooks({ page, pageSize })
      setBooks(response.result)
      setMeta(response.meta)
    } catch (error) {
      toast.error('Không thể tải danh sách sách')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [page, pageSize])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }

  const handleDeleteSuccess = (bookId: number) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId))
    if (meta) {
      setMeta((prev) => prev ? { ...prev, total: prev.total - 1 } : null)
    }
  }

  return (
    <div className="space-y-4">
      <BooksHeader onSuccess={fetchBooks} />
      <BooksTable 
        books={books} 
        isLoading={isLoading}
        onDeleteSuccess={handleDeleteSuccess}
        onEditSuccess={fetchBooks}
      />
      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.pages}
          totalItems={meta.total}
          pageSize={meta.pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
