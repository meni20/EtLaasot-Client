import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { COLUMNS } from "./Trainee.constants";
import { useQuery } from "@tanstack/react-query";
import userService from "../../../services/user.service";
import type { IUser } from "../../../interfaces/user.interface";
import { CreateTrainee } from "../../../components/CreateTrainee/CreateTrainee";
import { VolunteerDetails } from "../../../components/VolunteerDetails/VolunteerDetails";
import { isAdmin } from "../../../constants/auth.const";

export const TraineePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isDialogDetailsOpen, setIsDialogDetailsOpen] =
    useState<boolean>(false);
  const [selectedTrainee, setSelectedTrainee] = useState<IUser>({} as IUser);
  const canManageTrainees = isAdmin();

  const { data: allTrainees, isFetching: isFetchingTrainees } = useQuery({
    queryKey: ["trainees"],
    queryFn: () => userService.getAllTreanees(),
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
    <Box
      sx={{
        height: "85%",
        width: "90%",
        position: "absolute",
        top: "12%",
        left: "5%",
      }}
    >
      {canManageTrainees && (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            ׳™׳¦׳™׳¨׳× ׳—׳ ׳™׳ ׳—׳“׳©
          </Button>
        </Box>
      )}
      <Box sx={{ height: "90%" }}>
        <DataGrid
          rows={rowsData}
          columns={COLUMNS}
          loading={isFetchingTrainees}
          onRowClick={(params) => {
            setIsDialogDetailsOpen(true);
            setSelectedTrainee(params.row);
          }}
        />
      </Box>
      {canManageTrainees && open && (
        <CreateTrainee open={open} onClose={() => setOpen(false)} />
      )}
      {isDialogDetailsOpen && (
        <VolunteerDetails
          open={isDialogDetailsOpen}
          onClose={() => setIsDialogDetailsOpen(false)}
          volunteerData={selectedTrainee}
        />
      )}
    </Box>
  );
};
