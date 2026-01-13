import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { COLUMNS } from "./Volunteer.constants";
import { useQuery } from "@tanstack/react-query";
import userService from "../../services/user.service";
import { CreateVolunteer } from "../../components/CreateVolunteerPopup/CreateVolunteer";
import type { IUser } from "../../interfaces/user.interface";

export const VolunteerPage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { data: allVolunteers } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAllUsers(),
  });

  const rowsData = useMemo(() => {
    return (
      allVolunteers?.map((volunteer: IUser) => ({
        id: volunteer.id,
        name: volunteer.name,
        age: volunteer.age,
        phoneNumber: volunteer.phoneNumber,
        email: volunteer.email,
        address: volunteer.address,
      })) ?? []
    );
  }, [allVolunteers]);

  return (
    <Box
      sx={{
        height: "85%",
        width: "90%",
        position: "absolute",
        top: "12%",
        left: "5%",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          יצירת מתנדב חדש
        </Button>
      </Box>
      <Box sx={{ height: "90%" }}>
        <DataGrid
          rows={rowsData}
          columns={COLUMNS}
          disableRowSelectionOnClick
        />
      </Box>
      {open && <CreateVolunteer open={open} onClose={() => setOpen(false)} />}
    </Box>
  );
};
