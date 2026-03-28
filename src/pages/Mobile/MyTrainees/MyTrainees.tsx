import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { useQuery } from "@tanstack/react-query";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import { BottomNav } from "../../../components/BottomNav/BottomNav";
import { useStyles } from "./MyTrainees.styles";
import type { IMentorAssignment } from "../../../interfaces/event.interface";

export const MyTraineesPage: React.FC = () => {
  const styles = useStyles();

  const { data: assignments = [] } = useQuery<IMentorAssignment[]>({
    queryKey: ["myTrainees"],
    queryFn: () => mentorAssignmentService.getMyTrainees(),
  });

  const activeAssignments = assignments.filter((a) => a.isActive);

  return (
    <Box className={styles.root}>
      <Typography className={styles.header}>
        החניכים שלי ({activeAssignments.length})
      </Typography>

      {activeAssignments.length === 0 && (
        <Typography className={styles.empty}>
          אין חניכים משויכים אליך כרגע
        </Typography>
      )}

      <Stack spacing={1}>
        {activeAssignments.map((assignment) => {
          const trainee = assignment.trainee;
          const initials = trainee?.name
            ? trainee.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
            : "?";

          return (
            <Box key={assignment.id} className={styles.traineeCard}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar className={styles.avatar}>{initials}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography className={styles.traineeName}>
                    {trainee?.name ?? "חניך"}
                  </Typography>
                  <Typography className={styles.traineeInfo}>
                    {trainee?.phoneNumber ?? "אין טלפון"}
                  </Typography>
                </Box>
                {trainee?.phoneNumber && (
                  <IconButton
                    className={styles.actionButton}
                    href={`tel:${trainee.phoneNumber}`}
                    sx={{ color: "#9a5188" }}
                  >
                    <PhoneIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>

      <BottomNav />
    </Box>
  );
};
