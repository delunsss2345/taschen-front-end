"use client";

import LoginForm, { LoginValues } from "@/app/(auth)/_components/LoginForm";
import {
  selectorAuthLoading,
  useAuthStore,
  useLoginMutation,
} from "@/features/auth";
import Link from "next/link"; // Import Link
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Login = () => {
  const authLoading = useAuthStore(selectorAuthLoading);
  const loginMutation = useLoginMutation();
  const router = useRouter();

  const onSubmit = async (values: LoginValues) => {
    toast.promise(loginMutation.mutateAsync(values), {
      loading: "Đang đăng nhập",
      success: () => {
        router.push("/");
        return "Đăng nhập thành công";
      },
      error: "Đăng nhập thất bại",
    });
  };

  return (
    <div className="space-y-4">
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