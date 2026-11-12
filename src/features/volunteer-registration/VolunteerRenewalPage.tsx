import { useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button } from "@mui/material";
import { useAuth } from "../../contexts/useAuth";
import { createServerAxiosInstance } from "../../config/axiosInstance";
import type { ApplicantClient, ApplicationSnapshot } from "../parent-admission/api";
import type { RegistrationType } from "../parent-admission/registration-type";
import { safeRegistrationError } from "../parent-registration/api";
import { VolunteerRegistration } from "./VolunteerRegistration";

type RenewalClient = Pick<ApplicantClient<RegistrationType>, "save" | "submit" | "upload">;

export default function VolunteerRenewalPage() {
  const { sessionId } = useAuth();
  const formId = useRef("");
  const http = useMemo(() => createServerAxiosInstance("/parent-registration/me/volunteer"), []);
  const renewal = useQuery({
    queryKey: ["registration", "volunteer-renewal", sessionId],
    queryFn: async () => {
      const { data } = await http.get<ApplicationSnapshot<"VOLUNTEER"> | null>("");
      formId.current = data?.application.id ?? "";
      return data;
    },
    refetchOnWindowFocus: false,
    refetchInterval: (query) => {
      const status = query.state.data?.application.status;
      return status === "PENDING_REVIEW" || status === "REJECTED" ? 5000 : false;
    },
  });
  const client = useMemo<RenewalClient>(() => ({
    async save(body) {
      try {
        const { data } = await http.patch<ApplicationSnapshot<"VOLUNTEER">>("", body);
        formId.current = data.application.id;
        return data;
      } catch (error) {
        throw safeRegistrationError(error);
      }
    },
    async upload(input) {
      const body = new FormData();
      body.append("file", input.file);
      body.append("revision", String(input.revision));
      if (input.signer) body.append("signer", input.signer);
      try {
        return (await http.post(`/attachments/${input.kind}`, body)).data;
      } catch (error) {
        throw safeRegistrationError(error);
      }
    },
    async submit(body) {
      try {
        return (await http.post("/submit", { ...body, formId: formId.current })).data;
      } catch (error) {
        throw safeRegistrationError(error);
      }
    },
  }), [http]);
  if (renewal.isPending) return <Alert severity="info">טוען טופס חידוש…</Alert>;
  if (renewal.isError) return <Alert severity="error" action={<Button onClick={() => void renewal.refetch()}>ניסיון נוסף</Button>}>לא ניתן לטעון את טופס החידוש.</Alert>;
  const initial = renewal.data;
  if (!initial) return <Alert severity="info">אין חידוש רישום פעיל.</Alert>;
  if (initial.application.status === "PENDING_REVIEW")
    return <Alert severity="success">הבקשה ממתינה לאישור מנהל.</Alert>;
  if (initial.application.status === "REJECTED")
    return <Alert severity="error">הרישום נדחה. {initial.application.feedbackReason}</Alert>;
  return (
    <>
      {initial.application.status === "CHANGES_REQUESTED" &&
        <Alert severity="warning">נדרשים תיקונים. {initial.application.feedbackReason}</Alert>}
      <VolunteerRegistration
        key={sessionId}
        client={client}
        initial={initial}
        onSubmitted={() => void renewal.refetch()}
        onReload={() => void renewal.refetch()}
      />
    </>
  );
}
