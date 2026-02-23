"use client";

import LoginForm, { LoginValues } from "@/app/(auth)/_components/LoginForm";
import {
  selectorAuthLoading,
  useAuthStore,
  useLoginMutation,
} from "@/features/auth";
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
    <>
      <LoginForm
        isLoading={authLoading || loginMutation.isPending}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default Login;
