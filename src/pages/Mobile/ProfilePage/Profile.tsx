import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LogoutIcon from "@mui/icons-material/Logout";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import LockResetIcon from "@mui/icons-material/LockReset";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth";
import { useBranch } from "../../../contexts/useBranch";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import { AUTH_ROLES } from "../../../constants/auth.const";
import {
  formatShirtSize,
  SHIRT_SIZE_OPTIONS,
} from "../../../constants/user.constants";
import { calculateAge, formatDate } from "../../../utils/data.utillity";
import { decodeUnicodeEscapes } from "../../../utils/text.util";
import {
  getNewPasswordValidationError,
  getPasswordChangeErrorMessage,
  normalizeNewPassword,
  PASSWORD_POLICY_MESSAGE,
} from "../../../utils/password.util";
import { TraineeMedicationsSection } from "../../../components/VolunteerDetails/TraineeMedicationsSection";
import {
  useCurrentUserProfile,
  useUpdateCurrentUserProfile,
} from "../../../hooks/useCurrentUserProfile";
import { useStyles } from "./Profile.styles";
import type { IMentorAssignment } from "../../../interfaces/event.interface";
import type { ShirtSize } from "../../../interfaces/user.interface";

const ROLE_LABELS: Record<number, string> = {
  [AUTH_ROLES.SUPER_ADMIN.id]: "מנהל על",
  [AUTH_ROLES.BRANCH_ADMIN.id]: "מנהל סניף",
  [AUTH_ROLES.VOLUNTEER.id]: "מתנדב/ת",
  [AUTH_ROLES.TRAINEE.id]: "חניך",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d\s()-]*$/;

type ProfileFormState = {
  email: string;
  phoneNumber: string;
  address: string;
  shirtSize: ShirtSize | "";
  customShirtSize: string;
  allergies: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordFieldName = keyof PasswordFormState;

const INITIAL_PASSWORD_FORM: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const ProfilePage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { user, logout, changePassword } = useAuth();
  const { activeBranch, availableBranches } = useBranch();
  const [selectedAssignment, setSelectedAssignment] =
    useState<IMentorAssignment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    email: "",
    phoneNumber: "",
    address: "",
    shirtSize: "",
    customShirtSize: "",
    allergies: "",
  });
  const [formError, setFormError] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(
    INITIAL_PASSWORD_FORM,
  );
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [visiblePasswordFields, setVisiblePasswordFields] = useState<
    Record<PasswordFieldName, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const isVolunteer = user?.roles?.some(
    (role) => role.roleId === AUTH_ROLES.VOLUNTEER.id,
  );
  const isTrainee = user?.roles?.some(
    (role) => role.roleId === AUTH_ROLES.TRAINEE.id,
  );

  const {
    data: currentProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useCurrentUserProfile();

  const updateProfileMutation = useUpdateCurrentUserProfile();

  const { data: myTrainees = [] } = useQuery<IMentorAssignment[]>({
    queryKey: ["myTrainees"],
    queryFn: () => mentorAssignmentService.getMyTrainees(),
    enabled: !!isVolunteer,
  });

  const activeAssignments = myTrainees.filter(
    (assignment) => assignment.isActive,
  );
  const currentBranch = availableBranches.find(
    (branch) => branch.id === activeBranch,
  );
  const branchName = decodeUnicodeEscapes(
    currentBranch?.name ??
      user?.roles?.find((role) => role.branchId === activeBranch)?.branchName,
  );

  const userRoles =
    user?.roles
      ?.map((role) =>
        decodeUnicodeEscapes(ROLE_LABELS[role.roleId] ?? role.role),
      )
      .filter(Boolean) ?? [];
  const uniqueRoleNames = Array.from(new Set(userRoles));
  const primaryRoleLabel = isVolunteer
    ? ROLE_LABELS[AUTH_ROLES.VOLUNTEER.id]
    : uniqueRoleNames[0];
  const profileName = decodeUnicodeEscapes(currentProfile?.name);
  const userName = profileName || decodeUnicodeEscapes(user?.name);
  const profileEmail = decodeUnicodeEscapes(currentProfile?.email);
  const profilePhone = decodeUnicodeEscapes(currentProfile?.phoneNumber);
  const profileAddress = decodeUnicodeEscapes(currentProfile?.address);
  const profileShirtSize = formatShirtSize(
    currentProfile?.shirtSize,
    currentProfile?.customShirtSize,
  );
  const profileAllergies = decodeUnicodeEscapes(currentProfile?.allergies);
  const profileAge = calculateAge(
    currentProfile?.dateOfBirth,
    currentProfile?.age,
  );

  useEffect(() => {
    if (!isEditDialogOpen) return;
    setProfileForm({
      email: profileEmail,
      phoneNumber: profilePhone,
      address: profileAddress,
      shirtSize: currentProfile?.shirtSize ?? "",
      customShirtSize: currentProfile?.customShirtSize ?? "",
      allergies: profileAllergies,
    });
    setFormError("");
  }, [
    currentProfile?.customShirtSize,
    currentProfile?.shirtSize,
    isEditDialogOpen,
    profileAddress,
    profileAllergies,
    profileEmail,
    profilePhone,
  ]);

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (updateProfileMutation.isPending) return;
    setIsEditDialogOpen(false);
    setFormError("");
  };

  const handleProfileFormChange =
    (field: keyof ProfileFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfileForm((current) => ({
        ...current,
        [field]: event.target.value,
        ...(field === "shirtSize" && event.target.value !== "OTHER"
          ? { customShirtSize: "" }
          : {}),
      }));
    };

  const handleSaveProfile = () => {
    const nextEmail = profileForm.email.trim();
    const nextPhone = profileForm.phoneNumber.trim();
    const nextAddress = profileForm.address.trim();

    if (nextEmail && !EMAIL_PATTERN.test(nextEmail)) {
      setFormError("כתובת האימייל אינה תקינה");
      return;
    }

    if (!nextPhone) {
      setFormError("מספר טלפון הוא שדה חובה");
      return;
    }

    if (!PHONE_PATTERN.test(nextPhone)) {
      setFormError("מספר הטלפון אינו תקין");
      return;
    }

    setFormError("");
    updateProfileMutation.mutate(
      {
        email: nextEmail || null,
        phoneNumber: nextPhone,
        address: nextAddress || null,
        shirtSize: profileForm.shirtSize || null,
        customShirtSize:
          profileForm.shirtSize === "OTHER"
            ? profileForm.customShirtSize.trim() || null
            : null,
        allergies: profileForm.allergies.trim() || null,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
        },
        onError: () => {
          setFormError("לא הצלחנו לעדכן את הפרטים");
        },
      },
    );
  };

  const handleOpenPasswordDialog = () => {
    setPasswordForm(INITIAL_PASSWORD_FORM);
    setPasswordError("");
    setIsPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
    if (isPasswordSaving) return;
    setIsPasswordDialogOpen(false);
    setPasswordError("");
  };

  const handlePasswordFormChange =
    (field: PasswordFieldName) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
      setPasswordError("");
    };

  const togglePasswordField = (field: PasswordFieldName) => {
    setVisiblePasswordFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const handleSavePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("יש למלא את כל שדות הסיסמה");
      return;
    }

    const newPassword = normalizeNewPassword(passwordForm.newPassword);
    const confirmPassword = normalizeNewPassword(
      passwordForm.confirmPassword,
    );

    if (newPassword !== confirmPassword) {
      setPasswordError("אימות הסיסמה אינו תואם");
      return;
    }

    const validationError = getNewPasswordValidationError(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    setIsPasswordSaving(true);
    setPasswordError("");

    try {
      await changePassword({
        ...passwordForm,
        newPassword,
        confirmPassword,
      });
      setPasswordForm(INITIAL_PASSWORD_FORM);
      setIsPasswordDialogOpen(false);
    } catch (error) {
      setPasswordError(
        getPasswordChangeErrorMessage(
          error,
          "לא הצלחנו לעדכן את הסיסמה",
        ),
      );
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <Box className={styles.root}>
      <Box className={styles.topBar}>
        <Button
          className={styles.backButton}
          startIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/home")}
        >
          חזרה
        </Button>
        <Typography className={styles.pageTitle}>פרופיל</Typography>
      </Box>

      {profileError && (
        <Alert severity="warning" className={styles.profileAlert}>
          לא הצלחנו לטעון את פרטי המשתמש המלאים
        </Alert>
      )}

      <Box className={styles.heroCard}>
        <Avatar className={styles.avatar}>
          {userName?.[0]?.toUpperCase() ?? "?"}
        </Avatar>
        <Typography className={styles.name}>
          {isProfileLoading && !userName ? "טוען..." : userName}
        </Typography>
        {primaryRoleLabel && (
          <Typography className={styles.role}>{primaryRoleLabel}</Typography>
        )}
        {branchName && (
          <Box className={styles.branchPill}>
            <LocationOnIcon fontSize="small" />
            <Typography>{branchName}</Typography>
          </Box>
        )}
      </Box>

      {!!currentProfile && (
        <Box className={styles.section}>
          <Box className={styles.sectionHeader}>
            <Typography className={styles.sectionTitle}>מידע אישי</Typography>
            <IconButton
              className={styles.inlineEditButton}
              aria-label="עריכת פרטים אישיים"
              onClick={handleOpenEditDialog}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          <InfoRow
            icon={<EmailIcon fontSize="small" />}
            label="אימייל"
            value={profileEmail || "לא הוגדר"}
            styles={styles}
          />
          <InfoRow
            icon={<PhoneIcon fontSize="small" />}
            label="טלפון"
            value={profilePhone || "לא הוגדר"}
            styles={styles}
          />
          <InfoRow
            icon={<HomeIcon fontSize="small" />}
            label="כתובת"
            value={profileAddress || "לא הוגדרה"}
            styles={styles}
          />
          <InfoRow
            icon={<CheckroomOutlinedIcon fontSize="small" />}
            label="מידת חולצה"
            value={profileShirtSize === "-" ? "לא הוגדרה" : profileShirtSize}
            styles={styles}
          />
          <InfoRow
            icon={<HealthAndSafetyOutlinedIcon fontSize="small" />}
            label="אלרגיות"
            value={profileAllergies || "לא צוין"}
            styles={styles}
          />
          {profileAge !== undefined && profileAge !== null && (
            <InfoRow
              icon={<PersonIcon fontSize="small" />}
              label="גיל"
              value={`${profileAge}`}
              styles={styles}
            />
          )}
        </Box>
      )}

      {isTrainee && <TraineeMedicationsSection mode="self" />}

      {isVolunteer && (
        <Box className={styles.section}>
          <Typography className={styles.sectionTitle}>חניכים</Typography>
          {activeAssignments.map((assignment) => (
            <TraineeRow
              key={assignment.id}
              assignment={assignment}
              styles={styles}
              onClick={() => setSelectedAssignment(assignment)}
            />
          ))}
        </Box>
      )}

      <Button
        fullWidth
        variant="outlined"
        startIcon={<LockResetIcon />}
        onClick={handleOpenPasswordDialog}
        sx={{
          borderRadius: 2,
          height: 48,
          mb: 1,
          fontWeight: 800,
          color: "var(--color-primary)",
          borderColor: "var(--color-border, #dadde3)",
          bgcolor: "var(--color-surface, #fff)",
          fontFamily: "inherit",
          "&:hover": {
            borderColor: "var(--color-primary)",
            bgcolor: "var(--color-primary-soft)",
          },
        }}
      >
        שינוי סיסמה
      </Button>

      <Button
        fullWidth
        variant="outlined"
        className={styles.logoutButton}
        startIcon={<LogoutIcon />}
        onClick={logout}
      >
        התנתק
      </Button>

      <ProfileEditDialog
        open={isEditDialogOpen}
        form={profileForm}
        error={formError}
        isSaving={updateProfileMutation.isPending}
        styles={styles}
        onChange={handleProfileFormChange}
        onClose={handleCloseEditDialog}
        onSave={handleSaveProfile}
      />

      <PasswordChangeDialog
        open={isPasswordDialogOpen}
        form={passwordForm}
        error={passwordError}
        isSaving={isPasswordSaving}
        visibleFields={visiblePasswordFields}
        styles={styles}
        onChange={handlePasswordFormChange}
        onToggleVisible={togglePasswordField}
        onClose={handleClosePasswordDialog}
        onSave={handleSavePassword}
      />

      <TraineeDetailsDialog
        assignment={selectedAssignment}
        branchName={getAssignmentBranchName(
          selectedAssignment,
          availableBranches,
        )}
        styles={styles}
        onClose={() => setSelectedAssignment(null)}
      />
    </Box>
  );
};

const ProfileEditDialog: React.FC<{
  open: boolean;
  form: ProfileFormState;
  error: string;
  isSaving: boolean;
  styles: ReturnType<typeof useStyles>;
  onChange: (
    field: keyof ProfileFormState,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave: () => void;
}> = ({
  open,
  form,
  error,
  isSaving,
  styles,
  onChange,
  onClose,
  onSave,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-profile-dialog-title"
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          direction: "rtl",
          borderRadius: "22px",
          p: 0.5,
          m: 2,
        },
      }}
    >
      <DialogTitle id="edit-profile-dialog-title" className={styles.dialogTitle}>
        עריכת פרטים אישיים
        <IconButton
          onClick={onClose}
          className={styles.dialogCloseButton}
          aria-label="סגירת עריכת פרטים אישיים"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box className={styles.editFields}>
          <TextField
            fullWidth
            label="אימייל"
            type="email"
            autoComplete="email"
            value={form.email}
            error={!!error}
            onChange={onChange("email")}
          />
          <TextField
            fullWidth
            label="טלפון"
            type="tel"
            autoComplete="tel"
            inputProps={{ inputMode: "tel" }}
            value={form.phoneNumber}
            error={!!error}
            onChange={onChange("phoneNumber")}
          />
          <TextField
            fullWidth
            label="כתובת"
            autoComplete="street-address"
            value={form.address}
            error={!!error}
            helperText={error || "אפשר להשאיר אימייל או כתובת ריקים כדי למחוק אותם"}
            onChange={onChange("address")}
          />
          <TextField
            select
            fullWidth
            label="מידת חולצה"
            value={form.shirtSize}
            onChange={onChange("shirtSize")}
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
              inputProps={{ maxLength: 50 }}
              onChange={onChange("customShirtSize")}
            />
          )}
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="אלרגיות"
            value={form.allergies}
            inputProps={{ maxLength: 1000 }}
            onChange={onChange("allergies")}
          />
        </Box>
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} disabled={isSaving}>
          ביטול
        </Button>
        <Button variant="contained" onClick={onSave} disabled={isSaving}>
          {isSaving ? "שומר..." : "שמירה"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PasswordChangeDialog: React.FC<{
  open: boolean;
  form: PasswordFormState;
  error: string;
  isSaving: boolean;
  visibleFields: Record<PasswordFieldName, boolean>;
  styles: ReturnType<typeof useStyles>;
  onChange: (
    field: PasswordFieldName,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisible: (field: PasswordFieldName) => void;
  onClose: () => void;
  onSave: () => void;
}> = ({
  open,
  form,
  error,
  isSaving,
  visibleFields,
  styles,
  onChange,
  onToggleVisible,
  onClose,
  onSave,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    PaperProps={{
      sx: {
        direction: "rtl",
        borderRadius: "22px",
        p: 0.5,
        m: 2,
      },
    }}
  >
    <DialogTitle className={styles.dialogTitle}>
      שינוי סיסמה
      <IconButton
        onClick={onClose}
        className={styles.dialogCloseButton}
        aria-label="סגירת שינוי סיסמה"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      <Box className={styles.editFields}>
        {error && <Alert severity="error">{error}</Alert>}
        <ProfilePasswordField
          label="סיסמה נוכחית"
          value={form.currentPassword}
          visible={visibleFields.currentPassword}
          autoComplete="current-password"
          onChange={onChange("currentPassword")}
          onToggleVisible={() => onToggleVisible("currentPassword")}
        />
        <ProfilePasswordField
          label="סיסמה חדשה"
          value={form.newPassword}
          visible={visibleFields.newPassword}
          autoComplete="new-password"
          helperText={PASSWORD_POLICY_MESSAGE}
          onChange={onChange("newPassword")}
          onToggleVisible={() => onToggleVisible("newPassword")}
        />
        <ProfilePasswordField
          label="אימות סיסמה חדשה"
          value={form.confirmPassword}
          visible={visibleFields.confirmPassword}
          autoComplete="new-password"
          onChange={onChange("confirmPassword")}
          onToggleVisible={() => onToggleVisible("confirmPassword")}
        />
      </Box>
    </DialogContent>
    <DialogActions className={styles.dialogActions}>
      <Button onClick={onClose} disabled={isSaving}>
        ביטול
      </Button>
      <Button variant="contained" onClick={onSave} disabled={isSaving}>
        {isSaving ? "שומר..." : "שמירה"}
      </Button>
    </DialogActions>
  </Dialog>
);

const ProfilePasswordField: React.FC<{
  label: string;
  value: string;
  visible: boolean;
  autoComplete: string;
  helperText?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleVisible: () => void;
}> = ({
  label,
  value,
  visible,
  autoComplete,
  helperText,
  onChange,
  onToggleVisible,
}) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    type={visible ? "text" : "password"}
    autoComplete={autoComplete}
    helperText={helperText}
    onChange={onChange}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label={visible ? "הסתרת סיסמה" : "הצגת סיסמה"}
            edge="end"
            size="small"
            onClick={onToggleVisible}
          >
            {visible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

const TraineeRow: React.FC<{
  assignment: IMentorAssignment;
  styles: ReturnType<typeof useStyles>;
  onClick: () => void;
}> = ({ assignment, styles, onClick }) => {
  const traineeName =
    decodeUnicodeEscapes(assignment.trainee?.name) || "חניך";
  const phone = decodeUnicodeEscapes(assignment.trainee?.phoneNumber);

  return (
    <Box
      className={styles.traineeRow}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <Box className={styles.infoLabelWrap}>
        <Box className={styles.infoIcon}>
          <PersonIcon fontSize="small" />
        </Box>
        <Box className={styles.traineeRowText}>
          <Typography className={styles.traineeRowTitle}>
            {traineeName}
          </Typography>
          {phone && (
            <Typography className={styles.traineeRowMeta}>{phone}</Typography>
          )}
        </Box>
      </Box>
      <ChevronLeftIcon className={styles.traineeChevron} />
    </Box>
  );
};

const TraineeDetailsDialog: React.FC<{
  assignment: IMentorAssignment | null;
  branchName?: string;
  styles: ReturnType<typeof useStyles>;
  onClose: () => void;
}> = ({ assignment, branchName, styles, onClose }) => {
  const trainee = assignment?.trainee;
  const traineeName = decodeUnicodeEscapes(trainee?.name) || "חניך";
  const phone = decodeUnicodeEscapes(trainee?.phoneNumber);
  const branch = decodeUnicodeEscapes(
    branchName ?? trainee?.branchId ?? assignment?.branchId,
  );

  return (
    <Dialog
      open={!!assignment}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          direction: "rtl",
          borderRadius: "22px",
          p: 0.5,
          m: 2,
        },
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        פרטי חניך
        <IconButton
          onClick={onClose}
          className={styles.dialogCloseButton}
          aria-label="סגירת פרטי חניך"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box className={styles.dialogHero}>
          <Avatar className={styles.dialogAvatar}>
            {traineeName[0]?.toUpperCase() ?? "?"}
          </Avatar>
          <Typography className={styles.dialogName}>{traineeName}</Typography>
        </Box>

        {phone && (
          <InfoRow
            icon={<PhoneIcon fontSize="small" />}
            label="טלפון"
            value={phone}
            styles={styles}
          />
        )}
        {branch && (
          <InfoRow
            icon={<LocationOnIcon fontSize="small" />}
            label="סניף"
            value={branch}
            styles={styles}
          />
        )}
        {assignment && (
          <InfoRow
            icon={<BadgeIcon fontSize="small" />}
            label="סטטוס שיוך"
            value={assignment.isActive ? "פעיל" : "לא פעיל"}
            styles={styles}
          />
        )}
        {assignment?.startDate && (
          <InfoRow
            icon={<BadgeIcon fontSize="small" />}
            label="תחילת שיוך"
            value={formatDate(assignment.startDate)}
            styles={styles}
          />
        )}

        {phone && (
          <Button
            fullWidth
            variant="contained"
            href={`tel:${phone}`}
            startIcon={<PhoneIcon />}
            sx={{
              mt: 2,
              borderRadius: "14px",
              bgcolor: "var(--color-primary)",
              fontWeight: 800,
              textTransform: "none",
              boxShadow:
                "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
              "&:hover": { bgcolor: "var(--color-primary-dark)" },
            }}
          >
            התקשר
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

const getAssignmentBranchName = (
  assignment: IMentorAssignment | null,
  branches: { id: string; name: string }[],
) => {
  if (!assignment?.branchId) return undefined;
  return branches.find((branch) => branch.id === assignment.branchId)?.name;
};

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  styles: ReturnType<typeof useStyles>;
}> = ({ icon, label, value, styles }) => (
  <Box className={styles.infoRow}>
    <Box className={styles.infoLabelWrap}>
      <Box className={styles.infoIcon}>{icon}</Box>
      <Typography className={styles.infoLabel}>{label}</Typography>
    </Box>
    <Box className={styles.infoValueWrap}>
      <Typography className={styles.infoValue}>
        {decodeUnicodeEscapes(value)}
      </Typography>
    </Box>
  </Box>
);
