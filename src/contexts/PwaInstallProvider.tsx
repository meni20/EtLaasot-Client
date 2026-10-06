import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type BeforeInstallPromptEvent,
  PwaInstallContext,
} from "./PwaInstallContext";
import {
  confirmPwaInstallation,
  isIosDevice,
  isMobileDevice,
  isPwaInstallationConfirmed,
  isRunningStandalone,
  STANDALONE_QUERY,
} from "../utils/pwa-installation.util";

export const PwaInstallProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isPwaInstallationConfirmed);
  const iosDevice = isIosDevice();
  const mobileDevice = isMobileDevice();

  useEffect(() => {
    const standaloneQuery = window.matchMedia(STANDALONE_QUERY);

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      confirmPwaInstallation();
      setInstalled(true);
      setInstallPrompt(null);
    };

    const handleDisplayModeChange = () => {
      if (isRunningStandalone()) handleInstalled();
    };

    if (isRunningStandalone()) handleInstalled();

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    standaloneQuery.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      standaloneQuery.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  const requestInstall = useCallback(async () => {
    if (!installPrompt) return "unavailable" as const;

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      return choice.outcome;
    } catch {
      return "dismissed" as const;
    } finally {
      setInstallPrompt(null);
    }
  }, [installPrompt]);

  const value = useMemo(
    () => ({
      canInstall: !installed && (iosDevice || Boolean(installPrompt)),
      installed,
      iosDevice,
      mobileDevice,
      requestInstall,
    }),
    [installPrompt, installed, iosDevice, mobileDevice, requestInstall],
  );

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
    </PwaInstallContext.Provider>
  );
};
