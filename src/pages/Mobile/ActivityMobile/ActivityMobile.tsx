import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
            bgcolor: "var(--color-primary, #2f6f61)",
            boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
            "&:hover": {
              bgcolor: "var(--color-primary-dark, #285e52)",
              boxShadow:
                "var(--shadow-md, 0 12px 34px rgba(16, 24, 40, 0.1))",
            },
          }}
          onClick={() => navigate("/home")}
        >
          חזרה למסך הבית
        </Button>
      </Box>
    </Box>
  );
};
