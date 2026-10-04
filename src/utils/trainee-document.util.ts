import { isAxiosError } from "axios";
import { DOCUMENT_MAX_SIZE } from "../constants/trainee-document.constants";

const extensions: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "application/pdf": ["pdf"],
};

export function validateDocumentFile(file: File): string | null {
  if (!file.size) return "הקובץ ריק. יש לבחור קובץ אחר.";
  if (file.size > DOCUMENT_MAX_SIZE)
    return "הקובץ גדול מדי. הגודל המרבי הוא 10 MiB.";
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!extensions[file.type]?.includes(extension)) {
    return "סוג הקובץ אינו נתמך. יש לבחור קובץ JPG, PNG, WEBP או PDF.";
  }
  return null;
}

// Never display server messages that could contain internal Storage details.
export function documentErrorMessage(error: unknown, fallback: string): string {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status === 401) return "יש להתחבר מחדש כדי לגשת למסמכים.";
  if (status === 403) return "אין לך הרשאה לגשת למסמכים אלה.";
  if (status === 404)
    return "המסמך אינו זמין. יש לרענן את רשימת המסמכים ולנסות שוב.";
  if (status === 413) return "הקובץ גדול מדי. הגודל המרבי הוא 10 MiB.";
  if (status === 400)
    return "הקובץ אינו תקין. יש לבחור קובץ JPG, PNG, WEBP או PDF תקין.";
  return fallback;
}
