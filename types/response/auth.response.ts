export type BackendApiResponse<T> = {
  error: string | null;
  message: string;
  statusCode: number;
  data: T;
};

export type RouteSuccessResponse<T> = {
  success: true;
  data: T;
};

export type UserLoginResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | string | null;
  phoneNumber: string | null;
  roles: string[];
};

export type UserResponse = {
  id: number;
  email: string;
  verifyToken: string;
  firstName: string;
  lastName: string;
  gender: string | null;
  phoneNumber: string | null;
  active: boolean;
  roles: string[];
  addresses: unknown[] | null;
};

export type AuthTokenData = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type LoginResponseData = AuthTokenData & {
  user: UserLoginResponse;
};

export type RegisterResponseData = UserResponse;
export type RefreshTokenResponseData = AuthTokenData;

export type LoginApiResponse = BackendApiResponse<LoginResponseData>;
export type RegisterApiResponse = BackendApiResponse<RegisterResponseData>;
export type RefreshTokenApiResponse = BackendApiResponse<RefreshTokenResponseData>;
export type LogoutApiResponse = BackendApiResponse<null>;
export type ChangePasswordApiResponse = BackendApiResponse<null>;
export type VerifyAccountApiResponse = BackendApiResponse<null>;
