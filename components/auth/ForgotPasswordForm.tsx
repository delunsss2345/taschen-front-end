'use client'
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

const getForgotPasswordSchema = (t: TFunction) =>
  z.object({
    email: z.string().email(t("auth.errors.emailInvalid")),
  });

export type ForgotPasswordValues = z.infer<
  ReturnType<typeof getForgotPasswordSchema>
>;

type ForgotPasswordFormProps = {
  isLoading?: boolean;
  onSubmit?: (values: ForgotPasswordValues) => void | Promise<void>;
};

const ForgotPasswordForm = ({
  isLoading = false,
  onSubmit,
}: ForgotPasswordFormProps) => {
  const { t } = useTranslator();
  const forgotSchema = React.useMemo(() => getForgotPasswordSchema(t), [t]);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (values: ForgotPasswordValues) => {
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.forgotSubmitting") : t("auth.forgotSubmit")}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
