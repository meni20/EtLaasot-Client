import {
  Box,
  Stack,
  Alert,
  Button,
  Avatar,
  Chip,
  Dialog,
  MenuItem,
  Divider,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "./Row/RowDetails";
import { copy, initials } from "./utilities/data.util";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import userService from "../../services/user.service";
import type { IVolunteerDetailsProps } from "./Volunteer.interface";
import { useVolunteerDetailsStyles } from "./VolunteerDetails.styles";
import type {
  IUpdateUserPayload,
  IUser,
  ShirtSize,
  UserGender,
} from "../../interfaces/user.interface";
import {
  calculateAge,
  formatMaskedNationalId,
  getTodayDateInputValue,
  isValidDateOfBirth,
  isValidIsraeliPhone,
} from "../../utils/data.utillity";
import {
  formatShirtSize,
  SHIRT_SIZE_OPTIONS,
} from "../../constants/user.constants";

type UserDetailsFormState = {
  name: string;
  dateOfBirth: string;
  gender: UserGender | "";
  shirtSize: ShirtSize | "";
  customShirtSize: string;
  notes: string;
  parentName: string;
  phoneNumber: string;
  email: string;
  address: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VolunteerDetails: React.FC<IVolunteerDetailsProps> = ({
  open,
  onClose,
  volunteerData,
  entityLabel = "מתנדב",
  onUserUpdated,
  showParentName = false,
}) => {
  const classes = useVolunteerDetailsStyles();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = React.useState<IUser>(volunteerData);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [form, setForm] = React.useState<UserDetailsFormState>({
    name: "",
    dateOfBirth: "",
    gender: "",
    shirtSize: "",
    customShirtSize: "",
    notes: "",
    parentName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });
  const [formError, setFormError] = React.useState("");

  React.useEffect(() => {
    setSelectedUser(volunteerData);
  }, [volunteerData]);

  const emailHref = selectedUser?.email
    ? `mailto:${selectedUser.email}`
    : undefined;
  const phoneHref = selectedUser?.phoneNumber
    ? `tel:${selectedUser.phoneNumber}`
    : undefined;
  const selectedNationalIdDisplay = formatMaskedNationalId(
    selectedUser?.nationalIdMasked,
    selectedUser?.nationalIdLast4,
  );
  const updateUserMutation = useMutation({
    mutationFn: (payload: IUpdateUserPayload) =>
      userService.updateUser(selectedUser.id, payload),
    onSuccess: async (updatedUser) => {
      setSelectedUser(updatedUser);
      onUserUpdated?.(updatedUser);
      setIsEditOpen(false);
      setFormError("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["volunteers"] }),
        queryClient.invalidateQueries({ queryKey: ["trainees"] }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
    },
    onError: () => {
      setFormError("לא הצלחנו לעדכן את הפרטים");
    },
  });

  const openEditDialog = () => {
    setForm({
      name: selectedUser.name ?? "",
      dateOfBirth: selectedUser.dateOfBirth ?? "",
      gender: selectedUser.gender ?? "",
      shirtSize: selectedUser.shirtSize ?? "",
      customShirtSize: selectedUser.customShirtSize ?? "",
      notes: selectedUser.notes ?? "",
      parentName: selectedUser.parentName ?? "",
      phoneNumber: selectedUser.phoneNumber ?? "",
      email: selectedUser.email ?? "",
      address: selectedUser.address ?? "",
    });
    setFormError("");
    setIsEditOpen(true);
  };

  const closeEditDialog = () => {
    if (updateUserMutation.isPending) return;
    setIsEditOpen(false);
    setFormError("");
  };

  const handleFormChange =
    (field: keyof UserDetailsFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((current) => ({
        ...current,
        [field]: value,
        ...(field === "shirtSize" && value !== "OTHER"
          ? { customShirtSize: "" }
          : {}),
      }));
    };

  const handleSave = () => {
    const name = form.name.trim();
    const phoneNumber = form.phoneNumber.trim();
    const email = form.email.trim();
    const address = form.address.trim();
    const dateOfBirth = form.dateOfBirth.trim();

    if (!name) {
      setFormError("שם הוא שדה חובה");
      return;
    }

    if (!phoneNumber || !isValidIsraeliPhone(phoneNumber)) {
      setFormError("מספר הטלפון אינו תקין");
      return;
    }

    if (email && !EMAIL_PATTERN.test(email)) {
      setFormError("כתובת האימייל אינה תקינה");
      return;
    }

    if (dateOfBirth && !isValidDateOfBirth(dateOfBirth)) {
      setFormError("תאריך הלידה אינו תקין");
      return;
    }

    updateUserMutation.mutate({
      name,
      dateOfBirth: dateOfBirth || null,
      gender: form.gender || null,
      shirtSize: form.shirtSize || null,
      customShirtSize:
        form.shirtSize === "OTHER"
          ? form.customShirtSize.trim() || null
          : null,
      notes: form.notes.trim() || null,
      ...(showParentName
        ? { parentName: form.parentName.trim() || null }
        : {}),
      phoneNumber,
      email: email || null,
      address: address || null,
    });
  };

  if (!open) return null;

  return (
    <>
      <Box
        className={classes.panel}
        role="complementary"
        aria-label={`פרטי ${entityLabel}`}
      >
      <Box className={classes.header}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar className={classes.avatar}>
            {initials(selectedUser?.name)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" className={classes.nameText} noWrap>
              {selectedUser?.name ?? entityLabel}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              className={classes.headerMeta}
            >
              <Typography variant="body2" className={classes.subText} noWrap>
                ת.ז: {selectedNationalIdDisplay}
              </Typography>
              <Chip label="פעיל" size="small" className={classes.statusChip} />
            </Stack>
          </Box>
          <IconButton
            onClick={openEditDialog}
            aria-label={`עריכת פרטי ${entityLabel}`}
            className={classes.closeIconButton}
          >
            <EditRoundedIcon />
          </IconButton>
          <IconButton
            onClick={onClose}
            aria-label={`סגור פרטי ${entityLabel}`}
            className={classes.closeIconButton}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </Box>

      <Box className={classes.content}>
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>פרטים אישיים</Typography>
          <Row
            icon={
              <CakeRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="גיל"
            value={calculateAge(selectedUser?.dateOfBirth, selectedUser?.age) ?? "-"}
          />
          <Divider />
          <Row
            icon={
              <WcRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="Gender"
            value={selectedUser?.gender || "-"}
          />
          <Divider />
          <Row
            icon={
              <CheckroomRoundedIcon
                className={classes.rowIcon}
                fontSize="small"
              />
            }
            label="מידת חולצה"
            value={formatShirtSize(
              selectedUser?.shirtSize,
              selectedUser?.customShirtSize,
            )}
          />
          <Divider />
          <Row
            icon={
              <NotesRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="הערות"
            value={selectedUser?.notes?.trim() || "-"}
          />
          {showParentName && (
            <>
              <Divider />
              <Row
                icon={
                  <FamilyRestroomRoundedIcon
                    className={classes.rowIcon}
                    fontSize="small"
                  />
                }
                label="שם הורה"
                value={selectedUser?.parentName?.trim() || "-"}
              />
            </>
          )}
          <Divider />
          <Row
            icon={
              <BadgeRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="תעודת זהות"
            value={selectedNationalIdDisplay}
          />
        </Box>

        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>פרטי קשר</Typography>
          <Row
            icon={
              <PhoneIphoneRoundedIcon
                className={classes.rowIcon}
                fontSize="small"
              />
            }
            label="טלפון"
            value={selectedUser?.phoneNumber}
            onCopy={
              selectedUser?.phoneNumber
                ? () => copy(selectedUser.phoneNumber)
                : undefined
            }
          />
          <Divider />
          <Row
            icon={
              <EmailRoundedIcon className={classes.rowIcon} fontSize="small" />
            }
            label="אימייל"
            value={selectedUser?.email}
            onCopy={
              selectedUser?.email
                ? () => copy(selectedUser.email!)
                : undefined
            }
          />
          <Divider />
          <Row
            icon={
              <LocationOnRoundedIcon
                className={classes.rowIcon}
                fontSize="small"
              />
            }
            label="כתובת"
            value={selectedUser?.address}
            onCopy={
              selectedUser?.address
                ? () => copy(selectedUser.address)
                : undefined
            }
          />
        </Box>

        <Stack direction="row" spacing={1} className={classes.actionsRow}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<EmailRoundedIcon />}
            disabled={!selectedUser?.email}
            className={classes.buttonContained}
            href={emailHref}
            aria-label={`שליחת אימייל ל${entityLabel}`}
          >
            שליחת אימייל
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PhoneIphoneRoundedIcon />}
            disabled={!selectedUser?.phoneNumber}
            className={classes.buttonOutlined}
            href={phoneHref}
            aria-label={`התקשרות ל${entityLabel}`}
          >
            התקשרות
          </Button>
        </Stack>

        <Button
          onClick={onClose}
          fullWidth
          className={classes.closeButton}
          sx={{ mt: 1.2 }}
        >
          סגור
        </Button>
      </Box>
      </Box>

      <Dialog
        open={isEditOpen}
        onClose={closeEditDialog}
        PaperProps={{
          sx: {
            direction: "rtl",
            minWidth: 420,
            borderRadius: 3,
            fontFamily: "Rubik, sans-serif",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Rubik, sans-serif", fontWeight: 800 }}>
          עריכת פרטי {entityLabel}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              fullWidth
              label="שם"
              value={form.name}
              onChange={handleFormChange("name")}
            />
            {showParentName && (
              <TextField
                fullWidth
                label="שם הורה"
                value={form.parentName}
                onChange={handleFormChange("parentName")}
                inputProps={{ maxLength: 100 }}
              />
            )}
            <TextField
              fullWidth
              label="תאריך לידה"
              type="date"
              value={form.dateOfBirth}
              onChange={handleFormChange("dateOfBirth")}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: getTodayDateInputValue() }}
            />
            <TextField
              select
              fullWidth
              label="Gender"
              value={form.gender}
              onChange={handleFormChange("gender")}
            >
              <MenuItem value="">-</MenuItem>
              <MenuItem value="male">male</MenuItem>
              <MenuItem value="female">female</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="מידת חולצה"
              value={form.shirtSize}
              onChange={handleFormChange("shirtSize")}
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
                fullWidth
                label="מידה אחרת"
                value={form.customShirtSize}
                onChange={handleFormChange("customShirtSize")}
                inputProps={{ maxLength: 50 }}
              />
            )}
            <TextField
              fullWidth
              label="הערות"
              value={form.notes}
              onChange={handleFormChange("notes")}
              multiline
              minRows={4}
              inputProps={{ maxLength: 2000 }}
            />
            <TextField
              fullWidth
              label="טלפון"
              value={form.phoneNumber}
              onChange={handleFormChange("phoneNumber")}
            />
            <TextField
              fullWidth
              label="אימייל"
              type="email"
              value={form.email}
              onChange={handleFormChange("email")}
            />
            <TextField
              fullWidth
              label="כתובת"
              value={form.address}
              onChange={handleFormChange("address")}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeEditDialog} disabled={updateUserMutation.isPending}>
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={updateUserMutation.isPending}
            className={classes.buttonContained}
          >
            {updateUserMutation.isPending ? "שומר..." : "שמירה"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
