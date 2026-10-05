import { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { useNavigate } from "react-router-dom";
import { ChangePasswordDialog } from "../../../components/AccountSettings/ChangePasswordDialog";
import { PersonalDetailsDialog } from "../../../components/AccountSettings/PersonalDetailsDialog";
import { BranchSelector } from "../../../components/BranchSelector/BranchSelector";
import { SettingsRow } from "../../../components/SettingsRow/SettingsRow";
import { useAuth } from "../../../contexts/useAuth";
import { useBranch } from "../../../contexts/useBranch";
import { version as appVersion } from "../../../../package.json";
import { useSettingsStyles } from "./Settings.styles";

export const SettingsPage: React.FC = () => {
  const classes = useSettingsStyles();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { availableBranches } = useBranch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const canSwitchBranches = availableBranches.length > 1;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Box className={classes.header}>
          <Typography component="h1" className={classes.title}>
            הגדרות
          </Typography>
          <Typography className={classes.subtitle}>
            ניהול החשבון והעדפות המערכת
          </Typography>
        </Box>

        <Box className={classes.sections}>
          <SettingsSection id="account" title="החשבון שלי" classes={classes}>
            <SettingsRow
              icon={<PersonOutlineRoundedIcon />}
              title="פרטים אישיים"
              description="צפייה בפרטי החשבון והקשר שלך"
              onClick={() => setIsProfileOpen(true)}
            />
            <SettingsRow
              icon={<LockResetRoundedIcon />}
              title="שינוי סיסמה"
              description="עדכון מאובטח של סיסמת הכניסה"
              onClick={() => setIsPasswordOpen(true)}
            />
          </SettingsSection>

          {canSwitchBranches && (
            <SettingsSection id="system" title="המערכת" classes={classes}>
              <SettingsRow
                icon={<BusinessOutlinedIcon />}
                title="מעבר בין סניפים"
                description="בחירת הסניף הפעיל במערכת"
                trailing={<BranchSelector variant="dialog" />}
              />
            </SettingsSection>
          )}

          <SettingsSection id="information" title="מידע" classes={classes}>
            <SettingsRow
              icon={<InfoOutlinedIcon />}
              title="אודות המערכת"
              description="מידע על עת לעשות"
              onClick={() => setIsAboutOpen(true)}
            />
          </SettingsSection>

          <Box className={classes.logoutSection}>
            <Box className={classes.logoutCard}>
              <SettingsRow
                icon={<LogoutRoundedIcon />}
                title="התנתקות"
                description="יציאה מאובטחת מהחשבון"
                onClick={handleLogout}
                destructive
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <PersonalDetailsDialog
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <ChangePasswordDialog
        open={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />
      <Dialog
        open={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        aria-labelledby="about-dialog-title"
        fullWidth
        maxWidth="xs"
        PaperProps={{ className: classes.aboutDialogPaper }}
      >
        <DialogTitle id="about-dialog-title" className={classes.aboutTitle}>
          עת לעשות
          <IconButton
            aria-label="סגירת אודות המערכת"
            onClick={() => setIsAboutOpen(false)}
            className={classes.aboutClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.aboutContent}>
          <Typography>מערכת לניהול פעילות העמותה</Typography>
          <Typography className={classes.aboutVersion}>
            גרסה {appVersion}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

interface SettingsSectionProps {
  id: string;
  title: string;
  classes: ReturnType<typeof useSettingsStyles>;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  id,
  title,
  classes,
  children,
}) => (
  <Box component="section" aria-labelledby={`settings-${id}`}>
    <Typography
      id={`settings-${id}`}
      component="h2"
      className={classes.sectionTitle}
    >
      {title}
    </Typography>
    <Box className={classes.sectionCard}>{children}</Box>
  </Box>
);
