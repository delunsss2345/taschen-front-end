import { http } from "@/utils/http";
import { getArrayData, getResponseData, type ApiResponseEnvelope } from "./helpers/response";

export type OrderStatus =
  | "UNPAID"
  | "PENDING"
  | "PROCESSING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED"
  | (string & {});

export interface OrderDetail {
  id: number;
  bookId: number;
  bookTitle: string;
  priceAtPurchase: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentCode: string | null;
  promotionId: number | null;
  promotionCode: string | null;
  addressId: number;
  deliveryAddress: string;
  orderDetails: OrderDetail[];
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

  async getOrderById(orderId: number | string): Promise<Order | null> {
    try {
      const id = typeof orderId === "string" ? Number(orderId) : orderId;
      if (!Number.isFinite(id)) {
        return null;
      }

      const response = await http.get<ApiResponseEnvelope<Order>>(`orders/${id}`);
      const data = getResponseData<Order>(response);
      return data;
    } catch {
      return null;
    }
  },

  async updateOrderStatus(orderId: number | string, status: OrderStatus): Promise<Order | null> {
    try {
      const response = await http.put<ApiResponseEnvelope<Order>>(`orders/${orderId}/status`, { status });
      const data = getResponseData<Order>(response);
      return data;
    } catch {
      return null;
    }
  },
};
