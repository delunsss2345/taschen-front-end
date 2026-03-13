import type { Supplier } from "@/types/response/supplier.response";
import { http } from "@/utils/http";
import {
  getResponseData,
  requireResponseData,
  type ApiResponseEnvelope,
} from "./helpers/response";

export interface CreateSupplierRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  active?: boolean;
}

export type UpdateSupplierRequest = Partial<CreateSupplierRequest>;

async function getSuppliersSafe(): Promise<Supplier[]> {
  try {
    const response =
      await http.get<ApiResponseEnvelope<Supplier[]>>("suppliers");
    const suppliersData = getResponseData<Supplier[]>(response);
    return suppliersData ?? [];
  } catch {
    return [];
  }
}

async function getSupplierByIdSafe(
  supplierId: number | string,
): Promise<Supplier | null> {
  try {
    const response = await http.get<ApiResponseEnvelope<Supplier>>(
      `suppliers/${supplierId}`,
    );
    return getResponseData<Supplier>(response);
  } catch {
    return null;
  }
}

async function createSupplierSafe(
  payload: CreateSupplierRequest,
): Promise<Supplier> {
  const response = await http.post<ApiResponseEnvelope<Supplier>>(
    "suppliers",
    payload,
  );
  return requireResponseData(
    response,
    "Create supplier response is missing data",
  );
}

async function updateSupplierSafe(
  supplierId: number | string,
  payload: UpdateSupplierRequest,
): Promise<Supplier> {
  const response = await http.put<ApiResponseEnvelope<Supplier>>(
    `suppliers/${supplierId}`,
    payload,
  );
  return requireResponseData(
    response,
    "Update supplier response is missing data",
  );
}

async function deleteSupplierSafe(
  supplierId: number | string,
): Promise<boolean> {
  try {
    await http.del<ApiResponseEnvelope<null>>(`suppliers/${supplierId}`);
    return true;
  } catch {
    return false;
  }
}

export const supplierService = {
  getAllSuppliers: getSuppliersSafe,
  getSuppliersSafe: async function (): Promise<Supplier[]> {
    try {
      const suppliers = await this.getAllSuppliers();
      return Array.isArray(suppliers) ? suppliers : [];
    } catch {
      return [];
    }
  },
  getAllSuppliersStrict: async function (): Promise<Supplier[]> {
    const response = await http.get<ApiResponseEnvelope<Supplier[]>>("suppliers");
    const suppliersData = getResponseData<Supplier[]>(response);
    return suppliersData ?? [];
  },

  getSupplierById: getSupplierByIdSafe,
  getSupplierByIdStrict: async function (supplierId: number | string): Promise<Supplier | null> {
    const response = await http.get<ApiResponseEnvelope<Supplier>>(`suppliers/${supplierId}`);
    return getResponseData<Supplier>(response);
  },

  createSupplier: createSupplierSafe,
  createSupplierStrict: async function (payload: CreateSupplierRequest): Promise<Supplier> {
    return this.createSupplier(payload); // safe method above doesn't catch errors internally
  },

  updateSupplier: updateSupplierSafe,
  updateSupplierStrict: async function (supplierId: number | string, payload: UpdateSupplierRequest): Promise<Supplier> {
    return this.updateSupplier(supplierId, payload); // safe method above doesn't catch errors internally
  },

  deleteSupplier: deleteSupplierSafe,
  deleteSupplierStrict: async function (supplierId: number | string): Promise<boolean> {
    await http.del<ApiResponseEnvelope<null>>(`suppliers/${supplierId}`);
    return true;
  },
};
