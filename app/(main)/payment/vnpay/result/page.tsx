"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VNPayResultContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const txnRef = searchParams.get("vnp_TxnRef");
  const amount = searchParams.get("vnp_Amount");

  const fmtVND = (raw: string | null) => {
    if (!raw) return null;
    const num = parseInt(raw, 10) / 100;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
        {success ? (
          <>
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold text-green-700">Thanh toán thành công!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Đơn hàng của bạn đã được thanh toán thành công qua VNPay.
            </p>
            {txnRef && (
              <p className="mt-3 text-xs text-muted-foreground">
                Mã giao dịch: <span className="font-medium text-foreground">{txnRef}</span>
              </p>
            )}
            {amount && (
              <p className="mt-1 text-xs text-muted-foreground">
                Số tiền: <span className="font-medium text-foreground">{fmtVND(amount)}</span>
              </p>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild>
                <Link href="/orders">Xem đơn hàng</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/books">Tiếp tục mua sắm</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-bold text-red-700">Thanh toán thất bại</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Giao dịch VNPay không thành công. Vui lòng thử lại.
            </p>
            {txnRef && (
              <p className="mt-3 text-xs text-muted-foreground">
                Mã giao dịch: <span className="font-medium text-foreground">{txnRef}</span>
              </p>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild>
                <Link href="/orders">Xem đơn hàng</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/checkout">Thử lại</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VNPayResultPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Đang xử lý...</div>}>
      <VNPayResultContent />
    </Suspense>
  );
}
