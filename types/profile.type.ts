// ============================================================
// Profile Domain Types
// ============================================================

// --- Enums & Constants ---
export const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"] as const;
export type Gender = (typeof GENDER_OPTIONS)[number];

export const ADDRESS_TYPE_OPTIONS = ["HOME", "WORK", "SHIPPING", "BILLING"] as const;
export type AddressType = (typeof ADDRESS_TYPE_OPTIONS)[number];

export const ORDER_STATUS_OPTIONS = [
  "UNPAID",
  "PENDING",
  "PROCESSING",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
  "RETURNED",
] as const;
export type OrderStatus = (typeof ORDER_STATUS_OPTIONS)[number];

export const PAYMENT_METHOD_OPTIONS = ["VNPAY", "COD"] as const;
export type PaymentMethod = (typeof PAYMENT_METHOD_OPTIONS)[number];

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  UNPAID: "#FFA500",
  PENDING: "#9B59B6",
  PROCESSING: "#3498DB",
  DELIVERING: "#1ABC9C",
  COMPLETED: "#27AE60",
  CANCELLED: "#E74C3C",
  RETURNED: "#95A5A6",
};

// --- Address ---
export interface Address {
  id: number;
  addressType: AddressType;
  street: string;
  district: string;
  ward: string;
  city: string;
  recipientName: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  addressType: AddressType;
  street: string;
  district: string;
  ward: string;
  city: string;
  recipientName: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

// --- User Profile ---
export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  phoneNumber: string | null;
  isActive: boolean;
  roles: string[];
  addresses: Address[];
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  gender: Gender;
  phoneNumber: string;
}

// --- Password ---
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// --- Order ---
export interface OrderDetail {
  id: number;
  bookId: number;
  bookTitle: string;
  priceAtPurchase: number;
  quantity: number;
  totalPrice: number;
  coverImage?: string;
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentCode: string | null;
  promotionId: number | null;
  promotionCode: string | null;
  addressId: number;
  deliveryAddress: string;
  orderDetails: OrderDetail[];
}

// --- Cloudinary ---
export interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
}

// --- API Response ---
export interface BackendApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
