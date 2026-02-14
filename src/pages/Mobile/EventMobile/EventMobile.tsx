import { formatDate } from "../../../utils/data.utillity";
import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import { useDataContext } from "../../../contexts/DataContext.context";

export const EventMobile: React.FC = () => {
  const { events } = useDataContext();

  return (
    <Box sx={{ px: 2, pb: 2, maxWidth: 520, mx: "auto" }}>
      <Stack spacing={1.25}>
        {events.map((event) => (
          <Card
            key={event.id}
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 3, 
              cursor: "pointer",
              "&:active": { transform: "scale(0.99)" },
            }}
          >
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={1}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>
                  {event.description}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {formatDate(event.endDate)} • {formatDate(event.startDate)}
                  {event.address ? ` • ${event.address}` : ""}
                </Typography>
              </Box>

              <Chip
                size="small"
                label={event.name}
                sx={{ borderRadius: 2, fontWeight: 700, flexShrink: 0 }}
              />
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};
