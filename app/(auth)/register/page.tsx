"use client";

import RegisterForm from "@/app/(auth)/_components/RegisterForm";
import { useRegisterMutation } from "@/features/auth";
import useTranslator from "@/hooks/use-translator";
import { RegisterRequest } from "@/types/request/auth.request";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Register = () => {
  const { t } = useTranslator();
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const onSubmit = async (values: RegisterRequest) => {
    toast.promise(registerMutation.mutateAsync(values), {
      loading: "Đang tạo tài khoản...",
      success: () => {
        router.push("/login");
        return "Đăng ký thành công! Vui lòng đăng nhập.";
      },
      error: "Đăng ký thất bại, vui lòng thử lại.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">{t("auth.registerTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("auth.registerSubtitle")}
        </p>
      </div>

      <RegisterForm
        onSubmit={onSubmit}
        isLoading={registerMutation.isPending}
      />

      {/* Bổ sung phần điều hướng ngược lại */}
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