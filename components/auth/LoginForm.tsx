import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormMessageI18n } from "@/components/common/FormMessageI18n";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useTranslator from "@/hooks/use-translator";

const getLoginSchema = (t: TFunction) =>
  z.object({
    email: z.string().email(t("auth.errors.emailInvalid")),
    password: z.string().min(6, t("auth.errors.passwordMin", { count: 6 })),
  });

export type LoginValues = z.infer<ReturnType<typeof getLoginSchema>>;

type LoginFormProps = {
  isLoading: boolean;
  onSubmit?: (values: LoginValues) => void | Promise<void>;
};

const LoginForm = ({ isLoading, onSubmit }: LoginFormProps) => {
  const { t } = useTranslator();
  const loginSchema = React.useMemo(() => getLoginSchema(t), [t]);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const handleSubmit = async (values: LoginValues) => {
    await onSubmit?.(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessageI18n />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.passwordLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("auth.passwordPlaceholder")}
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessageI18n />
            </FormItem>
          )}
        />

        <Button type="submit" className={`w-full ${isLoading ? "hidden" : ""}`} disabled={isLoading}>
          {isLoading ? 'Đang đăng nhập': 'Đăng nhập'}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
