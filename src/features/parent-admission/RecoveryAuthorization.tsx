import { useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { createServerAxiosInstance } from "../../config/axiosInstance";
import { passwordFlowEnabled } from "./password-flow";
export function RecoveryAuthorization({
  subjectId,
  subjectType = "IDENTITY",
}: {
  subjectId?: string;
  subjectType?: "USER" | "APPLICATION" | "IDENTITY";
}) {
  const [identifier, setIdentifier] = useState("");
  const [open, setOpen] = useState(false),
    [email, setEmail] = useState(""),
    [verified, setVerified] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  if (!passwordFlowEnabled()) return null;
  const close = () => {
    if (!busy) {
      setOpen(false);
      setIdentifier("");
      setEmail("");
      setVerified(false);
      setMessage("");
    }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>אימות בעלות לשחזור סיסמה</Button>
      <Dialog open={open} onClose={close} dir="rtl" fullWidth>
        <DialogTitle>אימות חד־פעמי לשחזור סיסמה</DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            {!subjectId && (
              <TextField
                label="תעודת זהות הפונה"
                value={identifier}
                onChange={(e) =>
                  setIdentifier(e.target.value.replace(/\D/g, "").slice(0, 9))
                }
                inputProps={{ inputMode: "numeric", maxLength: 9 }}
              />
            )}
            <Alert severity="info">
              יש לאמת את זהות הפונה בערוץ עצמאי לפי נוהל הסניף. הזינו את כתובת
              האימייל הרשומה לאחר שווידאתם שהיא שייכת לו. הפעולה אינה משנה את
              כתובת האימייל ואינה מציגה סיסמה או קישור. בקשה ללא סניף דורשת
              מנהל־על.
            </Alert>
            <TextField
              label="אימייל רשום שאומת מול הפונה"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputProps={{ maxLength: 254, dir: "ltr" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
              }
              label="אימתתי באופן עצמאי את זהות הפונה ואת בעלותו על כתובת האימייל"
            />
            {message && <Alert severity="info">{message}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={close}>
            סגירה
          </Button>
          <Button
            disabled={
              busy ||
              !verified ||
              !email ||
              (!subjectId && identifier.length < 5)
            }
            onClick={() => {
              setBusy(true);
              void createServerAxiosInstance("/password-recovery")
                .post("/authorize", {
                  subjectId: subjectId ?? identifier,
                  subjectType,
                  email,
                  identityVerified: true,
                  emailConfirmed: true,
                })
                .then(() =>
                  setMessage(
                    "האימות נשמר ל־30 דקות. הפונה יכול לבקש קישור דרך שכחתי סיסמה.",
                  ),
                )
                .catch(() =>
                  setMessage(
                    "האימות לא נשמר. בדקו הרשאות ושהכתובת תואמת לאימייל הרשום.",
                  ),
                )
                .finally(() => setBusy(false));
            }}
          >
            אישור בעלות
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
