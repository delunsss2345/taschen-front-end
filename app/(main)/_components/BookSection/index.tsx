'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BookCard from '@/app/(main)/_components/BookCard'
import { bookService } from '@/services/book.service'
import type { Book } from '@/types/response/book.response'

export default function BookSection() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookService
      .searchBooks({ status: 'active', page: 1, size: 8 })
      .then((res) => setBooks(res.result))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="container-main py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[320px] animate-pulse rounded-md bg-neutral-100" />
          ))}
        </div>
      </section>
    )
  }

  if (books.length === 0) return null

  return (
    <section className="container-main py-16">
      <div className="mb-8 flex flex-col items-center gap-1">
        <h2
          className="text-2xl font-serif font-medium tracking-tight text-zinc-900"
        >
          Sách nổi bật
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            bookId={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            stockQuantity={book.stockQuantity}
            categories={book.categories?.map((c) => c.name)}
            imageUrl={book.imageUrl}
            href={`/detail/${book.id}`}
            variant="compact"
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/books"
          className="inline-flex h-9 items-center justify-center border-2 border-zinc-900 bg-zinc-900 px-6 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-zinc-900"
        >
          Xem thêm
        </Link>
      </div>
    </section>
  )
}
