import http from "@/utils/http";

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

function extractData<T>(response: { data?: unknown }): T | null {
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    const innerData = (response.data as { data: unknown }).data;
    if (innerData && typeof innerData === 'object' && 'data' in innerData) {
      return (innerData as { data: T }).data;
    }
    return innerData as T;
  }
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return (response.data as { data: T }).data;
  }
  return response.data as T;
}

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await http.get("/api/orders");
      const ordersData = extractData<Order[]>(response);
      return Array.isArray(ordersData) ? ordersData : [];
    } catch {
      return [];
    }
  },

  async getOrderById(orderId: number | string): Promise<Order> {
    const response = await http.get(`/api/orders/${orderId}`);
    const data = extractData<Order>(response);
    return data as Order;
  },

  async updateOrderStatus(orderId: number | string, status: string): Promise<Order> {
    const response = await http.put(`/api/orders/${orderId}/status`, { status });
    const data = extractData<Order>(response);
    return data as Order;
  },
};
