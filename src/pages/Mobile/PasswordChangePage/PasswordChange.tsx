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

    if (form.newPassword !== form.confirmPassword) {
      setError("אימות הסיסמה אינו תואם");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await changePassword(form);
      navigate("/", { replace: true });
    } catch {
      setError("לא הצלחנו לעדכן את הסיסמה. ודאו שהסיסמה הנוכחית נכונה ושהסיסמה החדשה חזקה מספיק.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        direction: "rtl",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        backgroundColor: "#F7F7F8",
        fontFamily: "Rubik, sans-serif",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          bgcolor: "#fff",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          p: 3,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: 24,
            fontWeight: 900,
            color: "#1F1F1F",
            mb: 1,
            fontFamily: "Rubik, sans-serif",
          }}
        >
          החלפת סיסמה
        </Typography>
        <Typography
          sx={{
            color: "#6B7280",
            fontSize: 14,
            lineHeight: 1.6,
            mb: 2.5,
            fontFamily: "Rubik, sans-serif",
          }}
        >
          יש להגדיר סיסמה אישית לפני המשך השימוש במערכת.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
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
            helperText="לפחות 10 תווים, אותיות גדולות וקטנות, מספר וסימן."
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
            height: 48,
            borderRadius: 2,
            bgcolor: "#7B3F98",
            fontWeight: 900,
            fontFamily: "Rubik, sans-serif",
            "&:hover": { bgcolor: "#6D3588" },
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
            color: "#6B7280",
            fontWeight: 800,
            fontFamily: "Rubik, sans-serif",
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
            aria-label={visible ? "Hide password" : "Show password"}
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
