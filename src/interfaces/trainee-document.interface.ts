export type DocumentType = "MAGNETIC_CARD" | "ID_APPENDIX" | "QUEUE_EXEMPTION";

export type TraineeDocumentsTarget =
  | { mode: "self"; traineeUuid?: never }
  | { mode: "admin"; traineeUuid: string };

export interface TraineeDocument {
  id: string;
  documentType: DocumentType;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentView {
  signedUrl: string;
  expiresAt: string;
}
