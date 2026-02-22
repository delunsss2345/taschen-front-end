import type {
  ChangePasswordRequest,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  VerifyAccountRequest,
} from "@/types/request/auth.request";
import type {
  LoginResponseData,
  RefreshTokenResponseData,
  RegisterResponseData,
  RouteSuccessResponse,
} from "@/types/response/auth.response";
import { http } from "@/utils/http";
import { getResponseData } from "./helpers/response";

async function postAuth<T>(
  endpoint: string,
  payload: unknown
): Promise<T | null> {
  try {
    const response = await http.post<RouteSuccessResponse<T>>(endpoint, payload);
    return getResponseData<T>(response);
  } catch {
    return null;
  }
}

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponseData | null> {
    return postAuth<LoginResponseData>("/api/auth/login", payload);
  },

  async register(payload: RegisterRequest): Promise<RegisterResponseData | null> {
    return postAuth<RegisterResponseData>("/auth/register", payload);
  },

  async logout(payload: LogoutRequest): Promise<null> {
    return postAuth<null>("/auth/logout", payload);
  },

  async changePassword(payload: ChangePasswordRequest): Promise<null> {
    return postAuth<null>("/auth/change-password", payload);
  },

  async verifyAccount(
    userId: number | string,
    payload: VerifyAccountRequest
  ): Promise<null> {
    return postAuth<null>(`/auth/verify/${userId}`, payload);
  },

  async refreshToken(payload: RefreshTokenRequest): Promise<RefreshTokenResponseData | null> {
    return postAuth<RefreshTokenResponseData>("/auth/refresh", payload);
  },
};
