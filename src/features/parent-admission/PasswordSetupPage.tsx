import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { admissionUrl } from "./api";
import { useReloadGuard } from "../../hooks/useReloadGuard";

export default function PasswordSetupPage() {
  // Fragment is never sent to the Server, access logs or Referrer headers.
  const [token] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "",
  );
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [error, setError] = useState("");
  const valid = /^[A-Za-z0-9_-]{43}$/.test(token);
  useReloadGuard(!done && (!!password || !!confirmation || busy));
  useEffect(() => {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );
    const meta = document.createElement("meta");
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || !valid) return;
    if (password !== confirmation) {
      setError("הסיסמאות אינן זהות");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // Isolated client: no login JWT/cookies and no global logout interceptor.
      await axios.post(
        `${admissionUrl()}/onboarding/password-setup`,
        { token, password, confirmation },
        { withCredentials: false, timeout: 30000 },
      );
      setPassword("");
      setConfirmation("");
      setDone(true);
    } catch (cause) {
      const status = axios.isAxiosError(cause)
        ? cause.response?.status
        : undefined;
      const code = axios.isAxiosError(cause)
        ? cause.response?.data?.code
        : undefined;
      setError(
        code === "SETUP_LINK_INVALID" || status === 404
          ? "הקישור אינו תקף, כבר נוצל או שפג תוקפו. פנו למנהל הסניף לקבלת עזרה."
          : status === 429
            ? "בוצעו ניסיונות רבים. המתינו עשר דקות ונסו שוב."
            : status === 400
              ? "בחרו סיסמה בת 6–128 תווים שאינה נפוצה, ואינה תעודת הזהות או מספר הטלפון."
              : "לא הצלחנו לשמור את הסיסמה. בדקו את החיבור ונסו שוב.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Box
      dir="rtl"
      sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 2 }}
    >
      <Paper sx={{ p: 3, width: "100%", maxWidth: 440, borderRadius: 3 }}>
        <Stack component="form" spacing={2} onSubmit={submit} aria-busy={busy}>
          <Typography variant="h5" component="h1">
            בחירת סיסמה לעת לעשות
          </Typography>
          {done ? (
            <Alert severity="success">
              הסיסמה נשמרה. אפשר להיכנס עם תעודת הזהות והסיסמה שבחרתם.
            </Alert>
          ) : !valid ? (
            <Alert severity="error">
              הקישור אינו תקף. פתחו את הקישור המלא מהאימייל או פנו למנהל הסניף.
            </Alert>
          ) : (
            <>
              <Typography>
                ההרשמה אושרה. בחרו סיסמה אישית כדי להתחיל.
              </Typography>
              <TextField
                required
                label="סיסמה חדשה"
                type="password"
                autoComplete="new-password"
                value={password}
                disabled={busy}
                inputProps={{ minLength: 6, maxLength: 128, dir: "ltr" }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                required
                label="אימות סיסמה"
                type="password"
                autoComplete="new-password"
                value={confirmation}
                disabled={busy}
                inputProps={{ minLength: 6, maxLength: 128, dir: "ltr" }}
                onChange={(e) => setConfirmation(e.target.value)}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" variant="contained" disabled={busy}>
                <span role="status">{busy ? "שומר..." : "שמירת סיסמה"}</span>
              </Button>
            </>
          )}
          <Button component={Link} to="/login">
            לכניסה למערכת
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
