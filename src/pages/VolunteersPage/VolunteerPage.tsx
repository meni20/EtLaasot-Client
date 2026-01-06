import { Box, Button } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import userService from "../../services/user.service";

export const VolunteerPage: React.FC = () => {
  const rows = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    role: i % 2 === 0 ? "Volunteer" : "Student",
    age: 18 + (i % 20),
  }));

  const { data: allVolunteers } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAllUsers(),
  });


  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "age", headerName: "Age", width: 100 },
  ];

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
      <Button variant="contained" onClick={() => console.log("beni")
      }>
        Add row
      </Button>
      <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick  />
    </Box>
  );
};
