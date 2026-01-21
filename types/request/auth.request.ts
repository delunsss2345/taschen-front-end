export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LogoutPayload = {
  refreshToken: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type VerifyAccountPayload = {
  verifyToken: string;
};

export type RefreshTokenPayload = {
  refreshToken: string;
};
