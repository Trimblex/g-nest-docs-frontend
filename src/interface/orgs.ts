export interface OrgInfoVO {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logoUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy: string;
}

export interface OrgMemberVO {
  userId: string;
  role: string;
  username: string;
  avatarUrl: string;
  email: string;
}
