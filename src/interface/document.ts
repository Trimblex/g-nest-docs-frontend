interface DocumentInfoVO {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
