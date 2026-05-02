"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  Edit,
  Home,
  MapPin,
  Phone,
  Star,
  Trash2,
  User,
  Briefcase,
  CreditCard,
} from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  useAddressesQuery,
  useAddressesStore,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "@/features/profile";
import { useAuthStore, selectorCurrentUser } from "@/features/auth";
import type { Address, AddressType } from "@/types/profile.type";
import useTranslator from "@/hooks/use-translator";

const ADDRESS_TYPE_ICONS: Record<AddressType, React.ElementType> = {
  HOME: Home,
  WORK: Briefcase,
  SHIPPING: MapPin,
  BILLING: CreditCard,
};

// ============================================================
// Validation Schema
// ============================================================
const addressSchema = z.object({
  addressType: z.enum(["HOME", "WORK", "SHIPPING", "BILLING"]),
  recipientName: z.string().min(1, "Tên người nhận không được để trống").max(100),
  phoneNumber: z
    .string()
    .regex(/^0[0-9]{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0"),
  street: z.string().min(1, "Địa chỉ không được để trống").max(255),
  district: z.string().min(1, "Quận/Huyện không được để trống").max(100),
  ward: z.string().min(1, "Phường/Xã không được để trống").max(100),
  city: z.string().min(1, "Tỉnh/Thành phố không được để trống").max(100),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

// ============================================================
// Address Card
// ============================================================
function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: (a: Address) => void;
  onDelete: (a: Address) => void;
  onSetDefault: (a: Address) => void;
}) {
  const { t } = useTranslator();
  const Icon = ADDRESS_TYPE_ICONS[address.addressType] ?? Home;

  return (
    <div className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{t(`profile.addresses.types.${address.addressType}`)}</span>
          {address.isDefault && (
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {t("profile.addresses.default")}
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span>{address.recipientName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span>{address.phoneNumber}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mt-px shrink-0" />
          <span>
            {address.street}, {address.ward}, {address.district}, {address.city}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => onEdit(address)}
        >
          <Edit className="h-3.5 w-3.5" />
          {t("profile.addresses.edit")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-destructive hover:text-destructive"
          onClick={() => onDelete(address)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t("profile.addresses.delete")}
        </Button>
        {!address.isDefault && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => onSetDefault(address)}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("profile.addresses.setDefault")}
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Address Modal (Create / Edit)
// ============================================================
interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
  userId: number;
}

function AddressModal({ open, onOpenChange, address, userId }: AddressModalProps) {
  const { t } = useTranslator();
  const isEdit = Boolean(address);
  const createMutation = useCreateAddressMutation();
  const updateMutation = useUpdateAddressMutation();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    values: address
      ? {
          addressType: address.addressType,
          recipientName: address.recipientName,
          phoneNumber: address.phoneNumber,
          street: address.street,
          district: address.district,
          ward: address.ward,
          city: address.city,
          isDefault: address.isDefault,
        }
      : {
          addressType: "HOME",
          recipientName: "",
          phoneNumber: "",
          street: "",
          district: "",
          ward: "",
          city: "",
          isDefault: false as boolean,
        },
  });

  const onSubmit = async (values: AddressFormValues) => {
    try {
      if (isEdit && address) {
        const result = await updateMutation.mutateAsync({
          userId,
          addressId: address.id,
          payload: values,
        });
        if (result) {
          toast.success(t("profile.addresses.editSuccess"));
          onOpenChange(false);
        } else {
          toast.error(t("profile.addresses.errors.saveFailed"));
        }
      } else {
        const result = await createMutation.mutateAsync({ userId, payload: values });
        if (result) {
          toast.success(t("profile.addresses.createSuccess"));
          onOpenChange(false);
        } else {
          toast.error(t("profile.addresses.errors.saveFailed"));
        }
      }
    } catch {
      toast.error(t("profile.addresses.errors.saveFailed"));
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("profile.addresses.editTitle") : t("profile.addresses.addTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Address Type */}
            <FormField
              control={form.control}
              name="addressType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.addresses.addressType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(["HOME", "WORK", "SHIPPING", "BILLING"] as AddressType[]).map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`profile.addresses.types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recipient Name */}
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.addresses.recipientName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.addresses.recipientNamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.addresses.phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.addresses.phonePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Street */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.addresses.street")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.addresses.streetPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* District */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.addresses.district")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.addresses.districtPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ward */}
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.addresses.ward")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.addresses.wardPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.addresses.city")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.addresses.cityPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("profile.addresses.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? t("profile.addresses.saving")
                  : isEdit
                    ? t("profile.addresses.update")
                    : t("profile.addresses.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Main Component
// ============================================================
export function ProfileAddresses() {
  const { t } = useTranslator();
  const currentUser = useAuthStore(selectorCurrentUser);
  const userId = currentUser?.id;
  const { data: fetchedAddresses, isLoading } = useAddressesQuery(userId);
  const { addresses, loading } = useAddressesStore();

  const [hasMounted, setHasMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

  useEffect(() => { setHasMounted(true); }, []);

  const deleteMutation = useDeleteAddressMutation();
  const setDefaultMutation = useSetDefaultAddressMutation();

  const displayAddresses = isLoading ? [] : addresses.length ? addresses : fetchedAddresses ?? [];

  const handleEdit = useCallback((address: Address) => {
    setSelectedAddress(address);
    setModalOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedAddress(null);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback((address: Address) => {
    setDeleteTarget(address);
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget || !userId) return;
    try {
      const success = await deleteMutation.mutateAsync({
        userId,
        addressId: deleteTarget.id,
      });
      if (success) {
        toast.success(t("profile.addresses.deleteSuccess"));
      } else {
        toast.error(t("profile.addresses.errors.deleteFailed"));
      }
    } catch {
      toast.error(t("profile.addresses.errors.deleteFailed"));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSetDefault = async (address: Address) => {
    if (!userId) return;
    try {
      const success = await setDefaultMutation.mutateAsync({
        userId,
        addressId: address.id,
      });
      if (success) {
        toast.success(t("profile.addresses.setDefaultSuccess"));
      } else {
        toast.error(t("profile.addresses.errors.setDefaultFailed"));
      }
    } catch {
      toast.error(t("profile.addresses.errors.setDefaultFailed"));
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setSelectedAddress(null);
    }
    setModalOpen(open);
  };

  if (!hasMounted || isLoading || loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">{t("profile.addresses.title")}</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t("profile.addresses.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("profile.addresses.subtitle")}
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-1.5">
          <span>+</span>
          {t("profile.addresses.add")}
        </Button>
      </div>

      {displayAddresses.length === 0 ? (
        <div className="rounded-lg border border-dashed py-12 text-center">
          <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t("profile.addresses.noAddresses")}
          </p>
          <Button variant="outline" className="mt-4" onClick={handleAdd}>
            {t("profile.addresses.addFirst")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {displayAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {userId && (
        <AddressModal
          open={modalOpen}
          onOpenChange={handleModalClose}
          address={selectedAddress}
          userId={userId}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("profile.addresses.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("profile.addresses.deleteConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("profile.addresses.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? t("profile.addresses.deleting") : t("profile.addresses.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
