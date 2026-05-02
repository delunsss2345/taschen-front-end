import { http } from "@/utils/http";
import { getArrayData, getResponseData, type ApiResponseEnvelope } from "./helpers/response";
import type { Order, OrderStatus } from "@/types/profile.type";

export type { Order, OrderStatus };

export interface OrderDetail {
  id: number;
  bookId: number;
  bookTitle: string;
  priceAtPurchase: number;
  quantity: number;
  totalPrice: number;
}

export interface CreateOrderRequest {
  addressId: number;
  paymentMethod: "COD" | "VNPAY";
  promotionCode?: string;
}

export interface VNPayCreateResponse {
  paymentUrl: string;
}

export interface PromoValidationResult {
  id: number;
  code: string;
  discountPercent: number;
  isActive: boolean;
}

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Order[] | { result: Order[] }>>("orders");
      const ordersData = getArrayData<Order>(response);
      return ordersData;
    } catch {
      return [];
    }
  },

  async getMyOrders(): Promise<Order[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Order[]>>("orders/my");
      return getResponseData<Order[]>(response) ?? [];
    } catch {
      return [];
    }
  },

  async getOrderById(orderId: number | string): Promise<Order | null> {
    try {
      const id = typeof orderId === "string" ? Number(orderId) : orderId;
      if (!Number.isFinite(id)) return null;
      const response = await http.get<ApiResponseEnvelope<Order>>(`orders/${id}`);
      return getResponseData<Order>(response);
    } catch {
      return null;
    }
  },

  async createOrder(payload: CreateOrderRequest): Promise<Order> {
    const response = await http.post<ApiResponseEnvelope<Order>>("orders", payload);
    const data = getResponseData<Order>(response);
    if (!data) throw new Error("Tạo đơn hàng thất bại");
    return data;
  },

  async cancelOrder(orderId: number | string): Promise<Order | null> {
    try {
      const response = await http.put<ApiResponseEnvelope<Order>>(`orders/${orderId}/cancel`, {});
      return getResponseData<Order>(response);
    } catch {
      return null;
    }
  },

  async confirmReceived(orderId: number | string): Promise<Order | null> {
    try {
      const response = await http.put<ApiResponseEnvelope<Order>>(`orders/${orderId}/confirm-received`, {});
      return getResponseData<Order>(response);
    } catch {
      return null;
    }
  },

  async createVNPayPayment(orderId: number | string): Promise<string> {
    const response = await http.post<ApiResponseEnvelope<VNPayCreateResponse | string>>(
      `payments/vnpay/create/${orderId}`,
      {},
    );
    const data = getResponseData<VNPayCreateResponse | string>(response);
    if (!data) throw new Error("Không thể tạo thanh toán VNPay");
    if (typeof data === "string") return data;
    return (data as VNPayCreateResponse).paymentUrl;
  },

  async validatePromoCode(code: string): Promise<PromoValidationResult | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<PromoValidationResult>>(
        `promotions/validate/${encodeURIComponent(code)}`,
      );
      return getResponseData<PromoValidationResult>(response);
    } catch {
      return null;
    }
  },

  async updateOrderStatus(orderId: number | string, status: OrderStatus): Promise<Order | null> {
    try {
      const response = await http.put<ApiResponseEnvelope<Order>>(`orders/${orderId}/status`, { status });
      return getResponseData<Order>(response);
    } catch {
      return null;
    }
  },
};
