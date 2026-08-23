import { useEffect, useRef } from "react";
import { Alert, Button, Snackbar } from "@mui/material";
import { useRegisterSW } from "virtual:pwa-register/react";

const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

interface PwaUpdatePromptProps {
  hasBottomNavigation?: boolean;
}

export const PwaUpdatePrompt: React.FC<PwaUpdatePromptProps> = ({
  hasBottomNavigation = false,
}) => {
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(
    undefined,
  );
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW: (_serviceWorkerUrl, registration) => {
      registrationRef.current = registration;
    },
  });

  useEffect(() => {
    const updateInterval = window.setInterval(() => {
      const registration = registrationRef.current;
      if (!registration || registration.installing || !navigator.onLine) return;

      void registration.update();
    }, UPDATE_INTERVAL_MS);

    return () => window.clearInterval(updateInterval);
  }, []);

  const closePrompt = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <Snackbar
      open={offlineReady || needRefresh}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{
        bottom: hasBottomNavigation
          ? "calc(var(--shell-bottom-inset) + 16px)"
          : "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        insetInline: 12,
      }}
    >
      <Alert
        severity={needRefresh ? "info" : "success"}
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
          needRefresh ? (
            <Button
              color="inherit"
              size="small"
              onClick={() => void updateServiceWorker(true)}
              sx={{ minWidth: 88, minHeight: 44, fontFamily: "inherit" }}
            >
              עדכון עכשיו
            </Button>
          ) : undefined
        }
      >
        {needRefresh
          ? "גרסה חדשה זמינה. ניתן לעדכן כעת בבטחה."
          : "האפליקציה מוכנה לפתיחה לאחר ההתקנה. נתונים עדכניים דורשים חיבור לרשת."}
      </Alert>
    </Snackbar>
  );
};
