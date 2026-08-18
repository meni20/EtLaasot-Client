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
      minHeight: 58,
      py: 1,
      px: 1,
      borderRadius: 2,
      transition: "background-color 140ms ease",
      "&:hover": {
        backgroundColor: "rgba(111, 61, 100, 0.045)",
      },
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "12px",
        color: "var(--people-primary, #6f3d64)",
        backgroundColor: "var(--people-primary-soft, #efe5ed)",
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
          color: "var(--people-text-muted, #6d6670)",
          fontFamily: "inherit",
          fontWeight: 700,
          lineHeight: 1.25,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: 0.25,
          color: "var(--people-text, #1f1f23)",
          fontWeight: 800,
          wordBreak: "break-word",
          fontFamily: "inherit",
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
          width: 44,
          height: 44,
          color: "var(--people-primary, #6f3d64)",
          backgroundColor: "#fff",
          border: "1px solid var(--people-border, #e6e1e6)",
          flexShrink: 0,
          "&:hover": {
            color: "#fff",
            backgroundColor: "var(--people-primary, #6f3d64)",
            borderColor: "var(--people-primary, #6f3d64)",
          },
          "&:active": {
            transform: "scale(0.96)",
          },
          "&.Mui-focusVisible": {
            boxShadow: "0 0 0 4px var(--people-focus, rgba(111,61,100,0.34))",
          },
          "@media (prefers-reduced-motion: reduce)": {
            "&:active": {
              transform: "none",
            },
          },
        }}
      >
        <ContentCopyRoundedIcon fontSize="small" />
      </IconButton>
    )}
  </Stack>
);
