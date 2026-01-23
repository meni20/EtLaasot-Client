import { Box, Button } from "@mui/material";
import { BasicCard } from "../../components/Card/Card";
import type { IEvent } from "../../interfaces/event.interface";
import { CreateEvent } from "../../components/CreateEvent/CreateEvent";
import { useState } from "react";
import { useStyles } from "./Event.styles";
import { useDataContext } from "../../contexts/DataContext.context";

export const EventPage: React.FC = () => {
  const styles = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const { events } = useDataContext();

  return (
    <Box className={styles.container}>
      <Box className={styles.buttonContainer}>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          className={styles.createButton}
        >
          יצירת אירוע
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
          ></BasicCard>
        ))}
      </Box>
      {open && <CreateEvent open={open} onClose={() => setOpen(false)} />}
    </Box>
  );
};
