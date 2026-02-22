import http from "@/utils/http";

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

// Helper function to extract data from various response structures
function extractData<T>(response: { data?: unknown }): T | null {
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    const innerData = (response.data as { data: unknown }).data;
    if (innerData && typeof innerData === 'object' && 'data' in innerData) {
      return (innerData as { data: T }).data;
    }
    return innerData as T;
  }
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return (response.data as { data: T }).data;
  }
  // Try: directly array or object
  return response.data as T;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await http.get("/api/users");
      const usersData = extractData<User[]>(response);
      return Array.isArray(usersData) ? usersData : [];
    } catch {
      return [];
    }
  },

  async getUserById(userId: number | string): Promise<User | null> {
    try {
      const response = await http.get(`/api/users/${userId}`);
      const data = extractData<User>(response);
      return data;
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
    const response = await http.post("/api/users", payload);
    const result = extractData<User>(response);
    return result;
  },

  async updateUser(userId: number | string, payload: Record<string, unknown>): Promise<User | null> {
    const response = await http.put(`/api/users/${userId}`, payload);
    const result = extractData<User>(response);
    return result;
  },

  async deleteUser(userId: number | string): Promise<boolean> {
    try {
      await http.delete(`/api/users/${userId}`);
      return true;
    } catch {
      return false;
    }
  },
};
