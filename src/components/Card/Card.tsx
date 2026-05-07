import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useCardStyles } from "./Card.styles";
import { useQuery } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import type { ICardProps } from "./Card.interface";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { useBranch } from "../../contexts/useBranch";
import { formatDate } from "../../utils/data.utillity";
import userService from "../../services/user.service";
import type { IUser } from "../../interfaces/user.interface";
import { AddAttendeeDialog } from "../AddAttendeeDialog/AddAttendeeDialog";
import { EventAtendeeDialog } from "../EventAtendeeDialog/EventAtendeeDialog";

export const BasicCard: React.FC<ICardProps> = ({
  eventId,
  eventName,
  eventDate,
  address,
  onEdit,
}) => {
  const classes = useCardStyles();
  const { activeBranch } = useBranch();
  const [open, setOpen] = useState<boolean>(false);
  const [isAddAttenddeOpen, setIsAddAtendeeOpen] = useState<boolean>(false);

  const { data: allUsers } = useQuery({
    queryKey: ["users", activeBranch],
    queryFn: () => userService.getAllUsers(activeBranch ?? undefined),
    select: (data) =>
      [...data].sort((a, b) => {
        const roleA = a.userRoles?.[0]?.roleId ?? Infinity;
        const roleB = b.userRoles?.[0]?.roleId ?? Infinity;
        return roleA - roleB;
      }),
  });

  const formattedVolunteers = useMemo(() => {
    return allUsers?.map((user: IUser) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.userRoles?.[0]?.roleId ?? 0,
      events: user.events,
    }));
  }, [allUsers]);

  return (
    <Box className={classes.cardContainer}>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.eventName}>
            {eventName}
          </Typography>
          <Typography className={classes.eventDate}>
            📅 {formatDate(eventDate)}
          </Typography>
          <Typography className={classes.eventAddress}>📍 {address}</Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            size="small"
            className={classes.showButton}
            onClick={() => setOpen(true)}
          >
            הצג משתתפים
          </Button>
          <Button
           size="small"
           onClick={onEdit}
>
  ערוך
</Button>
          
          <Box
            className={classes.addIconBox}
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
        />
      )}

      {open && (
        <EventAtendeeDialog
          open={open}
          onClose={() => setOpen(false)}
          eventId={eventId}
        />
      )}
    </Box>
  );
};
