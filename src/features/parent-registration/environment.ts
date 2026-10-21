const railwayDevApi = "https://etlaasot-server-dev-dev.up.railway.app";

/** Explicit local/DEV targets only. Never infer a target or use a fallback. */
export function registrationApiUrl(
  registrationUrl: string | undefined,
  applicationUrl: string | undefined,
  environment: string | undefined,
): string | null {
  try {
    const requested = new URL(registrationUrl || "");
    const configured = new URL(applicationUrl || "");
    for (const url of [requested, configured]) {
      if (
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        url.pathname !== "/"
      )
        return null;
    }
    if (requested.origin !== configured.origin) return null;
    if (requested.protocol === "http:" && requested.hostname === "127.0.0.1")
      return requested.origin;
    if (environment === "dev" && requested.origin === railwayDevApi)
      return requested.origin;
    return null;
  } catch {
    return null;
  }
}
