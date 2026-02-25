import {
  getAuthorizationHeader,
  handleRouteError,
} from "@/app/api/_utils/route-utils";
import { API_MESSAGE } from "@/constants/api/messageApi";
import { api } from "@/lib/api/fetchHandler";
import { ResponseApi } from "@/lib/api/responseHandler";
import { HttpStatusCode } from "axios";
import { NextRequest } from "next/server";

type Supplier = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
};

type SupplierApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: Supplier;
};

type UpdateSupplierRequest = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ supplierId: string }> }
) {
  try {
    const { supplierId } = await params;
    const headers = getAuthorizationHeader(request);
    const response = await api.get<SupplierApiResponse>(`suppliers/${supplierId}`, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Supplier API Error");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ supplierId: string }> }
) {
  try {
    const { supplierId } = await params;
    const headers = getAuthorizationHeader(request);
    const body: UpdateSupplierRequest = await request.json();

    if (!body.name) {
      return ResponseApi.error("Vui lòng nhập tên nhà cung cấp", HttpStatusCode.BadRequest);
    }

    const response = await api.put<{ data: Supplier }>(`suppliers/${supplierId}`, body, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Update Supplier API Error");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ supplierId: string }> }
) {
  try {
    const { supplierId } = await params;
    const headers = getAuthorizationHeader(request);
    
    await api.delete(`suppliers/${supplierId}`, { headers });

    return ResponseApi.success({ message: "Xóa nhà cung cấp thành công" }, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Delete Supplier API Error");
  }
}
