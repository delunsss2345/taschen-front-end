import type {
  AddToCartRequest,
  UpdateCartItemQuantityRequest,
} from "@/types/request/cart.request";
import type {
  Cart,
  CartItem,
  CheckoutPreview,
  RouteSuccessResponse,
} from "@/types/response/cart.response";
import { http } from "@/utils/http";

export const cartService = {
  async getCartByUserId(userId: number | string): Promise<Cart> {
    const response = await http.get<RouteSuccessResponse<Cart>>(`/carts/users/${userId}`);
    return response.data;
  },

  async getCurrentCart(): Promise<Cart> {
    const response = await http.get<RouteSuccessResponse<Cart>>("/carts/current");
    return response.data;
  },

  async addToCart(
    userId: number | string,
    payload: AddToCartRequest,
  ): Promise<Cart> {
    const response = await http.post<RouteSuccessResponse<Cart>>(
      `/carts/users/${userId}/items`,
      payload,
    );

    return response.data;
  },

  async clearCart(userId: number | string): Promise<null> {
    const response = await http.del<RouteSuccessResponse<null>>(`/carts/users/${userId}`);
    return response.data;
  },

  async checkoutCurrentUser(): Promise<CheckoutPreview> {
    const response = await http.get<RouteSuccessResponse<CheckoutPreview>>(
      "/carts/current/checkout",
    );

    return response.data;
  },

  async getCartItem(cartItemId: number | string): Promise<CartItem> {
    const response = await http.get<RouteSuccessResponse<CartItem>>(
      `/cart-items/${cartItemId}`,
    );

    return response.data;
  },

  async increaseCartItemQuantity(cartItemId: number | string): Promise<CartItem> {
    const response = await http.patch<RouteSuccessResponse<CartItem>>(
      `/cart-items/${cartItemId}/increase`,
      {},
    );

    return response.data;
  },

  async decreaseCartItemQuantity(cartItemId: number | string): Promise<CartItem> {
    const response = await http.patch<RouteSuccessResponse<CartItem>>(
      `/cart-items/${cartItemId}/decrease`,
      {},
    );

    return response.data;
  },

  async updateCartItemQuantity(
    cartItemId: number | string,
    payload: UpdateCartItemQuantityRequest,
  ): Promise<CartItem> {
    const response = await http.put<RouteSuccessResponse<CartItem>>(
      `/cart-items/${cartItemId}/quantity`,
      payload,
    );

    return response.data;
  },

  async deleteCartItem(cartItemId: number | string): Promise<null> {
    const response = await http.del<RouteSuccessResponse<null>>(
      `/cart-items/${cartItemId}`,
    );

    return response.data;
  },
};
