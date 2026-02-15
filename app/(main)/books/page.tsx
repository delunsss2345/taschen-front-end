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
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ── static data (UI only) ── */

const books = [
    {
        title: "Homes for Our Time.",
        subtitle: "Sustainable Living",
        price: 80,
        badge: "NEW",
        imageUrl:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Japanese Woodblock Prints",
        subtitle: "",
        price: 150,
        badge: "NEW",
        imageUrl:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Hokusai.",
        subtitle: "Thirty-six Views of Mount Fuji",
        price: 80,
        badge: "NEW",
        imageUrl:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Valentino.",
        subtitle: "A Grand Italian Epic",
        price: 125,
        badge: "",
        imageUrl:
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Caravaggio.",
        subtitle: "The Complete Works",
        price: 60,
        badge: "",
        imageUrl:
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Sylvester Stallone.",
        subtitle: "The Legend",
        price: 200,
        badge: "NEW",
        imageUrl:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "Albert Watson.",
        subtitle: "KAOS",
        price: 100,
        badge: "",
        imageUrl:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    },
    {
        title: "The Gourmand's Mushroom.",
        subtitle: "A Collection of Recipes",
        price: 50,
        badge: "NEW",
        imageUrl:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    },
];

const themes = [
    { label: "Architecture & Design", count: 136 },
    { label: "Art", count: 243 },
    { label: "Classics", count: 81 },
    { label: "Comics", count: 49 },
    { label: "Esoterica", count: 15 },
    { label: "Fashion", count: 48 },
    { label: "Film", count: 56 },
    { label: "Graphic Design", count: 46 },
    { label: "Kids", count: 7 },
    { label: "Music", count: 42 },
    { label: "Photography", count: 302 },
    { label: "Pop Culture", count: 167 },
    { label: "Sexy Books", count: 66 },
    { label: "Sports", count: 16 },
    { label: "Style, Food & Travel", count: 47 },
];

const priceRanges = [
    "All Prices",
    "Under US$ 50",
    "US$ 50 to US$ 100",
    "US$ 100 to US$ 500",
    "More than US$ 500",
];

const languages = [
    { label: "English", count: 878 },
    { label: "German", count: 602 },
    { label: "French", count: 595 },
    { label: "Spanish", count: 175 },
    { label: "Italian", count: 108 },
    { label: "Portuguese", count: 28 },
    { label: "Dutch", count: 3 },
];

const sortOptions = [
    "best-selling titles",
    "price, low to high",
    "price, high to low",
    "title, A-Z",
    "title, Z-A",
];

/* ── Filter sidebar content (shared between header button & sticky button) ── */
function FilterContent({
    sortOpen,
    setSortOpen,
    selectedSort,
    setSelectedSort,
    selectedPrice,
    setSelectedPrice,
}: {
    sortOpen: boolean;
    setSortOpen: (v: boolean) => void;
    selectedSort: string;
    setSelectedSort: (v: string) => void;
    selectedPrice: string;
    setSelectedPrice: (v: string) => void;
}) {
    return (
        <div className="space-y-6 px-6 py-5">
            {/* Sort by */}
            <div>
                <h3 className="text-sm font-bold">Sort by</h3>
                <div className="relative mt-2">
                    <button
                        className="flex w-[200px] items-center justify-between border px-3 py-2 text-sm"
                        onClick={() => setSortOpen(!sortOpen)}
                    >
                        <span>{selectedSort}</span>
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    {sortOpen && (
                        <div className="absolute left-0 top-full z-10 w-[200px] border bg-white shadow-md">
                            {sortOptions.map((opt) => (
                                <button
                                    key={opt}
                                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 ${opt === selectedSort ? "font-bold" : ""
                                        }`}
                                    onClick={() => {
                                        setSelectedSort(opt);
                                        setSortOpen(false);
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Separator />

            {/* Themes */}
            <div>
                <h3 className="text-sm font-bold">Themes</h3>
                <div className="mt-3 space-y-2.5">
                    {themes.map((t) => (
                        <label
                            key={t.label}
                            className="flex cursor-pointer items-center gap-2.5 text-sm"
                        >
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-zinc-300"
                            />
                            <span>
                                {t.label}{" "}
                                <span className="text-zinc-400">({t.count})</span>
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price */}
            <div>
                <h3 className="text-sm font-bold">Price</h3>
                <div className="mt-3 space-y-2.5">
                    {priceRanges.map((p) => (
                        <label
                            key={p}
                            className="flex cursor-pointer items-center gap-2.5 text-sm"
                        >
                            <input
                                type="radio"
                                name="price"
                                checked={selectedPrice === p}
                                onChange={() => setSelectedPrice(p)}
                                className="h-4 w-4 border-zinc-300"
                            />
                            <span>{p}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Width */}
            <div>
                <h3 className="text-sm font-bold">Width</h3>
                <p className="mt-2 text-right text-xs text-zinc-500">
                    10 cm - 70 cm
                </p>
                <input
                    type="range"
                    min={10}
                    max={70}
                    defaultValue={70}
                    className="mt-1 w-full accent-zinc-900"
                />
            </div>

            <Separator />

            {/* Height */}
            <div>
                <h3 className="text-sm font-bold">Height</h3>
                <p className="mt-2 text-right text-xs text-zinc-500">
                    13 cm - 70 cm
                </p>
                <input
                    type="range"
                    min={13}
                    max={70}
                    defaultValue={70}
                    className="mt-1 w-full accent-zinc-900"
                />
            </div>

            <Separator />

            {/* Language */}
            <div>
                <h3 className="text-sm font-bold">Language</h3>
                <div className="mt-3 space-y-2.5">
                    {languages.map((l) => (
                        <label
                            key={l.label}
                            className="flex cursor-pointer items-center gap-2.5 text-sm"
                        >
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-zinc-300"
                            />
                            <span>
                                {l.label}{" "}
                                <span className="text-zinc-400">({l.count})</span>
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Apply button */}
            <div className="pb-4 pt-2">
                <Button
                    variant="outline"
                    className="w-full rounded-none border-zinc-900 text-xs uppercase tracking-wider"
                >
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}

const TOTAL_PAGES = 16;

export default function AllTitlesPage() {
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
    const [selectedPrice, setSelectedPrice] = useState("All Prices");
    const [showStickyBtn, setShowStickyBtn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            setShowStickyBtn(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const filterProps = {
        sortOpen,
        setSortOpen,
        selectedSort,
        setSelectedSort,
        selectedPrice,
        setSelectedPrice,
    };

    return (
        <div className="mx-auto w-full max-w-[var(--container-main)] px-6 pb-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 py-4 text-xs text-zinc-500">
                <Link href="/" className="hover:text-zinc-900">
                    Home
                </Link>
                <span>/</span>
                <span className="text-zinc-700">Books (904 Items)</span>
            </div>

            {/* Header row */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold tracking-tight">All Titles</h1>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="default"
                            className="gap-2 rounded-none bg-zinc-900 px-5 text-xs uppercase tracking-wider text-white hover:bg-zinc-800"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Sort and Filter
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[360px] overflow-y-auto p-0">
                        <SheetHeader className="border-b px-6 py-4">
                            <SheetTitle className="text-sm font-bold">
                                Sort and Filter
                            </SheetTitle>
                        </SheetHeader>
                        <FilterContent {...filterProps} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Book grid */}
            <div className="mt-8">
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 bg-transparent">
                    {books.map((book, i) => (
                        <BookCard
                            key={i}
                            title={book.title}
                            subtitle={book.subtitle}
                            price={book.price}
                            badge={book.badge || undefined}
                            imageUrl={book.imageUrl}
                            href={`/detail/${i + 1}`}
                            variant="compact"
                        />
                    ))}
                </div>

                {/* Pagination */}
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
                        Page {currentPage} of {TOTAL_PAGES}
                    </span>

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
                        disabled={currentPage === TOTAL_PAGES}
                        className="text-zinc-400 transition-colors hover:text-zinc-900 disabled:opacity-30"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setCurrentPage(TOTAL_PAGES)}
                        disabled={currentPage === TOTAL_PAGES}
                        className="text-zinc-400 transition-colors hover:text-zinc-900 disabled:opacity-30"
                    >
                        <ChevronsRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Sticky floating filter button — appears on scroll */}
            {showStickyBtn && (
                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded border border-zinc-200 bg-white shadow-lg transition-transform hover:scale-105"
                            aria-label="Sort and Filter"
                        >
                            <SlidersHorizontal className="h-5 w-5 text-zinc-700" />
                        </button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[360px] overflow-y-auto p-0">
                        <SheetHeader className="border-b px-6 py-4">
                            <SheetTitle className="text-sm font-bold">
                                Sort and Filter
                            </SheetTitle>
                        </SheetHeader>
                        <FilterContent {...filterProps} />
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}