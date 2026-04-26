import type { BaseResponse } from "./base.response";

export type RouteSuccessResponse<T> = {
  success: true;
  data: T;
};

export type CartItem = {
  id: number;
  bookId: number;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  [key: string]: unknown;
};

export type Cart = {
  id: number;
  userId: number;
  totalPrice: number;
  items: CartItem[];
  [key: string]: unknown;
};

export type CheckoutPreview = Cart | Record<string, unknown> | null;

export type CartApiResponse = BaseResponse<Cart>;
export type CartItemApiResponse = BaseResponse<CartItem>;
export type CheckoutApiResponse = BaseResponse<CheckoutPreview>;
export type EmptyApiResponse = BaseResponse<null>;
