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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTranslator from "@/hooks/use-translator";
import { Eye, EyeOff } from "lucide-react";

const PHONE_REGEX = /^0\d{9}$/;

const getRegisterSchema = (t: TFunction) =>
  z
    .object({
      firstName: z.string().min(1, t("auth.errors.required")),
      lastName: z.string().min(1, t("auth.errors.required")),
      email: z.string().email(t("auth.errors.emailInvalid")),
      password: z.string().min(6, t("auth.errors.passwordMin", { count: 6 })),
      confirmPassword: z
        .string()
        .min(6, t("auth.errors.passwordMin", { count: 6 })),
      gender: z.enum(["MALE", "FEMALE", "OTHER"], {
        message: t("auth.errors.required"),
      }),
      phoneNumber: z
        .string()
        .min(1, t("auth.errors.required"))
        .regex(PHONE_REGEX, t("auth.errors.phoneInvalid")),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t("auth.errors.passwordMismatch"),
      path: ["confirmPassword"],
    });

export type RegisterValues = z.infer<ReturnType<typeof getRegisterSchema>>;

type RegisterFormProps = {
  isLoading?: boolean;
  onSubmit?: (values: RegisterValues) => void | Promise<void>;
};

function PasswordField({
  name,
  label,
  placeholder,
  autoComplete,
  control,
}: {
  name: "password" | "confirmPassword";
  label: string;
  placeholder: string;
  autoComplete: string;
  control: ReturnType<typeof useForm<RegisterValues>>["control"];
}) {
  const { t } = useTranslator();
  const [show, setShow] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="pr-10"
                {...field}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => setShow((s) => !s)}
                tabIndex={-1}
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessageI18n />
        </FormItem>
      )}
    />
  );
}

const RegisterForm = ({ isLoading = false, onSubmit }: RegisterFormProps) => {
  const { t } = useTranslator();
  const registerSchema = React.useMemo(() => getRegisterSchema(t), [t]);
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: undefined as "MALE" | "FEMALE" | "OTHER" | undefined,
      phoneNumber: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (values: RegisterValues) => {
    await onSubmit?.(values);
  };

  const togglePassword = () => setShowPassword((s) => !s);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
        </div>

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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.passwordLabel")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.passwordPlaceholder")}
                      autoComplete="new-password"
                      className="pr-10"
                      {...field}
                    />
                    <TogglePasswordButton
                      show={showPassword}
                      onToggle={togglePassword}
                    />
                  </div>
                </FormControl>
                <FormMessageI18n />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.confirmPasswordLabel")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.confirmPasswordPlaceholder")}
                      autoComplete="new-password"
                      className="pr-10"
                      {...field}
                    />
                    <TogglePasswordButton
                      show={showPassword}
                      onToggle={togglePassword}
                    />
                  </div>
                </FormControl>
                <FormMessageI18n />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.genderLabel")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("auth.genderPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Nam</SelectItem>
                    <SelectItem value="FEMALE">Nữ</SelectItem>
                    <SelectItem value="OTHER">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessageI18n />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.phoneNumberLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t("auth.phonePlaceholder")}
                    autoComplete="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessageI18n />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
          {isLoading ? t("auth.registering") : t("auth.registerSubmit")}
        </Button>
      </form>
    </Form>
  );
}

function TogglePasswordButton({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
      onClick={onToggle}
      tabIndex={-1}
    >
      {show ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  );
}

export default RegisterForm;
