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

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponseData> {
    const response = await http.post<RouteSuccessResponse<LoginResponseData>>(
      "/auth/login",
      payload,
    );

    return response.data.data;
  },

  async register(payload: RegisterRequest): Promise<RegisterResponseData> {
    const response = await http.post<RouteSuccessResponse<RegisterResponseData>>(
      "/auth/register",
      payload,
    );

    return response.data.data;
  },

  async logout(payload: LogoutRequest): Promise<null> {
    const response = await http.post<RouteSuccessResponse<null>>(
      "/auth/logout",
      payload,
    );

    return response.data.data;
  },

  async changePassword(payload: ChangePasswordRequest): Promise<null> {
    const response = await http.post<RouteSuccessResponse<null>>(
      "/auth/change-password",
      payload,
    );

    return response.data.data;
  },

  async verifyAccount(
    userId: number | string,
    payload: VerifyAccountRequest,
  ): Promise<null> {
    const response = await http.post<RouteSuccessResponse<null>>(
      `/auth/verify/${userId}`,
      payload,
    );

    return response.data.data;
  },

  async refreshToken(payload: RefreshTokenRequest): Promise<RefreshTokenResponseData> {
    const response = await http.post<RouteSuccessResponse<RefreshTokenResponseData>>(
      "/auth/refresh",
      payload,
    );

    return response.data.data;
  },
};
