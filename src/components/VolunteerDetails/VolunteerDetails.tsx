import {
  Box,
  Stack,
  Alert,
  Button,
  Avatar,
  Chip,
  Dialog,
  CircularProgress,
  MenuItem,
  Divider,
  Tooltip,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "./Row/RowDetails";
import { copy, initials } from "./utilities/data.util";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import SettingsBackupRestoreRoundedIcon from "@mui/icons-material/SettingsBackupRestoreRounded";
import attendeeService from "../../services/attendee.service";
import userService from "../../services/user.service";
import type { IVolunteerDetailsProps } from "./Volunteer.interface";
import { useVolunteerDetailsStyles } from "./VolunteerDetails.styles";
import { useAuth } from "../../contexts/useAuth";
import { AUTH_ROLES } from "../../constants/auth.const";
import type {
  IUpdateUserPayload,
  IUser,
  ShirtSize,
  UserGender,
} from "../../interfaces/user.interface";
import {
  calculateAge,
  formatDate,
  formatDateTimeShort,
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
const NATIONAL_ID_REVEAL_TIMEOUT_MS = 60_000;

const formatEventTime = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "";

  return `${String(value.getHours()).padStart(2, "0")}:${String(
    value.getMinutes(),
  ).padStart(2, "0")}`;
};

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
  const { user: authUser } = useAuth();
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
  const [revealedNationalId, setRevealedNationalId] = React.useState<
    string | null
  >(null);
  const [nationalIdStatus, setNationalIdStatus] = React.useState("");
  const [isNationalIdPending, setIsNationalIdPending] = React.useState(false);
  const [passwordResetInfo, setPasswordResetInfo] = React.useState<{
    temporaryPassword: string;
    temporaryPasswordExpiresAt: string;
  } | null>(null);
  const [passwordResetError, setPasswordResetError] = React.useState("");
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = React.useState(false);
  const [archiveError, setArchiveError] = React.useState("");
  const [archiveSuccess, setArchiveSuccess] = React.useState("");
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false);
  const [restoreError, setRestoreError] = React.useState("");
  const [restoreSuccess, setRestoreSuccess] = React.useState("");
  const [isRegisteredEventsOpen, setIsRegisteredEventsOpen] =
    React.useState(false);
  const nationalIdClearTimerRef = React.useRef<ReturnType<
    typeof window.setTimeout
  > | null>(null);

  const clearNationalIdTimer = React.useCallback(() => {
    if (!nationalIdClearTimerRef.current) return;
    window.clearTimeout(nationalIdClearTimerRef.current);
    nationalIdClearTimerRef.current = null;
  }, []);

  const clearRevealedNationalId = React.useCallback(() => {
    clearNationalIdTimer();
    setRevealedNationalId(null);
    setNationalIdStatus("");
  }, [clearNationalIdTimer]);

  const scheduleNationalIdClear = React.useCallback(() => {
    clearNationalIdTimer();
    nationalIdClearTimerRef.current = window.setTimeout(() => {
      setRevealedNationalId(null);
      setNationalIdStatus("");
      nationalIdClearTimerRef.current = null;
    }, NATIONAL_ID_REVEAL_TIMEOUT_MS);
  }, [clearNationalIdTimer]);

  React.useEffect(() => {
    setSelectedUser(volunteerData);
    clearRevealedNationalId();
    setPasswordResetInfo(null);
    setPasswordResetError("");
    setIsArchiveDialogOpen(false);
    setArchiveError("");
    setArchiveSuccess("");
    setIsRestoreDialogOpen(false);
    setRestoreError("");
    setRestoreSuccess("");
    setIsRegisteredEventsOpen(false);
  }, [clearRevealedNationalId, volunteerData]);

  React.useEffect(() => {
    if (!open) {
      clearRevealedNationalId();
      setPasswordResetInfo(null);
      setPasswordResetError("");
      setIsArchiveDialogOpen(false);
      setArchiveError("");
      setArchiveSuccess("");
      setIsRestoreDialogOpen(false);
      setRestoreError("");
      setRestoreSuccess("");
      setIsRegisteredEventsOpen(false);
    }
  }, [clearRevealedNationalId, open]);

  React.useEffect(() => () => clearNationalIdTimer(), [clearNationalIdTimer]);

  const emailHref = selectedUser?.email
    ? `mailto:${selectedUser.email}`
    : undefined;
  const phoneHref = selectedUser?.phoneNumber
    ? `tel:${selectedUser.phoneNumber}`
    : undefined;
  const {
    data: registeredEvents = [],
    isLoading: isRegisteredEventsLoading,
    isError: isRegisteredEventsError,
  } = useQuery({
    queryKey: ["registered-events", selectedUser?.id],
    queryFn: () => attendeeService.getRegisteredEventsByUser(selectedUser.id),
    enabled: isRegisteredEventsOpen && !!selectedUser?.id,
  });
  const selectedNationalIdDisplay = formatMaskedNationalId(
    selectedUser?.nationalIdMasked,
    selectedUser?.nationalIdLast4,
  );
  const displayedNationalId = revealedNationalId ?? selectedNationalIdDisplay;
  const canRevealNationalId = React.useMemo(() => {
    if (!authUser || !selectedUser?.nationalIdRevealId) {
      return false;
    }

    return authUser.roles.some(
      (role) =>
        role.roleId === AUTH_ROLES.SUPER_ADMIN.id ||
        (role.roleId === AUTH_ROLES.BRANCH_ADMIN.id &&
          !!selectedUser.branchId &&
          role.branchId === selectedUser.branchId),
    );
  }, [authUser, selectedUser?.branchId, selectedUser?.nationalIdRevealId]);

  const canResetPassword = React.useMemo(() => {
    if (!authUser || !selectedUser?.id) {
      return false;
    }

    return authUser.roles.some(
      (role) =>
        role.roleId === AUTH_ROLES.SUPER_ADMIN.id ||
        (role.roleId === AUTH_ROLES.BRANCH_ADMIN.id &&
          !!selectedUser.branchId &&
          role.branchId === selectedUser.branchId),
    );
  }, [authUser, selectedUser?.branchId, selectedUser?.id]);

  const canArchiveUser = React.useMemo(() => {
    if (!authUser || !selectedUser?.id || selectedUser.isActive === false) {
      return false;
    }

    if (authUser.userId === selectedUser.id) {
      return false;
    }

    const roleIds = selectedUser.userRoles?.map((role) => role.roleId) ?? [];
    const hasAdminRole = roleIds.some(
      (roleId) =>
        roleId === AUTH_ROLES.SUPER_ADMIN.id ||
        roleId === AUTH_ROLES.BRANCH_ADMIN.id,
    );

    if (hasAdminRole) {
      return false;
    }

    const hasArchiveableRole =
      roleIds.length === 0 ||
      roleIds.some(
        (roleId) =>
          roleId === AUTH_ROLES.VOLUNTEER.id ||
          roleId === AUTH_ROLES.TRAINEE.id,
      );

    if (!hasArchiveableRole) {
      return false;
    }

    return authUser.roles.some(
      (role) =>
        role.roleId === AUTH_ROLES.SUPER_ADMIN.id ||
        (role.roleId === AUTH_ROLES.BRANCH_ADMIN.id &&
          !!selectedUser.branchId &&
          role.branchId === selectedUser.branchId),
    );
  }, [
    authUser,
    selectedUser?.branchId,
    selectedUser?.id,
    selectedUser?.isActive,
    selectedUser?.userRoles,
  ]);

  const canRestoreUser = React.useMemo(() => {
    if (!authUser || !selectedUser?.id || selectedUser.isActive !== false) {
      return false;
    }

    if (authUser.userId === selectedUser.id) {
      return false;
    }

    const roleIds = selectedUser.userRoles?.map((role) => role.roleId) ?? [];
    const hasAdminRole = roleIds.some(
      (roleId) =>
        roleId === AUTH_ROLES.SUPER_ADMIN.id ||
        roleId === AUTH_ROLES.BRANCH_ADMIN.id,
    );

    if (hasAdminRole) {
      return false;
    }

    const hasRestorableRole =
      roleIds.length === 0 ||
      roleIds.some(
        (roleId) =>
          roleId === AUTH_ROLES.VOLUNTEER.id ||
          roleId === AUTH_ROLES.TRAINEE.id,
      );

    if (!hasRestorableRole) {
      return false;
    }

    return authUser.roles.some(
      (role) =>
        role.roleId === AUTH_ROLES.SUPER_ADMIN.id ||
        (role.roleId === AUTH_ROLES.BRANCH_ADMIN.id &&
          !!selectedUser.branchId &&
          role.branchId === selectedUser.branchId),
    );
  }, [
    authUser,
    selectedUser?.branchId,
    selectedUser?.id,
    selectedUser?.isActive,
    selectedUser?.userRoles,
  ]);

  const resetPasswordMutation = useMutation({
    mutationFn: () => userService.resetPassword(selectedUser.id),
    onSuccess: (data) => {
      setPasswordResetInfo(data);
      setPasswordResetError("");
    },
    onError: () => {
      setPasswordResetError("לא ניתן לאפס סיסמה למשתמש זה");
    },
  });

  const requestNationalId = React.useCallback(async () => {
    if (!selectedUser?.nationalIdRevealId) {
      setNationalIdStatus("לא ניתן להציג תעודת זהות עבור משתמש זה");
      throw new Error("Missing national ID reveal identifier");
    }

    setIsNationalIdPending(true);
    setNationalIdStatus("");

    try {
      const { nationalId } = await userService.getNationalId(
        selectedUser.nationalIdRevealId,
      );
      return nationalId;
    } catch (error) {
      setNationalIdStatus("אין הרשאה להציג את תעודת הזהות");
      throw error;
    } finally {
      setIsNationalIdPending(false);
    }
  }, [selectedUser?.nationalIdRevealId]);

  const handleRevealNationalId = async () => {
    try {
      const nationalId = await requestNationalId();
      setRevealedNationalId(nationalId);
      scheduleNationalIdClear();
    } catch {}
  };

  const handleCopyNationalId = async () => {
    try {
      const nationalId = revealedNationalId ?? (await requestNationalId());
      await copy(nationalId);
      setNationalIdStatus("תעודת הזהות הועתקה");

      if (revealedNationalId) {
        scheduleNationalIdClear();
      }
    } catch {}
  };

  const handleResetPassword = () => {
    setPasswordResetError("");
    resetPasswordMutation.mutate();
  };

  const handleClosePasswordReset = () => {
    setPasswordResetInfo(null);
    setPasswordResetError("");
  };

  const handleCopyTemporaryPassword = async () => {
    if (!passwordResetInfo) return;
    await copy(passwordResetInfo.temporaryPassword);
  };

  const updateUserMutation = useMutation({
    mutationFn: (payload: IUpdateUserPayload) =>
      userService.updateUser(selectedUser.id, payload),
    onSuccess: async (updatedUser) => {
      const nextUser = {
        ...updatedUser,
        nationalIdRevealId:
          updatedUser.nationalIdRevealId ?? selectedUser.nationalIdRevealId,
      };
      setSelectedUser(nextUser);
      onUserUpdated?.(nextUser);
      clearRevealedNationalId();
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

  const archiveUserMutation = useMutation({
    mutationFn: () => userService.archiveUser(selectedUser.id),
    onSuccess: async (archiveState) => {
      const nextUser = {
        ...selectedUser,
        ...archiveState,
      };
      setSelectedUser(nextUser);
      onUserUpdated?.(nextUser);
      setArchiveError("");
      setArchiveSuccess("המשתמש הוסר מהמערכת");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["volunteers"] }),
        queryClient.invalidateQueries({ queryKey: ["trainees"] }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["mentor-assignments"] }),
        queryClient.invalidateQueries({ queryKey: ["unassigned-trainees"] }),
      ]);
    },
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status === 403) {
        setArchiveError("אין לך הרשאה להסיר משתמש זה");
      } else if (status === 409) {
        setArchiveError("המשתמש כבר הוסר מהמערכת");
      } else {
        setArchiveError("לא הצלחנו להסיר את המשתמש");
      }
    },
  });

  const restoreUserMutation = useMutation({
    mutationFn: () => userService.restoreUser(selectedUser.id),
    onSuccess: async (restoreState) => {
      const nextUser = {
        ...selectedUser,
        ...restoreState,
      };
      setSelectedUser(nextUser);
      onUserUpdated?.(nextUser);
      setRestoreError("");
      setRestoreSuccess("המשתמש הוחזר לפעילות");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["volunteers"] }),
        queryClient.invalidateQueries({ queryKey: ["trainees"] }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["mentor-assignments"] }),
        queryClient.invalidateQueries({ queryKey: ["unassigned-trainees"] }),
      ]);
    },
    onError: (error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;

      if (status === 403) {
        setRestoreError("אין לך הרשאה להחזיר משתמש זה לפעילות");
      } else if (status === 409) {
        setRestoreError("המשתמש כבר פעיל");
      } else {
        setRestoreError("לא הצלחנו להחזיר את המשתמש לפעילות");
      }
    },
  });

  const openArchiveDialog = () => {
    setArchiveError("");
    setArchiveSuccess("");
    setIsArchiveDialogOpen(true);
  };

  const openArchiveDialogFromEdit = () => {
    if (updateUserMutation.isPending) return;
    setIsEditOpen(false);
    openArchiveDialog();
  };

  const closeArchiveDialog = () => {
    if (archiveUserMutation.isPending) return;

    setIsArchiveDialogOpen(false);
    setArchiveError("");

    if (archiveSuccess) {
      handleCloseDetails();
    }
  };

  const handleArchiveUser = () => {
    setArchiveError("");
    archiveUserMutation.mutate();
  };

  const openRestoreDialog = () => {
    setRestoreError("");
    setRestoreSuccess("");
    setIsRestoreDialogOpen(true);
  };

  const closeRestoreDialog = () => {
    if (restoreUserMutation.isPending) return;

    setIsRestoreDialogOpen(false);
    setRestoreError("");

    if (restoreSuccess) {
      handleCloseDetails();
    }
  };

  const handleRestoreUser = () => {
    setRestoreError("");
    restoreUserMutation.mutate();
  };

  const openRegisteredEventsDialog = () => {
    setIsRegisteredEventsOpen(true);
  };

  const closeRegisteredEventsDialog = () => {
    setIsRegisteredEventsOpen(false);
  };

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
        form.shirtSize === "OTHER" ? form.customShirtSize.trim() || null : null,
      notes: form.notes.trim() || null,
      ...(showParentName ? { parentName: form.parentName.trim() || null } : {}),
      phoneNumber,
      email: email || null,
      address: address || null,
    });
  };

  const handleCloseDetails = () => {
    clearRevealedNationalId();
    onClose();
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
              <Chip
                label={entityLabel}
                size="small"
                className={classes.entityChip}
              />
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                className={classes.headerMeta}
              >
                <Typography variant="body2" className={classes.subText} noWrap>
                  ת.ז: {displayedNationalId}
                </Typography>
                {canRevealNationalId && (
                  <Stack
                    direction="row"
                    spacing={0.5}
                    className={classes.nationalIdActions}
                  >
                    <Button
                      size="small"
                      variant="text"
                      className={classes.nationalIdActionButton}
                      onClick={handleRevealNationalId}
                      disabled={isNationalIdPending}
                    >
                      הצג
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      className={classes.nationalIdActionButton}
                      onClick={handleCopyNationalId}
                      disabled={isNationalIdPending}
                    >
                      העתק
                    </Button>
                  </Stack>
                )}
                <Chip
                  label={selectedUser.isActive === false ? "הוסר" : "פעיל"}
                  size="small"
                  className={`${classes.statusChip} ${
                    selectedUser.isActive === false
                      ? classes.archivedStatusChip
                      : ""
                  }`}
                />
              </Stack>
              {nationalIdStatus && (
                <Typography
                  variant="caption"
                  className={classes.nationalIdStatus}
                >
                  {nationalIdStatus}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={openEditDialog}
              aria-label={`עריכת פרטי ${entityLabel}`}
              className={classes.closeIconButton}
            >
              <EditRoundedIcon />
            </IconButton>
            <IconButton
              onClick={handleCloseDetails}
              aria-label={`סגור פרטי ${entityLabel}`}
              className={classes.closeIconButton}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box className={classes.content}>
          <Box className={classes.section}>
            <Typography className={classes.sectionTitle}>
              פרטים אישיים
            </Typography>
            <Row
              icon={
                <CakeRoundedIcon className={classes.rowIcon} fontSize="small" />
              }
              label="גיל"
              value={
                calculateAge(selectedUser?.dateOfBirth, selectedUser?.age) ??
                "-"
              }
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
                <NotesRoundedIcon
                  className={classes.rowIcon}
                  fontSize="small"
                />
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
                <BadgeRoundedIcon
                  className={classes.rowIcon}
                  fontSize="small"
                />
              }
              label="תעודת זהות"
              value={displayedNationalId}
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
                <EmailRoundedIcon
                  className={classes.rowIcon}
                  fontSize="small"
                />
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

          {selectedUser.isActive === false && (
            <Box className={classes.section}>
              <Typography className={classes.sectionTitle}>
                פרטי ארכיון
              </Typography>
              <Row
                icon={
                  <PersonRemoveRoundedIcon
                    className={classes.rowIcon}
                    fontSize="small"
                  />
                }
                label="תאריך הסרה"
                value={
                  selectedUser.archivedAt
                    ? formatDateTimeShort(selectedUser.archivedAt)
                    : "-"
                }
              />
              <Divider />
              <Row
                icon={
                  <NotesRoundedIcon
                    className={classes.rowIcon}
                    fontSize="small"
                  />
                }
                label="סיבת הסרה"
                value={selectedUser.archiveReason?.trim() || "-"}
              />
            </Box>
          )}

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
            fullWidth
            variant="outlined"
            startIcon={<EventAvailableOutlinedIcon />}
            onClick={openRegisteredEventsDialog}
            className={classes.buttonOutlined}
            sx={{ mt: 1.2 }}
          >
            אירועים שנרשם אליהם
          </Button>

          {canResetPassword && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LockResetRoundedIcon />}
              onClick={handleResetPassword}
              disabled={resetPasswordMutation.isPending}
              className={classes.buttonOutlined}
              sx={{ mt: 1.2 }}
            >
              {resetPasswordMutation.isPending
                ? "מאפס סיסמה..."
                : "איפוס סיסמה זמנית"}
            </Button>
          )}
          {passwordResetError && (
            <Alert severity="error" sx={{ mt: 1.2, borderRadius: 2 }}>
              {passwordResetError}
            </Alert>
          )}

          {canRestoreUser && (
            <Box className={classes.dangerSection}>
              <Typography className={classes.dangerSectionTitle}>
                פעולות משתמש
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SettingsBackupRestoreRoundedIcon />}
                onClick={openRestoreDialog}
                className={classes.restoreButton}
              >
                החזרת משתמש לפעילות
              </Button>
            </Box>
          )}

          <Button
            onClick={handleCloseDetails}
            fullWidth
            className={classes.closeButton}
            sx={{ mt: 1.2 }}
          >
            סגור
          </Button>
        </Box>
      </Box>

      <Dialog
        open={isRegisteredEventsOpen}
        onClose={closeRegisteredEventsDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            direction: "rtl",
            borderRadius: 3,
            fontFamily: "Rubik, sans-serif",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Rubik, sans-serif",
            fontWeight: 900,
            color: "#2f2930",
            pb: 1,
          }}
        >
          אירועים שנרשם אליהם
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            {isRegisteredEventsLoading && (
              <Stack alignItems="center" spacing={1.2} sx={{ py: 4 }}>
                <CircularProgress size={28} />
                <Typography sx={{ fontFamily: "Rubik, sans-serif" }}>
                  טוען אירועים...
                </Typography>
              </Stack>
            )}

            {isRegisteredEventsError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                לא הצלחנו לטעון את האירועים
              </Alert>
            )}

            {!isRegisteredEventsLoading &&
              !isRegisteredEventsError &&
              registeredEvents.length === 0 && (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  המשתמש אינו רשום לאירועים
                </Alert>
              )}

            {!isRegisteredEventsLoading &&
              !isRegisteredEventsError &&
              registeredEvents.map(({ attendeeId, event }) => {
                const startDate = new Date(event.startDate);
                const endDate = new Date(event.endDate);
                const isUpcoming = !Number.isNaN(startDate.getTime())
                  ? startDate.getTime() >= Date.now()
                  : false;
                const timeRange = [formatEventTime(event.startDate), formatEventTime(event.endDate)]
                  .filter(Boolean)
                  .join(" - ");
                const locationText =
                  event.branch?.name ||
                  event.address ||
                  event.branch?.city ||
                  event.branch?.address ||
                  "-";

                return (
                  <Box key={attendeeId} className={classes.eventListItem}>
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      spacing={1.5}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography className={classes.eventListTitle}>
                          {event.name}
                        </Typography>
                        <Typography className={classes.eventListMeta}>
                          {formatDate(startDate)}
                          {timeRange ? ` | ${timeRange}` : ""}
                        </Typography>
                        <Typography className={classes.eventListMeta}>
                          {locationText}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={isUpcoming ? "עתידי" : "עבר"}
                        className={`${classes.eventStatusChip} ${
                          isUpcoming ? "" : classes.pastEventStatusChip
                        }`}
                      />
                    </Stack>
                    {!Number.isNaN(endDate.getTime()) && (
                      <Typography className={classes.eventListSecondary}>
                        סיום: {formatDate(endDate)}
                        {formatEventTime(event.endDate)
                          ? ` | ${formatEventTime(event.endDate)}`
                          : ""}
                      </Typography>
                    )}
                  </Box>
                );
              })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={closeRegisteredEventsDialog}
            className={classes.buttonContained}
          >
            סגירה
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!passwordResetInfo}
        onClose={handleClosePasswordReset}
        PaperProps={{
          sx: {
            direction: "rtl",
            minWidth: 380,
            borderRadius: 3,
            fontFamily: "Rubik, sans-serif",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Rubik, sans-serif", fontWeight: 800 }}>
          סיסמה זמנית חדשה
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="success">
              הסיסמה הזמנית מוצגת פעם אחת בלבד. המשתמש יחויב להחליף אותה בכניסה.
            </Alert>
            <TextField
              fullWidth
              label="סיסמה זמנית"
              value={passwordResetInfo?.temporaryPassword ?? ""}
              InputProps={{ readOnly: true }}
            />
            <Button
              variant="outlined"
              startIcon={<ContentCopyRoundedIcon />}
              onClick={handleCopyTemporaryPassword}
              className={classes.buttonOutlined}
            >
              העתקת סיסמה
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleClosePasswordReset}
            className={classes.buttonContained}
          >
            סגירה
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isArchiveDialogOpen}
        onClose={closeArchiveDialog}
        PaperProps={{
          sx: {
            direction: "rtl",
            maxWidth: 460,
            borderRadius: 3,
            fontFamily: "Rubik, sans-serif",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Rubik, sans-serif", fontWeight: 800 }}>
          הסרת משתמש מהמערכת
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {archiveSuccess ? (
              <Alert severity="success">{archiveSuccess}</Alert>
            ) : (
              <Typography sx={{ fontFamily: "Rubik, sans-serif" }}>
                המשתמש לא יוכל להתחבר או להשתמש במערכת. הרשומות ההיסטוריות שלו
                באירועים, שיוכים ודוחות יישמרו. האם אתה בטוח שברצונך להסיר את
                המשתמש מהמערכת?
              </Typography>
            )}
            {archiveError && <Alert severity="error">{archiveError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeArchiveDialog}
            disabled={archiveUserMutation.isPending}
          >
            {archiveSuccess ? "סגירה" : "ביטול"}
          </Button>
          {!archiveSuccess && (
            <Button
              variant="contained"
              color="error"
              onClick={handleArchiveUser}
              disabled={archiveUserMutation.isPending}
            >
              {archiveUserMutation.isPending ? "מסיר..." : "הסר משתמש"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={isRestoreDialogOpen}
        onClose={closeRestoreDialog}
        PaperProps={{
          sx: {
            direction: "rtl",
            maxWidth: 460,
            borderRadius: 3,
            fontFamily: "Rubik, sans-serif",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "Rubik, sans-serif", fontWeight: 800 }}>
          החזרת משתמש לפעילות
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {restoreSuccess ? (
              <Alert severity="success">{restoreSuccess}</Alert>
            ) : (
              <Typography sx={{ fontFamily: "Rubik, sans-serif" }}>
                המשתמש יחזור לרשימות הפעילות ויוכל להתחבר למערכת מחדש. האם אתה
                בטוח שברצונך להחזיר אותו לפעילות?
              </Typography>
            )}
            {restoreError && <Alert severity="error">{restoreError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeRestoreDialog}
            disabled={restoreUserMutation.isPending}
          >
            {restoreSuccess ? "סגירה" : "ביטול"}
          </Button>
          {!restoreSuccess && (
            <Button
              variant="contained"
              onClick={handleRestoreUser}
              disabled={restoreUserMutation.isPending}
              className={classes.buttonContained}
            >
              {restoreUserMutation.isPending
                ? "מחזיר..."
                : "החזר לפעילות"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

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
        <DialogActions
          sx={{ px: 3, pb: 2, justifyContent: "space-between" }}
        >
          <Box>
            {canArchiveUser && (
              <Tooltip title="הסרת משתמש">
                <span>
                  <IconButton
                    aria-label="הסרת משתמש"
                    onClick={openArchiveDialogFromEdit}
                    disabled={updateUserMutation.isPending}
                    className={classes.deleteIconButton}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              onClick={closeEditDialog}
              disabled={updateUserMutation.isPending}
            >
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
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};
