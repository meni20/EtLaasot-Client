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
      return;
    }

    setForm(emptyEventForm());
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

      if (event?.id) {
        await eventService.updateEvent(event.id, payload);
      } else {
        await eventService.createEvent(payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["events"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      setForm(emptyEventForm());
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
            minWidth: 440,
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
        <DialogContent sx={{ padding: "24px", backgroundColor: "#faf8f9" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
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
            <Box sx={{ display: "flex", gap: 2 }}>
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
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ padding: "12px 24px 16px", backgroundColor: "#faf8f9" }}
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
