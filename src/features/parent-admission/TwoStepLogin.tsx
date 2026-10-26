import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { useAuth } from "../../contexts/useAuth";
import { useStyles } from "../../pages/Mobile/LoginPage/Login.styles";
import { isValidIsraeliId } from "../../utils/data.utillity";
import { PwaInstallButton } from "../../components/PwaInstallButton/PwaInstallButton";
import {
  admissionUrl,
  createApplicantClient,
  setPendingApplicantId,
} from "./api";

// Temporary UI gate. The recovery route and API remain available.
const SHOW_RECOVERY_ENTRY = false;

export function TwoStepLogin({
  identify,
}: {
  identify?: (id: string) => Promise<{ next: "PASSWORD" | "REGISTER" }>;
}) {
  const styles = useStyles(),
    { login } = useAuth(),
    navigate = useNavigate();
  const [identifier, setIdentifier] = useState(""),
    [password, setPassword] = useState("");
  const [step, setStep] = useState<"ID" | "PASSWORD" | "REGISTER">("ID");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [visible, setVisible] = useState(false);
  const next = async () => {
    if (busy) return;
    if (!isValidIsraeliId(identifier)) {
      setError("תעודת הזהות אינה תקינה");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (step === "PASSWORD") {
        await login(identifier, password);
        return;
      }
      const url = admissionUrl();
      if (!identify && !url) throw new Error();
      const result = await (identify ?? createApplicantClient(url!).identify)(
        identifier,
      );
      setStep(
        result.next === "REGISTER" &&
          import.meta.env.VITE_APPLICANT_REGISTRATION_ENABLED === "true"
          ? "REGISTER"
          : "PASSWORD",
      );
    } catch {
      setError("לא ניתן להמשיך כרגע. נסו שוב מאוחר יותר.");
    } finally {
      setBusy(false);
    }
  };
  const reset = () => {
    setPassword("");
    setVisible(false);
    setStep("ID");
    setError("");
  };
  return (
    <Box className={styles.container} dir="rtl">
      <Box
        component="form"
        className={styles.card}
        onSubmit={(e) => {
          e.preventDefault();
          void next();
        }}
      >
        <Box
          component="img"
          src="/etlaasot-favicon.png"
          alt="עת לעשות"
          className={styles.logo}
        />
        <Typography component="h1" className={styles.subtitle}>
          {step === "ID"
            ? "כניסה באמצעות תעודת זהות"
            : step === "PASSWORD"
              ? "הזנת סיסמה"
              : "בקשת הרשמה"}
        </Typography>
        <Stack gap={3}>
          {error && (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            fullWidth
            label="תעודת זהות"
            autoComplete="username"
            value={identifier}
            disabled={step !== "ID" || busy}
            onChange={(e) => {
              setIdentifier(e.target.value.replace(/\D/g, "").slice(0, 9));
              setError("");
            }}
            inputProps={{ inputMode: "numeric", maxLength: 9 }}
            InputProps={{
              endAdornment:
                step !== "ID" ? (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      size="small"
                      edge="end"
                      aria-label="שינוי תעודת זהות"
                      disabled={busy}
                      onClick={reset}
                      sx={{ width: 44, height: 44 }}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
            }}
          />
          {step === "PASSWORD" && (
            <TextField
              autoFocus
              fullWidth
              label="סיסמה"
              type={visible ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={visible ? "הסתרת סיסמה" : "הצגת סיסמה"}
                      onClick={() => setVisible((v) => !v)}
                    >
                      {visible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          {step === "REGISTER" ? (
            <>
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  setPendingApplicantId(identifier);
                  navigate("/apply");
                }}
              >
                להתחלת הרשמה
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              variant="contained"
              disabled={
                busy || !identifier || (step === "PASSWORD" && !password)
              }
            >
              {busy ? "ממשיך…" : step === "ID" ? "המשך" : "התחבר"}
            </Button>
          )}
          {SHOW_RECOVERY_ENTRY &&
            import.meta.env.VITE_APPLICANT_REGISTRATION_ENABLED === "true" && (
              <Button type="button" onClick={() => navigate("/apply")}>
                המשך בקשה עם קוד שחזור
              </Button>
            )}
          <PwaInstallButton />
        </Stack>
      </Box>
    </Box>
  );
}
