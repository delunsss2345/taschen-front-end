import LoginForm, { type LoginValues } from "@/components/auth/LoginForm";
import * as React from "react";

const Login = () => {
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (values: LoginValues) => {
    try {
      setLoading(true);
      console.log("login:", values);
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm isLoading={loading} onSubmit={onSubmit} />;
};
export default Login;
