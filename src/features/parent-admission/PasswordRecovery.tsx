import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import { admissionUrl } from "./api";
import { passwordFlowEnabled } from "./password-flow";
import { isValidIsraeliId } from "../../utils/data.utillity";
import { useAuth } from "../../contexts/useAuth";
const generic =
  "אם ניתן לבצע איפוס, יישלח קישור לאימייל הרשום. הקישור תקף ל־30 דקות. לפני האיפוס הראשון יש לפנות למנהל הסניף לאימות זהות ובעלות על כתובת האימייל.";
const post = (path: string, input: object) =>
  axios.post(`${admissionUrl()}/password-recovery/${path}`, input, {
    withCredentials: false,
    timeout: 30000,
  });
export function PasswordRecoveryRequest({
  identifier: initial,
  onBack,
}: {
  identifier: string;
  onBack: () => void;
}) {
  const [identifier, setIdentifier] = useState(initial),
    [done, setDone] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!isValidIsraeliId(identifier)) {
      setError("תעודת הזהות אינה תקינה");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await post("request", { identifier });
      setDone(true);
    } catch {
      setError("לא ניתן לשלוח בקשה כעת. המתינו ונסו שוב.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Frame>
      <Stack component="form" gap={2} onSubmit={submit}>
        <Typography component="h1" variant="h5">
          שכחתי סיסמה
        </Typography>
        {done ? (
          <Alert severity="info">{generic}</Alert>
        ) : (
          <>
            <Typography>הזינו תעודת זהות לקבלת קישור לאימייל הרשום.</Typography>
            <TextField
              required
              label="תעודת זהות"
              value={identifier}
              onChange={(e) =>
                setIdentifier(e.target.value.replace(/\D/g, "").slice(0, 9))
              }
              inputProps={{ inputMode: "numeric", maxLength: 9 }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" disabled={busy}>
              שליחת קישור לאיפוס
            </Button>
          </>
        )}
        <Button type="button" onClick={onBack} disabled={busy}>
          חזרה לכניסה
        </Button>
      </Stack>
    </Frame>
  );
}
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <Box
      dir="rtl"
      sx={{ minHeight: "80dvh", display: "grid", placeItems: "center", p: 2 }}
    >
      <Paper sx={{ p: 3, width: "100%", maxWidth: 440, borderRadius: 3 }}>
        {children}
      </Paper>
    </Box>
  );
}
export default function PasswordResetPage() {
  const [token, setToken] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "",
  );
  const [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState(""),
    [visible, setVisible] = useState(false),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [error, setError] = useState("");
  const { logout } = useAuth();
  useEffect(() => {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );
    const m = document.createElement("meta");
    m.name = "referrer";
    m.content = "no-referrer";
    document.head.appendChild(m);
    return () => m.remove();
  }, []);
  if (!passwordFlowEnabled())
    return (
      <Frame>
        <Alert severity="info">שחזור סיסמה עדיין אינו זמין.</Alert>
        <Button component={Link} to="/login">
          לכניסה למערכת
        </Button>
      </Frame>
    );
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (password !== confirmation) {
      setError("אימות הסיסמה אינו תואם");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await post("consume", { token, password, confirmation });
      setToken("");
      setDone(true);
    } catch (cause) {
      const status = axios.isAxiosError(cause) ? cause.response?.status : 0;
      const code = axios.isAxiosError(cause) ? cause.response?.data?.code : "";
      setError(
        code === "RESET_LINK_INVALID"
          ? "הקישור אינו תקף, פג תוקפו או שכבר נוצל. בקשו קישור חדש."
          : status === 429
            ? "בוצעו ניסיונות רבים. המתינו ונסו שוב."
            : "בדקו את דרישות הסיסמה ונסו שוב.",
      );
    } finally {
      setPassword("");
      setConfirmation("");
      setBusy(false);
    }
  };
  return (
    <Frame>
      <Stack component="form" gap={2} onSubmit={submit}>
        <Typography component="h1" variant="h5">
          איפוס סיסמה
        </Typography>
        {done ? (
          <Alert severity="success">
            הסיסמה נשמרה. היכנסו מחדש עם תעודת הזהות והסיסמה החדשה.
          </Alert>
        ) : !/^[A-Za-z0-9_-]{43}$/.test(token) ? (
          <Alert severity="error">
            הקישור אינו תקף. פתחו את הקישור המלא מהאימייל.
          </Alert>
        ) : (
          <>
            <Typography>הקישור אישי, חד־פעמי ותקף ל־30 דקות.</Typography>
            <TextField
              required
              label="סיסמה חדשה"
              type={visible ? "text" : "password"}
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{ minLength: 6, maxLength: 128, dir: "ltr" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      aria-label={visible ? "הסתרת סיסמה" : "הצגת סיסמה"}
                      aria-pressed={visible}
                      onClick={() => setVisible((v) => !v)}
                      sx={{ minWidth: 44, minHeight: 44 }}
                    >
                      {visible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              label="אימות סיסמה"
              type={visible ? "text" : "password"}
              value={confirmation}
              autoComplete="new-password"
              onChange={(e) => setConfirmation(e.target.value)}
              inputProps={{ minLength: 6, maxLength: 128, dir: "ltr" }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" type="submit" disabled={busy}>
              שמירת סיסמה חדשה
            </Button>
          </>
        )}
        <Button
          component={Link}
          to="/login"
          onClick={() => {
            if (done) logout();
          }}
        >
          לכניסה למערכת
        </Button>
      </Stack>
    </Frame>
  );
}
