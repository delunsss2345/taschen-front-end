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

const getResetPasswordSchema = (t: TFunction) =>
  z.object({
    verifyToken: z.string().min(1, t("auth.errors.required")),
  });

export type ResetPasswordValues = z.infer<
  ReturnType<typeof getResetPasswordSchema>
>;

type ResetPasswordFormProps = {
  isLoading?: boolean;
  onSubmit?: (values: ResetPasswordValues) => void | Promise<void>;
};

const ResetPasswordForm = ({
  isLoading = false,
  onSubmit,
}: ResetPasswordFormProps) => {
  const { t } = useTranslator();
  const resetSchema = React.useMemo(() => getResetPasswordSchema(t), [t]);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      verifyToken: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (values: ResetPasswordValues) => {
    await onSubmit?.(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="verifyToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.verifyTokenLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.verifyTokenPlaceholder")}
                  autoComplete="one-time-code"
                  {...field}
                />
              </FormControl>
              <FormMessageI18n />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.verifying") : t("auth.verifySubmit")}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
