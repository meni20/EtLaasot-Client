import React, { useMemo, useState } from "react";
import SideMenuIcon from "../../icons/SideMenuIcon";
import type { NavbarProps } from "./Navbar.interface";
import {
  Alert,
  AppBar,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useNavbarStyles } from "./Navbar.styles";
import { BranchSelector } from "../BranchSelector/BranchSelector";
import { useAuth } from "../../contexts/useAuth";
import { useBranch } from "../../contexts/useBranch";
import { AUTH_ROLES } from "../../constants/auth.const";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import {
  calculateAge,
  formatDate,
  formatMaskedNationalId,
} from "../../utils/data.utillity";
import { decodeUnicodeEscapes } from "../../utils/text.util";

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const INITIAL_PASSWORD_FORM: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ROLE_LABELS: Record<number, string> = {
  [AUTH_ROLES.SUPER_ADMIN.id]: AUTH_ROLES.SUPER_ADMIN.name,
  [AUTH_ROLES.BRANCH_ADMIN.id]: AUTH_ROLES.BRANCH_ADMIN.name,
  [AUTH_ROLES.VOLUNTEER.id]: AUTH_ROLES.VOLUNTEER.name,
  [AUTH_ROLES.TRAINEE.id]: AUTH_ROLES.TRAINEE.name,
};

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  const classes = useNavbarStyles();
  const navigate = useNavigate();
  const { user, logout, changePassword } = useAuth();
  const { activeBranch, availableBranches } = useBranch();
  const {
    data: currentProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useCurrentUserProfile();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] =
    useState<PasswordFormState>(INITIAL_PASSWORD_FORM);
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const branchName = useMemo(() => {
    return decodeUnicodeEscapes(
      availableBranches.find((branch) => branch.id === activeBranch)?.name ??
        user?.roles?.find((role) => role.branchId === activeBranch)?.branchName,
    );
  }, [activeBranch, availableBranches, user?.roles]);

  const roleNames = useMemo(() => {
    const roles =
      user?.roles
        ?.map((role) =>
          decodeUnicodeEscapes(ROLE_LABELS[role.roleId] ?? role.role),
        )
        .filter(Boolean) ?? [];

    return Array.from(new Set(roles)).join(", ");
  }, [user?.roles]);

  const dateOfBirth = currentProfile?.dateOfBirth
    ? formatDate(new Date(currentProfile.dateOfBirth))
    : "";
  const age = calculateAge(currentProfile?.dateOfBirth, currentProfile?.age);
  const nationalId = formatMaskedNationalId(
    currentProfile?.nationalIdMasked ?? user?.nationalIdMasked,
    currentProfile?.nationalIdLast4 ?? user?.nationalIdLast4,
  );

  const openPasswordDialog = () => {
    setPasswordForm(INITIAL_PASSWORD_FORM);
    setPasswordError("");
    setShowPasswords(false);
    setIsPasswordDialogOpen(true);
  };

  const closePasswordDialog = () => {
    if (isSavingPassword) return;
    setIsPasswordDialogOpen(false);
    setPasswordError("");
  };

  const handlePasswordFormChange =
    (field: keyof PasswordFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
      setPasswordError("");
    };

  const savePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("יש למלא את כל שדות הסיסמה");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("אימות הסיסמה אינו תואם");
      return;
    }

    setIsSavingPassword(true);
    setPasswordError("");

    try {
      await changePassword(passwordForm);
      setPasswordForm(INITIAL_PASSWORD_FORM);
      setIsPasswordDialogOpen(false);
    } catch {
      setPasswordError("לא הצלחנו לעדכן את הסיסמה");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileDialogOpen(false);
    navigate("/login");
  };

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Box className={classes.navActions}>
            <Box className={classes.menuIconBox} onClick={onMenuClick}>
              <SideMenuIcon />
            </Box>
            <Tooltip title="חזרה לבית">
              <IconButton
                className={classes.homeButton}
                onClick={() => navigate("/dashboard")}
                aria-label="חזרה לבית"
                size="small"
              >
                <HomeRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box className={classes.navbarLogoSlot} aria-label={title}>
            <Box
              component="img"
              src="/et-laasot-bat-yam-logo.png"
              alt="עת לעשות בת ים"
              className={classes.navbarLogo}
            />
          </Box>
          <Tooltip title="הפרטים שלי">
            <ButtonBase
              className={classes.userInfo}
              onClick={() => setIsProfileDialogOpen(true)}
              aria-label="פתיחת הפרטים שלי"
            >
              <Typography className={classes.userName}>{user?.name}</Typography>
              {user?.nationalIdMasked && (
                <Typography className={classes.userTz}>
                  ת.ז. {user.nationalIdMasked}
                </Typography>
              )}
            </ButtonBase>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Dialog
        open={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { direction: "rtl", borderRadius: 3 } }}
      >
        <DialogTitle className={classes.profileDialogTitle}>
          הפרטים שלי
          <IconButton
            aria-label="סגירת הפרטים שלי"
            onClick={() => setIsProfileDialogOpen(false)}
            className={classes.profileDialogClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {isProfileLoading ? (
            <Box className={classes.profileLoading}>
              <CircularProgress size={28} sx={{ color: "#9a5188" }} />
            </Box>
          ) : isProfileError ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              לא הצלחנו לטעון את פרטי המשתמש המלאים.
            </Alert>
          ) : (
            <Stack spacing={1.5}>
              <Box className={classes.profileHero}>
                <Box className={classes.profileAvatar}>
                  {(currentProfile?.name ?? user?.name)?.[0]?.toUpperCase() ??
                    "?"}
                </Box>
                <Box>
                  <Typography className={classes.profileName}>
                    {decodeUnicodeEscapes(currentProfile?.name ?? user?.name)}
                  </Typography>
                  {roleNames && (
                    <Typography className={classes.profileMeta}>
                      {roleNames}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider />

              <ProfileInfoRow label="תעודת זהות" value={nationalId} />
              <ProfileInfoRow label="סניף פעיל" value={branchName || "-"} />
              <ProfileInfoRow
                label="טלפון"
                value={decodeUnicodeEscapes(currentProfile?.phoneNumber) || "-"}
              />
              <ProfileInfoRow
                label="אימייל"
                value={decodeUnicodeEscapes(currentProfile?.email) || "-"}
              />
              <ProfileInfoRow
                label="כתובת"
                value={decodeUnicodeEscapes(currentProfile?.address) || "-"}
              />
              <ProfileInfoRow label="תאריך לידה" value={dateOfBirth || "-"} />
              <ProfileInfoRow
                label="גיל"
                value={age === null || age === undefined ? "-" : `${age}`}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions className={classes.profileActions}>
          <Box className={classes.profileBranchAction}>
            <Typography className={classes.profileBranchLabel}>
              מעבר בין סניפים
            </Typography>
            <BranchSelector variant="dialog" />
          </Box>
          <Box className={classes.profileAccountActions}>
            <Button
              variant="outlined"
              startIcon={<LockResetRoundedIcon />}
              onClick={openPasswordDialog}
              className={classes.profileActionButton}
            >
              שינוי סיסמה
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutRoundedIcon />}
              onClick={handleLogout}
              className={classes.profileActionButton}
            >
              התנתקות
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isPasswordDialogOpen}
        onClose={closePasswordDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { direction: "rtl", borderRadius: 3 } }}
      >
        <DialogTitle className={classes.profileDialogTitle}>
          שינוי סיסמה
          <IconButton
            aria-label="סגירת חלון שינוי סיסמה"
            onClick={closePasswordDialog}
            className={classes.profileDialogClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <PasswordField
              label="סיסמה נוכחית"
              value={passwordForm.currentPassword}
              visible={showPasswords}
              autoComplete="current-password"
              onChange={handlePasswordFormChange("currentPassword")}
              onToggleVisible={() => setShowPasswords((current) => !current)}
            />
            <PasswordField
              label="סיסמה חדשה"
              value={passwordForm.newPassword}
              visible={showPasswords}
              autoComplete="new-password"
              helperText="לפחות 10 תווים, אותיות גדולות וקטנות, מספר וסימן."
              onChange={handlePasswordFormChange("newPassword")}
              onToggleVisible={() => setShowPasswords((current) => !current)}
            />
            <PasswordField
              label="אימות סיסמה חדשה"
              value={passwordForm.confirmPassword}
              visible={showPasswords}
              autoComplete="new-password"
              onChange={handlePasswordFormChange("confirmPassword")}
              onToggleVisible={() => setShowPasswords((current) => !current)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closePasswordDialog} disabled={isSavingPassword}>
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={savePassword}
            disabled={isSavingPassword}
          >
            {isSavingPassword ? "שומר..." : "שמירה"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ProfileInfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      gap: 2,
      alignItems: "center",
      py: 0.75,
    }}
  >
    <Typography
      sx={{
        color: "#6b6068",
        fontFamily: "Rubik, sans-serif",
        fontSize: "0.86rem",
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        color: "#2f2930",
        fontFamily: "Rubik, sans-serif",
        fontWeight: 700,
        textAlign: "left",
        minWidth: 0,
        overflowWrap: "anywhere",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const PasswordField: React.FC<{
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
            aria-label={visible ? "Hide password" : "Show password"}
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

export default Navbar;
