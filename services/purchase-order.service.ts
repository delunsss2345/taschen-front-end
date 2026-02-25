import axios from 'axios';
import type { PurchaseOrder } from "@/types/response/purchase-order.response";
import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export type { PurchaseOrder };

async function getPurchaseOrdersSafe(): Promise<PurchaseOrder[]> {
  try {
    const response = await http.get<ApiResponseEnvelope<PurchaseOrder[]>>("purchase-orders");
    const data = getResponseData<PurchaseOrder[]>(response);
    return data ?? [];
  } catch {
    return [];
  }
}

async function getPurchaseOrderByIdSafe(purchaseOrderId: number | string): Promise<PurchaseOrder | null> {
  try {
    const response = await http.get<ApiResponseEnvelope<PurchaseOrder>>(`purchase-orders/${purchaseOrderId}`);
    return getResponseData<PurchaseOrder>(response);
  } catch {
    return null;
  }
}

async function createPurchaseOrderSafe(payload: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
  const response = await http.post<ApiResponseEnvelope<PurchaseOrder>>("purchase-orders", payload);
  return requireResponseData(response, "Create purchase order response is missing data");
}

async function approvePurchaseOrderSafe(purchaseOrderId: number | string, approvedById: number): Promise<PurchaseOrder> {
  try {
    const response = await http.put<ApiResponseEnvelope<PurchaseOrder>>(
      `purchase-orders/${purchaseOrderId}/approve`,
      { approvedById }
    );
    if (!response || !response.data) {
      throw new Error("Approve purchase order response is missing data");
    }
    return response.data as PurchaseOrder;
  } catch (error) {
    throw error;
  }
}

async function rejectPurchaseOrderSafe(purchaseOrderId: number | string, approvedById: number, cancelReason?: string): Promise<PurchaseOrder> {
  try {
    const response = await http.put<ApiResponseEnvelope<PurchaseOrder>>(
      `purchase-orders/${purchaseOrderId}/reject`,
      { approvedById, cancelReason }
    );
    if (!response || !response.data) {
      throw new Error("Reject purchase order response is missing data");
    }
    return response.data as PurchaseOrder;
  } catch (error) {
    throw error;
  }
}

async function cancelPurchaseOrderSafe(
  purchaseOrderId: number | string,
  cancelReason: string,
  cancelledById?: number
): Promise<PurchaseOrder> {
  try {
    const response = await http.put<ApiResponseEnvelope<PurchaseOrder>>(
      `purchase-orders/${purchaseOrderId}/cancel`,
      { cancelReason, cancelledById }
    );
    if (!response || !response.data) {
      throw new Error("Cancel purchase order response is missing data");
    }
    return response.data as PurchaseOrder;
  } catch (error) {
    throw error;
  }
}

async function updatePurchaseOrderStatusSafe(purchaseOrderId: number | string, status: string): Promise<PurchaseOrder> {
  try {
    const response = await http.put<ApiResponseEnvelope<PurchaseOrder>>(
      `purchase-orders/${purchaseOrderId}/status`,
      { status }
    );
    if (!response || !response.data) {
      throw new Error("Update purchase order status response is missing data");
    }
    return response.data as PurchaseOrder;
  } catch (error) {
    throw error;
  }
}

async function payPurchaseOrderSafe(purchaseOrderId: number | string, paidById: number): Promise<PurchaseOrder> {
  try {
    const response = await http.post<ApiResponseEnvelope<PurchaseOrder>>(
      `purchase-orders/${purchaseOrderId}/pay`,
      { paidById }
    );
    if (!response || !response.data) {
      throw new Error("Pay purchase order response is missing data");
    }
    return response.data as PurchaseOrder;
  } catch (error: unknown) {
    throw error;
  }
}

export interface CreatePurchaseOrderRequest {
  supplierId: number;
  createdById?: number;
  note?: string;
  items: Array<{
    bookId: number;
    variantId?: number;
    quantity: number;
    importPrice: number;
  }>;
}

export const purchaseOrderService = {
  getAllPurchaseOrders: getPurchaseOrdersSafe,
  getPurchaseOrderById: getPurchaseOrderByIdSafe,
  createPurchaseOrder: createPurchaseOrderSafe,
  approvePurchaseOrder: approvePurchaseOrderSafe,
  rejectPurchaseOrder: (purchaseOrderId: number | string, approvedById: number, cancelReason?: string) => rejectPurchaseOrderSafe(purchaseOrderId, approvedById, cancelReason),
  cancelPurchaseOrder: cancelPurchaseOrderSafe,
  updatePurchaseOrderStatus: updatePurchaseOrderStatusSafe,
  payPurchaseOrder: payPurchaseOrderSafe,
};
