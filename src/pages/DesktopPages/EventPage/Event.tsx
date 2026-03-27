import { useState } from "react";
import { useStyles } from "./Event.styles";
import { Box, Button } from "@mui/material";
import { BasicCard } from "../../../components/Card/Card";
import type { IEvent } from "../../../interfaces/event.interface";
import { useDataContext } from "../../../contexts/DataContext.context";
import { CreateEvent } from "../../../components/CreateEvent/CreateEvent";
import { isAdmin } from "../../../constants/auth.const";

export const EventPage: React.FC = () => {
  const styles = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const { events } = useDataContext();
  const canManageEvents = isAdmin();

  return (
    <Box className={styles.container}>
      {canManageEvents && (
        <Box className={styles.buttonContainer}>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            className={styles.createButton}
          >
            ׳™׳¦׳™׳¨׳× ׳׳™׳¨׳•׳¢
          </Button>
        </Box>
      )}
      <Box className={styles.cardsContainer}>
        {events?.map((event: IEvent) => (
          <BasicCard
            key={event.id}
            eventId={event.id ?? ""}
            eventName={event.name}
            eventDate={event.startDate}
            address={event.address}
            canManage={canManageEvents}
          />
        ))}
      </Box>
      {canManageEvents && open && (
        <CreateEvent open={open} onClose={() => setOpen(false)} />
      )}
    </Box>
  );
};
