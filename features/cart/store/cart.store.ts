"use client";

import type { Cart } from "@/types/response/cart.response";
import { create } from "zustand";

export type CartStoreState = {
  cartItemCount: number;
  activeCartId: number | null;
  setCartItemCount: (count: number) => void;
  setActiveCartId: (cartId: number | null) => void;
  syncFromCart: (cart: Cart | null | undefined) => void;
  resetCartState: () => void;
};

const getItemCount = (cart: Cart | null | undefined) => {
  if (!cart) {
    return 0;
  }

  return cart.items.reduce((total, item) => total + Number(item.quantity || 0), 0);
};

export const useCartStore = create<CartStoreState>((set) => ({
  cartItemCount: 0,
  activeCartId: null,

  setCartItemCount: (count) => {
    set({ cartItemCount: count });
  },

  setActiveCartId: (cartId) => {
    set({ activeCartId: cartId });
  },

  syncFromCart: (cart) => {
    set({
      activeCartId: cart?.id ?? null,
      cartItemCount: getItemCount(cart),
    });
  },

  resetCartState: () => {
    set({
      cartItemCount: 0,
      activeCartId: null,
    });
  },
}));
