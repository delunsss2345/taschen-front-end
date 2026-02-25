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
    const response = await http.get<ApiResponseEnvelope<Supplier[]>>("suppliers");
    const suppliersData = getResponseData<Supplier[]>(response);
    return suppliersData ?? [];
  } catch {
    return [];
  }
}

async function getSupplierByIdSafe(supplierId: number | string): Promise<Supplier | null> {
  try {
    const response = await http.get<ApiResponseEnvelope<Supplier>>(`suppliers/${supplierId}`);
    return getResponseData<Supplier>(response);
  } catch {
    return null;
  }
}

async function createSupplierSafe(payload: CreateSupplierRequest): Promise<Supplier> {
  const response = await http.post<ApiResponseEnvelope<Supplier>>("suppliers", payload);
  return requireResponseData(response, "Create supplier response is missing data");
}

async function updateSupplierSafe(
  supplierId: number | string,
  payload: UpdateSupplierRequest,
): Promise<Supplier> {
  const response = await http.put<ApiResponseEnvelope<Supplier>>(`suppliers/${supplierId}`, payload);
  return requireResponseData(response, "Update supplier response is missing data");
}

async function deleteSupplierSafe(supplierId: number | string): Promise<boolean> {
  try {
    await http.del<ApiResponseEnvelope<null>>(`suppliers/${supplierId}`);
    return true;
  } catch {
    return false;
  }
}

export const supplierService = {
  getAllSuppliers: getSuppliersSafe,
  getSupplierById: getSupplierByIdSafe,
  createSupplier: createSupplierSafe,
  updateSupplier: updateSupplierSafe,
  deleteSupplier: deleteSupplierSafe,
};
