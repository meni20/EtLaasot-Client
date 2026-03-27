import {
  Alert,
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import {
  type EventValidationErrors,
  type IEventFormData,
  validateFormEvent,
} from "../../utils/validators.util";
import { useQueryClient } from "@tanstack/react-query";
import type { ICreateEventProps } from "./CreateEvent.interface";
import type { IEvent } from "../../interfaces/event.interface";
import { DatePicker } from "@mui/x-date-pickers";
import eventService from "../../services/event.service";

const createInitialForm = (): IEventFormData => ({
  name: "",
  address: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
});

export const CreateEvent: React.FC<ICreateEventProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<EventValidationErrors>({});
  const [submitError, setSubmitError] = useState("");
  const queryClient = useQueryClient();
  const [form, setForm] = useState<IEventFormData>(createInitialForm());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSubmitError("");
  };

  const handleDateChange = (
    field: "startDate" | "endDate",
    value: Date | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSubmitError("");
  };

  const handleCreateEvent = async () => {
    const validationErrors = validateFormEvent(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!form.startDate || !form.endDate) {
      return;
    }

    const payload: IEvent = {
      ...form,
      name: form.name.trim(),
      address: form.address.trim(),
      description: form.description?.trim() || undefined,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    setLoading(true);
    setSubmitError("");

    try {
      await eventService.createEvent(payload);
      await queryClient.invalidateQueries({ queryKey: ["events"] });
      setForm(createInitialForm());
      setErrors({});
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create event."
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Create Event
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <TextField
                  label={"name"}
                  value={form.name}
                  onChange={handleChange}
                  name="name"
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <DatePicker
                  label="׳×׳׳¨׳™׳ ׳”׳×׳—׳׳”"
                  value={form.startDate}
                  onChange={(newValue) => handleDateChange("startDate", newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startDate,
                      helperText: errors.startDate,
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <TextField
                  label={"address"}
                  value={form.address}
                  onChange={handleChange}
                  name="address"
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <DatePicker
                  label="׳×׳׳¨׳™׳ ׳¡׳™׳•׳"
                  value={form.endDate}
                  onChange={(newValue) => handleDateChange("endDate", newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate,
                    },
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <TextField
                label={"description"}
                value={form.description}
                onChange={handleChange}
                name="description"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCreateEvent} disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
