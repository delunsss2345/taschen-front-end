import { http } from "@/utils/http";

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await http.get("/api/orders");
      const ordersData = response.data?.data;
      return Array.isArray(ordersData) ? ordersData : [];
    } catch {
      return [];
    }
  },

  async getOrderById(orderId: number | string): Promise<Order> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await http.get(`/api/orders/${orderId}`);
    return response.data?.data;
  },

  async updateOrderStatus(orderId: number | string, status: string): Promise<Order> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await http.put(`/api/orders/${orderId}/status`, { status });
    return response.data?.data;
  },
};
