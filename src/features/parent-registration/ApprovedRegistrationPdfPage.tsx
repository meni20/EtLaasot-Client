import { Alert, Box, CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createServerAxiosInstance } from "../../config/axiosInstance";
import { createApplicationAdminApi } from "../parent-admission/api";
import { createRegistrationApi } from "./api";

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function ApprovedRegistrationPdfPage() {
  const [params] = useSearchParams();
  const source = params.get("source");
  const formId = params.get("formId") ?? "";
  const documentId = params.get("documentId") ?? "";
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const registrationApi = useMemo(
    () => createRegistrationApi(createServerAxiosInstance("")),
    [],
  );
  const applicationApi = useMemo(() => createApplicationAdminApi(), []);
  const valid =
    (source === "RENEWAL" || source === "APPLICATION") &&
    UUID_V4.test(formId) &&
    UUID_V4.test(documentId);

  useEffect(() => {
    if (!valid) {
      setFailed(true);
      return;
    }
    let active = true;
    let objectUrl: string | null = null;
    void (source === "APPLICATION"
      ? applicationApi.document(formId, documentId)
      : registrationApi.document!(formId, documentId)
    )
      .then((blob) => {
        if (!active || (blob.type && blob.type !== "application/pdf")) {
          if (active) setFailed(true);
          return;
        }
        objectUrl = URL.createObjectURL(
          blob.type === "application/pdf"
            ? blob
            : new Blob([blob], { type: "application/pdf" }),
        );
        setPdfUrl(objectUrl);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [applicationApi, documentId, formId, registrationApi, source, valid]);

  if (failed)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          לא ניתן לפתוח את ה-PDF. יש לבדוק הרשאה ולנסות שוב.
        </Alert>
      </Box>
    );
  if (!pdfUrl)
    return (
      <Box
        sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}
      >
        <CircularProgress aria-label="טוען PDF מאושר" />
      </Box>
    );
  return (
    <Box
      component="iframe"
      src={pdfUrl}
      title="טופס רישום מאושר"
      sx={{ width: "100%", height: "100dvh", border: 0, display: "block" }}
    />
  );
}
