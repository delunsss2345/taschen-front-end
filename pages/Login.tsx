import LoginForm, { type LoginValues } from "@/components/auth/LoginForm";
import { LoginButtons } from "@/components/auth/LoginWithGoogle";
import { login, selectAuthLoading } from "@/features/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Login = () => {
  const { authLoading } = useAppSelector(selectAuthLoading)
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (values: LoginValues) => {
    console.log(authLoading);
    toast.promise(dispatch(login(values)).unwrap(), {
      loading: 'Đang đăng nhập',
      success: () => {
        router.push('/');
        return 'Đăng nhập thành công';
      },
      error: 'Đăng nhập thất bại',
    });
  };

  return <>
    <LoginForm isLoading={authLoading} onSubmit={onSubmit} />
    <LoginButtons />
  </>
};
export default Login;
