import http from "@/utils/http";
import { getResponseData, getArrayData } from "./helpers/response";

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
  status: string;
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
      const response = await http.get("/api/orders");
      const ordersData = getArrayData<Order>(response);
      return ordersData;
    } catch {
      return [];
    }
  },

  async getOrderById(orderId: number | string): Promise<Order | null> {
    try {
      const id = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
      const response = await http.get(`/api/orders/${id}`);
      const data = getResponseData<Order>(response);
      return data;
    } catch {
      return null;
    }
  },

  async updateOrderStatus(orderId: number | string, status: string): Promise<Order | null> {
    try {
      const response = await http.put(`/api/orders/${orderId}/status`, { status });
      const data = getResponseData<Order>(response);
      return data;
    } catch {
      return null;
    }
  },
};
