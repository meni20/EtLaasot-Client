import type { GridColDef } from "@mui/x-data-grid";

export const VOLUNTEER_BASE_COLUMNS: GridColDef[] = [
  { field: "name", headerName: "שם", flex: 1.2, minWidth: 190 },
  {
    field: "age",
    headerName: "גיל",
    width: 100,
    renderCell: (params) => params.value ?? "-",
  },
  {
    field: "gender",
    headerName: "מגדר",
    width: 110,
    renderCell: (params) => params.value || "-",
  },
  { field: "shirtSizeDisplay", headerName: "מידת חולצה", width: 120 },
  { field: "phoneNumber", headerName: "טלפון", flex: 1, minWidth: 140 },
  { field: "email", headerName: "אימייל", flex: 1, minWidth: 180 },
  { field: "address", headerName: "כתובת", flex: 1, minWidth: 170 },
];
