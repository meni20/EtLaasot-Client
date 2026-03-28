import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { COLUMNS } from "./Volunteer.constants";
import { useQuery } from "@tanstack/react-query";
import userService from "../../../services/user.service";
import { CreateVolunteer } from "../../../components/CreateVolunteerPopup/CreateVolunteer";
import type { IUser } from "../../../interfaces/user.interface";
import { VolunteerDetails } from "../../../components/VolunteerDetails/VolunteerDetails";
import { useVolunteerPageStyles } from "./VolunteerPage.styles";
import { useBranch } from "../../../contexts/useBranch";

export const VolunteerPage: React.FC = () => {
  const styles = useVolunteerPageStyles();
  const { activeBranch } = useBranch();
  const [open, setOpen] = useState<boolean>(false);
  const [isDialogDetailsOpen, setIsDialogDetailsOpen] =
    useState<boolean>(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<IUser>(
    {} as IUser,
  );

  const { data: allVolunteers, isFetching: isFetchingVolunteers } = useQuery({
    queryKey: ["volunteers", activeBranch],
    queryFn: () => userService.getAllVolunteers(activeBranch ?? undefined),
    enabled: !!activeBranch,
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
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography className={styles.pageTitle}>מתנדבים</Typography>
        <Button className={styles.createButton} onClick={() => setOpen(true)}>
          + יצירת מתנדב חדש
        </Button>
      </Box>
      <Box className={styles.dataGridBox}>
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
