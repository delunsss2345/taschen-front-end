export type BackendApiResponse<T> = {
  error: string | null;
  message: string;
  statusCode: number;
  data: T;
};

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

export type CartApiResponse = BackendApiResponse<Cart>;
export type CartItemApiResponse = BackendApiResponse<CartItem>;
export type CheckoutApiResponse = BackendApiResponse<CheckoutPreview>;
export type EmptyApiResponse = BackendApiResponse<null>;
