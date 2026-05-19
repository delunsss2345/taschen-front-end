"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Info, MapPin, Tag, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth";
import { useBookByIdQuery } from "@/features/book";
import {
  useCurrentCartQuery,
} from "@/features/cart";
import { useGuestCartStore } from "@/features/cart/store/guest-cart.store";
import { useAddressesQuery } from "@/features/profile";
import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import type { Address } from "@/types/profile.type";
import type { CartItem } from "@/types/response/cart.response";

const fmtVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(n);

function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "w-full rounded-lg border p-4 text-left transition",
        selected
          ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
          : "border-zinc-200 hover:border-zinc-400",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{address.recipientName}</p>
          <p className="text-xs text-zinc-500">{address.phoneNumber}</p>
          <p className="text-xs text-zinc-600">
            {address.street}, {address.ward}, {address.district}, {address.city}
          </p>
        </div>
        {address.isDefault && (
          <Badge variant="secondary" className="text-xs shrink-0">Mặc định</Badge>
        )}
      </div>
    </button>
  );
}

function CartSummaryItem({
  item,
  source,
}: {
  item: CartItem | { bookId: number; quantity: number; bookTitle: string; coverImage?: string; imageUrl?: string; unitPrice?: number };
  source: "user" | "guest";
}) {
  const isUser = source === "user";
  const cartItem = item as CartItem;
  const guestItem = item as { bookId: number; quantity: number; bookTitle: string; coverImage?: string; imageUrl?: string; unitPrice?: number };

  const imageFromItem = isUser
    ? cartItem.coverImage ?? cartItem.imageUrl ?? cartItem.book?.imageUrl ?? cartItem.book?.coverImage
    : guestItem.coverImage ?? guestItem.imageUrl;
  const titleFromItem = isUser ? cartItem.bookTitle ?? cartItem.book?.title : guestItem.bookTitle;
  const { data: bookData } = useBookByIdQuery(!imageFromItem || !titleFromItem ? item.bookId : null);
  const title = titleFromItem ?? bookData?.title;
  const imageUrl = imageFromItem ?? bookData?.imageUrl;

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title ?? ""} className="h-full w-full object-cover" />
        )}
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-500 text-[10px] font-bold text-white">
          {item.quantity}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug line-clamp-2">
          {title ?? `Sách #${item.bookId}`}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">{fmtVND(item.unitPrice ?? 0)}</p>
      </div>
      <p className="text-sm font-medium">
        {fmtVND((item.unitPrice ?? 0) * item.quantity)}
      </p>
    </div>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useAuthStore((s) => s.currentUser);
  const guestCart = useGuestCartStore();
  const [hasMergedGuest, setHasMergedGuest] = React.useState(false);

  React.useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      const decoded = decodeURIComponent(error);
      toast.error(decoded);
      router.replace("/checkout");
    }
  }, [searchParams]);

  const isLoggedIn = Boolean(currentUser?.id);
  const { data: cart, isLoading: cartLoading } = useCurrentCartQuery();
  const { data: addresses = [], isLoading: addrLoading } = useAddressesQuery(currentUser?.id ?? undefined);

  const guestItems = guestCart.items;
  const userItems = cart?.items ?? [];
  const displayItems = isLoggedIn ? userItems : guestItems;

  React.useEffect(() => {
    if (!isLoggedIn || hasMergedGuest || guestItems.length === 0) return;
    const doMerge = async () => {
      try {
        await cartService.mergeGuestCart(
          currentUser!.id,
          guestItems.map((i) => ({ bookId: i.bookId, quantity: i.quantity })),
        );
        guestCart.clearCart();
        setHasMergedGuest(true);
      } catch {
        // ignore merge error
      }
    };
    doMerge();
  }, [isLoggedIn, hasMergedGuest, guestItems.length]);

  const [selectedAddressId, setSelectedAddressId] = React.useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<"COD" | "VNPAY">("COD");
  const [promoCode, setPromoCode] = React.useState("");
  const [promoValidating, setPromoValidating] = React.useState(false);
  const [promoResult, setPromoResult] = React.useState<{
    discountPercent: number;
    code: string;
  } | null>(null);
  const [promoError, setPromoError] = React.useState("");
  const [placing, setPlacing] = React.useState(false);

  const subtotal = displayItems.reduce((s, i) => {
    const unitPrice = isLoggedIn
      ? (i as CartItem).unitPrice ?? 0
      : (i as { unitPrice?: number }).unitPrice ?? 0;
    return s + unitPrice * i.quantity;
  }, 0);
  const discount = promoResult ? Math.round(subtotal * promoResult.discountPercent / 100) : 0;
  const total = subtotal - discount;

  React.useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoValidating(true);
    setPromoError("");
    setPromoResult(null);
    try {
      const result = await orderService.validatePromoCode(promoCode.trim());
      if (result) {
        setPromoResult({ discountPercent: result.discountPercent, code: result.code });
        toast.success(`Áp dụng mã giảm giá: -${result.discountPercent}%`);
      } else {
        setPromoError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      }
    } catch {
      setPromoError("Mã giảm giá không hợp lệ");
    } finally {
      setPromoValidating(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập");
      router.push("/login");
      return;
    }
    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    if (displayItems.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    setPlacing(true);
    try {
      const order = await orderService.createOrder({
        addressId: selectedAddressId,
        paymentMethod,
        promotionCode: promoResult?.code || undefined,
      });

      if (paymentMethod === "VNPAY") {
        try {
          const paymentUrl = await orderService.createVNPayPayment(order.id);
          window.location.href = paymentUrl;
        } catch {
          toast.error("Không thể tạo thanh toán VNPay. Đơn hàng đã được tạo.");
          router.push(`/orders`);
        }
      } else {
        toast.success("Đặt hàng thành công!");
        router.push(`/orders`);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; details?: { message?: string } } } };
      const msg =
        axiosErr?.response?.data?.details?.message
        || axiosErr?.response?.data?.message
        || (err instanceof Error ? err.message : "Đặt hàng thất bại. Vui lòng thử lại.");
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  const isLoading = cartLoading || addrLoading;

  if (isLoading && isLoggedIn) {
    return (
      <div className="container-main py-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container-main py-20 text-center">
        <p className="text-lg font-medium text-muted-foreground mb-2">
          Vui lòng đăng nhập để tiếp tục thanh toán.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Giỏ hàng của bạn đã được lưu.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Button asChild className="px-8">
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button variant="outline" asChild className="px-8">
            <Link href="/register">Tạo tài khoản</Link>
          </Button>
          <Button variant="ghost" asChild className="mt-1">
            <Link href="/cart">← Quay lại giỏ hàng</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-10">
      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        {/* ---- LEFT: Checkout form ---- */}
        <div className="space-y-10">
          {/* Delivery Address */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-zinc-600" />
              <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>
            </div>

            {addresses.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-zinc-500 mb-3">Bạn chưa có địa chỉ nào.</p>
                <Button variant="outline" asChild size="sm">
                  <Link href="/profile/addresses">Thêm địa chỉ</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    selected={selectedAddressId === addr.id}
                    onSelect={() => setSelectedAddressId(addr.id)}
                  />
                ))}
                <Link
                  href="/profile/addresses"
                  className="text-sm text-blue-600 underline underline-offset-2"
                >
                  Quản lý địa chỉ
                </Link>
              </div>
            )}
          </section>

          {/* Shipping Method */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-zinc-600" />
              <h2 className="text-xl font-semibold">Phương thức vận chuyển</h2>
            </div>
            <div className="rounded-lg border border-zinc-200 px-4 py-3">
              <p className="text-sm text-zinc-700">Giao hàng tiêu chuẩn · Miễn phí</p>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
            <p className="mb-4 text-sm text-zinc-500">
              Toàn bộ các giao dịch được bảo mật và mã hóa.
            </p>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as "COD" | "VNPAY")}
              className="gap-0 overflow-hidden rounded-lg border border-zinc-200"
            >
              <label
                htmlFor="vnpay"
                className={[
                  "flex cursor-pointer items-center gap-3 border-b border-zinc-200 px-4 py-4 transition",
                  paymentMethod === "VNPAY" ? "bg-sky-50/60" : "bg-white",
                ].join(" ")}
              >
                <RadioGroupItem value="VNPAY" id="vnpay" />
                <span className="text-sm font-medium">VNPay</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="rounded bg-blue-700 px-1.5 py-0.5 text-[10px] font-bold text-white">VISA</span>
                  <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">MC</span>
                  <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">JCB</span>
                </div>
              </label>

              <label
                htmlFor="cod"
                className={[
                  "flex cursor-pointer items-center gap-3 px-4 py-4 transition",
                  paymentMethod === "COD" ? "bg-zinc-50" : "bg-white",
                ].join(" ")}
              >
                <RadioGroupItem value="COD" id="cod" />
                <span className="text-sm text-zinc-700">Thanh toán khi nhận hàng (COD)</span>
              </label>
            </RadioGroup>

            <Button
              className="mt-6 h-14 w-full rounded-lg bg-zinc-900 text-base font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
              onClick={handlePlaceOrder}
              disabled={placing || displayItems.length === 0 || !selectedAddressId}
            >
              {placing
                ? "Đang xử lý..."
                : paymentMethod === "VNPAY"
                  ? "Tiến hành thanh toán VNPay"
                  : "Đặt hàng"}
            </Button>
          </section>
        </div>

        {/* ---- RIGHT: Order summary ---- */}
        <aside className="lg:border-l lg:pl-10">
          {/* Cart items */}
          <div className="space-y-5">
            {displayItems.map((item) => {
              const key = isLoggedIn
                ? (item as CartItem).id
                : `guest-${(item as { bookId: number }).bookId}`;
              return (
                <CartSummaryItem
                  key={key}
                  item={item}
                  source={isLoggedIn ? "user" : "guest"}
                />
              );
            })}
          </div>

          <Separator className="my-6" />

          {/* Promo code */}
          <div className="space-y-2">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Tag className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="Mã giảm giá"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError("");
                    if (promoResult) setPromoResult(null);
                  }}
                  className="h-11 pl-9 text-sm"
                  onKeyDown={(e) => { if (e.key === "Enter") handleValidatePromo(); }}
                />
              </div>
              <Button
                variant="outline"
                className="h-11 px-5 text-sm"
                onClick={handleValidatePromo}
                disabled={promoValidating || !promoCode.trim()}
              >
                {promoValidating ? "..." : "Áp dụng"}
              </Button>
            </div>
            {promoResult && (
              <div className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Giảm {promoResult.discountPercent}% · Mã: {promoResult.code}</span>
              </div>
            )}
            {promoError && (
              <p className="text-xs text-red-500">{promoError}</p>
            )}
          </div>

          <Separator className="my-6" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-600">
                Tạm tính · {displayItems.length} sản phẩm
              </span>
              <span>{fmtVND(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span>Giảm giá</span>
                <span>-{fmtVND(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-zinc-600 flex items-center gap-1">
                Vận chuyển <Info className="inline h-3.5 w-3.5 text-zinc-400" />
              </span>
              <span className="text-green-600 text-sm">Miễn phí</span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Tổng</span>
            <div className="text-right">
              <span className="mr-2 text-xs text-zinc-400">VND</span>
              <span className="text-2xl font-bold">{fmtVND(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="container-main py-10">
      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}

