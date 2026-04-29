import { http } from "@/utils/http";
import type {
  Address,
  BackendApiResponse,
  ChangePasswordRequest,
  CloudinaryUploadResponse,
  CreateAddressRequest,
  Order,
  UpdateAddressRequest,
  UpdateProfileRequest,
  UserProfile,
} from "@/types/profile.type";

export const profileService = {
  // --- User Profile ---
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const response = await http.get<BackendApiResponse<UserProfile>>("/users/me");
      return response.data ?? null;
    } catch {
      return null;
    }
  },

  async updateProfile(
    userId: number,
    payload: UpdateProfileRequest,
  ): Promise<UserProfile | null> {
    try {
      const response = await http.put<BackendApiResponse<UserProfile>>(
        `/users/${userId}`,
        payload,
      );
      return response.data ?? null;
    } catch {
      return null;
    }
  },

  async uploadAvatar(file: File): Promise<CloudinaryUploadResponse | null> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await http.post<BackendApiResponse<CloudinaryUploadResponse>>(
        "/cloudinary/upload/avatars",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data ?? null;
    } catch {
      return null;
    }
  },

  // --- Addresses ---
  async getAddresses(userId: number): Promise<Address[]> {
    try {
      const response = await http.get<BackendApiResponse<Address[]>>(
        `/users/${userId}/addresses`,
      );
      return response.data ?? [];
    } catch {
      return [];
    }
  },

  async createAddress(
    userId: number,
    payload: CreateAddressRequest,
  ): Promise<Address | null> {
    try {
      const response = await http.post<BackendApiResponse<Address>>(
        `/users/${userId}/addresses`,
        payload,
      );
      return response.data ?? null;
    } catch {
      return null;
    }
  },

  async updateAddress(
    userId: number,
    addressId: number,
    payload: UpdateAddressRequest,
  ): Promise<Address | null> {
    try {
      const response = await http.put<BackendApiResponse<Address>>(
        `/users/${userId}/addresses/${addressId}`,
        payload,
      );
      return response.data ?? null;
    } catch {
      return null;
    }
  },

  async deleteAddress(userId: number, addressId: number): Promise<boolean> {
    try {
      await http.del(`/users/${userId}/addresses/${addressId}`);
      return true;
    } catch {
      return false;
    }
  },

  async setDefaultAddress(userId: number, addressId: number): Promise<boolean> {
    try {
      await http.put(`/users/${userId}/addresses/${addressId}/default`, {});
      return true;
    } catch {
      return false;
    }
  },

  // --- Orders ---
  async getMyOrders(): Promise<Order[]> {
    try {
      const response = await http.get<BackendApiResponse<Order[]>>("/orders/my");
      return response.data ?? [];
    } catch {
      return [];
    }
  },

  async getOrderById(orderId: number): Promise<Order | null> {
    try {
      const response = await http.get<BackendApiResponse<Order>>(`/orders/${orderId}`);
      return response.data ?? null;
    } catch {
      return null;
    }
  },

  // --- Password ---
  async changePassword(payload: ChangePasswordRequest): Promise<boolean> {
    try {
      await http.post("/auth/change-password", payload);
      return true;
    } catch {
      return false;
    }
  },
};
