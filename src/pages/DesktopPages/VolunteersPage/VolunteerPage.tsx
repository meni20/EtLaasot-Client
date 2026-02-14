import { useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { COLUMNS } from "./Volunteer.constants";
import { useQuery } from "@tanstack/react-query";
import userService from "../../../services/user.service";
import type { IUser } from "../../../interfaces/user.interface";
import { useVolunteerPageStyles } from "./VolunteerPage.styles";
import { VolunteerDetails } from "../../../components/VolunteerDetails/VolunteerDetails";
import { CreateVolunteer } from "../../../components/CreateVolunteerPopup/CreateVolunteer";

export const VolunteerPage: React.FC = () => {
  const styles = useVolunteerPageStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [isDialogDetailsOpen, setIsDialogDetailsOpen] =
    useState<boolean>(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<IUser>(
    {} as IUser
  );

  const { data: allVolunteers, isFetching: isFetchingVolunteers } = useQuery({
    queryKey: ["volunteers"],
    queryFn: () => userService.getAllVolunteers(),
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
        <Button className={styles.createButton} onClick={() => setOpen(true)}>
          יצירת מתנדב חדש
        </Button>
      </Box>
      <Box sx={{ height: "90%" }}>
        <DataGrid
          rows={rowsData}
          columns={COLUMNS}
          loading={isFetchingVolunteers}
          onRowClick={(params) => {
            setIsDialogDetailsOpen(true);
            setSelectedVolunteer(params.row);
          }}
        />
      </Box>

      {open && <CreateVolunteer open={open} onClose={() => setOpen(false)} />}
      {isDialogDetailsOpen && (
        <VolunteerDetails
          open={isDialogDetailsOpen}
          onClose={() => setIsDialogDetailsOpen(false)}
          volunteerData={selectedVolunteer}
        />
      )}
    </Box>
  );
};
