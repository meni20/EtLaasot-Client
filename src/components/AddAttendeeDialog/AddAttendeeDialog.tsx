import * as React from "react";
import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Box,
  InputAdornment,
  ListItemText,
  IconButton,
  CircularProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import type { IAddAttendeeDialogProps } from "./AddAttendeeDialog.interface";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import eventService from "../../services/event.service";
import { AUTH_ROLES } from "../../constants/auth.const";
import { useQueryClient } from "@tanstack/react-query";

const normalizeSearchValue = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export const AddAttendeeDialog: React.FC<IAddAttendeeDialogProps> = ({
  open,
  eventId,
  onClose,
  users,
}) => {
  const queryClient = useQueryClient();
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [pendingUserId, setPendingUserId] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  const filteredUsers = React.useMemo(() => {
    const normalizedSearch = normalizeSearchValue(searchTerm);

    if (!normalizedSearch) return users ?? [];

    return (users ?? []).filter((user) =>
      [user.name, user.email].some((value) =>
        normalizeSearchValue(value).includes(normalizedSearch),
      ),
    );
  }, [searchTerm, users]);

  React.useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setPendingUserId(null);
      setNotice(null);
    }
  }, [open]);

  const handleAddAttendee = async (userId: string) => {
    try {
      setPendingUserId(userId);
      await eventService.addAttendeeToEvent(userId, eventId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["events"] }),
        queryClient.invalidateQueries({ queryKey: ["attendeesByEvent", eventId] }),
        queryClient.invalidateQueries({ queryKey: ["eventAttendees", eventId] }),
        queryClient.invalidateQueries({ queryKey: ["eventAttendees"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] }),
      ]);
      setNotice({ severity: "success", message: "המשתתף נוסף לאירוע" });
    } catch (error) {
      console.error("Error adding attendee to event:", error);
      setNotice({
        severity: "error",
        message: "לא הצלחנו להוסיף את המשתתף. נסו שוב.",
      });
    } finally {
      setPendingUserId(null);
    }
  };

  const isUserAssignedToEvent = (userId: string) => {
    const user = users?.find((u) => u.id === userId);

    if (!user?.events || user.events.length === 0) return false;

    return user.events.some((event) => event.id === eventId);
  };

  const getRoleTitle = (roleId: number) => {
    switch (roleId) {
      case AUTH_ROLES.TRAINEE.id:
        return "חניכים";
      case AUTH_ROLES.VOLUNTEER.id:
        return "חונכים";
      default:
        return "משתמשים";
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "calc(100vw - 24px)", sm: 420 },
            maxWidth: "calc(100vw - 24px)",
            borderRadius: 5,
            overflow: "hidden",
            direction: "rtl",
            fontFamily: (theme) => theme.typography.fontFamily,
            backgroundColor: "background.default",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 5,
            pt: 5,
            pb: 2,
            fontWeight: 800,
            fontSize: 21,
            color: "text.primary",
          }}
        >
          הוספת משתתפים
          <Typography
            component="span"
            sx={{
              display: "block",
              mt: 0.75,
              fontSize: 13,
              fontWeight: 500,
              color: "text.secondary",
            }}
          >
            חיפוש מהיר לפי שם או אימייל
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 0,
            pb: 4,
            maxHeight: { xs: "min(68dvh, 540px)", sm: 430 },
            overflowY: "auto",
            backgroundColor: "transparent",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              pt: 1,
              pb: 2,
              backgroundColor: (theme) => alpha(theme.palette.background.default, 0.86),
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <TextField
              inputRef={searchInputRef}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="חיפוש לפי שם או אימייל"
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      edge="start"
                      aria-label="חיפוש משתתף"
                      onClick={() => searchInputRef.current?.focus()}
                      sx={{ color: "primary.main" }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label="ניקוי חיפוש"
                      onClick={() => {
                        setSearchTerm("");
                        searchInputRef.current?.focus();
                      }}
                      sx={{ color: "text.secondary" }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "background.paper",
                },
                "& input": {
                  textAlign: "right",
                },
              }}
            />
          </Box>
          <List disablePadding>
            {filteredUsers.length === 0 ? (
              <Typography
                sx={{
                  px: 2,
                  py: 6,
                  textAlign: "center",
                  color: "text.secondary",
                  fontWeight: 700,
                }}
              >
                לא נמצאו משתתפים
              </Typography>
            ) : (
              filteredUsers.map((user, index) => {
                const prevRole = filteredUsers[index - 1]?.role;
                const isFirstOfRole = index === 0 || user.role !== prevRole;
                const isAssigned = isUserAssignedToEvent(user.id);
                const isPending = pendingUserId === user.id;

                return (
                  <React.Fragment key={user.id}>
                    {isFirstOfRole && (
                      <Typography
                        sx={{
                          px: 2,
                          py: 1,
                          fontWeight: 800,
                          fontSize: 12,
                          color: "primary.main",
                          textAlign: "right",
                        }}
                      >
                        {getRoleTitle(user.role!)}
                      </Typography>
                    )}

                    <ListItem
                    sx={{
                      px: 1.5,
                      py: 1,
                      gap: 1.5,
                      borderRadius: 4,
                      marginBottom: 1,
                      backgroundColor: isAssigned ? "success.light" : "background.paper",
                      border: "1px solid",
                      borderColor: isAssigned ? "success.main" : "divider",
                      transition: (theme) =>
                        `transform 140ms ${theme.transitions.easing.easeOut}, background-color 140ms ease, border-color 140ms ease`,
                      "&:hover": {
                        backgroundColor: isAssigned ? "success.light" : "primary.light",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <IconButton
                      edge="end"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAddAttendee(user.id);
                      }}
                      disabled={isAssigned || Boolean(pendingUserId)}
                      aria-label={`הוסף ${user.name} לאירוע`}
                      sx={{
                        flexShrink: 0,
                        color: isAssigned ? "success.main" : "primary.main",
                        backgroundColor: "background.paper",
                        border: "1px solid",
                        borderColor: isAssigned ? "success.main" : "divider",
                      }}
                    >
                      {isPending ? (
                        <CircularProgress size={18} />
                      ) : (
                        <AddIcon fontSize="small" />
                      )}
                    </IconButton>

                  <ListItemText
                    primary={user.name}
                    secondary={user.email}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: 14,
                        fontWeight: 700,
                        textAlign: "right",
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        textAlign: "right",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                  />

                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor:
                          user.role === AUTH_ROLES.TRAINEE.id
                            ? "primary.light"
                            : "secondary.light",
                        color:
                          user.role === AUTH_ROLES.TRAINEE.id
                            ? "primary.main"
                            : "secondary.main",
                        fontSize: 14,
                        fontWeight: 800,
                      }}
                    >
                      <PersonOutlineIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  </ListItem>
                  </React.Fragment>
                );
              })
            )}
          </List>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3000}
        onClose={() => setNotice(null)}
      >
        <Alert
          severity={notice?.severity ?? "success"}
          onClose={() => setNotice(null)}
          sx={{ width: "100%" }}
        >
          {notice?.message}
        </Alert>
      </Snackbar>
    </>
  );
};
