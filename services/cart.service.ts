import type {
  AddToCartRequest,
  UpdateCartItemQuantityRequest,
} from "@/types/request/cart.request";
import type {
  Cart,
  CartItem,
  CheckoutPreview,
} from "@/types/response/cart.response";
import { http } from "@/utils/http";
import { getResponseData, type ApiResponseEnvelope } from "./helpers/response";

export const cartService = {
  async getCartByUserId(userId: number | string): Promise<Cart | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<Cart>>(`/carts/users/${userId}`);
      return getResponseData<Cart>(response);
    } catch {
      return null;
    }
  },

  async getCurrentCart(): Promise<Cart | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<Cart>>("/carts/current");
      return getResponseData<Cart>(response);
    } catch {
      return null;
    }
  },

  async addToCart(
    userId: number | string,
    payload: AddToCartRequest,
  ): Promise<Cart> {
    const response = await http.post<ApiResponseEnvelope<Cart>>(
      `/carts/users/${userId}/items`,
      payload,
    );
    const cart = getResponseData<Cart>(response);
    if (!cart) throw new Error("Không thể thêm vào giỏ hàng");
    return cart;
  },

  async clearCart(userId: number | string): Promise<boolean> {
    try {
      await http.del<ApiResponseEnvelope<null>>(`/carts/users/${userId}`);
      return true;
    } catch {
      return false;
    }
  },

  async checkoutCurrentUser(): Promise<CheckoutPreview | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<CheckoutPreview>>("/carts/current/checkout");
      return getResponseData<CheckoutPreview>(response);
    } catch {
      return null;
    }
  },

  async getCartItem(cartItemId: number | string): Promise<CartItem | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<CartItem>>(`/cart-items/${cartItemId}`);
      return getResponseData<CartItem>(response);
    } catch {
      return null;
    }
  },

  async increaseCartItemQuantity(cartItemId: number | string): Promise<CartItem> {
    const response = await http.patch<ApiResponseEnvelope<CartItem>>(
      `/cart-items/${cartItemId}/increase`,
      {},
    );
    const item = getResponseData<CartItem>(response);
    if (!item) throw new Error("Không thể tăng số lượng");
    return item;
  },

  async decreaseCartItemQuantity(cartItemId: number | string): Promise<CartItem> {
    const response = await http.patch<ApiResponseEnvelope<CartItem>>(
      `/cart-items/${cartItemId}/decrease`,
      {},
    );
    const item = getResponseData<CartItem>(response);
    if (!item) throw new Error("Không thể giảm số lượng");
    return item;
  },

  async updateCartItemQuantity(
    cartItemId: number | string,
    payload: UpdateCartItemQuantityRequest,
  ): Promise<CartItem> {
    const response = await http.put<ApiResponseEnvelope<CartItem>>(
      `/cart-items/${cartItemId}/quantity`,
      payload,
    );
    const item = getResponseData<CartItem>(response);
    if (!item) throw new Error("Không thể cập nhật số lượng");
    return item;
  },

  async deleteCartItem(cartItemId: number | string): Promise<void> {
    await http.del<ApiResponseEnvelope<null>>(`/cart-items/${cartItemId}`);
  },
};
