import { makeStyles } from "@mui/styles";
import { alpha, type Theme } from "@mui/material/styles";
import { theme } from "../../../theme/them";

type FilesPageClassKey =
  | "root"
  | "content"
  | "header"
  | "titleRow"
  | "titleIcon"
  | "pageTitle"
  | "subtitle"
  | "categoryGrid"
  | "categoryButton"
  | "selectedCategory"
  | "categoryIcon"
  | "categoryText"
  | "filtersCard"
  | "searchField"
  | "branchField"
  | "resultCount"
  | "dataGridBox"
  | "stateCard"
  | "stateTitle"
  | "stateText"
  | "viewButton";

export const useFilesPageStyles = makeStyles<Theme, {}, FilesPageClassKey>({
  root: {
    minHeight: "100dvh",
    padding: "88px 24px 24px",
    direction: "rtl",
    color: "var(--color-text)",
    background:
      "linear-gradient(180deg, var(--color-canvas) 0%, rgba(255, 255, 255, 0.94) 100%)",
  },
  content: {
    width: "100%",
    maxWidth: 1480,
    margin: "0 auto",
  },
  header: {
    marginBottom: 18,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  titleIcon: {
    width: 44,
    height: 44,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: 13,
    color: "var(--color-primary)",
    backgroundColor: "var(--color-primary-soft)",
    border: "1px solid rgba(var(--color-primary-rgb), 0.16)",
    "& svg": { fontSize: 25 },
  },
  pageTitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: "750 !important",
    fontSize: "1.65rem !important",
    lineHeight: "1.2 !important",
  },
  subtitle: {
    marginTop: "5px !important",
    color: "var(--color-text-secondary)",
    fontFamily: theme.typography.fontFamily,
    fontSize: "0.94rem !important",
    lineHeight: "1.55 !important",
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 14,
  },
  categoryButton: {
    minHeight: 82,
    width: "100%",
    display: "flex !important",
    justifyContent: "flex-start !important",
    gap: "13px !important",
    padding: "16px 18px !important",
    borderRadius: "16px !important",
    color: `${theme.palette.text.primary} !important`,
    backgroundColor: `${alpha(theme.palette.background.paper, 0.86)} !important`,
    border: `1px solid ${alpha(theme.palette.divider, 0.88)} !important`,
    boxShadow: `${theme.shadows[1]} !important`,
    textAlign: "right" as const,
    transition:
      "background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease !important",
    "&:hover": {
      backgroundColor: `${theme.palette.primary.light} !important`,
      borderColor: `${alpha(theme.palette.primary.main, 0.45)} !important`,
    },
    "&:focus-visible": {
      outline: `3px solid ${alpha(theme.palette.primary.main, 0.22)}`,
      outlineOffset: 2,
    },
  },
  selectedCategory: {
    color: `${theme.palette.primary.dark} !important`,
    backgroundColor: `${theme.palette.primary.light} !important`,
    borderColor: `${theme.palette.primary.main} !important`,
    boxShadow: `inset 0 -3px 0 ${theme.palette.primary.main}, ${theme.shadows[1]} !important`,
  },
  categoryIcon: {
    width: 42,
    height: 42,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: 12,
    color: "var(--color-primary)",
    backgroundColor: "rgba(var(--color-primary-rgb), 0.1)",
    "& svg": { fontSize: 23 },
  },
  categoryText: {
    minWidth: 0,
    fontFamily: theme.typography.fontFamily,
    fontWeight: "750 !important",
    fontSize: "1rem !important",
  },
  filtersCard: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 1fr) auto auto",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: alpha(theme.palette.background.paper, 0.86),
    border: `1px solid ${alpha(theme.palette.divider, 0.86)}`,
    boxShadow: theme.shadows[1],
    backdropFilter: "blur(16px) saturate(1.3)",
    WebkitBackdropFilter: "blur(16px) saturate(1.3)",
  },
  searchField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      minHeight: 44,
      borderRadius: 12,
      backgroundColor: theme.palette.background.paper,
    },
    "& input": {
      textAlign: "right" as const,
      fontFamily: theme.typography.fontFamily,
    },
    "& .MuiInputAdornment-root": {
      color: "var(--color-primary)",
    },
  },
  branchField: {
    width: 230,
    "& .MuiOutlinedInput-root": {
      minHeight: 44,
      borderRadius: 12,
      backgroundColor: theme.palette.background.paper,
    },
  },
  resultCount: {
    minHeight: 44,
    display: "inline-flex !important",
    alignItems: "center",
    paddingInline: "6px !important",
    color: "var(--color-text-secondary)",
    fontFamily: theme.typography.fontFamily,
    fontWeight: "700 !important",
    fontSize: "0.86rem !important",
    whiteSpace: "nowrap" as const,
  },
  dataGridBox: {
    height: "calc(100dvh - 366px)",
    minHeight: 430,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "var(--color-surface)",
    border: `1px solid ${alpha(theme.palette.divider, 0.86)}`,
    boxShadow: theme.shadows[2],
    "& .MuiDataGrid-root": {
      direction: "rtl",
      border: 0,
      fontFamily: theme.typography.fontFamily,
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: alpha(theme.palette.background.default, 0.9),
      color: "var(--color-text-secondary)",
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 750,
    },
    "& .MuiDataGrid-row": {
      minHeight: "64px !important",
      transition: "background-color 140ms ease",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
      },
    },
    "& .MuiDataGrid-cell": {
      minHeight: "64px !important",
      borderColor: theme.palette.divider,
      fontSize: 13.5,
      outline: "none",
    },
    "& .MuiDataGrid-footerContainer": {
      minHeight: 50,
      backgroundColor: alpha(theme.palette.background.default, 0.72),
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    "& .MuiDataGrid-overlay": {
      color: "var(--color-text-secondary)",
      fontFamily: theme.typography.fontFamily,
      fontWeight: 700,
    },
  },
  stateCard: {
    minHeight: 300,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
    borderRadius: 16,
    textAlign: "center" as const,
    backgroundColor: "var(--color-surface)",
    border: `1px solid ${alpha(theme.palette.divider, 0.86)}`,
    boxShadow: theme.shadows[1],
  },
  stateTitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: "750 !important",
    fontSize: "1.05rem !important",
  },
  stateText: {
    color: "var(--color-text-secondary)",
    fontFamily: theme.typography.fontFamily,
    fontSize: "0.92rem !important",
  },
  viewButton: {
    minWidth: "88px !important",
    minHeight: "40px !important",
    borderRadius: "11px !important",
    fontFamily: `${theme.typography.fontFamily} !important`,
    fontWeight: "700 !important",
    "& .MuiButton-startIcon": {
      marginLeft: 6,
      marginRight: 0,
    },
  },
  "@media (max-width: 1100px)": {
    root: {
      padding: "80px 16px 20px",
    },
    filtersCard: {
      gridTemplateColumns: "minmax(240px, 1fr) 210px",
    },
    resultCount: {
      gridColumn: "1 / -1",
      minHeight: 26,
      paddingInline: "2px !important",
    },
    dataGridBox: {
      height: "calc(100dvh - 398px)",
      minHeight: 390,
      overflowX: "auto" as const,
      "& .MuiDataGrid-root": {
        minWidth: 980,
      },
    },
  },
  "@media (max-width: 760px)": {
    categoryGrid: {
      gridTemplateColumns: "1fr",
    },
    categoryButton: {
      minHeight: 64,
      padding: "11px 14px !important",
    },
    filtersCard: {
      gridTemplateColumns: "1fr",
    },
    branchField: {
      width: "100%",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    categoryButton: {
      transition: "none !important",
    },
    dataGridBox: {
      "& .MuiDataGrid-row": { transition: "none" },
    },
  },
  "@media (prefers-reduced-transparency: reduce)": {
    filtersCard: {
      backgroundColor: theme.palette.background.paper,
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  },
} as any);
