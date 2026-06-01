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
  <Stack direction="row" alignItems="center" spacing={1.25} sx={{ py: 1 }}>
    <Box
      sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "Rubik" }}>
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 700, wordBreak: "break-word", fontFamily: "Rubik" }}
      >
        {value ?? "—"}
      </Typography>
    </Box>

    {onCopy && (
      <IconButton size="small" onClick={onCopy} aria-label={`העתקת ${label}`}>
        <ContentCopyRoundedIcon fontSize="small" />
      </IconButton>
    )}
  </Stack>
);
