import { useState } from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { useNavigate } from "react-router-dom";
import { ChangePasswordDialog } from "../../../components/AccountSettings/ChangePasswordDialog";
import { PersonalDetailsDialog } from "../../../components/AccountSettings/PersonalDetailsDialog";
import { FeatureRequestDialog } from "../../../components/FeatureRequestDialog/FeatureRequestDialog";
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
  const [isFeatureRequestOpen, setIsFeatureRequestOpen] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
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

          <SettingsSection id="help" title="עזרה ומשוב" classes={classes}>
            <SettingsRow
              icon={<TipsAndUpdatesOutlinedIcon />}
              title="בקשה לפיצ'ר"
              description="בקשה לפיצ'ר / דיווח על בעיה / הצעה לשיפור עיצוב, או כל דבר אחר"
              onClick={() => setIsFeatureRequestOpen(true)}
            />
          </SettingsSection>

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
      <FeatureRequestDialog
        open={isFeatureRequestOpen}
        onClose={() => setIsFeatureRequestOpen(false)}
        onSuccess={() => setShowFeedbackSuccess(true)}
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
      <Snackbar
        open={showFeedbackSuccess}
        autoHideDuration={5000}
        onClose={() => setShowFeedbackSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setShowFeedbackSuccess(false)}
        >
          הבקשה נשלחה בהצלחה, תודה על המשוב!
        </Alert>
      </Snackbar>
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
