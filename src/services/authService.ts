import type {
  ChangePasswordPayload,
  LoginPayload,
  LogoutPayload,
  RefreshTokenPayload,
  RegisterPayload,
  VerifyAccountPayload,
} from "@/types/request/auth.request";

import type {
  ChangePasswordResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
  VerifyAccountResponse,
} from "@/types/response/auth.response";
import { http } from "@/utils/http";

export const authApi = {
  login: (payload: LoginPayload) =>
    http.post<LoginResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    http.post<RegisterResponse>("/auth/register", payload),

  logout: (payload: LogoutPayload) =>
    http.post<LogoutResponse>("/auth/logout", payload),

  changePassword: (payload: ChangePasswordPayload) =>
    http.post<ChangePasswordResponse>("/auth/change-password", payload),

  verifyAccount: (userId: number | string, payload: VerifyAccountPayload) =>
    http.post<VerifyAccountResponse>(`/auth/verify/${userId}`, payload),

  refreshToken: (payload: RefreshTokenPayload) =>
    http.post<RefreshTokenResponse>("/auth/refresh", payload),
};
