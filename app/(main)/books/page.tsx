"use client";

import BookCard from "@/app/(main)/_components/BookCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    type BookSearchParams,
    useSearchBooksQuery,
} from "@/features/book/hooks";
import { categoryService } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SORT_OPTIONS = [
    { label: "Mặc định", sortBy: undefined, sortDir: undefined },
    { label: "Giá tăng dần", sortBy: "price", sortDir: "asc" },
    { label: "Giá giảm dần", sortBy: "price", sortDir: "desc" },
    { label: "Tên A-Z", sortBy: "title", sortDir: "asc" },
    { label: "Tên Z-A", sortBy: "title", sortDir: "desc" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

const PAGE_SIZE = 12;

function BookCardSkeleton() {
    return (
        <div className="flex animate-pulse flex-col gap-3">
            <div className="aspect-2/3 w-full rounded-md bg-neutral-100" />
            <div className="h-4 w-3/4 rounded bg-neutral-100" />
            <div className="h-3 w-1/2 rounded bg-neutral-100" />
            <div className="h-3 w-1/3 rounded bg-neutral-100" />
            <div className="mt-auto h-9 w-full rounded-sm bg-neutral-100" />
        </div>
    );
}

function FilterContent({
    sortOpen,
    setSortOpen,
    selectedSort,
    setSelectedSort,
    selectedCategoryId,
    setSelectedCategoryId,
    categories,
    keyword,
    setKeyword,
    onApply,
}: {
    sortOpen: boolean;
    setSortOpen: (v: boolean) => void;
    selectedSort: SortOption;
    setSelectedSort: (v: SortOption) => void;
    selectedCategoryId: number | null;
    setSelectedCategoryId: (v: number | null) => void;
    categories: { id: number; name: string }[];
    keyword: string;
    setKeyword: (v: string) => void;
    onApply: () => void;
}) {
    return (
        <div className="space-y-6 px-6 py-5">
            {/* Tìm kiếm */}
            <div>
                <h3 className="text-sm font-bold">Tìm kiếm</h3>
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Tên sách, tác giả..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onApply()}
                        className="w-full border px-3 py-2 pl-9 text-sm outline-none focus:border-zinc-900"
                    />
                    {keyword && (
                        <button
                            onClick={() => setKeyword("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <Separator />

            {/* Sắp xếp */}
            <div>
                <h3 className="text-sm font-bold">Sắp xếp theo</h3>
                <div className="relative mt-2">
                    <button
                        className="flex w-full items-center justify-between border px-3 py-2 text-sm"
                        onClick={() => setSortOpen(!sortOpen)}
                    >
                        <span>{selectedSort.label}</span>
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    {sortOpen && (
                        <div className="absolute left-0 top-full z-10 w-full border bg-white shadow-md">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.label}
                                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${opt.label === selectedSort.label ? "font-bold" : ""}`}
                                    onClick={() => {
                                        setSelectedSort(opt);
                                        setSortOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Separator />

            {/* Danh mục */}
            <div>
                <h3 className="text-sm font-bold">Danh mục</h3>
                <div className="mt-3 space-y-2.5">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                        <input
                            type="radio"
                            name="category"
                            checked={selectedCategoryId === null}
                            onChange={() => setSelectedCategoryId(null)}
                            className="h-4 w-4 border-zinc-300"
                        />
                        <span>Tất cả danh mục</span>
                    </label>
                    {categories.map((cat) => (
                        <label
                            key={cat.id}
                            className="flex cursor-pointer items-center gap-2.5 text-sm"
                        >
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategoryId === cat.id}
                                onChange={() => setSelectedCategoryId(cat.id)}
                                className="h-4 w-4 border-zinc-300"
                            />
                            <span>{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="pb-4 pt-2">
                <Button
                    className="w-full rounded-none bg-zinc-900 text-xs uppercase tracking-wider text-white hover:bg-zinc-700"
                    onClick={onApply}
                >
                    Áp dụng
                </Button>
            </div>
        </div>
    );
}

export default function BooksPage() {
    const searchParams = useSearchParams();
    const initialQ = searchParams.get("q") ?? "";

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState<SortOption>(SORT_OPTIONS[0]);
    const [keyword, setKeyword] = useState(initialQ);
    const [appliedParams, setAppliedParams] = useState<Pick<BookSearchParams, "keyword" | "categoryId" | "sortBy" | "sortDir">>({ keyword: initialQ || undefined });
    const [sortOpen, setSortOpen] = useState(false);
    const [showStickyBtn, setShowStickyBtn] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);

    useEffect(() => {
        const q = searchParams.get("q") ?? "";
        setKeyword(q);
        setAppliedParams((prev) => ({ ...prev, keyword: q || undefined }));
        setCurrentPage(1);
    }, [searchParams]);

    useEffect(() => {
        const handleScroll = () => setShowStickyBtn(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { data: booksData, isLoading } = useSearchBooksQuery({
        page: currentPage,
        size: PAGE_SIZE,
        status: "active",
        ...appliedParams,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getAllCategories(),
        staleTime: 5 * 60 * 1000,
    });

    const books = booksData?.result ?? [];
    const meta = booksData?.meta;
    const totalPages = meta?.pages ?? 1;
    const totalBooks = meta?.total ?? 0;

    const handleApply = () => {
        setAppliedParams({
            keyword: keyword || undefined,
            categoryId: selectedCategoryId ?? undefined,
            sortBy: selectedSort.sortBy,
            sortDir: selectedSort.sortDir,
        });
        setCurrentPage(1);
        setSheetOpen(false);
    };

    const handleRemoveKeyword = () => {
        setKeyword("");
        setAppliedParams((prev) => ({ ...prev, keyword: undefined }));
        setCurrentPage(1);
    };

    const handleRemoveCategory = () => {
        setSelectedCategoryId(null);
        setAppliedParams((prev) => ({ ...prev, categoryId: undefined }));
        setCurrentPage(1);
    };

    const activeFiltersCount = [
        !!appliedParams.keyword,
        !!appliedParams.categoryId,
        !!appliedParams.sortBy,
    ].filter(Boolean).length;

    const filterProps = {
        sortOpen,
        setSortOpen,
        selectedSort,
        setSelectedSort,
        selectedCategoryId,
        setSelectedCategoryId,
        categories,
        keyword,
        setKeyword,
        onApply: handleApply,
    };

    return (
        <div className="container-main w-full pb-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 py-4 text-xs text-zinc-500">
                <Link href="/" className="hover:text-zinc-900">
                    Trang chủ
                </Link>
                <span>/</span>
                <span className="text-zinc-700">
                    Tất cả sách
                    {!isLoading && totalBooks > 0 && (
                        <> ({totalBooks.toLocaleString("vi-VN")} cuốn)</>
                    )}
                </span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold tracking-tight">Tất cả sách</h1>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="default"
                            className="relative gap-2 rounded-none bg-zinc-900 px-5 text-xs uppercase tracking-wider text-white hover:bg-zinc-800"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Lọc &amp; Sắp xếp
                            {activeFiltersCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[360px] overflow-y-auto p-0">
                        <SheetHeader className="border-b px-6 py-4">
                            <SheetTitle className="text-sm font-bold">
                                Lọc &amp; Sắp xếp
                            </SheetTitle>
                        </SheetHeader>
                        <FilterContent {...filterProps} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Active filter tags */}
            {(appliedParams.keyword || appliedParams.categoryId) && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {appliedParams.keyword && (
                        <span className="flex items-center gap-1 rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
                            Từ khóa: &ldquo;{appliedParams.keyword}&rdquo;
                            <button
                                onClick={handleRemoveKeyword}
                                className="ml-1 hover:text-zinc-900"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                    {appliedParams.categoryId && (
                        <span className="flex items-center gap-1 rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
                            {categories.find((c) => c.id === appliedParams.categoryId)?.name ?? "Danh mục"}
                            <button
                                onClick={handleRemoveCategory}
                                className="ml-1 hover:text-zinc-900"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* Grid */}
            <div className="mt-8">
                {isLoading ? (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
                        <p className="text-base">Không tìm thấy sách nào.</p>
                        <p className="mt-1 text-sm">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                        </p>
                    </div>
                ) : (
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
                )}

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="text-zinc-400 transition-colors hover:text-zinc-900 disabled:opacity-30"
                        >
                            <ChevronsLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="text-zinc-400 transition-colors hover:text-zinc-900 disabled:opacity-30"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages}
                            className="text-zinc-400 transition-colors hover:text-zinc-900 disabled:opacity-30"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="text-zinc-400 transition-colors hover:text-zinc-900 disabled:opacity-30"
                        >
                            <ChevronsRight className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Sticky filter button */}
            {showStickyBtn && (
                <button
                    onClick={() => setSheetOpen(true)}
                    className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-lg transition-transform hover:scale-105"
                    aria-label="Lọc & Sắp xếp"
                >
                    <SlidersHorizontal className="h-5 w-5 text-zinc-700" />
                    {activeFiltersCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}
