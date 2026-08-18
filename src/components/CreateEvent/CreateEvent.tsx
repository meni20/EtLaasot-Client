import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  FormControlLabel,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useQueryClient } from "@tanstack/react-query";
import {
  validateFormEvent,
  type EventValidationErrors,
} from "../../utils/validators.util";
import type { ICreateEventProps } from "./CreateEvent.interface";
import type { IEvent } from "../../interfaces/event.interface";
import eventService from "../../services/event.service";
import { useBranch } from "../../contexts/useBranch";
import { EVENT_TYPES } from "../../constants/auth.const";

const MAX_EVENT_IMAGE_SIZE = 5 * 1024 * 1024;
const EVENT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const PICKER_TEXT_FIELD_SX = {
  "& .MuiOutlinedInput-root, & .MuiPickersInputBase-root": {
    borderRadius: 2.5,
    minHeight: 48,
  },
} as const;

const isValidDate = (value: Date | null | undefined): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

const isSameCalendarDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const mergeDateAndTime = (date: Date, time: Date) => {
  const merged = new Date(date);
  merged.setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds(),
  );
  return merged;
};

const getDefaultEventTimes = () => {
  const startDate = new Date();
  startDate.setSeconds(0, 0);
  const minutesUntilNextHalfHour = 30 - (startDate.getMinutes() % 30);
  startDate.setMinutes(startDate.getMinutes() + minutesUntilNextHalfHour);

  return {
    startDate,
    endDate: new Date(startDate.getTime() + 60 * 60 * 1000),
  };
};

const emptyEventForm = (): IEvent => {
  const { startDate, endDate } = getDefaultEventTimes();

  return {
    name: "",
    address: "",
    description: "",
    startDate,
    endDate,
    eventType: "",
  };
};

const toEventPayload = (form: IEvent, branchId: string | null): IEvent => ({
  name: form.name,
  address: form.address,
  description: form.description,
  startDate: form.startDate,
  endDate: form.endDate,
  eventType: form.eventType,
  branchId: branchId ?? undefined,
});

export const CreateEvent: React.FC<ICreateEventProps> = ({
  open,
  onClose,
  event,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<EventValidationErrors>({});
  const [errorMsg, setErrorMsg] = useState("");
  const queryClient = useQueryClient();
  const { activeBranch } = useBranch();
  const [form, setForm] = useState<IEvent>(emptyEventForm);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [endsOnDifferentDay, setEndsOnDifferentDay] = useState(false);

  useEffect(() => {
    setErrors({});

    if (event) {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      setForm({
        ...event,
        name: event.name ?? "",
        address: event.address ?? "",
        description: event.description ?? "",
        startDate,
        endDate,
        eventType: event.eventType ?? "",
      });
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setRemoveExistingImage(false);
      setEndsOnDifferentDay(
        isValidDate(startDate) &&
          isValidDate(endDate) &&
          !isSameCalendarDay(startDate, endDate),
      );
      return;
    }

    setForm(emptyEventForm());
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setRemoveExistingImage(false);
    setEndsOnDifferentDay(false);
  }, [event, open]);

  useEffect(() => {
    if (!selectedImageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(selectedImageFile);
    setImagePreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [selectedImageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) {
      return;
    }

    if (!EVENT_IMAGE_TYPES.includes(file.type)) {
      setErrorMsg("ניתן להעלות תמונת JPEG, PNG או WebP בלבד");
      return;
    }

    if (file.size > MAX_EVENT_IMAGE_SIZE) {
      setErrorMsg("גודל התמונה חייב להיות עד 5MB");
      return;
    }

    setSelectedImageFile(file);
    setRemoveExistingImage(false);
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setRemoveExistingImage(true);
  };

  const handleEventDateChange = (newValue: Date | null) => {
    if (!newValue) return;

    setForm((current) => {
      if (!isValidDate(newValue) || !isValidDate(current.startDate)) {
        return { ...current, startDate: newValue };
      }

      const startDate = mergeDateAndTime(newValue, current.startDate);
      const endDate =
        !endsOnDifferentDay && isValidDate(current.endDate)
          ? mergeDateAndTime(newValue, current.endDate)
          : current.endDate;

      return { ...current, startDate, endDate };
    });
  };

  const handleEndDateChange = (newValue: Date | null) => {
    if (!newValue) return;

    setForm((current) => ({
      ...current,
      endDate:
        isValidDate(newValue) && isValidDate(current.endDate)
          ? mergeDateAndTime(newValue, current.endDate)
          : newValue,
    }));
  };

  const handleStartTimeChange = (newValue: Date | null) => {
    if (!newValue) return;

    setForm((current) => ({
      ...current,
      startDate:
        isValidDate(newValue) && isValidDate(current.startDate)
          ? mergeDateAndTime(current.startDate, newValue)
          : newValue,
    }));
  };

  const handleEndTimeChange = (newValue: Date | null) => {
    if (!newValue) return;

    setForm((current) => ({
      ...current,
      endDate:
        isValidDate(newValue) && isValidDate(current.endDate)
          ? mergeDateAndTime(current.endDate, newValue)
          : newValue,
    }));
  };

  const handleDifferentDayChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setEndsOnDifferentDay(checked);

    setForm((current) => {
      if (!isValidDate(current.startDate) || !isValidDate(current.endDate)) {
        return current;
      }

      if (checked) {
        const endDate = new Date(current.endDate);
        if (isSameCalendarDay(current.startDate, endDate)) {
          endDate.setDate(endDate.getDate() + 1);
        }
        return { ...current, endDate };
      }

      let endDate = mergeDateAndTime(current.startDate, current.endDate);
      if (endDate <= current.startDate) {
        endDate = new Date(current.startDate.getTime() + 60 * 60 * 1000);
      }
      return { ...current, endDate };
    });
  };

  const startDateIsValid = isValidDate(form.startDate);
  const endDateIsValid = isValidDate(form.endDate);
  const endIsAfterStart =
    startDateIsValid &&
    endDateIsValid &&
    form.endDate.getTime() > form.startDate.getTime();
  const dateTimeIsValid =
    startDateIsValid && endDateIsValid && endIsAfterStart;
  const endTimeError = !endDateIsValid
    ? "יש לבחור שעת סיום תקינה"
    : !endIsAfterStart
      ? "שעת הסיום חייבת להיות מאוחרת משעת ההתחלה"
      : "";

  const handleCreateEvent = async () => {
    const validationErrors = validateFormEvent(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = toEventPayload(form, activeBranch);
      let savedEvent: IEvent;

      if (event?.id) {
        savedEvent = await eventService.updateEvent(event.id, payload);
      } else {
        savedEvent = await eventService.createEvent(payload);
      }

      const eventId = event?.id ?? savedEvent.id;

      if (event?.id && eventId && removeExistingImage && !selectedImageFile) {
        await eventService.removeEventImage(eventId);
      }

      if (eventId && selectedImageFile) {
        await eventService.uploadEventImage(eventId, selectedImageFile);
      }

      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      setForm(emptyEventForm());
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setRemoveExistingImage(false);
      setErrors({});
      onClose();
    } catch {
      setErrorMsg(
        event
          ? "שגיאה בעריכת אירוע, נסה שוב"
          : "שגיאה ביצירת אירוע, נסה שוב",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            overflow: "hidden",
            minWidth: { xs: "calc(100vw - 24px)", sm: 440 },
            maxWidth: { xs: "calc(100vw - 24px)", sm: 560 },
            maxHeight: { xs: "calc(100dvh - 24px)", sm: "calc(100dvh - 64px)" },
            direction: "rtl",
            fontFamily: (theme) => theme.typography.fontFamily,
            background: (theme) =>
              `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          },
        }}
      >
        <DialogTitle
          sx={{
            pr: { xs: 5, sm: 6 },
            pl: { xs: 7, sm: 8 },
            pt: 5,
            pb: 2,
            fontWeight: 800,
            fontSize: { xs: 20, sm: 22 },
            lineHeight: 1.25,
            color: "text.primary",
          }}
        >
          {event ? "עריכת אירוע" : "יצירת אירוע"}
          <Typography
            component="span"
            sx={{
              display: "block",
              mt: 0.75,
              color: "text.secondary",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            פרטים, זמן ותמונה במקום אחד
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="סגירת חלון יצירת אירוע"
          onClick={onClose}
          disabled={loading}
          sx={{
            position: "absolute",
            left: 12,
            top: 14,
            color: "text.secondary",
            backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.06),
            "&:hover": {
              backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.1),
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <DialogContent
          sx={{
            px: { xs: 3.5, sm: 6 },
            py: { xs: 3, sm: 4 },
            backgroundColor: "transparent",
          }}
        >
          <Box dir="rtl" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 4,
                p: { xs: 2.5, sm: 3 },
                backgroundColor: "background.paper",
                boxShadow: (theme) => theme.shadows[0],
              }}
            >
              <Typography
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  fontSize: 14,
                  color: "text.primary",
                }}
              >
                פרטי האירוע
              </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <TextField
                label="שם אירוע"
                value={form.name}
                onChange={handleChange}
                name="name"
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                autoFocus
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
              <TextField
                label="כתובת"
                value={form.address}
                onChange={handleChange}
                name="address"
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
            </Box>
            <TextField
              label="סוג אירוע"
              value={form.eventType ?? ""}
              onChange={handleChange}
              name="eventType"
              select
              fullWidth
              sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            >
              {Object.entries(EVENT_TYPES).map(([key, { label, icon }]) => (
                <MenuItem key={key} value={key}>
                  {icon} {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="תיאור"
              value={form.description}
              onChange={handleChange}
              name="description"
              multiline
              rows={3}
              fullWidth
              sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
            </Box>

            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 4,
                p: { xs: 2.5, sm: 3 },
                backgroundColor: "background.paper",
              }}
            >
              <Typography
                sx={{
                  mb: 2,
                  fontWeight: 800,
                  fontSize: 14,
                  color: "text.primary",
                }}
              >
                מועד
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    sm: endsOnDifferentDay
                      ? "repeat(2, minmax(0, 1fr))"
                      : "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                  minWidth: 0,
                }}
              >
              <DatePicker
                label="תאריך האירוע"
                value={form.startDate}
                onChange={handleEventDateChange}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !startDateIsValid,
                    helperText: !startDateIsValid
                      ? "יש לבחור תאריך תקין"
                      : undefined,
                    sx: PICKER_TEXT_FIELD_SX,
                  },
                }}
              />
              {endsOnDifferentDay && (
                <DatePicker
                  label="תאריך סיום"
                  value={form.endDate}
                  onChange={handleEndDateChange}
                  minDate={startDateIsValid ? form.startDate : undefined}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !endDateIsValid,
                      helperText: !endDateIsValid
                        ? "יש לבחור תאריך סיום תקין"
                        : undefined,
                      sx: PICKER_TEXT_FIELD_SX,
                    },
                  }}
                />
              )}
              <TimePicker
                label="שעת התחלה"
                value={form.startDate}
                onChange={handleStartTimeChange}
                ampm={false}
                format="HH:mm"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !startDateIsValid,
                    helperText: !startDateIsValid
                      ? "יש לבחור שעת התחלה תקינה"
                      : undefined,
                    sx: PICKER_TEXT_FIELD_SX,
                  },
                }}
              />
              <TimePicker
                label="שעת סיום"
                value={form.endDate}
                onChange={handleEndTimeChange}
                minTime={
                  !endsOnDifferentDay && startDateIsValid
                    ? form.startDate
                    : undefined
                }
                ampm={false}
                format="HH:mm"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!endTimeError,
                    helperText: endTimeError || undefined,
                    sx: PICKER_TEXT_FIELD_SX,
                  },
                }}
              />
              </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={endsOnDifferentDay}
                  onChange={handleDifferentDayChange}
                  sx={{ p: 1.25 }}
                />
              }
              label="האירוע מסתיים ביום אחר"
              sx={{
                mt: 1.5,
                m: 0,
                alignSelf: "flex-start",
                "& .MuiFormControlLabel-label": {
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontSize: 14,
                },
              }}
            />
            {!dateTimeIsValid && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                יש להשלים תאריך ושעות תקינים לפני שמירה.
              </Alert>
            )}
            </Box>

            <Box
              sx={{
                border: "1px dashed",
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.35),
                borderRadius: 4,
                p: { xs: 2.5, sm: 3 },
                backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.38),
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 14,
                  mb: 1,
                  color: "text.primary",
                }}
              >
                תמונת אירוע
              </Typography>
              {(imagePreviewUrl || (event?.imageUrl && !removeExistingImage)) && (
                <Box
                  component="img"
                  src={imagePreviewUrl ?? event?.imageUrl ?? ""}
                  alt={form.name || "תמונת אירוע"}
                  sx={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 3,
                    mb: 2,
                    backgroundColor: "background.default",
                  }}
                />
              )}
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Button component="label" variant="outlined">
                  בחר תמונה
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                {(selectedImageFile ||
                  (event?.imagePath && !removeExistingImage)) && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={handleRemoveImage}
                  >
                    הסר תמונה
                  </Button>
                )}
              </Box>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 12,
                  mt: 1,
                }}
              >
                JPEG, PNG או WebP עד 5MB
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 3.5, sm: 6 },
            pt: 1,
            pb: { xs: 3.5, sm: 5 },
            backgroundColor: "transparent",
          }}
        >
          <Button
            onClick={handleCreateEvent}
            disabled={loading || !form.name.trim() || !dateTimeIsValid}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 3,
              minHeight: 48,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : event ? (
              "שמור שינויים"
            ) : (
              "צור אירוע"
            )}
          </Button>
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
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
