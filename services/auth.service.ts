import type {
  ChangePasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  VerifyAccountRequest
} from "@/types/request/auth.request";
import type {
  ChangePasswordApiResponse,
  LoginApiResponse,
  LogoutApiResponse,
  RefreshTokenApiResponse,
  RegisterApiResponse,
  VerifyAccountApiResponse
} from "@/types/response/auth.response";
import { http } from "@/utils/http";

export const authService = {
  login: (payload: LoginRequest) =>
    http.post<LoginApiResponse>("/auth/login", payload),

  register: (payload: RegisterRequest) =>
    http.post<RegisterApiResponse>("/auth/register", payload),

  logout: () =>
    http.post<LogoutApiResponse>("/auth/logout"),

  changePassword: (payload: ChangePasswordRequest) =>
    http.post<ChangePasswordApiResponse>("/auth/change-password", payload),

  verifyAccount: (userId: number | string, payload: VerifyAccountRequest) =>
    http.post<VerifyAccountApiResponse>(`/auth/verify/${userId}`, payload),

  refreshToken: (payload: RefreshTokenRequest) =>
    http.post<RefreshTokenApiResponse>("/auth/refresh", payload),
};