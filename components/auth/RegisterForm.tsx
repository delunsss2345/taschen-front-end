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

const getRegisterSchema = (t: TFunction) =>
  z
    .object({
      firstName: z.string().min(1, t("auth.errors.required")),
      lastName: z.string().min(1, t("auth.errors.required")),
      email: z.string().email(t("auth.errors.emailInvalid")),
      password: z.string().min(6, t("auth.errors.passwordMin", { count: 6 })),
      confirm_password: z
        .string()
        .min(6, t("auth.errors.passwordMin", { count: 6 })),
    })
    .refine((values) => values.password === values.confirm_password, {
      message: t("auth.errors.passwordMismatch"),
      path: ["confirm_password"],
    });

export type RegisterValues = z.infer<ReturnType<typeof getRegisterSchema>>;

type RegisterFormProps = {
  isLoading?: boolean;
  onSubmit?: (values: RegisterValues) => void | Promise<void>;
};

const RegisterForm = ({ isLoading = false, onSubmit }: RegisterFormProps) => {
  const { t } = useTranslator();
  const registerSchema = React.useMemo(() => getRegisterSchema(t), [t]);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (values: RegisterValues) => {
    await onSubmit?.(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.firstNameLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.firstNamePlaceholder")}
                  autoComplete="given-name"
                  {...field}
                />
              </FormControl>
              <FormMessageI18n />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.lastNameLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.lastNamePlaceholder")}
                  autoComplete="family-name"
                  {...field}
                />
              </FormControl>
              <FormMessageI18n />
            </FormItem>
          )}
        />

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
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessageI18n />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.confirmPasswordLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessageI18n />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.registering") : t("auth.registerSubmit")}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
