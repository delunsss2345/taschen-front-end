import { http } from "@/utils/http";
import { getArrayData, getResponseData, type ApiResponseEnvelope } from "./helpers/response";

export type UserRole = "ADMIN" | "SELLER" | "WAREHOUSE_STAFF" | "USER" | (string & {});

export interface Address {
  id: number;
  addressType: string;
  street: string;
  district: string;
  ward: string;
  city: string;
  recipientName: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  phoneNumber: string | null;
  active: boolean;
  roles: UserRole[];
  addresses: Address[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  roles?: UserRole[];
  active?: boolean;
}

export type UpdateUserRequest = Partial<CreateUserRequest> & Record<string, unknown>;

function getFirstUserFromResponse(
  response: ApiResponseEnvelope<User | User[]>,
): User | null {
  const data = getResponseData<User | User[]>(response);

  if (!data) {
    return null;
  }

  return Array.isArray(data) ? data[0] ?? null : data;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<User[] | { result: User[] }>>("users");
      const usersData = getArrayData<User>(response);
      return usersData;
    } catch {
      return [];
    }
  },

  async getUserById(userId: number | string): Promise<User | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<User | User[]>>(`users/${userId}`);
      return getFirstUserFromResponse(response);
    } catch {
      return null;
    }
  },

  async createUser(payload: CreateUserRequest): Promise<User | null> {
    try {
      const response = await http.post<ApiResponseEnvelope<User | User[]>>("users", payload);
      return getFirstUserFromResponse(response);
    } catch {
      return null;
    }
  },

  async updateUser(userId: number | string, payload: UpdateUserRequest): Promise<User | null> {
    try {
      const response = await http.put<ApiResponseEnvelope<User | User[]>>(`users/${userId}`, payload);
      return getFirstUserFromResponse(response);
    } catch {
      return null;
    }
  },

  async deleteUser(userId: number | string): Promise<boolean> {
    try {
      await http.del<ApiResponseEnvelope<null>>(`users/${userId}`);
      return true;
    } catch {
      return false;
    }
  },
};
