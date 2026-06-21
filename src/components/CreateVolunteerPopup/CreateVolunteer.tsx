import {
  Box,
  Button,
  Dialog,
  IconButton,
  MenuItem,
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
import { getTodayDateInputValue } from "../../utils/data.utillity";
import { SHIRT_SIZE_OPTIONS } from "../../constants/user.constants";

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
    dateOfBirth: "",
    phoneNumber: "",
    gender: "",
    shirtSize: "",
    customShirtSize: "",
    notes: "",
    address: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "shirtSize" && value !== "OTHER"
        ? { customShirtSize: "" }
        : {}),
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

      await userService.createVolunteer({
        ...payload,
        branchId: activeBranch ?? undefined,
      });

      await queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });

      setForm({
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
                label="תאריך לידה"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                name="dateOfBirth"
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: getTodayDateInputValue() }}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
              <TextField
                select
                label="Gender"
                value={form.gender}
                onChange={handleChange}
                name="gender"
                error={!!errors.gender}
                helperText={errors.gender}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              >
                <MenuItem value="male">male</MenuItem>
                <MenuItem value="female">female</MenuItem>
              </TextField>
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
              <TextField
                select
                label="מידת חולצה"
                value={form.shirtSize}
                onChange={handleChange}
                name="shirtSize"
                error={!!errors.shirtSize}
                helperText={errors.shirtSize}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
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
                  value={form.customShirtSize ?? ""}
                  onChange={handleChange}
                  name="customShirtSize"
                  error={!!errors.customShirtSize}
                  helperText={errors.customShirtSize}
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              )}
              <TextField
                label="הערות"
                value={form.notes ?? ""}
                onChange={handleChange}
                name="notes"
                error={!!errors.notes}
                helperText={errors.notes}
                multiline
                minRows={3}
                inputProps={{ maxLength: 2000 }}
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
