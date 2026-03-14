import type { PurchaseOrderStoreState } from "../store/purchase-order.store";

export const selectorPurchaseOrder = (state: PurchaseOrderStoreState) => state;

export const selectorIsProcessingPayment = (state: PurchaseOrderStoreState) =>
  state.isProcessingPayment;

export const selectorIsProcessingReject = (state: PurchaseOrderStoreState) =>
  state.isProcessingReject;

export const selectorIsProcessingCancel = (state: PurchaseOrderStoreState) =>
  state.isProcessingCancel;

export const selectorRejectReason = (state: PurchaseOrderStoreState) =>
  state.rejectReason;

export const selectorSetIsProcessingPayment = (state: PurchaseOrderStoreState) =>
  state.setIsProcessingPayment;

export const selectorSetIsProcessingReject = (state: PurchaseOrderStoreState) =>
  state.setIsProcessingReject;

export const selectorSetIsProcessingCancel = (state: PurchaseOrderStoreState) =>
  state.setIsProcessingCancel;

export const selectorSetRejectReason = (state: PurchaseOrderStoreState) =>
  state.setRejectReason;

export const selectorPurchaseOrderActions = (state: PurchaseOrderStoreState) => ({
  isProcessingPayment: state.isProcessingPayment,
  isProcessingReject: state.isProcessingReject,
  isProcessingCancel: state.isProcessingCancel,
  rejectReason: state.rejectReason,
  setIsProcessingPayment: state.setIsProcessingPayment,
  setIsProcessingReject: state.setIsProcessingReject,
  setIsProcessingCancel: state.setIsProcessingCancel,
  setRejectReason: state.setRejectReason,
});
