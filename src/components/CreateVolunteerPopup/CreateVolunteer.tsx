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
import type { ICreateVolunteerProps } from "./CreateVolunteer.interface";

export const CreateVolunteer: React.FC<ICreateVolunteerProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false)
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
    setLoading(true)
    const payload: IUser = {
      ...form,
      age: Number(form.age),
    };

    await userService.createUser(payload);

    setFrom({
      name: "",
      id: "",
      age: 0,
      phoneNumber: "",
      address: "",
      email: "",
    });
    setLoading(false)
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => { }}>
        Open dialog
      </Button>

      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Create Volunteer
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
              />
              <TextField
                label={"ID"}
                value={form.id}
                onChange={handleChange}
                name="id"
              />
              <TextField
                label={"age"}
                type="number"
                value={form.age}
                onChange={handleChange}
                name="age"
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <TextField
                label={"Phone number"}
                value={form.phoneNumber}
                onChange={handleChange}
                name="phoneNumber"
              />
              <TextField
                label={"address"}
                value={form.address}
                onChange={handleChange}
                name="address"
              />
              <TextField
                label={"Email"}
                value={form.email}
                onChange={handleChange}
                name="email"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCreateVolunteer} disabled={loading}>
            {loading ? "Creating..." : "Create Volunteer"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
