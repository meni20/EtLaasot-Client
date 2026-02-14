import type { GridColDef } from "@mui/x-data-grid";

export const COLUMNS: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "age", headerName: "Age", width: 100 },
  { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "address", headerName: "Address", flex: 1 },
];
