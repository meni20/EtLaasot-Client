import { Box, CircularProgress, Typography } from "@mui/material";
import { GridOverlay } from "@mui/x-data-grid";

export const CustomLoadingOverlay = () => {
  return (
    <GridOverlay>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress color="secondary" size={50} />
        <Typography
          variant="subtitle1"
          sx={{ mt: 2, fontWeight: 600, color: "var(--color-primary)" }}
        >
          טוען מתנדבים...
        </Typography>
      </Box>
    </GridOverlay>
  );
};
