import { http } from "@/utils/http";
import { getArrayData, getResponseData, type ApiResponseEnvelope } from "./helpers/response";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Permission {
  id: number;
  code: string;
  httpMethod: HttpMethod;
  pathPattern: string;
  active: boolean;
  roleCode?: string | null;
}

export interface Role {
  id: number;
  code: string;
  name: string;
  permissions?: Permission[];
  permissionCount?: number;
}

export interface CreatePermissionRequest {
  code: string;
  httpMethod: HttpMethod;
  pathPattern: string;
  active: boolean;
}

export type UpdatePermissionRequest = Partial<CreatePermissionRequest>;

export interface CreateAssignRequest {
  code: string;
  httpMethod: HttpMethod;
  pathPattern: string;
  active: boolean;
  roleCode: string;
}

export interface RoleWithPermissionCount extends Role {
  permissionCount: number;
}

function getFirstFromResponse<T>(
  response: ApiResponseEnvelope<T | T[]>,
): T | null {
  const data = getResponseData<T | T[]>(response);
  if (!data) return null;
  return Array.isArray(data) ? (data[0] ?? null) : (data as T);
}

export const permissionService = {
  async getAllPermissions(): Promise<Permission[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Permission[]>>("permissions");
      return getArrayData<Permission>(response);
    } catch {
      return [];
    }
  },

  async getPermissionById(id: number): Promise<Permission | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<Permission>>(`permissions/${id}`);
      return getFirstFromResponse(response);
    } catch {
      return null;
    }
  },

  async getPermissionsByRole(roleCode: string): Promise<Permission[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Permission[]>>(`permissions/role/${roleCode}`);
      return getArrayData<Permission>(response);
    } catch {
      return [];
    }
  },

  async getPermissionsPaged(params: { page?: number; size?: number; keyword?: string; roleCode?: string }): Promise<{
    permissions: Permission[];
    meta: { page: number; pageSize: number; pages: number; total: number };
  }> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.size) searchParams.set("size", String(params.size));
    if (params.keyword) searchParams.set("keyword", params.keyword);
    const url = `permissions${searchParams.toString() ? `?${searchParams}` : ""}`;
    const response = await http.get<ApiResponseEnvelope<{ result: Permission[]; meta: { page: number; pageSize: number; pages: number; total: number } }>>(url);
    const data = response?.data as { result?: Permission[]; meta?: { page: number; pageSize: number; pages: number; total: number } } | undefined;
    return {
      permissions: data?.result ?? [],
      meta: data?.meta ?? { page: 1, pageSize: params.size ?? 20, pages: 1, total: 0 },
    };
  },

  async getAllPermissionsPaged(): Promise<Permission[]> {
    try {
      const result = await this.getPermissionsPaged({ page: 1, size: 100 });
      return result.permissions;
    } catch {
      return [];
    }
  },

  async createPermission(payload: CreatePermissionRequest): Promise<Permission | null> {
    try {
      const response = await http.post<ApiResponseEnvelope<Permission>>("permissions", payload);
      return getFirstFromResponse(response);
    } catch {
      return null;
    }
  },

  async updatePermission(id: number, payload: UpdatePermissionRequest): Promise<Permission | null> {
    try {
      const response = await http.put<ApiResponseEnvelope<Permission>>(`permissions/${id}`, payload);
      return getFirstFromResponse(response);
    } catch {
      return null;
    }
  },

  async deletePermission(id: number): Promise<boolean> {
    try {
      await http.del<ApiResponseEnvelope<null>>(`permissions/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async createAndAssign(payload: CreateAssignRequest): Promise<Permission | null> {
    try {
      const response = await http.post<ApiResponseEnvelope<Permission>>("permissions/assign", payload);
      return getFirstFromResponse(response);
    } catch {
      return null;
    }
  },
};

export const roleService = {
  async getAllRoles(): Promise<Role[]> {
    try {
      const response = await http.get<ApiResponseEnvelope<Role[]>>("roles");
      return getArrayData<Role>(response);
    } catch {
      return [];
    }
  },

  async getRoleById(id: number): Promise<Role | null> {
    try {
      const response = await http.get<ApiResponseEnvelope<Role>>(`roles/${id}`);
      return getFirstFromResponse(response);
    } catch {
      return null;
    }
  },

  async createRole(payload: { code: string; name: string }): Promise<Role | null> {
    try {
      const response = await http.post<ApiResponseEnvelope<Role>>("roles", payload);
      return getFirstFromResponse(response);
    } catch {
      return null;
    }
  },

  async updateRole(id: number, payload: { name?: string }): Promise<Role | null> {
    try {
      const response = await http.put<ApiResponseEnvelope<Role>>(`roles/${id}`, payload);
      return getFirstFromResponse(response);
    } catch {
      return null;
    }
  },

  async deleteRole(id: number): Promise<boolean> {
    try {
      await http.del<ApiResponseEnvelope<null>>(`roles/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async assignPermissions(roleCode: string, permissionIds: number[]): Promise<boolean> {
    try {
      await http.put<ApiResponseEnvelope<null>>(`roles/${roleCode}/permissions`, {
        permissionIds,
      });
      return true;
    } catch {
      return false;
    }
  },

  async removePermission(roleCode: string, permissionId: number): Promise<boolean> {
    try {
      await http.del<ApiResponseEnvelope<null>>(`roles/${roleCode}/permissions/${permissionId}`);
      return true;
    } catch {
      return false;
    }
  },
};
