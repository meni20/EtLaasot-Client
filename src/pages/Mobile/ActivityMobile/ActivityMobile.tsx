import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "../../../components/BottomNav/BottomNav";
import { useStyles } from "./ActivityMobile.styles";

export const ActivityMobile: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <Box className={styles.root}>
      <Box className={styles.sectionCard}>
        <Typography className={styles.header}>פעילות באירוע</Typography>
        <Typography className={styles.subheader}>
          דיווח פעילות זמין עכשיו ישירות ממסך הבית.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          className={styles.actionButton}
          sx={{
            bgcolor: "#7B3F98",
            boxShadow: "0 4px 12px rgba(123, 63, 152, 0.22)",
            "&:hover": { bgcolor: "#6D3588" },
          }}
          onClick={() => navigate("/home")}
        >
          חזרה למסך הבית
        </Button>
      </Box>

      <BottomNav />
    </Box>
  );
};
