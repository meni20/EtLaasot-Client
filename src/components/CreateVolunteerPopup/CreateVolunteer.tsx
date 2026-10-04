import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useQueryClient } from "@tanstack/react-query";
import userService from "../../services/user.service";
import type { IUser } from "../../interfaces/user.interface";
import {
  validateFormVolunteer,
  type ValidationErrors,
} from "../../utils/validators.util";
import type { ICreateVolunteerProps } from "./CreateVolunteer.interface";
import { useBranch } from "../../contexts/useBranch";
import { getTodayDateInputValue } from "../../utils/data.utillity";
import { SHIRT_SIZE_OPTIONS } from "../../constants/user.constants";

const INITIAL_FORM: IUser = {
  name: "",
  id: "",
  dateOfBirth: "",
  phoneNumber: "",
  gender: "",
  shirtSize: "",
  customShirtSize: "",
  notes: "",
  address: "",
  email: "",
};

const helperCopy: Partial<Record<keyof IUser, string>> = {
  name: "שם פרטי ומשפחה כפי שיופיע במערכת",
  id: "9 ספרות, ללא מקפים",
  dateOfBirth: "לא ניתן לבחור תאריך עתידי",
  gender: "בחירה זו נשמרת כערך מערכת קיים",
  phoneNumber: "מספר ישראלי תקין",
  address: "רחוב, מספר ועיר",
  email: "אופציונלי, למשל name@example.com",
  shirtSize: "אופציונלי",
  customShirtSize: "עד 50 תווים",
  notes: "מידע פנימי לצוות, עד 2000 תווים",
};

const errorCopy: Partial<Record<keyof IUser, string>> = {
  name: "יש להזין שם מלא",
  id: "תעודת הזהות אינה תקינה",
  phoneNumber: "מספר הטלפון אינו תקין",
  gender: "יש לבחור מגדר",
  dateOfBirth: "יש להזין תאריך לידה תקין",
  customShirtSize: "מידה אחרת יכולה להכיל עד 50 תווים",
  notes: "הערות יכולות להכיל עד 2000 תווים",
  parentName: "שם הורה יכול להכיל עד 100 תווים",
  email: "כתובת האימייל אינה תקינה",
};

const dialogPaperSx = {
  borderRadius: { xs: "22px 22px 0 0", sm: 4 },
  overflow: "hidden",
  width: { xs: "100%", sm: 680 },
  minWidth: { xs: "100%", sm: 520 },
  maxWidth: { xs: "100%", sm: 680 },
  maxHeight: { xs: "92dvh", sm: "calc(100dvh - 64px)" },
  m: { xs: "auto 0 0", sm: 3 },
  direction: "rtl",
  textAlign: "start",
  fontFamily: "inherit",
  backgroundColor: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(22px) saturate(170%)",
  border: "1px solid rgba(255,255,255,0.7)",
  boxShadow: "0 22px 70px rgba(31, 31, 35, 0.2)",
  "@media (prefers-reduced-transparency: reduce), (prefers-contrast: more)": {
    backgroundColor: "#fff",
    backdropFilter: "none",
    borderColor: "#d6c8d3",
  },
};

const fieldSx = {
  direction: "rtl",
  textAlign: "start",
  "& .MuiOutlinedInput-root": {
    minHeight: 44,
    borderRadius: 3,
    backgroundColor: "#fff",
    direction: "rtl",
  },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    direction: "rtl",
    textAlign: "start",
  },
  "& .MuiFormHelperText-root": {
    mx: 0,
    direction: "rtl",
    textAlign: "start",
  },
};

const menuProps = {
  PaperProps: { dir: "rtl", sx: { direction: "rtl", textAlign: "start" } },
  MenuListProps: {
    dir: "rtl",
    sx: {
      direction: "rtl",
      textAlign: "start",
      "& .MuiMenuItem-root": {
        justifyContent: "flex-start",
        direction: "rtl",
        textAlign: "start",
        minHeight: 44,
      },
    },
  },
};

export const CreateVolunteer: React.FC<ICreateVolunteerProps> = ({
  open,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [temporaryPasswordInfo, setTemporaryPasswordInfo] = useState<{
    temporaryPassword: string;
    temporaryPasswordExpiresAt: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const { activeBranch } = useBranch();
  const [form, setForm] = useState<IUser>(INITIAL_FORM);

  const fieldHelper = (field: keyof IUser) =>
    errors[field] ? errorCopy[field] || errors[field] : helperCopy[field];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof IUser;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "shirtSize" && value !== "OTHER"
        ? { customShirtSize: "" }
        : {}),
    }));
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  const handleCreateVolunteer = async () => {
    const validationErrors = validateFormVolunteer(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: IUser = {
      ...form,
      email: form.email?.trim() || null,
      shirtSize: form.shirtSize || null,
      customShirtSize:
        form.shirtSize === "OTHER"
          ? form.customShirtSize?.trim() || null
          : null,
      notes: form.notes?.trim() || null,
    };

    try {
      setLoading(true);
      setErrorMsg("");

      const createdUser = await userService.createVolunteer({
        ...payload,
        branchId: activeBranch ?? undefined,
      });

      await queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });

      setForm(INITIAL_FORM);
      setErrors({});
      setTemporaryPasswordInfo({
        temporaryPassword: createdUser.temporaryPassword,
        temporaryPasswordExpiresAt: createdUser.temporaryPasswordExpiresAt,
      });
    } catch {
      setErrorMsg("שגיאה ביצירת מתנדב, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTemporaryPasswordInfo(null);
    onClose();
  };

  const copyTemporaryPassword = async () => {
    if (!temporaryPasswordInfo) return;
    await navigator.clipboard.writeText(temporaryPasswordInfo.temporaryPassword);
  };

  return (
    <React.Fragment>
      <Dialog
        dir="rtl"
        open={open}
        onClose={handleClose}
        PaperProps={{ dir: "rtl", sx: dialogPaperSx }}
        aria-labelledby="create-volunteer-title"
      >
        <DialogTitle
          id="create-volunteer-title"
          sx={{
            px: { xs: 2.25, sm: 3 },
            py: 2,
            color: "#1f1f23",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,248,250,0.84) 100%)",
            borderBottom: "1px solid #e6e1e6",
            fontFamily: "inherit",
            direction: "rtl",
            textAlign: "start",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ direction: "rtl" }}>
            <Box sx={{ minWidth: 0, flex: 1 }} style={{ textAlign: "right" }}>
              <Typography sx={{ fontWeight: 900, fontSize: 20 }}>
                יצירת מתנדב
              </Typography>
              <Typography sx={{ mt: 0.5, color: "#6d6670", fontSize: 13 }}>
                פרטים בסיסיים, קשר והערות לצוות
              </Typography>
            </Box>
            <IconButton
              aria-label="סגירת יצירת מתנדב"
              onClick={handleClose}
              sx={{
                width: 44,
                height: 44,
                color: "var(--color-primary)",
                border: "1px solid #e6e1e6",
                backgroundColor: "rgba(255,255,255,0.82)",
                "&:hover": { backgroundColor: "#efe5ed" },
                "&:active": { transform: "scale(0.96)" },
                "@media (prefers-reduced-motion: reduce)": {
                  "&:active": { transform: "none" },
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            backgroundColor: "#f7f8fa",
            direction: "rtl",
            textAlign: "start",
            "& .MuiInputLabel-root": {
              fontFamily: "inherit",
              direction: "rtl",
              textAlign: "start",
            },
          }}
        >
          {temporaryPasswordInfo ? (
            <Stack spacing={2} sx={{ direction: "rtl", textAlign: "start" }}>
              <Alert
                severity="success"
                sx={{
                  borderRadius: 3,
                  direction: "rtl",
                  textAlign: "start",
                  "& .MuiAlert-message": { width: "100%", textAlign: "start" },
                }}
              >
                המשתמש נוצר. הסיסמה הזמנית מוצגת פעם אחת בלבד.
              </Alert>
              <TextField
                label="סיסמה זמנית"
                value={temporaryPasswordInfo.temporaryPassword}
                InputProps={{ readOnly: true }}
                fullWidth
                sx={fieldSx}
              />
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={copyTemporaryPassword}
                sx={{
                  minHeight: 44,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontFamily: "inherit",
                  color: "var(--color-primary)",
                  borderColor: "#d6c8d3",
                  backgroundColor: "#fff",
                }}
              >
                העתקת סיסמה זמנית
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2.5} sx={{ direction: "rtl", textAlign: "start" }}>
              <Box>
                <Typography
                  sx={{ fontWeight: 900, color: "var(--color-primary)", mb: 1 }}
                  style={{ textAlign: "right" }}
                >
                  פרטי זיהוי
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <TextField
                    required
                    label="שם מלא"
                    value={form.name}
                    onChange={handleChange}
                    name="name"
                    autoComplete="name"
                    error={!!errors.name}
                    helperText={fieldHelper("name")}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    required
                    label="תעודת זהות"
                    value={form.id}
                    onChange={handleChange}
                    name="id"
                    autoComplete="username"
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    error={!!errors.id}
                    helperText={fieldHelper("id")}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    required
                    label="תאריך לידה"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    name="dateOfBirth"
                    autoComplete="bday"
                    error={!!errors.dateOfBirth}
                    helperText={fieldHelper("dateOfBirth")}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: getTodayDateInputValue() }}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    required
                    select
                    label="מגדר"
                    value={form.gender}
                    onChange={handleChange}
                    name="gender"
                    error={!!errors.gender}
                    helperText={fieldHelper("gender")}
                    fullWidth
                    sx={fieldSx}
                    SelectProps={{ MenuProps: menuProps }}
                  >
                    <MenuItem value="male">זכר</MenuItem>
                    <MenuItem value="female">נקבה</MenuItem>
                  </TextField>
                </Box>
              </Box>

              <Box>
                <Typography
                  sx={{ fontWeight: 900, color: "var(--color-primary)", mb: 1 }}
                  style={{ textAlign: "right" }}
                >
                  פרטי קשר
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <TextField
                    required
                    label="טלפון"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    inputProps={{ inputMode: "tel" }}
                    error={!!errors.phoneNumber}
                    helperText={fieldHelper("phoneNumber")}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    label="אימייל"
                    value={form.email}
                    onChange={handleChange}
                    name="email"
                    type="email"
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={fieldHelper("email")}
                    fullWidth
                    sx={fieldSx}
                  />
                  <TextField
                    label="כתובת"
                    value={form.address}
                    onChange={handleChange}
                    name="address"
                    autoComplete="street-address"
                    error={!!errors.address}
                    helperText={fieldHelper("address")}
                    fullWidth
                    sx={{
                      ...fieldSx,
                      gridColumn: { xs: "auto", sm: "1 / -1" },
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography
                  sx={{ fontWeight: 900, color: "var(--color-primary)", mb: 1 }}
                  style={{ textAlign: "right" }}
                >
                  פרטים נוספים
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <TextField
                    select
                    label="מידת חולצה"
                    value={form.shirtSize}
                    onChange={handleChange}
                    name="shirtSize"
                    error={!!errors.shirtSize}
                    helperText={fieldHelper("shirtSize")}
                    fullWidth
                    sx={fieldSx}
                    SelectProps={{ MenuProps: menuProps }}
                  >
                    <MenuItem value="">לא צוין</MenuItem>
                    {SHIRT_SIZE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  {form.shirtSize === "OTHER" && (
                    <TextField
                      label="מידה אחרת"
                      value={form.customShirtSize ?? ""}
                      onChange={handleChange}
                      name="customShirtSize"
                      error={!!errors.customShirtSize}
                      helperText={fieldHelper("customShirtSize")}
                      inputProps={{ maxLength: 50 }}
                      fullWidth
                      sx={fieldSx}
                    />
                  )}
                  <TextField
                    label="הערות"
                    value={form.notes ?? ""}
                    onChange={handleChange}
                    name="notes"
                    error={!!errors.notes}
                    helperText={fieldHelper("notes")}
                    multiline
                    minRows={3}
                    inputProps={{ maxLength: 2000 }}
                    fullWidth
                    sx={{
                      ...fieldSx,
                      gridColumn: { xs: "auto", sm: "1 / -1" },
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: { xs: 2, sm: 3 },
            pt: { xs: 1, sm: 1.5 },
            backgroundColor: "#f7f8fa",
            borderTop: "1px solid #e6e1e6",
            direction: "rtl",
          }}
        >
          {temporaryPasswordInfo ? (
            <Button
              onClick={handleClose}
              variant="contained"
              fullWidth
              sx={{
                minHeight: 44,
                borderRadius: 3,
                fontWeight: 800,
                textTransform: "none",
                fontFamily: "inherit",
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
              }}
            >
              סגירה
            </Button>
          ) : (
            <Button
              onClick={handleCreateVolunteer}
              disabled={
                loading ||
                !form.name.trim() ||
                !form.id.trim() ||
                !form.dateOfBirth ||
                !form.gender
              }
              variant="contained"
              fullWidth
              sx={{
                minHeight: 44,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: 15,
                textTransform: "none",
                fontFamily: "inherit",
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
                boxShadow: "0 10px 24px rgba(var(--color-primary-rgb), 0.22)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, var(--color-primary-pressed) 0%, var(--color-primary-dark) 100%)",
                },
                "&:active": { transform: "scale(0.985)" },
                "@media (prefers-reduced-motion: reduce)": {
                  "&:active": { transform: "none" },
                },
              }}
            >
              {loading ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={18} color="inherit" />
                  <span>יוצר...</span>
                </Stack>
              ) : (
                "צור מתנדב"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
      >
        <Alert
          severity="error"
          onClose={() => setErrorMsg("")}
          sx={{
            width: "100%",
            borderRadius: 3,
            direction: "rtl",
            textAlign: "start",
            "& .MuiAlert-message": { width: "100%", textAlign: "start" },
          }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
