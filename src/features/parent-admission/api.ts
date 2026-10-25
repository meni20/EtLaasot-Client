import type { VolunteerPurpose } from "../volunteer-registration/contracts";
import {
  applicationQueryScope,
  normalizeRegistrationType,
  type RegistrationType,
  type ApplicationFormData,
} from "./registration-type";
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
export interface ApplicationSummary<T extends RegistrationType = "TRAINEE"> {
  registrationType?: T; // Omitted by older servers/fixtures; defaults to TRAINEE.
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
export interface ApplicationSnapshot<T extends RegistrationType = "TRAINEE"> {
  application: ApplicationSummary<T>;
  data: ApplicationFormData<T>;
  contentHash: string;
  declarations: string[];
  declarationVersion: string;
  integration: "UNAVAILABLE" | "READY";
  legal?: {
    agreement: readonly string[];
    parental: string;
    confidentiality: readonly string[];
    clearance: string;
  };
  scopeHashes?: Record<VolunteerPurpose, string>;
}
export interface ApplicantCredentials<T extends RegistrationType = "TRAINEE"> {
  application: ApplicationSummary<T>;
  sessionToken: string;
  recoveryCode: string;
  expiresAt: string;
}
export interface ApplicantClient<T extends RegistrationType = "TRAINEE"> {
  identify(identifier: string): Promise<{ next: "PASSWORD" | "REGISTER" }>;
  branches(): Promise<{ id: string; name: string; city: string }[]>;
  start(
    identifier: string,
    branchId: string,
    registrationType?: T,
  ): Promise<ApplicantCredentials<T>>;
  recover(code: string): Promise<ApplicantCredentials<T>>;
  me(): Promise<ApplicationSnapshot<T>>;
  save(body: {
    revision: number;
    currentStep: number;
    data: ApplicationFormData<T>;
  }): Promise<{
    application: ApplicationSummary<T>;
    data: ApplicationFormData<T>;
    contentHash: string;
  }>;
  submit(body: { revision: number; idempotencyKey: string }): Promise<{
    application: ApplicationSummary<T>;
    versionId: string;
    versionNumber: number;
    idempotent: boolean;
  }>;
  revoke(): Promise<void>;
  pdf?(): Promise<Blob>;
  upload?(input: {
    kind: "PHYSICIAN_SUMMARY" | "SIGNATURE" | "POLICE_CLEARANCE";
    file: Blob;
    revision: number;
    signer?: "parent1" | "parent2" | VolunteerPurpose;
  }): Promise<{
    documentId: string;
    contentHash: string;
    signedAt: string;
    agreementVersion?: string;
  }>;
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
export function createApplicantClient(url: string): ApplicantClient;
export function createApplicantClient<T extends RegistrationType>(
  url: string,
  type: T,
): ApplicantClient<T>;
export function createApplicantClient<T extends RegistrationType = "TRAINEE">(
  url: string,
  type: T = "TRAINEE" as T,
): ApplicantClient<T> {
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
  const receive = async (work: Promise<ApplicantCredentials<T>>) => {
    const result = await work;
    token = result.sessionToken;
    return result;
  };
  return {
    identify: (id) => call("POST", "/auth/identify", { identifier: id }),
    branches: () => call("GET", "/parent-applications/branches"),
    start: (id, branchId, registrationType = type) =>
      receive(
        call("POST", "/parent-applications/start", {
          identifier: id,
          branchId,
          registrationType,
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
    pdf: async () => {
      try {
        return (
          await http.get<Blob>("/parent-applications/me/pdf", {
            responseType: "blob",
            headers: token ? { "X-Applicant-Session": token } : {},
          })
        ).data;
      } catch (error) {
        throw new RegistrationError(
          axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0,
        );
      }
    },
    revoke: async () => {
      await call("POST", "/parent-applications/session/revoke");
      token = undefined;
    },
  };
}
export function applicationForm(
  app: ApplicationSummary<RegistrationType>,
): FormSummary {
  if (normalizeRegistrationType(app.registrationType) !== "TRAINEE")
    throw new RegistrationError(409);
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
export function applicantFormApi(
  client: ApplicantClient<RegistrationType>,
  applicationId = "entry",
): RegistrationApi {
  const unsupported = async (): Promise<never> => {
    throw new RegistrationError(403);
  };
  return {
    mode: "live",
    queryScope: applicationQueryScope("TRAINEE", applicationId),
    upload: client.upload,
    retryPdf: client.retryPdf,
    me: async () => {
      const s = await client.me();
      return {
        form: applicationForm(s.application),
        data: s.data as RegistrationData,
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
        data: s.data as RegistrationData,
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
export interface ApplicationDetail<T extends RegistrationType = "TRAINEE"> {
  application: ApplicationSummary<T>;
  branch?: { id: string; name: string; isActive: boolean } | null;
  history?: {
    id: string;
    action: string;
    versionId: string | null;
    reason: string | null;
    createdAt: string;
  }[];
  integration: "UNAVAILABLE" | "READY";
  versions: {
    id: string;
    versionNumber: number;
    data: ApplicationFormData<T>;
    registrationType?: T;
    submittedAt?: string;
    contentHash?: string;
    templateVersion?: string;
    declarations: string[];
    declarationSections?: {
      agreement: string[];
      parental: string;
      confidentiality: string[];
    };
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
    registrationType?: RegistrationType;
    signaturePurpose?: string | null;
    contentHash?: string;
    templateVersion?: string | null;
    sourceChecksum?: string | null;
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
    list: (
      branchId: string,
      page: number,
      registrationType: RegistrationType | "ALL" = "TRAINEE",
      status?: string,
      search?: string,
    ) =>
      safe(
        http.get<{
          rows: ApplicationSummary<RegistrationType>[];
          count: number;
        }>("", {
          params: {
            branchId: branchId || undefined,
            page,
            registrationType,
            status: status || undefined,
            search: search || undefined,
          },
        }),
      ),
    detail: (id: string) =>
      safe(http.get<ApplicationDetail<RegistrationType>>(`/${id}`)),
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
      expectedVersionId: string,
    ) => safe(http.post(`/${id}/${action}`, { reason, expectedVersionId })),
    approve: (id: string, expectedVersionId: string) =>
      safe(
        http.post<{
          temporaryPassword?: string;
          temporaryPasswordExpiresAt?: string;
          idempotent?: boolean;
        }>(`/${id}/approve`, { expectedVersionId, identityVerified: true }),
      ),
  };
}
