import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import InstallMobileRoundedIcon from "@mui/icons-material/InstallMobileRounded";
import { usePwaInstall } from "../../contexts/PwaInstallContext";
import { SettingsRow } from "../SettingsRow/SettingsRow";

export const PwaInstallSettingsRow: React.FC = () => {
  const { iosDevice, requestInstall } = usePwaInstall();
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  const handleInstall = async () => {
    if (iosDevice) {
      setShowIosInstructions(true);
      return;
    }

    if (isPrompting) return;
    setIsPrompting(true);
    try {
      await requestInstall();
    } finally {
      setIsPrompting(false);
    }
  };

  return (
    <>
      <SettingsRow
        icon={<InstallMobileRoundedIcon />}
        title="התקנת האפליקציה"
        description={
          iosDevice
            ? "הוספת עת לעשות למסך הבית"
            : isPrompting
              ? "פותח את חלון ההתקנה..."
              : "התקנת עת לעשות במכשיר הנוכחי"
        }
        onClick={() => void handleInstall()}
      />

      <Dialog
        open={showIosInstructions}
        onClose={() => setShowIosInstructions(false)}
        aria-labelledby="ios-install-dialog-title"
        fullWidth
        maxWidth="xs"
        PaperProps={{ dir: "rtl", sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          id="ios-install-dialog-title"
          style={{ textAlign: "right" }}
        >
          התקנת האפליקציה
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ lineHeight: 1.7, textAlign: "right" }}>
            ב-Safari פתחו את תפריט השיתוף ובחרו „הוסף למסך הבית”. לאחר מכן
            פתחו את האפליקציה ממסך הבית.
          </Typography>
        </DialogContent>
        <DialogActions dir="ltr" sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setShowIosInstructions(false)}
          >
            הבנתי
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
