export type PwaPlatform = "android" | "ios" | "chromium" | "other";

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
  userAgentData?: { mobile?: boolean };
}

const INSTALLATION_ID_KEY = "etlaasot:pwa-installation-id:v1";
const INSTALLATION_CONFIRMED_KEY = "etlaasot:pwa-installed:v1";
export const STANDALONE_QUERY = "(display-mode: standalone)";

const browserNavigator = () => navigator as NavigatorWithStandalone;

export const isRunningStandalone = () => {
  const currentNavigator = browserNavigator();

  return (
    window.matchMedia(STANDALONE_QUERY).matches ||
    currentNavigator.standalone === true
  );
};

export const isIosDevice = () => {
  const currentNavigator = browserNavigator();

  return (
    /iPad|iPhone|iPod/i.test(currentNavigator.userAgent) ||
    (currentNavigator.platform === "MacIntel" &&
      currentNavigator.maxTouchPoints > 1)
  );
};

export const isMobileDevice = () => {
  const currentNavigator = browserNavigator();

  return (
    currentNavigator.userAgentData?.mobile === true ||
    /Android|iPad|iPhone|iPod|Mobile/i.test(currentNavigator.userAgent)
  );
};

export const getPwaPlatform = (): PwaPlatform => {
  const userAgent = browserNavigator().userAgent;

  if (/Android/i.test(userAgent)) return "android";
  if (isIosDevice()) return "ios";
  if (/Chrome|Chromium|CriOS|Edg/i.test(userAgent)) return "chromium";
  return "other";
};

export const isPwaInstallationConfirmed = () => {
  if (isRunningStandalone()) return true;

  try {
    return window.localStorage.getItem(INSTALLATION_CONFIRMED_KEY) === "true";
  } catch {
    return false;
  }
};

export const getOrCreatePwaInstallationId = () => {
  try {
    const existingId = window.localStorage.getItem(INSTALLATION_ID_KEY);
    if (existingId) return existingId;

    const installationId = createUuid();
    window.localStorage.setItem(INSTALLATION_ID_KEY, installationId);
    return installationId;
  } catch {
    return null;
  }
};

const createUuid = () => {
  if (typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));

  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
};

export const confirmPwaInstallation = () => {
  const installationId = getOrCreatePwaInstallationId();
  if (!installationId) return null;

  try {
    window.localStorage.setItem(INSTALLATION_CONFIRMED_KEY, "true");
    return installationId;
  } catch {
    return null;
  }
};
