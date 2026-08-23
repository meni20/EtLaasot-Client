import React, { useState, useMemo } from "react";
import {
  Avatar,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import userService from "../../../services/user.service";
import { useBranch } from "../../../contexts/useBranch";
import { useMentorAssignmentStyles } from "./MentorAssignment.styles";
import type { IMentorAssignment } from "../../../interfaces/event.interface";
import type { IUser } from "../../../interfaces/user.interface";

const avatarLetter = (name?: string) => name?.trim()?.[0]?.toUpperCase() || "?";

export const MentorAssignmentPage: React.FC = () => {
  const classes = useMentorAssignmentStyles();
  const { activeBranch } = useBranch();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState("");

  const { data: assignments = [], isLoading } = useQuery<IMentorAssignment[]>({
    queryKey: ["mentor-assignments", activeBranch],
    queryFn: () =>
      mentorAssignmentService.getAssignmentsByBranch(activeBranch!),
    enabled: !!activeBranch,
  });

  const { data: unassigned = [] } = useQuery<IUser[]>({
    queryKey: ["unassigned-trainees", activeBranch],
    queryFn: () => mentorAssignmentService.getUnassignedTrainees(activeBranch!),
    enabled: !!activeBranch,
  });

  const { data: volunteers = [] } = useQuery<IUser[]>({
    queryKey: ["volunteers", activeBranch],
    queryFn: () => userService.getAllVolunteers(activeBranch ?? undefined),
    enabled: !!activeBranch,
  });

  const assignMutation = useMutation({
    mutationFn: (data: {
      mentorId: string;
      traineeId: string;
      branchId: string;
    }) => mentorAssignmentService.assignTrainee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["unassigned-trainees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["myTrainees"] });
      setDialogOpen(false);
      setSelectedMentor("");
      setSelectedTrainee("");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => mentorAssignmentService.removeAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["unassigned-trainees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["myTrainees"] });
    },
  });

  // Group assignments by mentor
  const grouped = useMemo(() => {
    const map: Record<
      string,
      { mentor: IUser | undefined; assignments: IMentorAssignment[] }
    > = {};
    assignments.forEach((a) => {
      if (!map[a.mentorId]) {
        map[a.mentorId] = { mentor: a.mentor, assignments: [] };
      }
      map[a.mentorId].assignments.push(a);
    });
    return Object.values(map);
  }, [assignments]);

  if (isLoading) {
    return (
      <Box
        className={classes.root}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h4" className={classes.title}>
          הקצאות חונך-חניך
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className={classes.addButton}
          onClick={() => setDialogOpen(true)}
        >
          הקצאה חדשה
        </Button>
      </Box>

      {/* Unassigned trainees alert */}
      {unassigned.length > 0 && (
        <Box className={classes.unassignedCard} role="status">
          <WarningAmberRoundedIcon className={classes.statusIcon} />
          <Typography className={classes.unassignedText}>
            {unassigned.length} חניכים ללא חונך מוקצה:{" "}
            {unassigned.map((u) => u.name).join(", ")}
          </Typography>
        </Box>
      )}

      {/* Assignments table */}
      <Box className={classes.card}>
        <Box className={classes.sectionHeader}>
          <Typography className={classes.sectionTitle}>הקצאות נוכחיות</Typography>
          <Typography className={classes.assignmentCount}>
            {assignments.length} הקצאות
          </Typography>
        </Box>
        {grouped.map((group) => (
          <Box
            key={group.mentor?.id ?? "unknown"}
            className={classes.mentorRow}
          >
            <Box className={classes.mentorIdentity}>
              <Avatar className={classes.mentorAvatar}>
                {avatarLetter(group.mentor?.name)}
              </Avatar>
              <Typography className={classes.mentorName}>
                {group.mentor?.name ?? "חונך לא ידוע"}
              </Typography>
            </Box>
            <Box className={classes.traineesChips}>
              {group.assignments.map((a) => (
                <Box
                  key={a.id}
                  className={`${classes.chip} ${group.assignments.length > 5 ? classes.overloadChip : ""}`}
                >
                  {a.trainee?.name ?? a.traineeId}
                  <Tooltip title="הסרת הקצאה">
                    <IconButton
                      size="small"
                      aria-label={`הסרת ההקצאה של ${a.trainee?.name ?? a.traineeId}`}
                      disabled={removeMutation.isPending}
                      onClick={() => removeMutation.mutate(a.id)}
                      className={classes.removeButton}
                    >
                      <DeleteIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
            <Typography
              className={`${classes.loadStatus} ${group.assignments.length > 5 ? classes.loadStatusWarning : ""}`}
            >
              {group.assignments.length > 5 ? (
                <WarningAmberRoundedIcon fontSize="small" />
              ) : (
                <CheckCircleRoundedIcon fontSize="small" />
              )}
              {group.assignments.length > 5
                ? `${group.assignments.length} חניכים (עומס יתר)`
                : `${group.assignments.length} חניכים`}
            </Typography>
          </Box>
        ))}
        {grouped.length === 0 && (
          <Typography className={classes.emptyState}>
            אין הקצאות עדיין
          </Typography>
        )}
      </Box>

      {/* Assign Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { direction: "rtl" } }}
      >
        <DialogTitle>
          הקצאת חניך לחונך
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <FormControl className={classes.selectField} sx={{ mt: 1 }} fullWidth>
            <InputLabel id="mentor-assignment-mentor-label">חונך</InputLabel>
            <Select
              labelId="mentor-assignment-mentor-label"
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value as string)}
              label="חונך"
            >
              {volunteers.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.selectField} fullWidth>
            <InputLabel id="mentor-assignment-trainee-label">חניך</InputLabel>
            <Select
              labelId="mentor-assignment-trainee-label"
              value={selectedTrainee}
              onChange={(e) => setSelectedTrainee(e.target.value as string)}
              label="חניך"
            >
              {unassigned.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={() => setDialogOpen(false)}>ביטול</Button>
          <Button
            variant="contained"
            className={classes.addButton}
            disabled={!selectedMentor || !selectedTrainee || assignMutation.isPending}
            onClick={() =>
              assignMutation.mutate({
                mentorId: selectedMentor,
                traineeId: selectedTrainee,
                branchId: activeBranch!,
              })
            }
          >
            הקצה
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
