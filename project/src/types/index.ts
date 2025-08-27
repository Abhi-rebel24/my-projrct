export interface FileItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  isImage: boolean;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  isComplete: boolean;
}

export type FolderType = 'public' | 'private';