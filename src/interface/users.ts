export interface LoginBO {
  username: string;
  password: string;
}

export interface RegisterBO {
  username: string;
  password: string;
  email: string;
  verificationCode: string;
}
export interface VerificationCodeBO {
  email: string;
  code: string;
}

export interface UserInfoVO {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  createdAt: Date;
  lastLoginAt: Date;
  authToken: string;
  currentOrgId: string;
  updatedAt: Date;
}
