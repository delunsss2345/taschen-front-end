"use client";

import { create } from "zustand";

export type PurchaseOrderStoreState = {
  isProcessingPayment: boolean;
  isProcessingReject: boolean;
  isProcessingCancel: boolean;
  rejectReason: string;
  setIsProcessingPayment: (value: boolean) => void;
  setIsProcessingReject: (value: boolean) => void;
  setIsProcessingCancel: (value: boolean) => void;
  setRejectReason: (value: string) => void;
  resetProcessingStates: () => void;
};

export const usePurchaseOrderStore = create<PurchaseOrderStoreState>(
  (set) => ({
    isProcessingPayment: false,
    isProcessingReject: false,
    isProcessingCancel: false,
    rejectReason: "",
    setIsProcessingPayment: (value) => set({ isProcessingPayment: value }),
    setIsProcessingReject: (value) => set({ isProcessingReject: value }),
    setIsProcessingCancel: (value) => set({ isProcessingCancel: value }),
    setRejectReason: (value) => set({ rejectReason: value }),
    resetProcessingStates: () =>
      set({
        isProcessingPayment: false,
        isProcessingReject: false,
        isProcessingCancel: false,
        rejectReason: "",
      }),
  }),
);
