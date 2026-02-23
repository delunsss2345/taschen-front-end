import { http } from "@/utils/http";
import { getArrayData } from "./helpers/response";

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

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await http.get("/api/users");
      const usersData = getArrayData<User>(response);
      return usersData;
    } catch {
      return [];
    }
  },

  async getUserById(userId: number | string): Promise<User | null> {
    try {
      const response = await http.get(`/api/users/${userId}`);
      const data = getArrayData<User>(response);
      return data[0] ?? null;
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
    try {
      const response = await http.post("/api/users", payload);
      const result = getArrayData<User>(response);
      return result[0] ?? null;
    } catch {
      return null;
    }
  },

  async updateUser(userId: number | string, payload: Record<string, unknown>): Promise<User | null> {
    try {
      const response = await http.put(`/api/users/${userId}`, payload);
      const result = getArrayData<User>(response);
      return result[0] ?? null;
    } catch {
      return null;
    }
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
