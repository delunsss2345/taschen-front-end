"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  if (!status || (status !== "success" && status !== "failed")) {
    router.replace("/");
    return null;
  }

  const isSuccess = status === "success";

  return (
    <div className="container-main py-10">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          {isSuccess ? (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>

              <h1 className="text-2xl font-bold text-green-700">
                Thanh toán thành công!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
              </p>

              {orderId && (
                <div className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Mã đơn hàng:</span>
                  <span className="text-sm font-bold">{orderId}</span>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/orders">Xem đơn hàng</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/">Tiếp tục mua sắm</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>

              <h1 className="text-2xl font-bold text-red-700">
                Thanh toán thất bại
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {message || "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href="/checkout">Thử lại</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/">Về trang chủ</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentResultSkeleton() {
  return (
    <div className="container-main py-10">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <Skeleton className="mx-auto mb-6 h-20 w-20 rounded-full" />
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto mt-2 h-4 w-64" />
          <Skeleton className="mx-auto mt-6 h-12 w-64 rounded-lg" />
          <div className="mt-8 flex flex-col gap-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultSkeleton />}>
      <PaymentResultContent />
    </Suspense>
  );
}
