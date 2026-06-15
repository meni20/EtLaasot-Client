import type { GridColDef } from "@mui/x-data-grid";

export const COLUMNS: GridColDef[] = [
  { field: "id", headerName: "ת.ז", width: 150 },
  { field: "name", headerName: "שם", flex: 1 },
  { field: "age", headerName: "גיל", width: 100 },
  {
    field: "gender",
    headerName: "Gender",
    width: 110,
    renderCell: (params) => params.value || "-",
  },
  { field: "phoneNumber", headerName: "טלפון", flex: 1 },
  { field: "email", headerName: "אימייל", flex: 1 },
  { field: "address", headerName: "כתובת", flex: 1 },
];
