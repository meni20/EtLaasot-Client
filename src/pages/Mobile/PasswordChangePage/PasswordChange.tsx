import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth";
import {
  getNewPasswordValidationError,
  getPasswordChangeErrorMessage,
  normalizeNewPassword,
  PASSWORD_POLICY_MESSAGE,
} from "../../../utils/password.util";

type FieldName = "currentPassword" | "newPassword" | "confirmPassword";

const INITIAL_FORM: Record<FieldName, string> = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const PasswordChangePage: React.FC = () => {
  const navigate = useNavigate();
  const { changePassword, logout } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [visibleFields, setVisibleFields] = useState<Record<FieldName, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: FieldName) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setError("");
    };

  const toggleVisible = (field: FieldName) => {
    setVisibleFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("יש למלא את כל שדות הסיסמה");
      return;
    }

    const newPassword = normalizeNewPassword(form.newPassword);
    const confirmPassword = normalizeNewPassword(form.confirmPassword);

    if (newPassword !== confirmPassword) {
      setError("אימות הסיסמה אינו תואם");
      return;
    }

    const validationError = getNewPasswordValidationError(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await changePassword({
        ...form,
        newPassword,
        confirmPassword,
      });
      navigate("/", { replace: true });
    } catch (error) {
      setError(
        getPasswordChangeErrorMessage(
          error,
          "לא הצלחנו לעדכן את הסיסמה. ודאו שהסיסמה הנוכחית נכונה.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        direction: "rtl",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: "calc(env(safe-area-inset-top, 0px) + 24px)",
        pb: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
        background:
          "linear-gradient(180deg, var(--color-canvas-warm, #faf9fb) 0%, var(--color-canvas, #f5f6f8) 100%)",
        fontFamily:
          '"Noto Sans Hebrew", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "var(--radius-sheet, 26px)",
          bgcolor: "var(--color-surface-elevated, rgba(255, 255, 255, 0.82))",
          border: "1px solid rgba(255, 255, 255, 0.72)",
          boxShadow: "var(--shadow-lg, 0 24px 64px rgba(16, 24, 40, 0.15))",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          p: { xs: 3, sm: 4 },
          animation: "scaleIn 240ms var(--ease-out, ease-out)",
          "@media (prefers-reduced-motion: reduce)": {
            animation: "fadeIn 1ms linear",
          },
          "@media (prefers-reduced-transparency: reduce)": {
            bgcolor: "var(--color-surface, #fff)",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            borderColor: "var(--color-border, #dadde3)",
          },
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--color-text, #1d1d1f)",
            mb: 1,
            fontFamily: "inherit",
            lineHeight: 1.2,
          }}
        >
          החלפת סיסמה
        </Typography>
        <Typography
          sx={{
            color: "var(--color-text-secondary, #51565c)",
            fontSize: 15,
            lineHeight: 1.6,
            mb: 2.5,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          יש להגדיר סיסמה אישית לפני המשך השימוש במערכת.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "var(--radius-md, 14px)" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <PasswordField
            label="סיסמה נוכחית"
            value={form.currentPassword}
            visible={visibleFields.currentPassword}
            autoComplete="current-password"
            onChange={handleChange("currentPassword")}
            onToggleVisible={() => toggleVisible("currentPassword")}
          />
          <PasswordField
            label="סיסמה חדשה"
            value={form.newPassword}
            visible={visibleFields.newPassword}
            autoComplete="new-password"
            helperText={PASSWORD_POLICY_MESSAGE}
            onChange={handleChange("newPassword")}
            onToggleVisible={() => toggleVisible("newPassword")}
          />
          <PasswordField
            label="אימות סיסמה חדשה"
            value={form.confirmPassword}
            visible={visibleFields.confirmPassword}
            autoComplete="new-password"
            onChange={handleChange("confirmPassword")}
            onToggleVisible={() => toggleVisible("confirmPassword")}
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            mt: 3,
            minHeight: 52,
            borderRadius: "var(--radius-md, 14px)",
            bgcolor: "var(--color-primary)",
            fontWeight: 800,
            fontFamily: "inherit",
            boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
            "&:hover": {
              bgcolor: "var(--color-primary-dark)",
              boxShadow: "var(--shadow-md, 0 12px 34px rgba(16, 24, 40, 0.1))",
            },
          }}
        >
          {loading ? "מעדכן..." : "עדכון סיסמה"}
        </Button>
        <Button
          fullWidth
          variant="text"
          startIcon={<LogoutIcon />}
          onClick={logout}
          disabled={loading}
          sx={{
            mt: 1,
            minHeight: 48,
            color: "var(--color-text-secondary, #51565c)",
            fontWeight: 800,
            fontFamily: "inherit",
          }}
        >
          התנתקות
        </Button>
      </Box>
    </Box>
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
