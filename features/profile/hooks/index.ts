"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useProfileStore } from "@/features/profile/store";
import { profileService } from "@/services/profile.service";
import type {
  Address,
  CreateAddressRequest,
  Order,
  UpdateAddressRequest,
  UpdateProfileRequest,
  UserProfile,
} from "@/types/profile.type";
import type { ChangePasswordRequest } from "@/types/request/auth.request";
import { useAuthStore } from "@/features/auth";

// ============================================================
// Profile / User
// ============================================================

export const useProfileQuery = () => {
  const setProfile = useProfileStore((s) => s.setProfile);
  const setProfileLoading = useProfileStore((s) => s.setProfileLoading);

  return useQuery<UserProfile | null>({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      setProfileLoading(true);
      try {
        const profile = await profileService.getCurrentUser();
        setProfile(profile);
        return profile;
      } finally {
        setProfileLoading(false);
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfileMutation = () => {
  const setProfile = useProfileStore((s) => s.setProfile);
  const currentUser = useAuthStore((s) => s.currentUser);

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => {
      if (!currentUser?.id) throw new Error("No user id");
      return profileService.updateProfile(currentUser.id, payload);
    },
    onSuccess: (updated) => {
      if (updated) {
        setProfile(updated);
      }
    },
  });
};

export const useUploadAvatarMutation = () => {
  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
  });
};

// ============================================================
// Password
// ============================================================

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      profileService.changePassword(payload),
  });
};

// ============================================================
// Addresses
// ============================================================

export const useAddressesQuery = (userId: number | undefined) => {
  const setAddresses = useProfileStore((s) => s.setAddresses);
  const setAddressesLoading = useProfileStore((s) => s.setAddressesLoading);

  return useQuery<Address[]>({
    queryKey: ["profile", "addresses", userId],
    queryFn: async () => {
      if (userId === undefined) return [];
      setAddressesLoading(true);
      try {
        const addresses = await profileService.getAddresses(userId);
        setAddresses(addresses);
        return addresses;
      } finally {
        setAddressesLoading(false);
      }
    },
    enabled: userId !== undefined,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddressesStore = () =>
  useProfileStore(
    useShallow((s) => ({
      addresses: s.addresses,
      loading: s.addressesLoading,
    })),
  );

export const useCreateAddressMutation = () => {
  const addAddress = useProfileStore((s) => s.addAddress);

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: CreateAddressRequest;
    }) => profileService.createAddress(userId, payload),
    onSuccess: (address) => {
      if (address) addAddress(address);
    },
  });
};

export const useUpdateAddressMutation = () => {
  const updateAddress = useProfileStore((s) => s.updateAddress);

  return useMutation({
    mutationFn: ({
      userId,
      addressId,
      payload,
    }: {
      userId: number;
      addressId: number;
      payload: UpdateAddressRequest;
    }) => profileService.updateAddress(userId, addressId, payload),
    onSuccess: (address) => {
      if (address) updateAddress(address.id, address);
    },
  });
};

export const useDeleteAddressMutation = () => {
  const removeAddress = useProfileStore((s) => s.removeAddress);

  return useMutation({
    mutationFn: ({ userId, addressId }: { userId: number; addressId: number }) =>
      profileService.deleteAddress(userId, addressId),
    onSuccess: (_success, { addressId }) => {
      removeAddress(addressId);
    },
  });
};

export const useSetDefaultAddressMutation = () => {
  const setDefaultAddress = useProfileStore((s) => s.setDefaultAddress);

  return useMutation({
    mutationFn: ({ userId, addressId }: { userId: number; addressId: number }) =>
      profileService.setDefaultAddress(userId, addressId),
    onSuccess: (_success, { addressId }) => {
      setDefaultAddress(addressId);
    },
  });
};

// ============================================================
// Orders
// ============================================================

export const useOrdersQuery = () => {
  const setOrders = useProfileStore((s) => s.setOrders);
  const setOrdersLoading = useProfileStore((s) => s.setOrdersLoading);

  return useQuery<Order[]>({
    queryKey: ["profile", "orders"],
    queryFn: async () => {
      setOrdersLoading(true);
      try {
        const orders = await profileService.getMyOrders();
        setOrders(orders);
        return orders;
      } finally {
        setOrdersLoading(false);
      }
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useOrdersStore = () =>
  useProfileStore(
    useShallow((s) => ({
      orders: s.orders,
      loading: s.ordersLoading,
    })),
  );

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) =>
      profileService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "orders"] });
    },
  });
};

export const useConfirmReceivedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) =>
      profileService.confirmReceived(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "orders"] });
    },
  });
};
