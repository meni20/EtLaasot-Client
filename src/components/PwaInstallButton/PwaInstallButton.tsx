import { useState } from "react";
import InstallMobileRounded from "@mui/icons-material/InstallMobileRounded";
import { Alert, Button, Collapse, useMediaQuery } from "@mui/material";
import { usePwaInstall } from "../../contexts/PwaInstallContext";

export const PwaInstallButton: React.FC = () => {
  const isMobileViewport = useMediaQuery("(max-width:1023px)");
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const { canInstall, iosDevice, mobileDevice, requestInstall } = usePwaInstall();

  if (!isMobileViewport || !mobileDevice || !canInstall) {
    return null;
  }

  const handleInstall = async () => {
    if (iosDevice) {
      setShowIosInstructions((visible) => !visible);
      return;
    }

    await requestInstall();
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
