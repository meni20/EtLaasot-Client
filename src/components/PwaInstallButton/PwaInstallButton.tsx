import { useEffect, useState } from "react";
import InstallMobileRounded from "@mui/icons-material/InstallMobileRounded";
import { Alert, Button, Collapse, useMediaQuery } from "@mui/material";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
  userAgentData?: { mobile?: boolean };
}

const STANDALONE_QUERY = "(display-mode: standalone)";

const isRunningStandalone = () => {
  const mobileNavigator = navigator as NavigatorWithStandalone;

  return (
    window.matchMedia(STANDALONE_QUERY).matches ||
    mobileNavigator.standalone === true
  );
};

const isIosDevice = () => {
  const mobileNavigator = navigator as NavigatorWithStandalone;

  return (
    /iPad|iPhone|iPod/i.test(mobileNavigator.userAgent) ||
    (mobileNavigator.platform === "MacIntel" && mobileNavigator.maxTouchPoints > 1)
  );
};

const isMobileDevice = () => {
  const mobileNavigator = navigator as NavigatorWithStandalone;

  return (
    mobileNavigator.userAgentData?.mobile === true ||
    /Android|iPad|iPhone|iPod|Mobile/i.test(mobileNavigator.userAgent)
  );
};

export const PwaInstallButton: React.FC = () => {
  const isMobileViewport = useMediaQuery("(max-width:1023px)");
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isRunningStandalone);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const iosDevice = isIosDevice();
  const mobileDevice = isMobileDevice();

  useEffect(() => {
    const standaloneQuery = window.matchMedia(STANDALONE_QUERY);

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setShowIosInstructions(false);
    };

    const handleDisplayModeChange = () => {
      if (isRunningStandalone()) handleInstalled();
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    standaloneQuery.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      standaloneQuery.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  if (
    !isMobileViewport ||
    !mobileDevice ||
    installed ||
    (!iosDevice && !installPrompt)
  ) {
    return null;
  }

  const handleInstall = async () => {
    if (iosDevice) {
      setShowIosInstructions((visible) => !visible);
      return;
    }

    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch {
      // The browser owns the native prompt and may cancel it without app feedback.
    } finally {
      // Each native prompt event can only be used once.
      setInstallPrompt(null);
    }
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<InstallMobileRounded aria-hidden="true" />}
        onClick={() => void handleInstall()}
        aria-expanded={iosDevice ? showIosInstructions : undefined}
        aria-controls={iosDevice ? "ios-install-instructions" : undefined}
        sx={{
          minHeight: 48,
          borderRadius: "var(--radius-md, 14px)",
          borderColor: "var(--color-primary-border)",
          color: "var(--color-primary-dark)",
          backgroundColor: "var(--color-primary-soft)",
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 750,
          textTransform: "none",
          touchAction: "manipulation",
          transition:
            "background-color var(--transition-fast, 140ms ease), border-color var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease)",
          "& .MuiButton-startIcon": {
            marginInlineStart: 0,
            marginInlineEnd: 1,
          },
          "&:hover": {
            borderColor: "var(--color-primary)",
            backgroundColor: "var(--color-primary-selected)",
          },
          "&:active": {
            borderColor: "var(--color-primary-dark)",
            backgroundColor: "var(--color-primary-border)",
          },
          "&:focus-visible": {
            boxShadow: "var(--shadow-focus)",
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
        }}
      >
        התקנת האפליקציה
      </Button>

      {iosDevice && (
        <Collapse in={showIosInstructions}>
          <Alert
            id="ios-install-instructions"
            severity="info"
            role="status"
            sx={{
              direction: "rtl",
              borderRadius: "var(--radius-md, 14px)",
              fontFamily: "inherit",
              fontSize: 14,
              lineHeight: 1.55,
              textAlign: "right",
              "& .MuiAlert-message": { width: "100%" },
            }}
          >
            ב-Safari פתחו את תפריט השיתוף ובחרו „הוסף למסך הבית”.
          </Alert>
        </Collapse>
      )}
    </>
  );
};
