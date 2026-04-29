"use client";

import { useCallback, useRef } from "react";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/features/profile";
import { useAuthStore, selectorCurrentUser } from "@/features/auth";
import { GENDER_OPTIONS } from "@/types/profile.type";
import useTranslator from "@/hooks/use-translator";

// ============================================================
// Validation Schema
// ============================================================
const profileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phoneNumber: z
    .string()
    .regex(/^0[0-9]{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ============================================================
// Component
// ============================================================
export function ProfileInfo() {
  const { t } = useTranslator();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = useAuthStore(selectorCurrentUser);
  const { data: profile, isLoading } = useProfileQuery();
  const updateMutation = useUpdateProfileMutation();
  const uploadMutation = useUploadAvatarMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: profile?.firstName ?? currentUser?.firstName ?? "",
      lastName: profile?.lastName ?? currentUser?.lastName ?? "",
      phoneNumber: profile?.phoneNumber ?? "",
      gender: (profile?.gender as ProfileFormValues["gender"]) ?? "MALE",
    },
  });

  // Re-set form values when profile loads
  if (!isLoading && profile && form.formState.isDirty === false) {
    form.reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber ?? "",
      gender: (profile.gender as ProfileFormValues["gender"]) ?? "MALE",
    });
  }

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error(t("profile.info.errors.invalidImage"));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("profile.info.errors.imageTooLarge"));
        return;
      }

      try {
        const result = await uploadMutation.mutateAsync(file);
        if (result) {
          toast.success(t("profile.info.avatar.uploadSuccess"));
        }
      } catch {
        toast.error(t("profile.info.errors.uploadFailed"));
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadMutation, t],
  );

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success(t("profile.info.saveSuccess"));
    } catch {
      toast.error(t("profile.info.errors.saveFailed"));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-6">
          <Skeleton className="h-28 w-28 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">{t("profile.info.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("profile.info.subtitle")}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 space-y-6"
        >
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <Avatar className="h-28 w-28 border-2 border-border">
                <AvatarImage
                  src={profile?.avatarUrl}
                  alt={`${profile?.firstName} ${profile?.lastName}`}
                />
                <AvatarFallback className="text-2xl">
                  {[
                    profile?.firstName?.[0] ?? "",
                    profile?.lastName?.[0] ?? "",
                  ]
                    .join("")
                    .toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploadMutation.isPending}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
                aria-label={t("profile.info.uploadAvatar")}
              >
                {uploadMutation.isPending ? (
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div>
              <p className="text-sm font-medium">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="mt-2 text-sm text-primary hover:underline"
              >
                {t("profile.info.changeAvatar")}
              </button>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.info.firstName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.info.firstNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.info.lastName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.info.lastNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email (readonly) */}
          <FormItem>
            <FormLabel>{t("profile.info.email")}</FormLabel>
            <FormControl>
              <Input
                value={profile?.email ?? currentUser?.email ?? ""}
                readOnly
                disabled
                className="bg-muted/50"
              />
            </FormControl>
          </FormItem>

          {/* Phone */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.info.phoneNumber")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("profile.info.phonePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.info.gender")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("profile.info.genderPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {t(`profile.info.genders.${opt}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={updateMutation.isPending || !form.formState.isDirty}
            >
              {updateMutation.isPending
                ? t("profile.info.saving")
                : t("profile.info.save")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
