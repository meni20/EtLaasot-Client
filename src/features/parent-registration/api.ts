import type { AxiosInstance } from "axios";
import type { RegistrationData } from "./contracts";

export type FormStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED";
export type DocumentStatus = "PENDING" | "READY" | "FAILED";
export interface FormSummary {
  id: string;
  branchId: string;
  activityYearId: string | null;
  requestType: "YEARLY" | "INDIVIDUAL" | "APPLICATION";
  status: FormStatus;
  revision: number;
  currentStep: number;
  blocksAccess: boolean;
  documentStatus: DocumentStatus;
  submittedAt: string | null;
  approvedAt: string | null;
}
export interface SafeDocument {
  id: string;
  versionId: string | null;
  kind: "REGISTRATION_PDF" | "PHYSICIAN_SUMMARY" | "SIGNATURE";
  mimeType: string;
  fileSize: number;
  checksum: string;
  verifiedAt: string | null;
}
export interface DraftResponse {
  form: FormSummary | null;
  data: RegistrationData;
  contentHash: string;
  declarations: string[];
  declarationVersion: string;
  previousApproved: {
    formId: string;
    versionId: string;
    documents: SafeDocument[];
  } | null;
}
export interface RegistrationStatus {
  form: FormSummary | null;
  annualRequired: boolean;
  annualActivityYearId: string | null;
  registrationRequired: boolean;
  wouldBlockAccess: boolean;
  accessBlocked: boolean;
  documentIntegration: "DEFERRED" | "READY";
}
export interface Feedback {
  formId: string | null;
  status: FormStatus | null;
  reason: string | null;
  requestReason: string | null;
}
export interface ActivityYear {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  isActive: boolean;
}
export interface ListRow {
  id: string;
  traineeUuid: string;
  branchId: string;
  activityYearId: FormSummary["activityYearId"];
  requestType: FormSummary["requestType"];
  status: FormStatus;
  documentStatus: DocumentStatus;
  submittedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
}
export interface ListParams {
  branchId: string;
  activityYearId: string;
  status?: FormStatus;
  page: number;
  pageSize: number;
}
export interface FormDetail {
  form: FormSummary;
  requestReason: string | null;
  feedbackReason: string | null;
  versions: {
    id: string;
    versionNumber: number;
    submittedAt: string;
    data: RegistrationData;
    declarationVersion: string;
    declarations: string[];
  }[];
  differences: {
    field: string;
    currentValue: unknown;
    proposedValue: unknown;
  }[];
  medicalSynchronization: "MANUAL_RECONCILIATION_REQUIRED";
  existingAllergies: string | null;
  existingMedications: {
    id: string;
    medicationName: string;
    dosage: string | null;
    frequency: string | null;
    schedule: string | null;
    instructions: string | null;
    isActive: boolean;
  }[];
  documents: SafeDocument[];
}
export interface RegistrationApi {
  readonly queryScope?: readonly unknown[];
  readonly mode: "live" | "demo";
  upload?(input: {
    kind: "PHYSICIAN_SUMMARY" | "SIGNATURE";
    file: Blob;
    revision: number;
    signer?: "parent1" | "parent2";
  }): Promise<{ documentId: string; contentHash: string; signedAt: string }>;
  retryPdf?(): Promise<unknown>;
  adminRetryPdf?(id: string): Promise<unknown>;
  document?(id: string, documentId: string): Promise<Blob>;
  me(): Promise<DraftResponse>;
  status(): Promise<RegistrationStatus>;
  feedback(): Promise<Feedback>;
  save(payload: {
    revision: number;
    currentStep: number;
    data: RegistrationData;
  }): Promise<
    Pick<DraftResponse, "data" | "contentHash"> & { form: FormSummary }
  >;
  submit(payload: {
    formId: string;
    revision: number;
    idempotencyKey: string;
  }): Promise<{
    form: FormSummary;
    versionId: string;
    versionNumber: number;
    idempotent: boolean;
  }>;
  years(): Promise<ActivityYear[]>;
  list(params: ListParams): Promise<{ rows: ListRow[]; count: number }>;
  detail(id: string): Promise<FormDetail>;
  openPeriod(branchId: string, activityYearId: string): Promise<unknown>;
  requestChanges(id: string, reason: string): Promise<FormSummary>;
  approve(id: string, expectedVersionId: string): Promise<FormSummary>;
  renew(
    traineeId: string,
    body: {
      reason: string;
      blocksAccess: boolean;
      branchId: string;
      activityYearId: string;
    },
  ): Promise<FormSummary>;
}

export class RegistrationError extends Error {
  readonly status: number;
  readonly field?: string;
  constructor(status: number, field?: string) {
    super(
      status === 409
        ? "קיימת גרסה חדשה יותר. יש לטעון אותה לפני המשך עריכה."
        : status === 401
          ? "החיבור פג. יש להתחבר מחדש."
          : status === 403
            ? "אין הרשאה לפעולה בסניף זה."
            : status === 400 || status === 422
              ? "יש לבדוק את פרטי הטופס והשדות המסומנים."
              : "לא ניתן להשלים את הפעולה. נסו שוב.",
    );
    this.status = status;
    this.field = field;
  }
}
export function safeRegistrationError(error: unknown): RegistrationError {
  const e = error as {
    response?: { status?: number; data?: { field?: string } };
  };
  return new RegistrationError(
    e?.response?.status ?? 0,
    typeof e?.response?.data?.field === "string"
      ? e.response.data.field
      : undefined,
  );
}
// Only explicit integration imports the authenticated application Axios instance.
// Errors deliberately discard request/response payloads, which may contain medical data.
export function createRegistrationApi(http: AxiosInstance): RegistrationApi {
  async function call<T>(
    method: "get" | "post" | "patch",
    url: string,
    data?: unknown,
    params?: unknown,
  ): Promise<T> {
    try {
      return (await http.request<T>({ method, url, data, params })).data;
    } catch (error) {
      throw safeRegistrationError(error);
    }
  }
  const base = "/parent-registration";
  return {
    mode: "live",
    upload: async ({ kind, file, revision, signer }) => {
      const body = new FormData();
      body.append(
        "file",
        file,
        file.type === "image/png"
          ? "attachment.png"
          : file.type === "image/jpeg"
            ? "attachment.jpg"
            : "attachment.pdf",
      );
      body.append("revision", String(revision));
      if (signer) body.append("signer", signer);
      return call("post", `${base}/me/attachments/${kind}`, body);
    },
    retryPdf: () => call("post", `${base}/me/pdf/retry`),
    adminRetryPdf: (id) =>
      call("post", `${base}/admin/forms/${encodeURIComponent(id)}/pdf/retry`),
    document: async (id, documentId) => {
      try {
        return (
          await http.get(
            `${base}/admin/forms/${encodeURIComponent(id)}/documents/${encodeURIComponent(documentId)}`,
            { responseType: "blob" },
          )
        ).data;
      } catch (error) {
        throw safeRegistrationError(error);
      }
    },
    me: () => call("get", `${base}/me`),
    status: () => call("get", `${base}/me/status`),
    feedback: () => call("get", `${base}/me/feedback`),
    save: (body) => call("patch", `${base}/me/draft`, body),
    submit: (body) => call("post", `${base}/me/submit`, body),
    years: () => call("get", "/activity-years"),
    list: (params) => call("get", `${base}/admin/forms`, undefined, params),
    detail: (id) =>
      call("get", `${base}/admin/forms/${encodeURIComponent(id)}`),
    openPeriod: (branchId, activityYearId) =>
      call("post", `${base}/admin/periods/open`, { branchId, activityYearId }),
    requestChanges: (id, reason) =>
      call(
        "post",
        `${base}/admin/forms/${encodeURIComponent(id)}/request-changes`,
        { reason },
      ),
    approve: (id, expectedVersionId) =>
      call("post", `${base}/admin/forms/${encodeURIComponent(id)}/approve`, {
        expectedVersionId,
      }),
    renew: (id, body) =>
      call(
        "post",
        `${base}/admin/trainees/${encodeURIComponent(id)}/renew`,
        body,
      ),
  };
}

export const statuses: Record<FormStatus, string> = {
  DRAFT: "טיוטה",
  PENDING_REVIEW: "ממתין לאישור",
  CHANGES_REQUESTED: "הוחזר לתיקון",
  APPROVED: "מאושר",
};
export function canApprove(detail: FormDetail): boolean {
  const latest = [...detail.versions].sort(
    (a, b) => b.versionNumber - a.versionNumber,
  )[0];
  return (
    detail.form.status === "PENDING_REVIEW" &&
    detail.form.documentStatus === "READY" &&
    !!latest &&
    detail.documents.some(
      (d) =>
        d.kind === "REGISTRATION_PDF" &&
        d.versionId === latest.id &&
        !!d.verifiedAt,
    )
  );
}
