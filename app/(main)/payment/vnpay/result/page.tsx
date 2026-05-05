"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

function VNPayResultRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const status = success === "true" ? "success" : "failed";
    const orderId = searchParams.get("vnp_TxnRef");
    const params = new URLSearchParams({ status });
    if (orderId) params.set("orderId", orderId);
    router.replace(`/payment-result?${params.toString()}`);
  }, []);

  return null;
}

export default function VNPayResultPage() {
  return <VNPayResultRedirect />;
}
