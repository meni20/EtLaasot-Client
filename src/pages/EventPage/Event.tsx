import { Box, Button } from "@mui/material";
import { BasicCard } from "../../components/Card/Card";
import type { IEvent } from "../../interfaces/event.interface";
import { CreateEvent } from "../../components/CreateEvent/CreateEvent";
import { useState } from "react";
import eventService from "../../services/event.service";
import { useQuery } from "@tanstack/react-query";
import { useStyles } from "./Event.styles";
import { useDataContext } from "../../contexts/DataContext.context";

export const EventPage: React.FC = () => {
  const styles = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const { events } = useDataContext();

  console.log(events);

  return (
    <Box className={styles.container}>
      <Box sx={{ pl: 3 }}>
        <Button
          onClick={() => setOpen(true)}
          variant="outlined"
          className={styles.createButton}
        >
          יצירת אירוע
        </Button>
      </Box>
      <Box className={styles.cardsContainer}>
        {events?.map((event: IEvent) => (
          <BasicCard
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
