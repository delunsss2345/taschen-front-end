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

type SuppliersApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: Supplier[];
};

type CreateSupplierRequest = {
  name: string;
  email: string;
  phone: string;
  address: string;
  active?: boolean;
};

export async function GET(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const response = await api.get<SuppliersApiResponse>("suppliers", { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Ok);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Get Suppliers API Error");
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = getAuthorizationHeader(request);
    const body: CreateSupplierRequest = await request.json();

    if (!body.name) {
      return ResponseApi.error("Vui lòng nhập tên nhà cung cấp", HttpStatusCode.BadRequest);
    }

    const response = await api.post<{ data: Supplier }>("suppliers", body, { headers });

    return ResponseApi.success(response.data, HttpStatusCode.Created);
  } catch (error) {
    return handleRouteError(error, API_MESSAGE.SYSTEM_TRY_AGAIN, "Create Supplier API Error");
  }
}
