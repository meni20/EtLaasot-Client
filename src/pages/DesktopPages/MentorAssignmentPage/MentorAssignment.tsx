import React, { useState, useMemo } from "react";
import {
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import userService from "../../../services/user.service";
import { useBranch } from "../../../contexts/useBranch";
import { useMentorAssignmentStyles } from "./MentorAssignment.styles";
import type { IMentorAssignment } from "../../../interfaces/event.interface";
import type { IUser } from "../../../interfaces/user.interface";

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
        <CircularProgress sx={{ color: "#9a5188" }} />
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
        <Box className={classes.unassignedCard}>
          ⚠️ {unassigned.length} חניכים ללא חונך מוקצה:{" "}
          {unassigned.map((u) => u.name).join(", ")}
        </Box>
      )}

      {/* Assignments table */}
      <Box className={classes.card}>
        <Typography className={classes.sectionTitle}>הקצאות נוכחיות</Typography>
        {grouped.map((group) => (
          <Box
            key={group.mentor?.id ?? "unknown"}
            className={classes.mentorRow}
          >
            <Typography className={classes.mentorName}>
              {group.mentor?.name ?? "חונך לא ידוע"}
            </Typography>
            <Box className={classes.traineesChips}>
              {group.assignments.map((a) => (
                <Box
                  key={a.id}
                  className={`${classes.chip} ${group.assignments.length > 5 ? classes.overloadChip : ""}`}
                >
                  {a.trainee?.name ?? a.traineeId}
                  <IconButton
                    size="small"
                    onClick={() => removeMutation.mutate(a.id)}
                    sx={{ padding: "2px", marginRight: "4px" }}
                  >
                    <DeleteIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Typography
              sx={{ marginRight: "auto", fontSize: "0.85rem", color: "#666" }}
            >
              {group.assignments.length > 5
                ? `⚠️ ${group.assignments.length} חניכים (עומס יתר)`
                : `✅ ${group.assignments.length} חניכים`}
            </Typography>
          </Box>
        ))}
        {grouped.length === 0 && (
          <Typography sx={{ color: "#999", fontFamily: "Rubik" }}>
            אין הקצאות עדיין
          </Typography>
        )}
      </Box>

      {/* Assign Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: "Rubik", direction: "rtl" }}>
          הקצאת חניך לחונך
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <FormControl className={classes.selectField} sx={{ mt: 1 }}>
            <InputLabel>חונך</InputLabel>
            <Select
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
          <FormControl className={classes.selectField}>
            <InputLabel>חניך</InputLabel>
            <Select
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
        <DialogActions sx={{ direction: "rtl", px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>ביטול</Button>
          <Button
            variant="contained"
            className={classes.addButton}
            disabled={!selectedMentor || !selectedTrainee}
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
