"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BookCard from "@/app/(main)/_components/BookCard";

import { useBookByIdQuery, useBooksByCategoryQuery } from "@/features/book";
import { useAddToCartMutation } from "@/features/cart";
import { useAuthStore } from "@/features/auth";

const fmtPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(price);

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

function DetailSkeleton() {
  return (
    <div className="container-main py-10">
      <div className="grid grid-cols-1 gap-12 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <div className="aspect-2/3 w-full max-w-105 animate-pulse rounded-md bg-neutral-100" />
        </div>
        <div className="xl:col-span-5 space-y-4">
          <div className="h-8 w-3/4 rounded bg-neutral-100 animate-pulse" />
          <div className="h-5 w-1/3 rounded bg-neutral-100 animate-pulse" />
          <div className="h-6 w-1/2 rounded bg-neutral-100 animate-pulse" />
          <div className="h-20 w-full rounded bg-neutral-100 animate-pulse" />
          <div className="h-10 w-48 rounded bg-neutral-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const slugArr = Array.isArray(params.slug) ? params.slug : [params.slug];
  const bookId = slugArr[0];

  const { data: book, isLoading, error } = useBookByIdQuery(bookId);
  const addToCartMutation = useAddToCartMutation();
  const currentUser = useAuthStore((s) => s.currentUser);

  const firstCategoryId = book?.categoryIds?.[0];
  const { data: similarData } = useBooksByCategoryQuery(firstCategoryId);
  const similarBooks = (similarData?.result ?? []).filter((b) => b.id !== book?.id).slice(0, 4);

  const [qty, setQty] = React.useState(1);
  const [activeImg, setActiveImg] = React.useState(0);
  const [readMoreOpen, setReadMoreOpen] = React.useState(true);
  const [reviewsOpen, setReviewsOpen] = React.useState(false);
  const [selectedVariantId, setSelectedVariantId] = React.useState<number | null>(null);

  const images = book?.imageUrl ? [book.imageUrl] : [];
  const variants = book?.variantFormats ?? [];
  const selectedVariant = variants.find((v) => v.variantId === selectedVariantId);
  const displayPrice = selectedVariant?.price ?? book?.price ?? 0;
  const displayStock = selectedVariant?.stockQuantity ?? book?.stockQuantity ?? 0;

  const handleAddToCart = async () => {
    if (!currentUser?.id) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      router.push("/login");
      return;
    }
    if (!book) return;
    if (displayStock <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }
    try {
      await addToCartMutation.mutateAsync({
        userId: currentUser.id,
        payload: { bookId: book.id, quantity: qty },
      });
      toast.success("Đã thêm vào giỏ hàng");
    } catch {
      toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (error || !book) {
    return (
      <div className="container-main flex min-h-[40vh] flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">Không tìm thấy sách này.</p>
        <Button variant="outline" onClick={() => router.back()}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-neutral-900">
      <div className="container-main py-3">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900">Trang chủ</Link>
          <span>/</span>
          <Link href="/books" className="hover:text-zinc-900">Tất cả sách</Link>
          {book.categories && book.categories.length > 0 && (
            <>
              <span>/</span>
              <span>{book.categories[0].name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-zinc-700 line-clamp-1">{book.title}</span>
        </nav>

        <div className="mt-10 grid grid-cols-1 gap-12 xl:grid-cols-12">
          {/* LEFT: Image */}
          <section className="xl:col-span-7">
            <div className="relative mx-auto aspect-2/3 w-full max-w-90 overflow-hidden rounded-md bg-neutral-50">
              {images[activeImg] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[activeImg]}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-300">
                  <ShoppingCart className="h-16 w-16" />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={[
                      "relative h-14 w-10 overflow-hidden rounded-sm border transition",
                      i === activeImg
                        ? "border-neutral-900"
                        : "border-neutral-200 hover:border-neutral-400",
                    ].join(" ")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT: Info */}
          <section className="xl:col-span-5">
            {book.isActive === false && (
              <Badge variant="destructive" className="mb-3">Ngừng kinh doanh</Badge>
            )}

            {book.categories && book.categories.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {book.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-[11px] tracking-wide text-neutral-600"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-serif text-[28px] leading-[1.15] tracking-tight text-neutral-900">
              {book.title}
            </h1>
            <p className="mt-2 italic text-[14px] text-neutral-400">{book.author}</p>
            <p className="mt-4 text-[24px] font-semibold tracking-tight text-neutral-900">
              {fmtPrice(displayPrice)}
            </p>

            <div className="mt-6 space-y-1.5 text-[13px] leading-6 text-neutral-700">
              {book.publicationYear > 0 && <p>Năm xuất bản: {book.publicationYear}</p>}
              {book.pageCount > 0 && <p>Số trang: {book.pageCount}</p>}
              {book.weightGrams > 0 && <p>Trọng lượng: {book.weightGrams}g</p>}
              <p>
                Tình trạng:{" "}
                <span className={displayStock > 0 ? "font-medium text-green-600" : "font-medium text-red-500"}>
                  {displayStock > 0 ? `Còn hàng (${displayStock})` : "Hết hàng"}
                </span>
              </p>
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-[13px] font-medium text-neutral-700">Phiên bản</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.variantId ?? v.formatCode}
                      type="button"
                      onClick={() =>
                        setSelectedVariantId(
                          selectedVariantId === v.variantId ? null : (v.variantId ?? null),
                        )
                      }
                      className={[
                        "rounded-sm border px-3 py-2 text-[12px] transition",
                        selectedVariantId === v.variantId
                          ? "border-neutral-900 bg-neutral-900 font-semibold text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400",
                      ].join(" ")}
                    >
                      {v.formatName} · {fmtPrice(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div className="mt-8 flex items-center gap-3">
              <div className="inline-flex items-center rounded-sm border border-neutral-200">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-none px-3"
                  onClick={() => setQty((p) => Math.max(1, p - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  className="h-10 w-14 rounded-none border-x border-neutral-200 text-center text-[13px]"
                  value={qty}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setQty(Number.isFinite(next) && next > 0 ? Math.min(next, displayStock || 99) : 1);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-none px-3"
                  onClick={() => setQty((p) => Math.min(p + 1, displayStock || 99))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                className="h-10 flex-1 rounded-none bg-zinc-900 px-6 text-[11px] font-bold tracking-[0.15em] uppercase text-white hover:bg-zinc-700 disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || displayStock <= 0 || book.isActive === false}
              >
                {addToCartMutation.isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* Collapsibles */}
      <section className="border-t border-neutral-200">
        <Collapsible open={readMoreOpen} onOpenChange={setReadMoreOpen}>
          <CollapsibleTrigger className="container-main flex w-full items-center justify-center gap-3 py-6 text-[13px] font-medium tracking-widest text-neutral-900">
            <span className="uppercase">Mô tả sản phẩm</span>
            <span className="text-neutral-500">{readMoreOpen ? "—" : "+"}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="container-main pb-10">
              {book.description ? (
                <p className="text-[15px] leading-7 text-neutral-700 whitespace-pre-line">
                  {book.description}
                </p>
              ) : (
                <p className="text-neutral-500">Chưa có mô tả cho sản phẩm này.</p>
              )}
              {book.supplier && (
                <p className="mt-4 text-sm text-neutral-500">
                  Nhà cung cấp: <span className="font-medium text-neutral-800">{book.supplier.name}</span>
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={reviewsOpen} onOpenChange={setReviewsOpen} className="border-t border-neutral-200">
          <CollapsibleTrigger className="container-main flex w-full items-center justify-center gap-3 py-6 text-[13px] font-medium tracking-widest text-neutral-900">
            <span className="uppercase">Đánh giá</span>
            <span className="text-neutral-500">{reviewsOpen ? "—" : "+"}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="container-main pb-10">
              <p className="text-[14px] text-neutral-600">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* Similar books — reuse BookCard component */}
      {similarBooks.length > 0 && (
        <section className="border-t border-neutral-200 py-14">
          <div className="container-main">
            <h2 className="mb-10 font-serif text-[28px] leading-none tracking-tight text-neutral-900">
              Sách tương tự
            </h2>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
              {similarBooks.map((b) => (
                <BookCard
                  key={b.id}
                  bookId={b.id}
                  href={`/detail/${b.id}`}
                  title={b.title}
                  author={b.author}
                  price={b.price}
                  stockQuantity={b.stockQuantity}
                  imageUrl={b.imageUrl}
                  categories={b.categories?.map((c) => c.name)}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
