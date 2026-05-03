"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useTranslator from "@/hooks/use-translator";
import {
  useCurrentCartQuery,
  useIncreaseCartItemQuantityMutation,
  useDecreaseCartItemQuantityMutation,
  useDeleteCartItemMutation,
} from "@/features/cart";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useBookByIdQuery } from "@/features/book";
import type { CartItem } from "@/types/response/cart.response";
import { toast } from "sonner";

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(n);

function CartSheetItem({ item }: { item: CartItem }) {
  const increase = useIncreaseCartItemQuantityMutation();
  const decrease = useDecreaseCartItemQuantityMutation();
  const remove = useDeleteCartItemMutation();

  const imageFromItem = item.coverImage ?? item.imageUrl ?? item.book?.imageUrl ?? item.book?.coverImage;
  const titleFromItem = item.bookTitle ?? item.book?.title;
  const { data: bookData } = useBookByIdQuery(!imageFromItem || !titleFromItem ? item.bookId : null);
  const title = titleFromItem ?? bookData?.title;
  const imageUrl = imageFromItem ?? bookData?.imageUrl;
  const unitPrice = item.unitPrice ?? 0;
  const isPending = increase.isPending || decrease.isPending || remove.isPending;

  const handleRemove = async () => {
    try {
      await remove.mutateAsync(item.id);
    } catch {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  return (
    <div className="flex gap-3 sm:gap-4">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title ?? "Sách"}
          className="h-[106px] w-[70px] shrink-0 overflow-hidden rounded-sm border bg-muted/30 object-cover"
        />
      ) : (
        <div className="h-[106px] w-[70px] shrink-0 overflow-hidden rounded-sm border bg-muted/30" />
      )}

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium leading-snug sm:text-base line-clamp-2">
              {title ?? `Sách #${item.bookId}`}
            </p>
            <p className="mt-1 text-base font-semibold sm:text-lg">{fmtVND(unitPrice)}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-40"
            aria-label="Xóa"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-sm"
            onClick={() => decrease.mutate(item.id)}
            disabled={isPending}
            aria-label="Giảm số lượng"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="min-w-[52px] border px-3 py-1.5 text-center text-xs sm:text-sm">
            {item.quantity}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-sm"
            onClick={() => increase.mutate(item.id)}
            disabled={isPending}
            aria-label="Tăng số lượng"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const CartSheet = () => {
  const { t } = useTranslator();
  const { data: cart } = useCurrentCartQuery();
  const cartItemCount = useCartStore((s) => s.cartItemCount);

  const items = cart?.items ?? [];
  const subtotal = cart?.totalPrice ?? items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-sm px-2 hover:bg-muted"
          aria-label={t("header.aria.cart")}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-sm">{cartItemCount > 0 ? cartItemCount : 0}</span>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-1/3 min-w-[420px] max-w-[720px] p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-6 py-5 sm:px-8">
            <SheetTitle className="text-base font-semibold sm:text-sm">
              Giỏ hàng của bạn {cartItemCount > 0 && `(${cartItemCount})`}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Giỏ hàng của bạn đang trống</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/books">Mua sắm ngay</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {items.map((item) => (
                  <div key={item.id}>
                    <CartSheetItem item={item} />
                    <Separator className="mt-5" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t px-6 py-5 sm:px-8">
              <div className="mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm sm:text-base">
                <p>Tạm tính</p>
                <p>{totalItems} sản phẩm</p>
                <p className="justify-self-end text-xl font-semibold sm:text-2xl">
                  {fmtVND(subtotal)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button asChild className="h-10 rounded-sm">
                  <Link href="/checkout">Thanh toán ngay</Link>
                </Button>
                <Button asChild variant="outline" className="h-10 rounded-sm">
                  <Link href="/cart">Xem giỏ hàng</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
