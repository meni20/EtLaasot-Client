import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { branding } from "../../config/branding";
import { useAuth } from "../../contexts/useAuth";
import { useStyles } from "../../pages/Mobile/LoginPage/Login.styles";
import { isValidIsraeliId } from "../../utils/data.utillity";
import { RegistrationError } from "../parent-registration/api";
import type { ApplicantClient } from "./api";
import type { RegistrationType } from "./registration-type";
import { passwordApplicantClient } from "./password-flow";

export function UnifiedEntry({
  client: supplied,
  onApplicantAuthenticated,
  notice,
}: {
  client?: ApplicantClient<RegistrationType>;
  onApplicantAuthenticated?: () => Promise<void>;
  notice?: string;
}) {
  const styles = useStyles(),
    { login } = useAuth(),
    navigate = useNavigate();
  const client = supplied ?? passwordApplicantClient();
  const [step, setStep] = useState<
    "ID" | "PASSWORD" | "REGISTER" | "APPLICANT_PASSWORD" | "LEGACY_RECOVERY"
  >("ID");
  const [identifier, setIdentifier] = useState(""),
    [email, setEmail] = useState("");
  const [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState("");
  const [type, setType] = useState<RegistrationType>("TRAINEE");
  const [visible, setVisible] = useState(false),
    [confirmVisible, setConfirmVisible] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const inFlight = useRef(false);
  const reset = () => {
    setStep("ID");
    setPassword("");
    setConfirmation("");
    setEmail("");
    setError("");
    setVisible(false);
    setConfirmVisible(false);
  };
  const next = async () => {
    if (inFlight.current || !client) return;
    setError("");
    if (!isValidIsraeliId(identifier)) {
      setError("תעודת הזהות אינה תקינה");
      return;
    }
    if (step === "REGISTER") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("יש להזין כתובת אימייל תקינה");
        return;
      }
      if (password !== confirmation) {
        setError("אימות הסיסמה אינו תואם");
        return;
      }
      if (
        password.trim() !== password ||
        password.length < 6 ||
        password.length > 128 ||
        [
          "123456",
          "111111",
          "000000",
          "password",
          "qwerty",
          identifier,
        ].includes(password.toLowerCase())
      ) {
        setError(
          "יש לבחור סיסמה באורך 6–128 תווים, ללא רווח בתחילה או בסוף, שאינה נפוצה או תעודת הזהות",
        );
        return;
      }
    }
    inFlight.current = true;
    setBusy(true);
    try {
      if (step === "ID") {
        const result = await client.identify(identifier, true);
        setStep(result.next);
        return;
      }
      if (step === "PASSWORD") {
        await login(identifier, password);
        setPassword("");
        return;
      }
      if (step === "REGISTER") {
        if (!client.passwordSignup) throw new Error();
        await client.passwordSignup({
          identifier,
          email: email.trim().toLowerCase(),
          password,
          passwordConfirmation: confirmation,
          registrationType: type,
        });
      } else if (step === "APPLICANT_PASSWORD") {
        if (!client.passwordLogin) throw new Error();
        await client.passwordLogin({ identifier, password });
      } else return;
      setPassword("");
      setConfirmation("");
      if (onApplicantAuthenticated) await onApplicantAuthenticated();
      else navigate("/apply", { replace: true });
    } catch (e) {
      setError(
        e instanceof RegistrationError && e.status === 429
          ? "בוצעו ניסיונות רבים מדי. יש להמתין ולנסות שוב."
          : e instanceof RegistrationError && e.status === 409
            ? "לא ניתן לפתוח בקשה נוספת. נסו להיכנס מחדש או פנו למנהל הסניף."
            : e instanceof RegistrationError && e.status === 400
              ? "בדקו את הפרטים ואת דרישות הסיסמה ונסו שוב."
              : "לא ניתן להמשיך עם הפרטים שהוזנו. בדקו אותם ונסו שוב.",
      );
      setPassword("");
      setConfirmation("");
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  };
  const visibility = (shown: boolean, toggle: () => void, label: string) => (
    <InputAdornment position="end">
      <IconButton
        type="button"
        aria-label={`${shown ? "הסתרת" : "הצגת"} ${label}`}
        aria-pressed={shown}
        onClick={toggle}
        sx={{ minWidth: 44, minHeight: 44 }}
      >
        {shown ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
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
          src={branding.loginLogo}
          alt="עת לעשות"
          className={styles.logo}
        />
        <Typography component="h1" className={styles.subtitle}>
          {step === "ID"
            ? "כניסה והרשמה"
            : step === "REGISTER"
              ? "יצירת פרטי כניסה"
              : step === "LEGACY_RECOVERY"
                ? "המשך הרשמה קודמת"
                : "הזנת סיסמה"}
        </Typography>
        <Stack gap={3}>
          {notice && <Alert severity="info">{notice}</Alert>}
          {error && (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          )}
          {!client && <Alert severity="error">הכניסה אינה זמינה כרגע.</Alert>}
          <TextField
            autoFocus={step === "ID"}
            fullWidth
            required
            label="תעודת זהות"
            autoComplete="username"
            value={identifier}
            disabled={step !== "ID" || busy}
            onChange={(e) =>
              setIdentifier(e.target.value.replace(/\D/g, "").slice(0, 9))
            }
            inputProps={{ inputMode: "numeric", maxLength: 9, dir: "ltr" }}
          />
          {step !== "ID" && (
            <Button type="button" disabled={busy} onClick={reset}>
              שינוי תעודת זהות
            </Button>
          )}
          {step === "REGISTER" && (
            <>
              <TextField
                select
                label="סוג הרשמה"
                value={type}
                disabled={busy}
                onChange={(e) => setType(e.target.value as RegistrationType)}
              >
                <MenuItem value="TRAINEE">חניך</MenuItem>
                {import.meta.env.VITE_VOLUNTEER_REGISTRATION_ENABLED ===
                  "true" && <MenuItem value="VOLUNTEER">מתנדב</MenuItem>}
              </TextField>
              <TextField
                autoFocus
                fullWidth
                required
                label="כתובת אימייל"
                type="email"
                autoComplete="email"
                value={email}
                disabled={busy}
                onChange={(e) => setEmail(e.target.value)}
                inputProps={{ dir: "ltr", maxLength: 254 }}
                helperText="כתובת ליצירת קשר בענייני הכניסה והרישום. אפשר להשתמש באימייל המשפחתי."
              />
            </>
          )}
          {["REGISTER", "PASSWORD", "APPLICANT_PASSWORD"].includes(step) && (
            <TextField
              autoFocus={step !== "REGISTER"}
              fullWidth
              required
              label="סיסמה"
              type={visible ? "text" : "password"}
              autoComplete={
                step === "REGISTER" ? "new-password" : "current-password"
              }
              value={password}
              disabled={busy}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{ dir: "ltr", maxLength: 128 }}
              InputProps={{
                endAdornment: visibility(
                  visible,
                  () => setVisible((v) => !v),
                  "סיסמה",
                ),
              }}
              helperText={
                step === "REGISTER"
                  ? "לפחות 6 תווים. אין לבחור סיסמה נפוצה או את תעודת הזהות."
                  : undefined
              }
            />
          )}
          {step === "REGISTER" && (
            <TextField
              fullWidth
              required
              label="אימות סיסמה"
              type={confirmVisible ? "text" : "password"}
              autoComplete="new-password"
              value={confirmation}
              disabled={busy}
              onChange={(e) => setConfirmation(e.target.value)}
              inputProps={{ dir: "ltr", maxLength: 128 }}
              InputProps={{
                endAdornment: visibility(
                  confirmVisible,
                  () => setConfirmVisible((v) => !v),
                  "אימות סיסמה",
                ),
              }}
            />
          )}
          {step === "LEGACY_RECOVERY" ? (
            <>
              <Typography>
                לבקשות שנפתחו בעבר, אפשר להמשיך עם קוד השחזור שנשמר.
              </Typography>
              <Button
                component={RouterLink}
                to="/apply?legacy=1"
                variant="contained"
              >
                המשך עם קוד הרשמה קודם
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              variant="contained"
              disabled={busy || !client}
            >
              {busy ? "ממשיך…" : "המשך"}
            </Button>
          )}
          {step === "ID" && (
            <Button component={RouterLink} to="/apply?legacy=1" disabled={busy}>
              יש לי בקשה ישנה עם קוד שחזור
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
