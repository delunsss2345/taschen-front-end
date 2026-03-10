"use client";

import { useState } from "react";
import { BooksHeader } from "./BooksHeader";
import { BooksTable } from "./BooksTable";
import { Pagination } from "@/components/ui/pagination";
import { useBooksQuery } from "@/features/book/hooks";

export function AdminBooksPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");

  const { data, isPending, refetch } = useBooksQuery({
    page,
    pageSize,
    search: search || undefined,
  });

  const books = data?.result || [];
  const meta = data?.meta || null;

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleDeleteSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-4">
      <BooksHeader onSuccess={refetch} onSearch={handleSearch} />
      <BooksTable
        books={books}
        isLoading={isPending}
        onDeleteSuccess={handleDeleteSuccess}
        onEditSuccess={refetch}
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
  );
}
