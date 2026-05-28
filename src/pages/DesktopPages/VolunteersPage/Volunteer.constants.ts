import type { GridColDef } from "@mui/x-data-grid";

export const VOLUNTEER_BASE_COLUMNS: GridColDef[] = [
  { field: "name", headerName: "שם", flex: 1.2, minWidth: 180 },
  { field: "age", headerName: "גיל", width: 100 },
  { field: "phoneNumber", headerName: "טלפון", flex: 1 },
  { field: "email", headerName: "אימייל", flex: 1 },
  { field: "address", headerName: "כתובת", flex: 1 },
];
