"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GuestCartItem = {
  bookId: number;
  quantity: number;
  bookTitle: string;
  coverImage?: string;
  imageUrl?: string;
  unitPrice?: number;
};

export type GuestCartStoreState = {
  items: GuestCartItem[];
  addItem: (item: GuestCartItem) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  removeItem: (bookId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
};

export const useGuestCartStore = create<GuestCartStoreState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.bookId === item.bookId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.bookId === item.bookId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.bookId === bookId ? { ...i, quantity } : i
          ),
        }));
      },

      removeItem: (bookId) => {
        set((state) => ({
          items: state.items.filter((i) => i.bookId !== bookId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "guest-cart-storage",
    }
  )
);
