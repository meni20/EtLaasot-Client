import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useQueryClient } from "@tanstack/react-query";
import {
  validateFormEvent,
  type ValidationErrors,
} from "../../utils/validators.util";
import type { ICreateEventProps } from "./CreateEvent.interface";
import type { IEvent } from "../../interfaces/event.interface";
import eventService from "../../services/event.service";
import { useBranch } from "../../contexts/useBranch";
import { EVENT_TYPES } from "../../constants/auth.const";

const MAX_EVENT_IMAGE_SIZE = 5 * 1024 * 1024;
const EVENT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyEventForm = (): IEvent => ({
  name: "",
  address: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  eventType: "",
});

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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [errorMsg, setErrorMsg] = useState("");
  const queryClient = useQueryClient();
  const { activeBranch } = useBranch();
  const [form, setForm] = useState<IEvent>(emptyEventForm);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        ...event,
        name: event.name ?? "",
        address: event.address ?? "",
        description: event.description ?? "",
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        eventType: event.eventType ?? "",
      });
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setRemoveExistingImage(false);
      return;
    }

    setForm(emptyEventForm());
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setRemoveExistingImage(false);
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
            maxHeight: { xs: "calc(100dvh - 24px)", sm: "calc(100vh - 64px)" },
            direction: "rtl",
            fontFamily: "Rubik, sans-serif",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 18,
            textAlign: "center",
            background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
            color: "#fff",
            padding: "14px 24px",
            fontFamily: "Rubik, sans-serif",
          }}
        >
          {event ? "עריכת אירוע" : "יצירת אירוע"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            left: 8,
            top: 8,
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.15)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.25)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <DialogContent
          sx={{
            padding: { xs: "18px 14px", sm: "24px" },
            backgroundColor: "#faf8f9",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
              <TextField
                label="כתובת"
                value={form.address}
                onChange={handleChange}
                name="address"
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <DateTimePicker
                label="תאריך התחלה"
                value={form.startDate}
                onChange={(newValue) => {
                  if (newValue) setForm({ ...form, startDate: newValue });
                }}
                ampm={false}
                format="dd/MM/yyyy HH:mm"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: 3 } },
                  },
                }}
              />
              <DateTimePicker
                label="תאריך סיום"
                value={form.endDate}
                onChange={(newValue) => {
                  if (newValue) setForm({ ...form, endDate: newValue });
                }}
                ampm={false}
                format="dd/MM/yyyy HH:mm"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { "& .MuiOutlinedInput-root": { borderRadius: 3 } },
                  },
                }}
              />
            </Box>
            <TextField
              label="תיאור"
              value={form.description}
              onChange={handleChange}
              name="description"
              multiline
              rows={3}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              label="סוג אירוע"
              value={form.eventType ?? ""}
              onChange={handleChange}
              name="eventType"
              select
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            >
              {Object.entries(EVENT_TYPES).map(([key, { label, icon }]) => (
                <MenuItem key={key} value={key}>
                  {icon} {label}
                </MenuItem>
              ))}
            </TextField>
            <Box
              sx={{
                border: "1px dashed #d7bfd1",
                borderRadius: 3,
                p: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 14,
                  mb: 1,
                  fontFamily: "Rubik, sans-serif",
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
                    borderRadius: 2,
                    mb: 1.5,
                    backgroundColor: "#F3F4F6",
                  }}
                />
              )}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button component="label" variant="outlined" size="small">
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
                    size="small"
                    onClick={handleRemoveImage}
                  >
                    הסר תמונה
                  </Button>
                )}
              </Box>
              <Typography
                sx={{
                  color: "#6B7280",
                  fontSize: 12,
                  mt: 1,
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                JPEG, PNG או WebP עד 5MB
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: { xs: "10px 14px 14px", sm: "12px 24px 16px" },
            backgroundColor: "#faf8f9",
          }}
        >
          <Button
            onClick={handleCreateEvent}
            disabled={loading || !form.name.trim()}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 3,
              height: 44,
              fontWeight: 700,
              fontSize: 15,
              textTransform: "none",
              fontFamily: "Rubik, sans-serif",
              background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
              boxShadow: "0 4px 14px rgba(154, 81, 136, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #7a3e6b 0%, #5c2d52 100%)",
              },
            }}
          >
            {loading ? "טוען..." : event ? "שמור שינויים" : "צור אירוע"}
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
