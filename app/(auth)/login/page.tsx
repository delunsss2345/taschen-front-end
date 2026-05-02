"use client";

import LoginForm, { LoginValues } from "@/app/(auth)/_components/LoginForm";
import {
  selectorAuthLoading,
  useAuthStore,
  useLoginMutation,
} from "@/features/auth";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Login = () => {
  const authLoading = useAuthStore(selectorAuthLoading);
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const [showUnverifiedAlert, setShowUnverifiedAlert] = useState(false);

  const onSubmit = async (values: LoginValues) => {
    setShowUnverifiedAlert(false);
    toast.promise(loginMutation.mutateAsync(values), {
      loading: "Đang đăng nhập",
      success: () => {
        router.push("/");
        return "Đăng nhập thành công";
      },
      error: (err: unknown) => {
        let message = "Đăng nhập thất bại";

        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response &&
          err.response.data &&
          typeof err.response.data === "object"
        ) {
          const data = err.response.data as { error?: string; message?: string };
          const msg = data.error || data.message || "";
          if (
            msg.toLowerCase().includes("not verified") ||
            msg.toLowerCase().includes("chưa được xác minh") ||
            msg.toLowerCase().includes("xác minh")
          ) {
            setShowUnverifiedAlert(true);
            return "";
          }
          message = msg || "Đăng nhập thất bại";
        }

        setShowUnverifiedAlert(false);
        return message;
      },
    });
  };

  return (
    <div className="space-y-4">
      {showUnverifiedAlert && (
        <div className="rounded-md border border-orange-200 bg-orange-50 p-4 text-left">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-800">
                Tài khoản chưa được xác minh
              </p>
              <p className="mt-0.5 text-xs text-orange-700">
                Vui lòng kiểm tra email để xác minh tài khoản trước khi đăng nhập.
              </p>
              <p className="mt-1 text-xs text-orange-600">
                Link xác minh có hiệu lực trong 2 phút.
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  href="/register"
                  className="text-xs font-medium text-orange-700 hover:underline"
                >
                  Đăng ký lại
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoginForm
        isLoading={authLoading || loginMutation.isPending}
        onSubmit={onSubmit}
      />

      <div className="text-center text-sm">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default Login;