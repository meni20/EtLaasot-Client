import type { GridColDef } from "@mui/x-data-grid";

export const COLUMNS: GridColDef[] = [
  { field: "nationalIdMasked", headerName: "ת.ז", width: 150 },
  { field: "name", headerName: "שם", flex: 1 },
  {
    field: "age",
    headerName: "גיל",
    width: 100,
    renderCell: (params) => params.value ?? "-",
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 110,
    renderCell: (params) => params.value || "-",
  },
  { field: "shirtSizeDisplay", headerName: "מידת חולצה", width: 120 },
  { field: "phoneNumber", headerName: "טלפון", flex: 1 },
  {
    field: "parentName",
    headerName: "שם הורה",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => params.value || "-",
  },
  { field: "address", headerName: "כתובת", flex: 1 },
];
