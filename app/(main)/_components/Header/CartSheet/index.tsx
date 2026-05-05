"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

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
  cartQueryKeys,
} from "@/features/cart";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useGuestCartStore } from "@/features/cart/store/guest-cart.store";
import { useGuestCartItemCount } from "@/features/cart/hooks/useGuestCart";
import { useBookByIdQuery } from "@/features/book";
import { useAuthStore } from "@/features/auth";
import { cartService } from "@/services/cart.service";
import type { CartItem } from "@/types/response/cart.response";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(n);

type SheetItem =
  | { source: "user"; item: CartItem }
  | { source: "guest"; item: { bookId: number; quantity: number; bookTitle: string; coverImage?: string; imageUrl?: string; unitPrice?: number } };

function CartSheetItem({ entry }: { entry: SheetItem }) {
  const increase = useIncreaseCartItemQuantityMutation();
  const decrease = useDecreaseCartItemQuantityMutation();
  const remove = useDeleteCartItemMutation();
  const guestCart = useGuestCartStore();

  const isUser = entry.source === "user";
  const item = entry.item;

  const imageFromItem = isUser
    ? (item as CartItem).coverImage ?? (item as CartItem).imageUrl ?? (item as CartItem).book?.imageUrl ?? (item as CartItem).book?.coverImage
    : (item as { coverImage?: string; imageUrl?: string }).coverImage ?? (item as { coverImage?: string; imageUrl?: string }).imageUrl;
  const titleFromItem = isUser ? (item as CartItem).bookTitle ?? (item as CartItem).book?.title : (item as { bookTitle: string }).bookTitle;
  const { data: bookData } = useBookByIdQuery(
    isUser ? (item as CartItem).bookId : (item as { bookId: number }).bookId
  );
  const title = titleFromItem ?? bookData?.title;
  const imageUrl = imageFromItem ?? bookData?.imageUrl;
  const unitPrice = isUser ? (item as CartItem).unitPrice ?? 0 : (item as { unitPrice?: number }).unitPrice ?? 0;
  const isPending = increase.isPending || decrease.isPending || remove.isPending;

  const guestItem = isUser ? null : (item as { bookId: number; quantity: number });

  const handleRemove = async () => {
    if (isUser) {
      try {
        await remove.mutateAsync((item as CartItem).id);
      } catch {
        toast.error("Không thể xóa sản phẩm");
      }
    } else {
      guestCart.removeItem(guestItem!.bookId);
      toast.success("Đã xóa khỏi giỏ hàng");
    }
  };

  const handleIncrease = () => {
    if (isUser) {
      increase.mutate((item as CartItem).id);
    } else {
      guestCart.updateQuantity(guestItem!.bookId, guestItem!.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (isUser) {
      if ((item as CartItem).quantity <= 1) {
        handleRemove();
      } else {
        decrease.mutate((item as CartItem).id);
      }
    } else {
      if (guestItem!.quantity <= 1) {
        handleRemove();
      } else {
        guestCart.updateQuantity(guestItem!.bookId, guestItem!.quantity - 1);
      }
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
              {title ?? `Sách #${isUser ? (item as CartItem).bookId : (item as { bookId: number }).bookId}`}
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
            onClick={handleDecrease}
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
            onClick={handleIncrease}
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
  const router = useRouter();
  const { t } = useTranslator();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.currentUser);
  const { data: cart } = useCurrentCartQuery();
  const cartItemCount = useCartStore((s) => s.cartItemCount);
  const guestItemCount = useGuestCartItemCount();
  const guestCart = useGuestCartStore();

  const userItems = cart?.items ?? [];
  const guestItems = guestCart.items;

  const isLoggedIn = Boolean(currentUser?.id);
  const displayItems: SheetItem[] = isLoggedIn
    ? userItems.map((item) => ({ source: "user" as const, item }))
    : guestItems.map((item) => ({ source: "guest" as const, item }));

  const totalItems = displayItems.reduce((sum, e) => sum + e.item.quantity, 0);
  const subtotal = displayItems.reduce((sum, e) => {
    const unitPrice = e.source === "user"
      ? ((e.item as CartItem).unitPrice ?? 0)
      : ((e.item as { unitPrice?: number }).unitPrice ?? 0);
    return sum + unitPrice * e.item.quantity;
  }, 0);

  const prevLoggedIn = React.useRef(false);
  React.useEffect(() => {
    if (!isLoggedIn || guestItems.length === 0) {
      prevLoggedIn.current = false;
      return;
    }
    if (prevLoggedIn.current) return;
    prevLoggedIn.current = true;

    const doMerge = async () => {
      try {
        await cartService.mergeGuestCart(
          currentUser!.id,
          guestItems.map((i) => ({ bookId: i.bookId, quantity: i.quantity })),
        );
        guestCart.clearCart();
        await queryClient.invalidateQueries({ queryKey: cartQueryKeys.root });
      } catch {
        // silently fail - guest cart stays for next attempt
      }
    };
    doMerge();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.info("Vui lòng đăng nhập để thanh toán");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  const handleClearGuestCart = () => {
    guestCart.clearCart();
    toast.success("Đã xóa giỏ hàng");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-sm px-2 hover:bg-muted"
          aria-label={t("header.aria.cart")}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-sm">
            {cartItemCount + guestItemCount > 0 ? cartItemCount + guestItemCount : 0}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-1/3 min-w-[420px] max-w-[720px] p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-semibold sm:text-sm">
                Giỏ hàng của bạn {totalItems > 0 && `(${totalItems})`}
              </SheetTitle>
              {!isLoggedIn && guestItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearGuestCart}
                  className="text-xs text-muted-foreground underline hover:text-foreground"
                >
                  Xóa tất cả
                </button>
              )}
            </div>
            {!isLoggedIn && guestItems.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Đăng nhập để đồng bộ giỏ hàng của bạn
              </p>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            {displayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Giỏ hàng của bạn đang trống</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/books">Mua sắm ngay</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {displayItems.map((entry) => {
                  const key =
                    entry.source === "user"
                      ? `user-${(entry.item as CartItem).id}`
                      : `guest-${(entry.item as { bookId: number }).bookId}`;
                  return (
                    <div key={key}>
                      <CartSheetItem entry={entry} />
                      <Separator className="mt-5" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {displayItems.length > 0 && (
            <div className="border-t px-6 py-5 sm:px-8">
              <div className="mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm sm:text-base">
                <p>Tạm tính</p>
                <p>{totalItems} sản phẩm</p>
                <p className="justify-self-end text-xl font-semibold sm:text-2xl">
                  {fmtVND(subtotal)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={handleCheckout} className="h-10 rounded-sm">
                  Thanh toán ngay
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
