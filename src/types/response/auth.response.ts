export type ApiResponse<T> = {
  error: string | null;
  message: string;
  statusCode: number;
  data: T;
};

export type RegisterResponseData = {
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


export type LoginResponseData = {
  userId: number;
  email: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string;
  accessToken: string;
  roles: string[];
};

export type RefreshTokenResponseData = {
  userId: number;
  email: string;
  expiresIn: number;
  tokenType: string;
  refreshToken: string;
  accessToken: string;
  roles: string[];
};

export type LoginResponse = ApiResponse<LoginResponseData>;
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;
export type RegisterResponse = ApiResponse<RegisterResponseData>;
export type LogoutResponse = void;
export type ChangePasswordResponse = void;
export type VerifyAccountResponse = void;
