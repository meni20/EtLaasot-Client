import { Avatar, Box, Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/useAuth";
import { useBranch } from "../../../contexts/useBranch";
import mentorAssignmentService from "../../../services/mentorAssignment.service";
import { AUTH_ROLES } from "../../../constants/auth.const";
import { BottomNav } from "../../../components/BottomNav/BottomNav";
import { useStyles } from "./Profile.styles";
import type { IMentorAssignment } from "../../../interfaces/event.interface";

export const ProfilePage: React.FC = () => {
  const styles = useStyles();
  const { user, logout } = useAuth();
  const { activeBranch, availableBranches } = useBranch();

  const isVolunteer = user?.roles?.some(
    (r) => r.roleId === AUTH_ROLES.VOLUNTEER.id,
  );

  const { data: myTrainees = [] } = useQuery<IMentorAssignment[]>({
    queryKey: ["myTrainees"],
    queryFn: () => mentorAssignmentService.getMyTrainees(),
    enabled: !!isVolunteer,
  });

  const activeTrainees = myTrainees.filter((a) => a.isActive).length;
  const currentBranch = availableBranches.find((b) => b.id === activeBranch);

  const userRoles =
    user?.roles?.map((r) => {
      const match = Object.values(AUTH_ROLES).find((ar) => ar.id === r.roleId);
      return match?.name ?? r.role;
    }) ?? [];

  return (
    <Box className={styles.root}>
      <Box className={styles.avatarWrapper}>
        <Avatar className={styles.avatar}>
          {user?.name?.[0]?.toUpperCase() ?? "?"}
        </Avatar>
      </Box>

      <Typography className={styles.name}>{user?.name ?? ""}</Typography>
      <Typography className={styles.role}>{userRoles.join(" • ")}</Typography>

      <Box className={styles.statsRow}>
        {isVolunteer && (
          <Box className={styles.statCard}>
            <Typography className={styles.statValue}>
              {activeTrainees}
            </Typography>
            <Typography className={styles.statLabel}>חניכים</Typography>
          </Box>
        )}
        <Box className={styles.statCard}>
          <Typography className={styles.statValue}>
            {user?.roles?.length ?? 0}
          </Typography>
          <Typography className={styles.statLabel}>תפקידים</Typography>
        </Box>
      </Box>

      <Box className={styles.section}>
        <Typography className={styles.sectionTitle}>פרטים</Typography>
        <Box className={styles.infoRow}>
          <Typography className={styles.infoLabel}>סניף פעיל</Typography>
          <Typography className={styles.infoValue}>
            {currentBranch?.name ?? activeBranch ?? "—"}
          </Typography>
        </Box>
        <Box className={styles.infoRow}>
          <Typography className={styles.infoLabel}>סניפים</Typography>
          <Typography className={styles.infoValue}>
            {availableBranches.map((b) => b.name).join(", ") || "—"}
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="outlined"
        className={styles.logoutButton}
        startIcon={<LogoutIcon />}
        onClick={logout}
      >
        התנתק
      </Button>

      <BottomNav />
    </Box>
  );
};
