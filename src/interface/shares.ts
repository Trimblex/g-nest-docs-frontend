export interface ShareInfoBO {
  fileId: string;
  expiresIn: number;
  requireLogin: boolean;
  maxVisits: number;
}

export interface ShareCheckedVO {
  objectName: string;
  url: string;
  fileName: string;
}
