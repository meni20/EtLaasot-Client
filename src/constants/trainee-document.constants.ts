import type { DocumentType } from "../interfaces/trainee-document.interface";

export const DOCUMENT_TYPES: {
  type: DocumentType;
  label: string;
  deleteLabel: string;
}[] = [
  { type: "MAGNETIC_CARD", label: "כרטיס מגנטי", deleteLabel: "הכרטיס המגנטי" },
  { type: "ID_APPENDIX", label: "ספח", deleteLabel: "הספח" },
  { type: "QUEUE_EXEMPTION", label: "פטור מתור", deleteLabel: "הפטור מתור" },
];

export const DOCUMENT_MAX_SIZE = 10 * 1024 * 1024;
export const DOCUMENT_ACCEPT =
  ".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf";
export const DOCUMENT_FILE_HELP =
  "\u2066JPG / JPEG, PNG, WEBP, PDF\u2069 · עד \u206610 MiB\u2069";
