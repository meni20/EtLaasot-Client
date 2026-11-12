import { createServerAxiosInstance } from "../../config/axiosInstance";

export type Answers = Record<string, string>;
export type Condition = { key: string; values: string[] };
export type Field = {
  key: string;
  label: string;
  kind: "text" | "id" | "phone" | "money" | "textarea" | "select";
  options?: Record<string, string>;
  when?: Condition;
  optional?: boolean;
};
export type Draft = {
  revision: number;
  data: Answers;
  attachments: Record<string, string>;
  sections: { title: string; fields: Field[]; any?: Condition[] }[];
  declarations: string[];
  instructions: string[];
  documents: { key: string; label: string; when: Condition; and?: Condition }[];
};
export type AdminStatus =
  | { status: "disabled" | "draft" | "enabled" }
  | { status: "submitted"; submittedAt: string; attachments: Record<string, string> };

const api = createServerAxiosInstance("", { "X-Discount-Request": "1" });
const self = "/user/me/discount-request";
const admin = (id: string) => `/trainee/${encodeURIComponent(id)}/discount-request`;

export const discountApi = {
  status: (signal?: AbortSignal) => api.get<{ status: "available" | "submitted" }>(self + "/status", { signal }),
  draft: (signal: AbortSignal) => api.get<Draft>(self + "/draft", { signal }),
  save: (revision: number, data: Answers) => api.put<{ revision: number }>(self + "/draft", { revision, data }),
  upload: (revision: number, key: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.put<{ revision: number; name: string }>(self + "/attachments/" + key, form, { params: { revision } });
  },
  remove: (revision: number, key: string) =>
    api.delete<{ revision: number }>(self + "/attachments/" + key, { params: { revision } }),
  submit: (revision: number, data: Answers, declared: boolean, signature?: string) =>
    api.post<{ status: "submitted" }>(self + "/submit", { revision, data, declared, signature }),
  adminStatus: (id: string, signal?: AbortSignal) => api.get<AdminStatus>(admin(id), { signal }),
  enable: (id: string) => api.put<AdminStatus>(admin(id) + "/enable"),
  file: (id: string, key: string) =>
    api.get<Blob>(admin(id) + "/files/" + encodeURIComponent(key), { responseType: "blob" }),
};
