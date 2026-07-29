import { makeStyles } from "@mui/styles";

export const useActivityAdminStyles = makeStyles({
  container: {
    padding: "88px 24px 24px",
    direction: "rtl",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    "@media (max-width: 900px)": {
      padding: "72px 12px 16px",
      overflowX: "hidden",
    },
  },
  header: {
    marginBottom: 20,
  },
  pageTitle: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    color: "#333",
    fontSize: "1.5rem",
    marginBottom: "6px !important",
  },
  subtitle: {
    color: "#777",
    fontFamily: "Rubik, sans-serif",
    fontSize: 14,
  },
  filtersCard: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#fff",
    border: "1px solid #f0ecef",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    marginBottom: 18,
  },
  dataGridBox: {
    height: "calc(100vh - 290px)",
    background: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    border: "1px solid #f0ecef",
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#f8f4f9",
      color: "#7a3e6b",
      fontWeight: 700,
      fontFamily: "Rubik, sans-serif",
    },
    "& .MuiDataGrid-row": {
      fontFamily: "Rubik, sans-serif",
    },
    "& .MuiDataGrid-cell": {
      borderColor: "#f5f0f3",
      fontSize: 13,
      alignItems: "center",
    },
  },
  emptyState: {
    textAlign: "center" as const,
    color: "#999",
    padding: "16px 0",
    fontFamily: "Rubik, sans-serif",
  },
  "@media (max-width: 900px)": {
    filtersCard: {
      padding: 14,
    },
    dataGridBox: {
      height: "calc(100vh - 380px)",
      minHeight: 360,
      overflowX: "auto" as const,
      "& .MuiDataGrid-root": {
        minWidth: 980,
      },
    },
  },
});

