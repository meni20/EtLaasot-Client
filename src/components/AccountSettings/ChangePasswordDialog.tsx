import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../contexts/useAuth";
import {
  getNewPasswordValidationError,
  getPasswordChangeErrorMessage,
  normalizeNewPassword,
  PASSWORD_POLICY_MESSAGE,
} from "../../utils/password.util";
import { useNavbarStyles } from "../Navbar/Navbar.styles";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const INITIAL_PASSWORD_FORM: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onClose,
}) => {
  const classes = useNavbarStyles();
  const { changePassword } = useAuth();
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(
    INITIAL_PASSWORD_FORM,
  );
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const closeDialog = () => {
    if (isSavingPassword) return;
    setPasswordForm(INITIAL_PASSWORD_FORM);
    setPasswordError("");
    setShowPasswords(false);
    onClose();
  };

  const handlePasswordFormChange =
    (field: keyof PasswordFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
      setPasswordError("");
    };

  const savePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("יש למלא את כל שדות הסיסמה");
      return;
    }

    const newPassword = normalizeNewPassword(passwordForm.newPassword);
    const confirmPassword = normalizeNewPassword(passwordForm.confirmPassword);

    if (newPassword !== confirmPassword) {
      setPasswordError("אימות הסיסמה אינו תואם");
      return;
    }

    const validationError = getNewPasswordValidationError(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    setIsSavingPassword(true);
    setPasswordError("");

    try {
      await changePassword({
        ...passwordForm,
        newPassword,
        confirmPassword,
      });
      setPasswordForm(INITIAL_PASSWORD_FORM);
      onClose();
    } catch (error) {
      setPasswordError(
        getPasswordChangeErrorMessage(error, "לא הצלחנו לעדכן את הסיסמה"),
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      aria-labelledby="password-dialog-title"
      fullWidth
      maxWidth="xs"
      PaperProps={{ dir: "rtl", sx: { borderRadius: 3 } }}
    >
      <DialogTitle id="password-dialog-title" className={classes.profileDialogTitle}>
        שינוי סיסמה
        <IconButton
          aria-label="סגירת חלון שינוי סיסמה"
          onClick={closeDialog}
          className={classes.profileDialogClose}
          style={{ position: "absolute" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 1.5 }}>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {passwordError && <Alert severity="error">{passwordError}</Alert>}
          <PasswordField
            label="סיסמה נוכחית"
            value={passwordForm.currentPassword}
            visible={showPasswords}
            autoComplete="current-password"
            onChange={handlePasswordFormChange("currentPassword")}
            onToggleVisible={() => setShowPasswords((current) => !current)}
          />
          <PasswordField
            label="סיסמה חדשה"
            value={passwordForm.newPassword}
            visible={showPasswords}
            autoComplete="new-password"
            helperText={PASSWORD_POLICY_MESSAGE}
            onChange={handlePasswordFormChange("newPassword")}
            onToggleVisible={() => setShowPasswords((current) => !current)}
          />
          <PasswordField
            label="אימות סיסמה חדשה"
            value={passwordForm.confirmPassword}
            visible={showPasswords}
            autoComplete="new-password"
            onChange={handlePasswordFormChange("confirmPassword")}
            onToggleVisible={() => setShowPasswords((current) => !current)}
          />
        </Stack>
      </DialogContent>
      <DialogActions dir="ltr" sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={closeDialog} disabled={isSavingPassword}>
          ביטול
        </Button>
        <Button
          variant="contained"
          onClick={() => void savePassword()}
          disabled={isSavingPassword}
        >
          {isSavingPassword ? "שומר..." : "שמירה"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PasswordField: React.FC<{
  label: string;
  value: string;
  visible: boolean;
  autoComplete: string;
  helperText?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisible: () => void;
}> = ({
  label,
  value,
  visible,
  autoComplete,
  helperText,
  onChange,
  onToggleVisible,
}) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    type={visible ? "text" : "password"}
    autoComplete={autoComplete}
    helperText={helperText}
    onChange={onChange}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label={visible ? "הסתרת סיסמה" : "הצגת סיסמה"}
            aria-pressed={visible}
            edge="end"
            size="small"
            onClick={onToggleVisible}
          >
            {visible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);
