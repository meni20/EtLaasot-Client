import { useState } from "react";
import { useStyles } from "./Event.styles";
import { Box, Button, Typography } from "@mui/material";
import { BasicCard } from "../../../components/Card/Card";
import type { IEvent } from "../../../interfaces/event.interface";
import { useDataContext } from "../../../contexts/useDataContext";
import { CreateEvent } from "../../../components/CreateEvent/CreateEvent";

export const EventPage: React.FC = () => {
  const styles = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const { events } = useDataContext();

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography className={styles.pageTitle}>אירועים</Typography>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          className={styles.createButton}
        >
          + יצירת אירוע
        </Button>
      </Box>
      <Box className={styles.cardsContainer}>
        {events?.map((event: IEvent) => (
          <BasicCard
            key={event.id}
            eventId={event.id ?? ""}
            eventName={event.name}
            eventDate={event.startDate}
            address={event.address}
          />
        ))}
      </Box>
      {events?.length === 0 && (
        <Typography className={styles.emptyState}>
          אין אירועים להצגה. צור אירוע חדש!
        </Typography>
      )}
      {open && <CreateEvent open={open} onClose={() => setOpen(false)} />}
    </Box>
  );
};
