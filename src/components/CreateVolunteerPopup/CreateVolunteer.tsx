import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
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
import type { ICreateVolunteerProps } from "./CreateVolunteer.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useBranch } from "../../contexts/useBranch";

export const CreateVolunteer: React.FC<ICreateVolunteerProps> = ({
  open,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [errorMsg, setErrorMsg] = useState<string>("");
  const queryClient = useQueryClient();
  const { activeBranch } = useBranch();
  const [form, setForm] = useState<IUser>({
    name: "",
    id: "",
    age: 0,
    phoneNumber: "",
    address: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, valueAsNumber } = e.target;

    setForm((prev) => ({
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

    try {
      setLoading(true);

      await userService.createVolunteer({
        ...payload,
        branchId: activeBranch ?? undefined,
      });

      await queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      setForm({
        name: "",
        id: "",
        age: 0,
        phoneNumber: "",
        address: "",
        email: "",
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrorMsg("שגיאה ביצירת מתנדב, נסה שוב");
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
            borderRadius: 4,
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
          יצירת מתנדב
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                flex: 1,
              }}
            >
              <TextField
                label="שם מלא"
                value={form.name}
                onChange={handleChange}
                name="name"
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
              <TextField
                label="תעודת זהות"
                value={form.id}
                onChange={handleChange}
                name="id"
                error={!!errors.id}
                helperText={errors.id}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
              <TextField
                label="גיל"
                type="number"
                value={form.age}
                onChange={handleChange}
                name="age"
                error={!!errors.age}
                helperText={errors.age}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                flex: 1,
              }}
            >
              <TextField
                label="טלפון"
                value={form.phoneNumber}
                onChange={handleChange}
                name="phoneNumber"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
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
              <TextField
                label="אימייל"
                value={form.email}
                onChange={handleChange}
                name="email"
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ padding: "12px 24px 16px", backgroundColor: "#faf8f9" }}
        >
          <Button
            onClick={handleCreateVolunteer}
            disabled={loading || !form.name.trim() || !form.id.trim()}
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
            {loading ? "יוצר..." : "צור מתנדב"}
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
