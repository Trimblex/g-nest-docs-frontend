export interface ShareInfoBO {
  fileId: string;
  expiresIn: number;
  requireLogin: boolean;
  maxVisits: number;
}

export interface ShareCheckedVO {
  url: string;
  fileName: string;
}
