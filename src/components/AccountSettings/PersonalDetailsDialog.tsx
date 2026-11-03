import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AUTH_ROLES } from "../../constants/auth.const";
import { useAuth } from "../../contexts/useAuth";
import { useBranch } from "../../contexts/useBranch";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import {
  calculateAge,
  formatDate,
  formatMaskedNationalId,
} from "../../utils/data.utillity";
import { decodeUnicodeEscapes } from "../../utils/text.util";
import { useNavbarStyles } from "../Navbar/Navbar.styles";
import { AdminProfileEditDialog } from "./AdminProfileEditDialog";

interface PersonalDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

const ROLE_LABELS: Record<number, string> = {
  [AUTH_ROLES.SUPER_ADMIN.id]: AUTH_ROLES.SUPER_ADMIN.name,
  [AUTH_ROLES.BRANCH_ADMIN.id]: AUTH_ROLES.BRANCH_ADMIN.name,
  [AUTH_ROLES.VOLUNTEER.id]: AUTH_ROLES.VOLUNTEER.name,
  [AUTH_ROLES.TRAINEE.id]: AUTH_ROLES.TRAINEE.name,
};

export const PersonalDetailsDialog: React.FC<PersonalDetailsDialogProps> = ({
  open,
  onClose,
}) => {
  const classes = useNavbarStyles();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const canEdit = user?.roles.some(
    (role) =>
      role.roleId === AUTH_ROLES.BRANCH_ADMIN.id ||
      role.roleId === AUTH_ROLES.SUPER_ADMIN.id,
  );
  const close = () => {
    setEditing(false);
    setSaved(false);
    onClose();
  };
  const { activeBranch, availableBranches } = useBranch();
  const {
    data: currentProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useCurrentUserProfile(open);

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

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="profile-dialog-title"
      fullWidth
      maxWidth="xs"
      PaperProps={{ className: classes.profileDialogPaper }}
    >
      <DialogTitle id="profile-dialog-title" className={classes.profileTitle}>
        הפרטים שלי
        <IconButton
          aria-label="סגירת הפרטים שלי"
          onClick={close}
          className={classes.profileClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.profileContent}>
        {isProfileLoading ? (
          <Box className={classes.profileLoading} aria-live="polite">
            <CircularProgress size={28} sx={{ color: "var(--color-brand)" }} />
          </Box>
        ) : isProfileError ? (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            לא הצלחנו לטעון את פרטי המשתמש המלאים.
          </Alert>
        ) : (
          <Stack className={classes.profileBody}>
            {saved && <Alert severity="success">הפרטים נשמרו בהצלחה</Alert>}
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

            <Box className={classes.profileInfoList}>
              <ProfileInfoRow
                label="תעודת זהות"
                value={nationalId}
                classes={classes}
              />
              <ProfileInfoRow
                label="סניף פעיל"
                value={branchName || "-"}
                classes={classes}
              />
              <ProfileInfoRow
                label="טלפון"
                value={decodeUnicodeEscapes(currentProfile?.phoneNumber) || "-"}
                classes={classes}
              />
              <ProfileInfoRow
                label="אימייל"
                value={decodeUnicodeEscapes(currentProfile?.email) || "-"}
                classes={classes}
              />
              <ProfileInfoRow
                label="כתובת"
                value={decodeUnicodeEscapes(currentProfile?.address) || "-"}
                classes={classes}
              />
              <ProfileInfoRow
                label="תאריך לידה"
                value={dateOfBirth || "-"}
                classes={classes}
              />
              <ProfileInfoRow
                label="גיל"
                value={age === null || age === undefined ? "-" : `${age}`}
                classes={classes}
              />
            </Box>
            {canEdit && currentProfile && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSaved(false);
                  setEditing(true);
                }}
              >
                עריכת פרטים
              </Button>
            )}
          </Stack>
        )}
      </DialogContent>
      {open && editing && canEdit && currentProfile && (
        <AdminProfileEditDialog
          profile={currentProfile}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            setSaved(true);
          }}
        />
      )}
    </Dialog>
  );
};

const ProfileInfoRow: React.FC<{
  label: string;
  value: string;
  classes: {
    profileInfoRow: string;
    profileInfoLabel: string;
    profileInfoValue: string;
  };
}> = ({ label, value, classes }) => (
  <Box className={classes.profileInfoRow}>
    <Typography className={classes.profileInfoLabel}>{label}</Typography>
    <Typography className={classes.profileInfoValue}>{value}</Typography>
  </Box>
);
