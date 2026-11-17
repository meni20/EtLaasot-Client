import { RegistrationError } from "./api.ts";

export type MedicalUploadPhase = "read" | "upload" | "retry";

export const medicalUploadErrorMessage = (error: unknown) =>
  error instanceof RegistrationError && error.code === "INVALID_PDF"
    ? "קובץ ה-PDF פגום או אינו נתמך. יש לבחור קובץ PDF תקין."
    : "לא הצלחנו להעלות את הסיכום הרפואי. הטיוטה נשמרה.";

export const reportMedicalUploadFailure = (
  phase: MedicalUploadPhase,
  error: unknown,
) => {
  const registrationError =
    error instanceof RegistrationError ? error : undefined;
  console.warn("medical-summary-upload-failed", {
    phase,
    status: registrationError?.status || undefined,
    code: registrationError?.code || "UNKNOWN",
    online: typeof navigator === "undefined" ? undefined : navigator.onLine,
    pwaControlled:
      typeof navigator === "undefined"
        ? undefined
        : Boolean(navigator.serviceWorker?.controller),
  });
};
