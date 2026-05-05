"use client";

import { useGuestCartStore } from "../store/guest-cart.store";
import { useEffect } from "react";

export const useGuestCartItemCount = (): number => {
  const items = useGuestCartStore((s) => s.items);
  return items.reduce((sum, i) => sum + i.quantity, 0);
};
