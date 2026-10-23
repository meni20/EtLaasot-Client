import type { GridColDef } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { createElement } from "react";
import {
  statuses,
  type FormStatus,
} from "../../../features/parent-registration/api";

export const formLabel = (value: FormStatus | null | undefined) =>
  value === undefined ? "—" : value === null ? "אין טופס" : statuses[value];

export const COLUMNS: GridColDef[] = [
  { field: "nationalIdMasked", headerName: "ת.ז", width: 150 },
  { field: "name", headerName: "שם", flex: 1.1, minWidth: 190 },
  {
    field: "parentRegistrationStatus",
    headerName: "טופס",
    width: 150,
    align: "right",
    headerAlign: "right",
    valueFormatter: formLabel,
    renderCell: (params) =>
      createElement(Chip, { size: "small", label: formLabel(params.value) }),
  },
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
  {
    field: "parentName",
    headerName: "שם הורה",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => params.value || "-",
  },
  { field: "address", headerName: "כתובת", flex: 1, minWidth: 170 },
];
