export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LogoutRequest = {
  refreshToken: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type VerifyAccountRequest = {
  verifyToken: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};
