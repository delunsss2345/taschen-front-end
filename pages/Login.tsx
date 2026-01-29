import LoginForm, { type LoginValues } from "@/components/auth/LoginForm";
import { LoginButtons } from "@/components/auth/LoginWithGoogle";
import { login, selectAuthLoading } from "@/features/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { toast } from "sonner";
const Login = () => {
  const {authLoading} = useAppSelector(selectAuthLoading)
  const dispatch = useAppDispatch() ; 
  const onSubmit = async (values: LoginValues) => {
    console.log(authLoading) ; 
    toast.promise(dispatch(login(values)).unwrap(), {
      loading: 'Đang loading',
      success: 'Loading thành công',
      error: 'Loading lỗi',
    });
  };

  return <>
    <LoginForm isLoading={authLoading} onSubmit={onSubmit} />
    <LoginButtons />
  </>
};
export default Login;
