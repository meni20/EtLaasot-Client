import {
  List,
  Drawer,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
  Box,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/useAuth";
import { menuItems } from "./SideMenu.constants";
import { useSideMenuStyles } from "./SIdeMenu.styles";
import { type SideMenuProps } from "./SideMenu.interface";

export const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useSideMenuStyles();
  const { logout, changePassword } = useAuth();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const closePasswordDialog = () => {
    if (isSavingPassword) return;
    setIsPasswordDialogOpen(false);
    setPasswordError("");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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
      setIsPasswordDialogOpen(false);
      setPasswordError("");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      onClose();
    } catch {
      setPasswordError("לא הצלחנו לעדכן את הסיסמה");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      PaperProps={{ className: classes.drawerPaper }}
    >
      <Box className={classes.header}>
        <Box>
          <Typography variant="h6" className={classes.headerTitle}>
            תפריט
          </Typography>
          <Typography className={classes.headerSubtitle}>
            ניהול סניף
          </Typography>
        </Box>

        <ListItemButton
          className={classes.logoutButton}
          onClick={() => {
            logout();
            navigate("/login");
            onClose();
          }}
        >
          <ListItemText primary="התנתקות" />
        </ListItemButton>
        <ListItemButton
          className={classes.logoutButton}
          onClick={() => setIsPasswordDialogOpen(true)}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <LockResetRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="שינוי סיסמה" />
        </ListItemButton>
      </Box>

      <List className={classes.list}>
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.path);

          return (
            <ListItemButton
              key={item.path}
              className={`${classes.listItemButton} ${
                isActive ? classes.activeListItem : ""
              }`}
              selected={isActive}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                className={classes.listItemText}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Dialog
        open={isPasswordDialogOpen}
        onClose={closePasswordDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { direction: "rtl", borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontFamily: "Rubik, sans-serif", fontWeight: 800 }}>
          שינוי סיסמה
          <IconButton
            aria-label="סגירת חלון שינוי סיסמה"
            onClick={closePasswordDialog}
            sx={{ position: "absolute", left: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <TextField
              fullWidth
              label="סיסמה נוכחית"
              type={showPasswords ? "text" : "password"}
              autoComplete="current-password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
            />
            <TextField
              fullWidth
              label="סיסמה חדשה"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              helperText="לפחות 10 תווים, אותיות גדולות וקטנות, מספר וסימן."
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  newPassword: event.target.value,
                }))
              }
            />
            <TextField
              fullWidth
              label="אימות סיסמה חדשה"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPasswords ? "Hide passwords" : "Show passwords"
                      }
                      edge="end"
                      size="small"
                      onClick={() => setShowPasswords((current) => !current)}
                    >
                      {showPasswords ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
    </Drawer>
  );
};
