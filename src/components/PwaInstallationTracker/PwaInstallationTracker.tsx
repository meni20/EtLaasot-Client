import { useEffect } from "react";
import { useAuth } from "../../contexts/useAuth";
import { usePwaInstall } from "../../contexts/PwaInstallContext";
import pwaInstallationService from "../../services/pwa-installation.service";
import {
  getOrCreatePwaInstallationId,
  getPwaPlatform,
} from "../../utils/pwa-installation.util";

export const PwaInstallationTracker: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { installed } = usePwaInstall();

  useEffect(() => {
    if (!isAuthenticated || !installed) return;

    const installationId = getOrCreatePwaInstallationId();
    if (!installationId) return;

    void pwaInstallationService
      .register(installationId, getPwaPlatform())
      .catch(() => undefined);
  }, [installed, isAuthenticated]);

  return null;
};
