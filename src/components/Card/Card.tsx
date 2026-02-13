import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import type { ICardProps } from "./Card.interface";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import userService from "../../services/user.service";
import { formatDate } from "../../utils/data.utillity";
import type { IUser } from "../../interfaces/user.interface";
import { AddAttendeeDialog } from "../AddAttendeeDialog/AddAttendeeDialog";
import { EventAtendeeDialog } from "../EventAtendeeDialog/EventAtendeeDialog";

export const BasicCard: React.FC<ICardProps> = ({
  eventId,
  eventName,
  eventDate,
  address,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isAddAttenddeOpen, setIsAddAtendeeOpen] = useState<boolean>(false);

  const { data: allUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAllUsers(),
  });

  const formattedVolunteers = useMemo(() => {
    return allUsers?.map((user: IUser) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }, [allUsers]);

  return (
    <Box
      sx={{
        width: 280,
        m: 2,
        display: "inline-block",
        verticalAlign: "top",
      }}
    >
      <Card
        sx={{
          minWidth: 250,
          borderRadius: 3,
          boxShadow: 4,
          direction: "rtl",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            {eventName}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              mb: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📅 {formatDate(eventDate)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontSize: 15 }}
          >
            📍 {address}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={() => setOpen(true)}
          >
            הצג משתתפים
          </Button>
          <Box
            sx={{ paddingRight: "50%", cursor: "pointer" }}
            onClick={() => setIsAddAtendeeOpen(true)}
          >
            <AddIcon />
          </Box>
        </CardActions>
      </Card>

      {isAddAttenddeOpen && (
        <AddAttendeeDialog
          eventId={eventId}
          open={isAddAttenddeOpen}
          onClose={() => setIsAddAtendeeOpen(false)}
          users={formattedVolunteers || []}
          onDelete={() => {}}
        />
      )}

      {open && (
        <EventAtendeeDialog
          open={open}
          onClose={() => setOpen(false)}
          eventId={eventId}
          onDelete={() => {}}
        />
      )}
    </Box>
  );
};
