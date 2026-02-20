import { http } from "@/utils/http";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  phoneNumber: string | null;
  active: boolean;
  roles: string[];
  addresses: unknown[];
}

export interface UserResponse {
  error: string | null;
  message: string;
  statusCode: number;
  data: User[];
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await http.get("/api/users");
      const usersData = response.data?.data;
      return Array.isArray(usersData) ? usersData : [];
    } catch {
      return [];
    }
  },

  async getUserById(userId: number | string): Promise<User | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await http.get(`/api/users/${userId}`);
      return response.data?.data || null;
    } catch {
      return null;
    }
  },

  async createUser(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: string;
  }): Promise<User | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await http.post("/api/users", payload);
    return response.data?.data || null;
  },

  async updateUser(userId: number | string, payload: Record<string, unknown>): Promise<User | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await http.put(`/api/users/${userId}`, payload);
    return response.data?.data || null;
  },

  async deleteUser(userId: number | string): Promise<boolean> {
    try {
      await http.del(`/api/users/${userId}`);
      return true;
    } catch {
      return false;
    }
  },
};
