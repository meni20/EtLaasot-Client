import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { reloadSafety } from "../../utils/reload-safety";
import { Alert, Button, Snackbar } from "@mui/material";
import { useRegisterSW } from "virtual:pwa-register/react";

const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

interface PwaUpdatePromptProps {
  hasBottomNavigation?: boolean;
}

export const PwaUpdatePrompt: React.FC<PwaUpdatePromptProps> = ({
  hasBottomNavigation = false,
}) => {
  const reason = useSyncExternalStore(
    reloadSafety.subscribe,
    reloadSafety.getReason,
    () => "",
  );
  const [reloadPending, setReloadPending] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [activating, setActivating] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(
    undefined,
  );
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    // Let the initial document and authenticated API traffic finish before
    // Workbox starts downloading the full application precache.
    immediate: false,
    // Includes a worker activated by another tab. Never let the library reload
    // directly: work may have become dirty after the update button was clicked.
    onNeedReload: () => setReloadPending(true),
    onRegisteredSW: (_serviceWorkerUrl, registration) => {
      registrationRef.current = registration;
    },
  });

  useEffect(() => {
    if (reloadPending && !reloadSafety.getReason()) window.location.reload();
  }, [reloadPending, reason]);
  const update = async () => {
    if (reloadSafety.getReason() || activating) return;
    setActivating(true);
    setUpdateError(false);
    try {
      await updateServiceWorker(true);
    } catch {
      setUpdateError(true);
    } finally {
      setActivating(false);
    }
  };

  useEffect(() => {
    const updateInterval = window.setInterval(() => {
      const registration = registrationRef.current;
      if (!registration || registration.installing || !navigator.onLine) return;

      void registration.update().catch(() => setUpdateError(true));
    }, UPDATE_INTERVAL_MS);

    return () => window.clearInterval(updateInterval);
  }, []);

  const closePrompt = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <Snackbar
      open={offlineReady || needRefresh || reloadPending}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{
        bottom: hasBottomNavigation
          ? "calc(var(--shell-bottom-inset) + 16px)"
          : "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        insetInline: 12,
      }}
    >
      <Alert
        severity={needRefresh || reloadPending ? "info" : "success"}
        variant="filled"
        onClose={closePrompt}
        role="status"
        sx={{
          width: "min(100%, 520px)",
          direction: "rtl",
          alignItems: "center",
          fontFamily: "inherit",
          borderRadius: "var(--radius-md)",
        }}
        action={
          needRefresh || reloadPending ? (
            <Button
              color="inherit"
              size="small"
              disabled={!!reason || activating || reloadPending}
              onClick={() => void update()}
              sx={{ minWidth: 88, minHeight: 44, fontFamily: "inherit" }}
            >
              עדכון עכשיו
            </Button>
          ) : undefined
        }
      >
        {needRefresh || reloadPending
          ? reason ||
            (updateError
              ? "העדכון לא הושלם. נסו שוב."
              : "גרסה חדשה זמינה. אפשר לעדכן כעת.")
          : "האפליקציה מוכנה לפתיחה לאחר ההתקנה. נתונים עדכניים דורשים חיבור לרשת."}
      </Alert>
    </Snackbar>
  );
};
