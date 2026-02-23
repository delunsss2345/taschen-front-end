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
import { getResponseData } from "./helpers/response";

export const cartService = {
  async getCartByUserId(userId: number | string): Promise<Cart | null> {
    try {
      const response = await http.get(`/carts/users/${userId}`);
      return getResponseData<Cart>(response);
    } catch {
      return null;
    }
  },

  async getCurrentCart(): Promise<Cart | null> {
    try {
      const response = await http.get("/carts/current");
      return getResponseData<Cart>(response);
    } catch {
      return null;
    }
  },

  async addToCart(
    userId: number | string,
    payload: AddToCartRequest,
  ): Promise<Cart | null> {
    try {
      const response = await http.post(
        `/carts/users/${userId}/items`,
        payload,
      );
      return getResponseData<Cart>(response);
    } catch {
      return null;
    }
  },

  async clearCart(userId: number | string): Promise<boolean> {
    try {
      await http.del(`/carts/users/${userId}`);
      return true;
    } catch {
      return false;
    }
  },

  async checkoutCurrentUser(): Promise<CheckoutPreview | null> {
    try {
      const response = await http.get("/carts/current/checkout");
      return getResponseData<CheckoutPreview>(response);
    } catch {
      return null;
    }
  },

  async getCartItem(cartItemId: number | string): Promise<CartItem | null> {
    try {
      const response = await http.get(`/cart-items/${cartItemId}`);
      return getResponseData<CartItem>(response);
    } catch {
      return null;
    }
  },

  async increaseCartItemQuantity(cartItemId: number | string): Promise<CartItem | null> {
    try {
      const response = await http.patch(
        `/cart-items/${cartItemId}/increase`,
        {},
      );
      return getResponseData<CartItem>(response);
    } catch {
      return null;
    }
  },

  async decreaseCartItemQuantity(cartItemId: number | string): Promise<CartItem | null> {
    try {
      const response = await http.patch(
        `/cart-items/${cartItemId}/decrease`,
        {},
      );
      return getResponseData<CartItem>(response);
    } catch {
      return null;
    }
  },

  async updateCartItemQuantity(
    cartItemId: number | string,
    payload: UpdateCartItemQuantityRequest,
  ): Promise<CartItem | null> {
    try {
      const response = await http.put(
        `/cart-items/${cartItemId}/quantity`,
        payload,
      );
      return getResponseData<CartItem>(response);
    } catch {
      return null;
    }
  },

  async deleteCartItem(cartItemId: number | string): Promise<boolean> {
    try {
      await http.del(`/cart-items/${cartItemId}`);
      return true;
    } catch {
      return false;
    }
  },
};
