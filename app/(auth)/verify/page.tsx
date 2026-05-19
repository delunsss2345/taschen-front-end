"use client";

import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/features/auth";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, startTransition } from "react";

type VerifyState = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyMutation = useVerifyEmailMutation();

  const [state, setState] = useState<VerifyState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const { mutate } = verifyMutation;

  useEffect(() => {
    if (!token || !userId) {
      startTransition(() => {
        setState("error");
        setErrorMessage("Link xác minh không hợp lệ");
      });
      return;
    }

    mutate(
      { token, userId },
      {
        onSuccess: () => {
          setState("success");
        },
        onError: (err: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const axiosErr = err as any;
          const errData = axiosErr?.response?.data;
          const raw =
            errData?.data?.error ||
            errData?.data?.message ||
            errData?.error ||
            errData?.message ||
            "";

          // "already verified" → tài khoản đã xác minh thành công trước đó → coi là success
          if (
            raw.toLowerCase().includes("already") ||
            raw.includes("đã được xác minh")
          ) {
            setState("success");
            return;
          }

          let msg = "Đã xảy ra lỗi khi xác minh. Vui lòng thử lại.";
          if (raw.toLowerCase().includes("expired")) {
            msg = "Link xác minh đã hết hạn (2 phút). Vui lòng đăng ký lại.";
          } else if (
            raw.includes("Invalid") ||
            raw.includes("does not belong") ||
            raw.includes("không hợp lệ")
          ) {
            msg = "Link xác minh không hợp lệ.";
          } else if (raw) {
            msg = raw;
          }

          setErrorMessage(msg);
          setState("error");
        },
      },
    );
  }, [token, userId, mutate]);

  useEffect(() => {
    if (state !== "success") return;
    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (state === "success" && countdown <= 0) {
      router.push("/login");
    }
  }, [state, countdown, router]);

  return (
    <div className="space-y-6 text-center">
      {state === "loading" && (
        <>
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">Đang xác minh tài khoản...</p>
        </>
      )}

      {state === "success" && (
        <>
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-600">
              Xác minh thành công!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay.
            </p>
          </div>
          {countdown > 0 && (
            <p className="text-xs text-muted-foreground">
              Đang chuyển sang đăng nhập... {countdown}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button className="w-full cursor-pointer">
                Đăng nhập ngay
              </Button>
            </Link>
          </div>
        </>
      )}

      {state === "error" && (
        <>
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-600">Xác minh thất bại</h2>
            <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
          </div>
          <div className="flex flex-col gap-2">
            {errorMessage.includes("hết hạn") ||
            errorMessage.includes("đăng ký lại") ? (
              <Link href="/register">
                <Button className="w-full cursor-pointer">Đăng ký lại</Button>
              </Link>
            ) : (
              <Button
                className="w-full cursor-pointer"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            )}
            <Link href="/login">
              <Button variant="ghost" className="w-full cursor-pointer">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
