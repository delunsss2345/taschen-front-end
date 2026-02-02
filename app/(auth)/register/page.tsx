"use client";

import RegisterForm, { type RegisterValues } from "@/components/auth/RegisterForm";
import { register, selectAuthLoading } from "@/features/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
  const { authLoading } = useAppSelector(selectAuthLoading);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (values: RegisterValues) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirm_password,
    };

    toast.promise(dispatch(register(payload)).unwrap(), {
      loading: 'Đang đăng ký',
      success: () => {
        router.push('/');
        return 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.';
      },
      error: 'Đăng ký thất bại',
    });
  };

  return <RegisterForm isLoading={authLoading} onSubmit={onSubmit} />;
};

export default Page;
