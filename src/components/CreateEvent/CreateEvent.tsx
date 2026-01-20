import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import {
  validateFormEvent,
  type ValidationErrors,
} from "../../utils/validators.util";
import { useQueryClient } from "@tanstack/react-query";
import type { ICreateEventProps } from "./CreateEvent.interface";
import type { IEvent } from "../../interfaces/event.interface";
import { DatePicker } from "@mui/x-date-pickers";
import eventService from "../../services/event.service";

export const CreateEvent: React.FC<ICreateEventProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const queryClient = useQueryClient();
  const [form, setFrom] = useState<IEvent>({
    name: "",
    address: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFrom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateEvent = async () => {
    const validationErrors = validateFormEvent(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    await eventService.createEvent(form);

    await queryClient.invalidateQueries({ queryKey: ["events"] });

    setFrom({
      name: "",
      address: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
    });
    setErrors({});
    setLoading(false);
    onClose();
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
            <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <TextField
                  label={"name"}
                  value={form.name}
                  onChange={handleChange}
                  name="name"
                  error={!!errors.name}
                  helperText={errors.id}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <DatePicker
                  label="תאריך התחלה"
                  value={form.startDate}
                  onChange={(newValue) =>
                    setFrom({ ...form, startDate: newValue! })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
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
                  label="תאריך סיום"
                  value={form.endDate}
                  onChange={(newValue) =>
                    setFrom({ ...form, endDate: newValue! })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
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
