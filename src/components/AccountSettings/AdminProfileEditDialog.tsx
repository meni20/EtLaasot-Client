import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { SHIRT_SIZE_OPTIONS } from "../../constants/user.constants";
import { useUpdateCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useReloadGuard } from "../../hooks/useReloadGuard";
import type {
  ICurrentUserProfile,
  ShirtSize,
} from "../../interfaces/user.interface";
import { apiErrorMessage } from "../../utils/api-error";
import { decodeUnicodeEscapes } from "../../utils/text.util";

export function AdminProfileEditDialog({
  profile,
  onClose,
  onSaved,
}: {
  profile: ICurrentUserProfile;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(() => ({
    name: decodeUnicodeEscapes(profile.name),
    phoneNumber: profile.phoneNumber ?? "",
    email: profile.email ?? "",
    address: decodeUnicodeEscapes(profile.address),
    shirtSize: profile.shirtSize ?? "",
    customShirtSize: profile.customShirtSize ?? "",
    allergies: decodeUnicodeEscapes(profile.allergies),
  }));
  const [error, setError] = useState("");
  const save = useUpdateCurrentUserProfile();
  // Match the existing mobile editor: defer PWA reloads throughout editing.
  useReloadGuard(true);

  const close = () => {
    if (!save.isPending) onClose();
  };
  const change = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (save.isPending) return;
    if (!form.name.trim() || !form.phoneNumber.trim()) {
      setError("יש למלא שם ומספר טלפון");
      return;
    }
    if (!/^[+\d\s()-]+$/.test(form.phoneNumber.trim())) {
      setError("מספר הטלפון אינו תקין");
      return;
    }
    setError("");
    save.mutate(
      {
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim() || null,
        address: form.address.trim() || null,
        shirtSize: (form.shirtSize || null) as ShirtSize | null,
        customShirtSize:
          form.shirtSize === "OTHER"
            ? form.customShirtSize.trim() || null
            : null,
        allergies: form.allergies.trim() || null,
      },
      {
        onSuccess: onSaved,
        onError: (cause) =>
          setError(
            apiErrorMessage(cause, "לא הצלחנו לשמור את הפרטים. נסו שוב."),
          ),
      },
    );
  };

  return (
    <Dialog
      open
      onClose={close}
      fullWidth
      maxWidth="xs"
      aria-labelledby="admin-profile-edit-title"
      PaperProps={{ sx: { direction: "rtl", borderRadius: "22px" } }}
    >
      <Box component="form" onSubmit={submit} aria-busy={save.isPending}>
        <DialogTitle id="admin-profile-edit-title">עריכת פרטים</DialogTitle>
        <DialogContent>
          <Stack
            component="fieldset"
            disabled={save.isPending}
            spacing={2}
            sx={{ border: 0, m: 0, p: 0, pt: 1, minWidth: 0 }}
          >
            <TextField
              label="שם מלא"
              required
              autoComplete="name"
              value={form.name}
              inputProps={{ maxLength: 120 }}
              onChange={(e) => change("name", e.target.value)}
            />
            <TextField
              label="טלפון"
              required
              type="tel"
              autoComplete="tel"
              value={form.phoneNumber}
              inputProps={{ maxLength: 30 }}
              onChange={(e) => change("phoneNumber", e.target.value)}
            />
            <TextField
              label="אימייל"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
            />
            <TextField
              label="כתובת"
              autoComplete="street-address"
              value={form.address}
              inputProps={{ maxLength: 255 }}
              onChange={(e) => change("address", e.target.value)}
            />
            <TextField
              select
              label="מידת חולצה"
              value={form.shirtSize}
              onChange={(e) => change("shirtSize", e.target.value)}
            >
              <MenuItem value="">-</MenuItem>
              {SHIRT_SIZE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {form.shirtSize === "OTHER" && (
              <TextField
                label="מידה אחרת"
                value={form.customShirtSize}
                inputProps={{ maxLength: 50 }}
                onChange={(e) => change("customShirtSize", e.target.value)}
              />
            )}
            <TextField
              label="אלרגיות"
              multiline
              minRows={2}
              value={form.allergies}
              inputProps={{ maxLength: 1000 }}
              onChange={(e) => change("allergies", e.target.value)}
            />
          </Stack>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={close} disabled={save.isPending}>
            ביטול
          </Button>
          <Button type="submit" variant="contained" disabled={save.isPending}>
            <span role="status">{save.isPending ? "שומר..." : "שמירה"}</span>
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
