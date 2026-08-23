import { makeStyles } from "@mui/styles";

export const useActivityAdminStyles = makeStyles({
  root: {
    minHeight: "100dvh",
    padding: "88px 24px 24px",
    direction: "rtl",
    background:
      "linear-gradient(180deg, var(--color-canvas-warm) 0%, var(--color-canvas) 52%)",
  },
  header: {
    maxWidth: 1480,
    margin: "0 auto 18px",
  },
  pageTitle: {
    margin: "0 0 6px !important",
    fontFamily: "inherit !important",
    fontWeight: "700 !important",
    color: "var(--color-text)",
    fontSize: "1.5rem !important",
    lineHeight: "1.25 !important",
  },
  subtitle: {
    color: "var(--color-text-secondary)",
    fontFamily: "inherit !important",
    fontSize: "0.92rem !important",
    lineHeight: "1.5 !important",
  },
  filtersCard: {
    maxWidth: 1480,
    margin: "0 auto 18px",
    padding: 18,
    borderRadius: "var(--radius-lg)",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.82))",
    border: "1px solid var(--color-border-subtle)",
    boxShadow: "var(--shadow-sm)",
    "& .MuiTextField-root": {
      minWidth: 0,
    },
    "& .MuiInputLabel-root": {
      fontFamily: "inherit",
      color: "var(--color-text-secondary)",
    },
    "& .MuiInputBase-root": {
      minHeight: 44,
      fontFamily: "inherit",
      backgroundColor: "var(--color-surface)",
    },
  },
  resetButton: {
    minHeight: "44px !important",
    color: "var(--color-primary) !important",
    borderColor: "var(--color-border) !important",
    fontFamily: "inherit !important",
    fontWeight: "700 !important",
    "&:hover": {
      borderColor: "var(--color-primary) !important",
      backgroundColor: "var(--color-primary-soft) !important",
    },
  },
  dataGridBox: {
    maxWidth: 1480,
    height: "calc(100dvh - 310px)",
    minHeight: 430,
    margin: "0 auto",
    background: "var(--color-surface)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--color-border-subtle)",
    "& .MuiDataGrid-root": {
      direction: "rtl",
      border: 0,
      fontFamily: "inherit",
      color: "var(--color-text)",
      backgroundColor: "var(--color-surface)",
    },
    "& .MuiDataGrid-main": {
      minWidth: 0,
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "var(--color-surface-muted)",
      color: "var(--color-text-secondary)",
      fontWeight: 700,
      fontFamily: "inherit",
      borderBottomColor: "var(--color-border-subtle)",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
    },
    "& .MuiDataGrid-row": {
      fontFamily: "inherit",
      borderBottom: "1px solid var(--color-border-subtle)",
      transition: "background-color var(--transition-fast)",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "var(--color-primary-soft)",
    },
    "& .MuiDataGrid-cell": {
      borderColor: "var(--color-border-subtle)",
      fontSize: 13,
      alignItems: "center",
      lineHeight: 1.5,
      outline: "none !important",
    },
    "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within": {
      outline: "2px solid rgba(var(--color-primary-rgb), 0.36) !important",
      outlineOffset: -2,
    },
    "& .MuiTablePagination-root": {
      direction: "ltr",
      color: "var(--color-text-secondary)",
      fontFamily: "inherit",
      borderTop: "1px solid var(--color-border-subtle)",
    },
    "& .MuiCircularProgress-root": {
      color: "var(--color-primary)",
    },
  },
  statusActive: {
    minWidth: 72,
    justifyContent: "center",
    color: "var(--color-warning) !important",
    backgroundColor: "var(--color-warning-soft) !important",
    border: "1px solid rgba(168, 97, 10, 0.18)",
    fontFamily: "inherit !important",
    fontWeight: "700 !important",
  },
  statusCompleted: {
    minWidth: 72,
    justifyContent: "center",
    color: "var(--color-success) !important",
    backgroundColor: "var(--color-success-soft) !important",
    border: "1px solid rgba(var(--color-success-rgb), 0.18)",
    fontFamily: "inherit !important",
    fontWeight: "700 !important",
  },
  emptyState: {
    maxWidth: 1480,
    margin: "12px auto 0 !important",
    textAlign: "center" as const,
    color: "var(--color-text-secondary)",
    padding: "14px 16px",
    fontFamily: "inherit !important",
    fontSize: "0.92rem !important",
    fontWeight: "600 !important",
    borderRadius: "var(--radius-md)",
    border: "1px dashed var(--color-border)",
    backgroundColor: "var(--color-surface-muted)",
  },
  stateCard: {
    maxWidth: 1480,
    minHeight: 220,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border-subtle)",
    background: "var(--color-surface)",
    boxShadow: "var(--shadow-sm)",
    textAlign: "center" as const,
  },
  stateText: {
    color: "var(--color-text-secondary)",
    fontFamily: "inherit !important",
    fontSize: "0.96rem !important",
    fontWeight: "600 !important",
    lineHeight: "1.5 !important",
  },
  "@media (max-width: 1024px)": {
    root: {
      padding: "76px 16px 18px",
    },
    dataGridBox: {
      height: "calc(100dvh - 390px)",
      minHeight: 380,
      overflowX: "auto" as const,
      "& .MuiDataGrid-root": {
        minWidth: 1120,
      },
    },
  },
  "@media (max-width: 600px)": {
    root: {
      padding: "72px 12px 16px",
      overflowX: "hidden",
    },
    pageTitle: {
      fontSize: "1.3rem !important",
    },
    filtersCard: {
      padding: 14,
    },
    dataGridBox: {
      height: "calc(100dvh - 430px)",
      minHeight: 360,
    },
  },
});
