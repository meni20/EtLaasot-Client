import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Switch,
  Typography,
} from "@mui/material";
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

const STATUS_DESCRIPTION: Partial<Record<PushStatus, string>> = {
  unsupported: "הדפדפן או המכשיר הנוכחי אינם תומכים בהתראות Push.",
  "ios-not-installed":
    "ב-iPhone וב-iPad יש להתקין תחילה את האפליקציה במסך הבית, ואז לפתוח אותה משם.",
  denied: "יש לאפשר התראות בהגדרות הדפדפן או המכשיר כדי להפעיל אותן.",
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
  const isToggleAvailable = status === "enabled" || status === "disabled";
  const isToggleBusy = busyAction === "enable" || busyAction === "disable";
  const statusDescription = STATUS_DESCRIPTION[status];

  const handleToggle = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (checked) void handleEnable();
    else void handleDisable();
  };

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
      <Box
        sx={{
          display: "grid",
          direction: "ltr",
          gridTemplateAreas: '"control content"',
          gridTemplateColumns: "auto minmax(0, 1fr)",
          alignItems: "center",
          width: "100%",
          minHeight: 48,
          columnGap: 2,
        }}
      >
        <Box
          sx={{
            gridArea: "content",
            direction: "rtl",
            minWidth: 0,
            textAlign: "right",
          }}
        >
          <Typography
            component={variant === "mobile" ? "h2" : "span"}
            sx={{ fontWeight: 800, fontFamily: "inherit" }}
          >
            התראות
          </Typography>
          {statusDescription && (
            <Typography
              sx={{
                mt: 0.375,
                color: "var(--color-text-secondary, #51565c)",
                fontSize: 13,
                lineHeight: 1.55,
                fontFamily: "inherit",
                textAlign: "right",
              }}
            >
              {statusDescription}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            gridArea: "control",
            direction: "ltr",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
            minWidth: 64,
          }}
        >
          {(isLoading || isToggleBusy) && (
            <CircularProgress size={18} aria-label="מעדכן את מצב ההתראות" />
          )}
          <Switch
            checked={status === "enabled"}
            onChange={handleToggle}
            disabled={!isToggleAvailable || busyAction !== null}
            color="primary"
            slotProps={{
              input: { "aria-label": "הפעלת התראות" },
            }}
          />
        </Box>
      </Box>

      {allowSelfTest && status === "enabled" && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              variant="outlined"
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
          </Box>
        </>
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
