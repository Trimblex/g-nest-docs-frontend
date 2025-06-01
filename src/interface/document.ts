interface DocumentInfoVO {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  ownerName?: string;
  organizationId: string | null;
  organizationName?: string;
  createdAt: Date;
  updatedAt: Date;
}
