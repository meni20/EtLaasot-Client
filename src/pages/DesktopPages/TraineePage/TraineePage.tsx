import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { COLUMNS } from "./Trainee.constants";
import { useQuery } from "@tanstack/react-query";
import userService from "../../../services/user.service";
import type { IUser } from "../../../interfaces/user.interface";
import { CreateTrainee } from "../../../components/CreateTrainee/CreateTrainee";
import { VolunteerDetails } from "../../../components/VolunteerDetails/VolunteerDetails";
import { useBranch } from "../../../contexts/useBranch";
import { useTraineePageStyles } from "./TraineePage.styles";

export const TraineePage: React.FC = () => {
  const styles = useTraineePageStyles();
  const { activeBranch } = useBranch();
  const [open, setOpen] = useState<boolean>(false);
  const [isDialogDetailsOpen, setIsDialogDetailsOpen] =
    useState<boolean>(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<IUser>(
    {} as IUser
  );

  const { data: allTrainees, isFetching: isFetchingTrainees } = useQuery({
    queryKey: ["trainees", activeBranch],
    queryFn: () => userService.getAllTrainees(activeBranch ?? undefined),
    enabled: !!activeBranch,
  });

  const rowsData = useMemo(() => {
    return (
      allTrainees?.map((trainee: IUser) => ({
        id: trainee.id,
        name: trainee.name,
        age: trainee.age,
        phoneNumber: trainee.phoneNumber,
        email: trainee.email,
        address: trainee.address,
      })) ?? []
    );
  }, [allTrainees]);

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography className={styles.pageTitle}>חניכים</Typography>
        <Button className={styles.createButton} onClick={() => setOpen(true)}>
          + יצירת חניך חדש
        </Button>
      </Box>
      <Box className={styles.dataGridBox}>
        <DataGrid
          rows={rowsData}
          columns={COLUMNS}
          loading={isFetchingTrainees}
          onRowClick={(params) => {
            setIsDialogDetailsOpen(true);
            setSelectedVolunteer(params.row);
          }}
        />
      </Box>
      {open && <CreateTrainee open={open} onClose={() => setOpen(false)} />}
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
