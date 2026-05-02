"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import {
  useCurrentCartQuery,
  useIncreaseCartItemQuantityMutation,
  useDecreaseCartItemQuantityMutation,
  useDeleteCartItemMutation,
} from "@/features/cart";
import type { CartItem } from "@/types/response/cart.response";

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(n);

function CartItemRow({ item }: { item: CartItem }) {
  const increaseMutation = useIncreaseCartItemQuantityMutation();
  const decreaseMutation = useDecreaseCartItemQuantityMutation();
  const deleteMutation = useDeleteCartItemMutation();

  const title = (item as Record<string, unknown>).bookTitle as string | undefined;
  const imageUrl = (item as Record<string, unknown>).coverImage as string | undefined
    ?? (item as Record<string, unknown>).imageUrl as string | undefined;
  const unitPrice = item.unitPrice ?? 0;
  const totalPrice = item.totalPrice ?? unitPrice * item.quantity;

  const handleIncrease = async () => {
    try {
      await increaseMutation.mutateAsync(item.id);
    } catch {
      toast.error("Không thể tăng số lượng");
    }
  };

  const handleDecrease = async () => {
    if (item.quantity <= 1) {
      handleRemove();
      return;
    }
    try {
      await decreaseMutation.mutateAsync(item.id);
    } catch {
      toast.error("Không thể giảm số lượng");
    }
  };

  const handleRemove = async () => {
    try {
      await deleteMutation.mutateAsync(item.id);
      toast.success("Đã xóa khỏi giỏ hàng");
    } catch {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const isPending =
    increaseMutation.isPending || decreaseMutation.isPending || deleteMutation.isPending;

  return (
    <div>
      <div className="grid grid-cols-[1fr_140px_100px_100px] items-start gap-x-4 py-6">
        {/* Title column */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="mt-8 shrink-0 text-zinc-400 transition-colors hover:text-zinc-900 disabled:opacity-40"
            onClick={handleRemove}
            disabled={isPending}
            aria-label="Xóa sản phẩm"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="h-[120px] w-[80px] shrink-0 overflow-hidden border bg-neutral-50">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={title ?? "Sách"} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-300">
                <ShoppingCart className="h-6 w-6" />
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium leading-snug">
              {title ?? `Sách #${item.bookId}`}
            </p>
            <Link
              href={`/detail/${item.bookId}`}
              className="text-xs text-blue-600 underline underline-offset-2 hover:text-blue-800"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Price */}
        <div className="pt-1 text-center text-sm">{fmtVND(unitPrice)}</div>

        {/* Qty */}
        <div className="flex items-center justify-center gap-1 pt-1">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center border text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-40"
            onClick={handleDecrease}
            disabled={isPending}
          >
            <Minus className="h-3 w-3" />
          </button>
          <div className="flex h-7 w-8 items-center justify-center border text-xs">
            {item.quantity}
          </div>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center border text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-40"
            onClick={handleIncrease}
            disabled={isPending}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Total */}
        <div className="pt-1 text-right text-sm font-medium">{fmtVND(totalPrice)}</div>
      </div>
      <Separator />
    </div>
  );
}

export default function ShoppingCartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCurrentCartQuery();

  const items = cart?.items ?? [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart?.totalPrice ?? items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);

  if (isLoading) {
    return (
      <div className="container-main py-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-10">
      <h1 className="text-lg font-bold tracking-tight">Giỏ hàng của bạn</h1>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_280px]">
        {/* Left: Cart items */}
        <div>
          <div className="grid grid-cols-[1fr_140px_100px_100px] items-center border-b pb-3 text-xs text-zinc-500">
            <span>Sản phẩm</span>
            <span className="text-center">Đơn giá</span>
            <span className="text-center">Số lượng</span>
            <span className="text-right">Thành tiền</span>
          </div>

          {items.length > 0 ? (
            <>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
              <div className="grid grid-cols-[1fr_140px_100px_100px] items-center py-4 text-sm font-semibold">
                <span />
                <span />
                <span className="text-center">
                  {totalItems} sản phẩm
                </span>
                <span className="text-right">{fmtVND(subtotal)}</span>
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-zinc-300" />
              <p className="text-sm text-zinc-400">Giỏ hàng của bạn đang trống.</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/books">Tiếp tục mua sắm</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold">Tóm tắt đơn hàng</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600">Tạm tính</span>
                <span>{fmtVND(subtotal)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>Tổng cộng</span>
                <span>{fmtVND(subtotal)}</span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/checkout")}
              variant="outline"
              className="mt-5 w-full rounded-none border-zinc-900 py-5 text-xs uppercase tracking-wider"
              disabled={items.length === 0}
            >
              Tiến hành thanh toán
            </Button>
          </div>

          <Separator />

          <p className="text-xs text-zinc-500">
            Phí vận chuyển và mã giảm giá sẽ được áp dụng tại trang thanh toán.
          </p>
        </div>
      </div>
    </div>
  );
}
