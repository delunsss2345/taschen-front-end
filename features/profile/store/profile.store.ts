"use client";

import { create } from "zustand";
import type { Address, Order, UserProfile } from "@/types/profile.type";

export type ProfileStoreState = {
  profile: UserProfile | null;
  orders: Order[];
  addresses: Address[];
  profileLoading: boolean;
  ordersLoading: boolean;
  addressesLoading: boolean;

  setProfile: (profile: UserProfile | null) => void;
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: number, address: Address) => void;
  removeAddress: (id: number) => void;
  setDefaultAddress: (id: number) => void;
  setOrders: (orders: Order[]) => void;
  setProfileLoading: (loading: boolean) => void;
  setOrdersLoading: (loading: boolean) => void;
  setAddressesLoading: (loading: boolean) => void;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileStoreState>((set) => ({
  profile: null,
  orders: [],
  addresses: [],
  profileLoading: false,
  ordersLoading: false,
  addressesLoading: false,

  setProfile: (profile) => set({ profile }),

  setAddresses: (addresses) => set({ addresses }),

  addAddress: (address) =>
    set((state) => ({
      addresses: [...state.addresses, address],
    })),

  updateAddress: (id, updated) =>
    set((state) => ({
      addresses: state.addresses.map((a) => (a.id === id ? updated : a)),
    })),

  removeAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.filter((a) => a.id !== id),
    })),

  setDefaultAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    })),

  setOrders: (orders) => set({ orders }),

  setProfileLoading: (profileLoading) => set({ profileLoading }),

  setOrdersLoading: (ordersLoading) => set({ ordersLoading }),

  setAddressesLoading: (addressesLoading) => set({ addressesLoading }),

  clearProfile: () =>
    set({
      profile: null,
      orders: [],
      addresses: [],
      profileLoading: false,
      ordersLoading: false,
      addressesLoading: false,
    }),
}));
