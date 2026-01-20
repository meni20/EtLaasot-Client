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
import userService from "../../services/user.service";
import type { IUser } from "../../interfaces/user.interface";
import {
  validateFormVolunteer,
  type ValidationErrors,
} from "../../utils/validators.util";
import { useQueryClient } from "@tanstack/react-query";
import type { ICreateTraineeProps } from "./CreateTrainee.interface";

export const CreateTrainee: React.FC<ICreateTraineeProps> = ({
  open,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const queryClient = useQueryClient();
  const [form, setFrom] = useState<IUser>({
    name: "",
    id: "",
    age: 0,
    phoneNumber: "",
    address: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, valueAsNumber } = e.target;

    setFrom((prev) => ({
      ...prev,
      [name]:
        name === "age"
          ? Number.isNaN(valueAsNumber)
            ? 0
            : valueAsNumber
          : value,
    }));
  };

  const handleCreateVolunteer = async () => {
    const validationErrors = validateFormVolunteer(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload: IUser = {
      ...form,
      age: Number(form.age),
    };

    setLoading(true);

    await userService.createTrainee(payload);

    await queryClient.invalidateQueries({ queryKey: ["trainees"] });

    setFrom({
      name: "",
      id: "",
      age: 0,
      phoneNumber: "",
      address: "",
      email: "",
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
          יצירת חניך
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
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <TextField
                label={"name"}
                value={form.name}
                onChange={handleChange}
                name="name"
                error={!!errors.name}
                helperText={errors.id}
              />
              <TextField
                label={"ID"}
                value={form.id}
                onChange={handleChange}
                name="id"
                error={!!errors.id}
                helperText={errors.id}
              />
              <TextField
                label={"age"}
                type="number"
                value={form.age}
                onChange={handleChange}
                name="age"
                error={!!errors.age}
                helperText={errors.age}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <TextField
                label={"Phone number"}
                value={form.phoneNumber}
                onChange={handleChange}
                name="phoneNumber"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
              <TextField
                label={"address"}
                value={form.address}
                onChange={handleChange}
                name="address"
                error={!!errors.address}
                helperText={errors.address}
              />
              <TextField
                label={"Email"}
                value={form.email}
                onChange={handleChange}
                name="email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCreateVolunteer} disabled={loading}>
            {loading ? "Creating..." : "Create Trainee"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
