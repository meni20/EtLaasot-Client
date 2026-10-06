import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import pushNotificationService from "../../services/push-notification.service";
import {
  isPushSupported,
  serializePushSubscription,
  urlBase64ToUint8Array,
} from "../../utils/push-notification.util";
import {
  isIosDevice,
  isRunningStandalone,
} from "../../utils/pwa-installation.util";

type PushStatus =
  | "loading"
  | "unsupported"
  | "ios-not-installed"
  | "denied"
  | "disabled"
  | "enabled";

type PushNotificationSettingsProps = {
  allowSelfTest?: boolean;
  variant?: "admin" | "mobile";
};

const STATUS_COPY: Record<
  Exclude<PushStatus, "loading">,
  { title: string; description: string }
> = {
  unsupported: {
    title: "התראות אינן נתמכות",
    description: "הדפדפן או המכשיר הנוכחי אינם תומכים בהתראות Push.",
  },
  "ios-not-installed": {
    title: "נדרשת התקנת האפליקציה",
    description:
      "ב-iPhone וב-iPad יש להתקין תחילה את האפליקציה במסך הבית, ואז לפתוח אותה משם.",
  },
  denied: {
    title: "ההתראות חסומות",
    description:
      "יש לאפשר התראות בהגדרות הדפדפן או המכשיר כדי להפעיל אותן.",
  },
  disabled: {
    title: "ההתראות כבויות",
    description: "ניתן להפעיל התראות עבור המכשיר והדפדפן הנוכחיים.",
  },
  enabled: {
    title: "ההתראות פעילות",
    description: "המכשיר הנוכחי רשום לקבלת התראות.",
  },
};

export const PushNotificationSettings: React.FC<
  PushNotificationSettingsProps
> = ({ allowSelfTest = false, variant = "admin" }) => {
  const [status, setStatus] = useState<PushStatus>("loading");
  const [busyAction, setBusyAction] = useState<
    "enable" | "disable" | "test" | null
  >(null);
  const [message, setMessage] = useState<{
    severity: "success" | "error";
    text: string;
  } | null>(null);

  const getRegistration = useCallback(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      throw new Error("Service worker is not available");
    }
    return registration;
  }, []);

  const refreshStatus = useCallback(async () => {
    if (!isPushSupported()) {
      setStatus("unsupported");
      return;
    }

    if (isIosDevice() && !isRunningStandalone()) {
      setStatus("ios-not-installed");
      return;
    }

    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }

    try {
      const registration = await getRegistration();
      const subscription = await registration.pushManager.getSubscription();

      if (subscription && Notification.permission === "granted") {
        await pushNotificationService
          .register(serializePushSubscription(subscription))
          .catch(() => undefined);
        setStatus("enabled");
      } else {
        setStatus("disabled");
      }
    } catch {
      setStatus("unsupported");
    }
  }, [getRegistration]);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  const handleEnable = async () => {
    if (busyAction) return;
    setBusyAction("enable");
    setMessage(null);
    let createdSubscription: PushSubscription | null = null;

    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        setStatus("denied");
        return;
      }
      if (permission !== "granted") {
        setStatus("disabled");
        return;
      }

      const registration = await getRegistration();
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const publicKey = await pushNotificationService.getPublicKey();
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
        createdSubscription = subscription;
      }

      await pushNotificationService.register(
        serializePushSubscription(subscription),
      );
      setStatus("enabled");
      setMessage({ severity: "success", text: "ההתראות הופעלו בהצלחה" });
    } catch (error) {
      if (createdSubscription) {
        await createdSubscription.unsubscribe().catch(() => false);
      }
      setMessage({ severity: "error", text: getErrorMessage(error) });
      await refreshStatus();
    } finally {
      setBusyAction(null);
    }
  };

  const handleDisable = async () => {
    if (busyAction) return;
    setBusyAction("disable");
    setMessage(null);

    try {
      const registration = await getRegistration();
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await pushNotificationService.remove(subscription.endpoint);
        await subscription.unsubscribe();
      }

      setStatus("disabled");
      setMessage({ severity: "success", text: "ההתראות כובו במכשיר זה" });
    } catch (error) {
      setMessage({ severity: "error", text: getErrorMessage(error) });
      await refreshStatus();
    } finally {
      setBusyAction(null);
    }
  };

  const handleSelfTest = async () => {
    if (busyAction) return;
    setBusyAction("test");
    setMessage(null);

    try {
      const result = await pushNotificationService.sendSelfTest();
      setMessage({ severity: "success", text: result.message });
    } catch (error) {
      setMessage({ severity: "error", text: getErrorMessage(error) });
    } finally {
      setBusyAction(null);
    }
  };

  const isLoading = status === "loading";
  const copy = isLoading ? null : STATUS_COPY[status];
  const statusIcon =
    status === "enabled" ? (
      <NotificationsActiveRoundedIcon aria-hidden="true" />
    ) : (
      <NotificationsOffRoundedIcon aria-hidden="true" />
    );

  return (
    <Box
      dir="rtl"
      sx={{
        display: "block",
        width: "100%",
        boxSizing: "border-box",
        textAlign: "start",
        p: variant === "mobile" ? 2.25 : 2.5,
        borderRadius: variant === "mobile" ? "var(--radius-lg, 18px)" : 0,
        bgcolor:
          variant === "mobile"
            ? "var(--color-surface-elevated, rgba(255, 255, 255, 0.82))"
            : "transparent",
        border:
          variant === "mobile"
            ? "1px solid rgba(255, 255, 255, 0.72)"
            : "none",
        boxShadow:
          variant === "mobile"
            ? "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))"
            : "none",
        mb: variant === "mobile" ? 1.75 : 0,
      }}
    >
      {variant === "mobile" && (
        <Typography
          component="h2"
          sx={{
            mb: 1.5,
            fontSize: 15,
            fontWeight: 800,
            fontFamily: "inherit",
            textAlign: "start",
          }}
        >
          התראות
        </Typography>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "40px minmax(0, 1fr)",
          alignItems: "flex-start",
          justifyItems: "start",
          width: "100%",
          columnGap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            flexShrink: 0,
            color:
              status === "enabled"
                ? "var(--color-success, #2e7d32)"
                : "var(--color-primary)",
            bgcolor:
              status === "enabled"
                ? "var(--color-success-soft, #edf7ed)"
                : "var(--color-primary-soft)",
          }}
        >
          {isLoading ? <CircularProgress size={20} /> : statusIcon}
        </Box>
        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            textAlign: "start",
          }}
        >
          <Typography sx={{ fontWeight: 800, fontFamily: "inherit" }}>
            {isLoading ? "בודק את מצב ההתראות..." : copy?.title}
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              color: "var(--color-text-secondary, #51565c)",
              fontSize: 13,
              lineHeight: 1.55,
              fontFamily: "inherit",
            }}
          >
            {isLoading ? "" : copy?.description}
          </Typography>
        </Box>
      </Box>

      {(status === "enabled" || status === "disabled") && (
        <Box
          sx={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "max-content",
            justifyContent: "start",
            gap: 1,
            mt: 2,
            width: "100%",
          }}
        >
          {status === "disabled" ? (
            <Button
              variant="contained"
              onClick={() => void handleEnable()}
              disabled={busyAction !== null}
              startIcon={
                busyAction === "enable" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <NotificationsActiveRoundedIcon />
                )
              }
              sx={buttonSx}
            >
              {busyAction === "enable" ? "מפעיל..." : "הפעלת התראות"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              onClick={() => void handleDisable()}
              disabled={busyAction !== null}
              startIcon={
                busyAction === "disable" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <NotificationsOffRoundedIcon />
                )
              }
              sx={buttonSx}
            >
              {busyAction === "disable" ? "מכבה..." : "כיבוי התראות"}
            </Button>
          )}

          {allowSelfTest && status === "enabled" && (
            <Button
              variant="contained"
              onClick={() => void handleSelfTest()}
              disabled={busyAction !== null}
              startIcon={
                busyAction === "test" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SendRoundedIcon />
                )
              }
              sx={buttonSx}
            >
              {busyAction === "test" ? "שולח..." : "התראת בדיקה"}
            </Button>
          )}
        </Box>
      )}

      {message && (
        <Alert
          dir="rtl"
          severity={message.severity}
          role="status"
          sx={{
            mt: 2,
            borderRadius: 2,
            textAlign: "start",
          }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}
    </Box>
  );
};

const buttonSx = {
  minHeight: 44,
  borderRadius: "var(--radius-md, 14px)",
  fontWeight: 800,
  fontFamily: "inherit",
  textTransform: "none",
  "& .MuiButton-startIcon": {
    marginInlineStart: 0,
    marginInlineEnd: 1,
  },
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response as {
      data?: { message?: string | string[] };
    };
    const serverMessage = response.data?.message;
    if (typeof serverMessage === "string") return serverMessage;
    if (Array.isArray(serverMessage)) return serverMessage[0];
  }

  return "לא הצלחנו לעדכן את ההתראות. אפשר לנסות שוב.";
};
