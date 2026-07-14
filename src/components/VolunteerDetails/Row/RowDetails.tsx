import { Box, IconButton, Stack, Typography } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

export const Row = ({
  icon,
  label,
  value,
  onCopy,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
  onCopy?: () => void;
}) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1.5}
    sx={{
      minHeight: 54,
      py: 1,
      px: 0.5,
      borderRadius: 2,
      transition: "background-color 0.18s ease",
      "&:hover": {
        backgroundColor: "rgba(154, 81, 136, 0.035)",
      },
    }}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "10px",
        color: "#7a3e6b",
        backgroundColor: "#fbf7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{
          color: "#7a7078",
          fontFamily: "Rubik",
          fontWeight: 600,
          lineHeight: 1.25,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: 0.25,
          color: "#2f2930",
          fontWeight: 800,
          wordBreak: "break-word",
          fontFamily: "Rubik",
          lineHeight: 1.35,
          fontSize: "0.95rem",
        }}
      >
        {value ?? "-"}
      </Typography>
    </Box>

    {onCopy && (
      <IconButton
        size="small"
        onClick={onCopy}
        aria-label={`העתקת ${label}`}
        sx={{
          width: 34,
          height: 34,
          color: "#7a3e6b",
          backgroundColor: "#fff",
          border: "1px solid #ead8e5",
          flexShrink: 0,
          "&:hover": {
            color: "#fff",
            backgroundColor: "#9a5188",
            borderColor: "#9a5188",
          },
        }}
      >
        <ContentCopyRoundedIcon fontSize="small" />
      </IconButton>
    )}
  </Stack>
);
