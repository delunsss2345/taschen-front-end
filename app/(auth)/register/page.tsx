"use client";

import RegisterForm from "@/app/(auth)/_components/RegisterForm";
import { useRegisterMutation } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertTriangle } from "lucide-react";
import useTranslator from "@/hooks/use-translator";
import { RegisterRequest } from "@/types/request/auth.request";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Register = () => {
  const { t } = useTranslator();
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [existsError, setExistsError] = useState("");

  const onSubmit = async (values: RegisterRequest) => {
    setExistsError("");
    try {
      await registerMutation.mutateAsync(values);
      setRegisterSuccess(true);
    } catch (err: unknown) {
      let msg = "Đăng ký thất bại";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosErr = err as any;
      if (
        axiosErr?.response?.data &&
        typeof axiosErr.response.data === "object"
      ) {
        const data = axiosErr.response.data as {
          error?: string;
          message?: string;
          data?: { error?: string; message?: string };
        };
        const raw =
          data.data?.error ||
          data.data?.message ||
          data.error ||
          data.message ||
          "";
        msg = raw;

        if (
          raw.toLowerCase().includes("exists") ||
          raw.toLowerCase().includes("already") ||
          raw.toLowerCase().includes("đã tồn tại") ||
          raw.toLowerCase().includes("already been taken") ||
          raw.toLowerCase().includes("đăng ký")
        ) {
          setExistsError(raw);
          return;
        }
      }

      toast.error(msg);
    }
  };

  useEffect(() => {
    if (!registerSuccess) return;
    const interval = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [registerSuccess]);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/login");
    }
  }, [countdown, router]);

  if (registerSuccess) {
    return (
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-14 w-14 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-green-600">
            Đăng ký thành công!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Vui lòng kiểm tra email để xác minh tài khoản.
          </p>
          <p className="mt-1 text-xs text-orange-500">
            Lưu ý: Link xác minh chỉ có hiệu lực trong 2 phút.
          </p>
        </div>

        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-left">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Email xác minh đã được gửi
              </p>
              <p className="mt-0.5 text-xs text-green-700">
                Hãy kiểm tra hộp thư và click vào link để kích hoạt tài khoản.
              </p>
            </div>
          </div>
        </div>

        {countdown > 0 && (
          <p className="text-xs text-muted-foreground">
            Đang chuyển sang đăng nhập... {countdown}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <a
            href="mailto:"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="w-full cursor-pointer">
              <Mail className="h-4 w-4 mr-2" />
              Đến hộp thư
            </Button>
          </a>
          <Link href="/login">
            <Button className="w-full cursor-pointer">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {existsError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-left">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Email đã được sử dụng
              </p>
              <p className="mt-0.5 text-xs text-red-700">
                {existsError}
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  href="/login"
                  className="text-xs font-medium text-red-700 hover:underline"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.registerTitle")}</h1>
      </div>

      <RegisterForm
        onSubmit={onSubmit}
        isLoading={registerMutation.isPending}
      />

      <div className="text-center text-sm">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default Register;