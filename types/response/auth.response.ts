export type ApiResponse<T> = {
  error: string | null;
  message: string;
  statusCode: number;
  data: T;
};

export type AuthTokenData = {
  userId: number;
  email: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string;
  accessToken: string;
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

export type UserLoginResponse = {
  id: number;
  email: string;
  roles: string[];
};

export type RegisterResponseData = UserResponse;
export type LoginResponseData = AuthTokenData;
export type RefreshTokenResponseData = AuthTokenData;
export type LoginResponse = ApiResponse<LoginResponseData>;
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;
export type RegisterResponse = ApiResponse<RegisterResponseData>;

export type LogoutResponse = void;
export type ChangePasswordResponse = void;
export type VerifyAccountResponse = void;
