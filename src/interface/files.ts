export interface CreateFolderBO {
  name: string;
  currentPath: string;
}

export interface RenameFileBO {
  id: string;
  newName: string;
}

export interface MoveFileBO {
  id: string;
  targetPath: string;
}

export interface CreateOrgBO {
  name: string;
  slug: string;
  logoUrl: string;
  description?: string;
}

export interface PreviewUrlBO {
  objectName: string;
  duration: number;
}

export interface RecycleOpBO {
  fileId: string;
  action: "restore" | "delete";
}

export interface ActivityLogVO {
  id: string;
  userId: string;
  action: string;
  fileName: string;
  parentFileId: string;
  createdAt: Date;
}

export interface FileInfoVO {
  id: string;
  userId: string;
  name: string;
  originalName?: string;
  type: "FOLDER" | "FILE";
  fileType?: string;
  mimeType?: string;
  size?: number;
  path: string;
  parentId: string;
  modifiedAt: Date;
  filePath?: string;
  objectName?: string;
  originalParentId?: string;
  deletedAt?: Date;
  createdAt: Date;
}
