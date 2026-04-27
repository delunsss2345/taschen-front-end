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
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'active' | 'deleted' | 'all'>('active')

  const fetchBooks = async () => {
    try {
      setIsLoading(true)
      const response = await bookService.searchBooks({
        keyword: search || undefined,
        status,
        page,
        size: pageSize,
      })
      setBooks(response.result)
      setMeta(response.meta)
    } catch {
      toast.error('Không thể tải danh sách sách')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [page, pageSize, search, status])

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
    setPage(1)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as 'active' | 'deleted' | 'all')
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <BooksHeader
        onSuccess={fetchBooks}
        onSearch={handleSearch}
        status={status}
        onStatusChange={handleStatusChange}
      />
      <BooksTable
        books={books}
        isLoading={isLoading}
        onDeleteSuccess={fetchBooks}
        onEditSuccess={fetchBooks}
        onRestoreSuccess={fetchBooks}
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
