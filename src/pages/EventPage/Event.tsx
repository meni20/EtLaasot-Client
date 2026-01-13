import { Box, Button } from "@mui/material";
import { BasicCard } from "../../components/Card/Card";
import type { IEvent } from "../../interfaces/event.interface";
import { CreateEvent } from "../../components/CreateEvent/CreateEvent";
import { useState } from "react";

export const EventPage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const data = [
    {
      id: "11",
      name: "אירוע 1",
      startDate: new Date(),
      endDate: new Date(),
      address: "כתובת 1",
    },
    {
      id: "2",
      name: "אירוע 2",
      startDate: new Date("2024-08-15"),
      endDate: new Date("2024-08-15"),
      address: "כתובת 2",
    },
    {
      id: "3",
      name: "אירוע 3",
      startDate: new Date("2024-09-10"),
      endDate: new Date("2024-09-10"),
      address: "כתובת 3",
    },
    {
      id: "4",
      name: "אירוע 4",
      startDate: new Date("2024-10-05"),
      endDate: new Date("2024-10-05"),
      address: "כתובת 4",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3, position: "fixed", top: "10%" }}>
      <Box sx={{pl: 3}}>
        <Button onClick={() => setOpen(true)} variant="contained">יצירת אירוע</Button>
      </Box>
      <Box sx={{display:"flex",flexDirection: "row", gap: 3, pl: 3}}>
        {data.map((event) => (
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
