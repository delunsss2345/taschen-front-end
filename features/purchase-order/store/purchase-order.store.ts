"use client";

import { create } from "zustand";

export type PurchaseOrderStoreState = {};

export const usePurchaseOrderStore = create<PurchaseOrderStoreState>(
  (set) => ({}),
);
