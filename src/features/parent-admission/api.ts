import axios from "axios";
import { createServerAxiosInstance } from "../../config/axiosInstance";
import type { RegistrationData } from "../parent-registration/contracts";
import {
  RegistrationError,
  type DraftResponse,
  type FormStatus,
  type FormSummary,
  type RegistrationApi,
} from "../parent-registration/api";
import { registrationApiUrl } from "../parent-registration/environment";

export type ApplicationStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED";
export interface ApplicationSummary {
  id: string;
  branchId: string;
  applicantName?: string;
  pdfDocumentId?: string | null;
  status: ApplicationStatus;
  revision: number;
  currentStep: number;
  documentStatus: "PENDING" | "READY" | "FAILED";
  feedbackReason: string | null;
}
export interface ApplicationSnapshot {
  application: ApplicationSummary;
  data: RegistrationData;
  contentHash: string;
  declarations: string[];
  declarationVersion: string;
  integration: "UNAVAILABLE" | "READY";
}
export interface ApplicantCredentials {
  application: ApplicationSummary;
  sessionToken: string;
  recoveryCode: string;
  expiresAt: string;
}
export interface ApplicantClient {
  identify(identifier: string): Promise<{ next: "PASSWORD" | "REGISTER" }>;
  branches(): Promise<{ id: string; name: string; city: string }[]>;
  start(identifier: string, branchId: string): Promise<ApplicantCredentials>;
  recover(code: string): Promise<ApplicantCredentials>;
  me(): Promise<ApplicationSnapshot>;
  save(body: {
    revision: number;
    currentStep: number;
    data: RegistrationData;
  }): Promise<{
    application: ApplicationSummary;
    data: RegistrationData;
    contentHash: string;
  }>;
  submit(body: { revision: number; idempotencyKey: string }): Promise<{
    application: ApplicationSummary;
    versionId: string;
    versionNumber: number;
    idempotent: boolean;
  }>;
  revoke(): Promise<void>;
  upload?: RegistrationApi["upload"];
  retryPdf?: RegistrationApi["retryPdf"];
}
let pendingIdentifier = "";
export function setPendingApplicantId(id: string) {
  pendingIdentifier = id;
}
export function takePendingApplicantId() {
  const value = pendingIdentifier;
  pendingIdentifier = "";
  return value;
}
export function admissionUrl() {
  return registrationApiUrl(
    import.meta.env.VITE_PARENT_REGISTRATION_API_URL,
    import.meta.env.VITE_SERVER_URL,
    import.meta.env.VITE_PARENT_REGISTRATION_ENVIRONMENT,
  );
}
export function createApplicantClient(url: string): ApplicantClient {
  // Separate trust boundary: never attach the application's JWT or clear its
  // session on an applicant 401. Token fallback stays in this closure only.
  const http = axios.create({ baseURL: url, withCredentials: true });
  let token: string | undefined;
  const call = async <T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> => {
    try {
      return (
        await http.request<T>({
          method,
          url: path,
          data: body,
          headers: token ? { "X-Applicant-Session": token } : {},
        })
      ).data;
    } catch (error) {
      if (axios.isAxiosError(error))
        throw new RegistrationError(error.response?.status ?? 0);
      throw new RegistrationError(0);
    }
  };
  const receive = async (work: Promise<ApplicantCredentials>) => {
    const result = await work;
    token = result.sessionToken;
    return result;
  };
  return {
    identify: (id) => call("POST", "/auth/identify", { identifier: id }),
    branches: () => call("GET", "/parent-applications/branches"),
    start: (id, branchId) =>
      receive(
        call("POST", "/parent-applications/start", {
          identifier: id,
          branchId,
        }),
      ),
    recover: (code) =>
      receive(
        call("POST", "/parent-applications/recover", { recoveryCode: code }),
      ),
    me: () => call("GET", "/parent-applications/me"),
    save: (body) => call("PATCH", "/parent-applications/me/draft", body),
    submit: (body) => call("POST", "/parent-applications/me/submit", body),
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
      return call("POST", `/parent-applications/me/attachments/${kind}`, body);
    },
    retryPdf: () => call("POST", "/parent-applications/me/pdf/retry"),
    revoke: async () => {
      await call("POST", "/parent-applications/session/revoke");
      token = undefined;
    },
  };
}
export function applicationForm(app: ApplicationSummary): FormSummary {
  if (app.status === "REJECTED") throw new RegistrationError(409);
  return {
    id: app.id,
    branchId: app.branchId,
    activityYearId: null,
    requestType: "APPLICATION",
    status: app.status as FormStatus,
    revision: app.revision,
    currentStep: app.currentStep,
    blocksAccess: false,
    documentStatus: app.documentStatus,
    submittedAt: null,
    approvedAt: null,
  };
}
export function applicantFormApi(client: ApplicantClient): RegistrationApi {
  const unsupported = async (): Promise<never> => {
    throw new RegistrationError(403);
  };
  return {
    mode: "live",
    upload: client.upload,
    retryPdf: client.retryPdf,
    me: async () => {
      const s = await client.me();
      return {
        form: applicationForm(s.application),
        data: s.data,
        contentHash: s.contentHash,
        declarations: s.declarations,
        declarationVersion: s.declarationVersion,
        previousApproved: null,
      } satisfies DraftResponse;
    },
    status: async () => {
      const s = await client.me();
      return {
        form: applicationForm(s.application),
        annualRequired: false,
        annualActivityYearId: null,
        registrationRequired: true,
        wouldBlockAccess: false,
        accessBlocked: false,
        documentIntegration: s.integration === "READY" ? "READY" : "DEFERRED",
      };
    },
    feedback: async () => {
      const s = await client.me();
      return {
        formId: s.application.id,
        status: applicationForm(s.application).status,
        reason: s.application.feedbackReason,
        requestReason: null,
      };
    },
    save: async (body) => {
      const s = await client.save(body);
      return {
        form: applicationForm(s.application),
        data: s.data,
        contentHash: s.contentHash,
      };
    },
    submit: async (body) => {
      const s = await client.submit({
        revision: body.revision,
        idempotencyKey: body.idempotencyKey,
      });
      return {
        form: applicationForm(s.application),
        versionId: s.versionId,
        versionNumber: s.versionNumber,
        idempotent: s.idempotent,
      };
    },
    years: unsupported,
    list: unsupported,
    detail: unsupported,
    openPeriod: unsupported,
    requestChanges: unsupported,
    approve: unsupported,
    renew: unsupported,
  };
}
export interface ApplicationDetail {
  application: ApplicationSummary;
  integration: "UNAVAILABLE" | "READY";
  versions: {
    id: string;
    versionNumber: number;
    data: RegistrationData;
    declarations: string[];
    declarationVersion: string;
  }[];
  documents: {
    id: string;
    versionId: string | null;
    kind: string;
    verifiedAt: string | null;
    mimeType: string;
    fileSize: number;
    checksum: string;
  }[];
}
export function createApplicationAdminApi() {
  const http = createServerAxiosInstance("/parent-applications/admin");
  const safe = async <T>(work: Promise<{ data: T }>) => {
    try {
      return (await work).data;
    } catch (e) {
      throw new RegistrationError(
        axios.isAxiosError(e) ? (e.response?.status ?? 0) : 0,
      );
    }
  };
  return {
    list: (branchId: string, page: number) =>
      safe(
        http.get<{ rows: ApplicationSummary[]; count: number }>("", {
          params: { branchId, page },
        }),
      ),
    detail: (id: string) => safe(http.get<ApplicationDetail>(`/${id}`)),
    retryPdf: (id: string) => safe(http.post(`/${id}/pdf/retry`)),
    document: (id: string, documentId: string) =>
      safe(
        http.get<Blob>(`/${id}/documents/${documentId}`, {
          responseType: "blob",
        }),
      ),
    review: (
      id: string,
      action: "reject" | "request-changes",
      reason: string,
    ) => safe(http.post(`/${id}/${action}`, { reason })),
    approve: (id: string, expectedVersionId: string) =>
      safe(
        http.post<{
          temporaryPassword: string;
          temporaryPasswordExpiresAt: string;
        }>(`/${id}/approve`, { expectedVersionId, identityVerified: true }),
      ),
  };
}
