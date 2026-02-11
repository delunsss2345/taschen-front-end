'use client'

import Grid from "@/components/layouts/Grid";
import { fetchBooks } from "@/features/book";
import { selectBooks, selectIsLoadingBook } from "@/features/book/selector";
import Hero from "@/app/(main)/_components/Hero";
import QuoteRandom from "@/app/(main)/_components/QuoteRandom";
import { useAppDispatch, useAppSelector } from "@/store";
import { Book } from "@/types/book";
import { useEffect } from "react";

type Item = {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  price: string;
  image: string;
};

const Home = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  console.log(books);

  const isLoadingBook = useAppSelector(selectIsLoadingBook);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const items: Item[] = books.map((book: Book) => ({
    id: book.id.toString(),
    badge: book.isActive ? "Active" : undefined,
    title: book.title,
    subtitle: book.author,
    price: `${book.price.toLocaleString('vi-VN')} ₫`,
    image: book.imageUrl,
  }));

  return (
    <>
      <Hero />
      {isLoadingBook ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Đang tải sách...</p>
        </div>
      ) : (
        <Grid items={items} />
      )}
      <QuoteRandom />
    </>
  );
};
export default Home;
