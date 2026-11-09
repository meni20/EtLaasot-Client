import {
  admissionUrl,
  createApplicantClient,
  type ApplicantClient,
} from "./api";
import type { RegistrationType } from "./registration-type";

export function passwordFlowEnabled() {
  const url = admissionUrl();
  return (
    import.meta.env.VITE_APPLICANT_PASSWORD_AUTH_ENABLED === "true" &&
    import.meta.env.VITE_APPLICANT_REGISTRATION_ENABLED === "true" &&
    import.meta.env.VITE_ID_FIRST_LOGIN_ENABLED === "true" &&
    !!url
  );
}

// Memory only. Share the applicant fallback token across the login/apply route
// boundary, including browsers that block cross-site cookies. Never use auth JWTs.
let instance:
  { url: string; client: ApplicantClient<RegistrationType> } | undefined;
export function passwordApplicantClient() {
  const url = admissionUrl();
  if (!url) return null;
  if (instance?.url !== url)
    instance = {
      url,
      client: createApplicantClient<RegistrationType>(url, "TRAINEE"),
    };
  return instance.client;
}
