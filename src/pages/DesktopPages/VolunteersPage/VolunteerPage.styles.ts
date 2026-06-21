import { makeStyles } from "@mui/styles";

export const useVolunteerPageStyles = makeStyles({
  container: {
    padding: "88px 24px 24px",
    direction: "rtl",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    animation: "fadeIn 0.4s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 16,
    animation: "fadeInDown 0.5s ease-out",
  },
  pageTitle: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    color: "#333",
    fontSize: "1.5rem",
  },
  pageSubtitle: {
    fontFamily: "Rubik, sans-serif",
    color: "#6c626b",
    fontSize: "0.92rem",
    marginTop: 4,
  },
  createButton: {
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    fontWeight: 600,
    fontFamily: "Rubik, sans-serif",
    borderRadius: 14,
    padding: "10px 24px",
    boxShadow: "0 4px 16px rgba(154, 81, 136, 0.25)",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    "&:hover": {
      background: "linear-gradient(135deg, #7a3e6b 0%, #5a2d51 100%)",
      boxShadow: "0 8px 28px rgba(154, 81, 136, 0.4)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0) scale(0.98)",
    },
    "& .MuiButton-startIcon": {
      marginLeft: 6,
      marginRight: 0,
    },
  },
  toolbarCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    background: "#fff",
    borderRadius: 18,
    padding: "14px 16px",
    marginBottom: 14,
    boxShadow: "0 3px 16px rgba(0,0,0,0.05)",
    border: "1px solid #f0ecef",
    animation: "fadeInUp 0.45s ease-out",
  },
  searchField: {
    width: "min(520px, 100%)",
    "& .MuiOutlinedInput-root": {
      borderRadius: 14,
      backgroundColor: "#fbf8fa",
      fontFamily: "Rubik, sans-serif",
    },
    "& input": {
      textAlign: "right" as const,
      fontFamily: "Rubik, sans-serif",
    },
    "& .MuiInputAdornment-root": {
      color: "#9a5188",
    },
  },
  resultCount: {
    flexShrink: 0,
    color: "#7a3e6b",
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    fontSize: "0.86rem",
  },
  contentLayout: {
    display: "flex",
    alignItems: "stretch",
    gap: 16,
    minWidth: 0,
  },
  dataGridBox: {
    flex: 1,
    minWidth: 0,
    height: "calc(100vh - 250px)",
    minHeight: 420,
    background: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    border: "1px solid #f0ecef",
    animation: "fadeInUp 0.6s ease-out",
    transition: "box-shadow 0.3s ease",
    "&:hover": {
      boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#f8f4f9",
      fontWeight: 700,
      color: "#7a3e6b",
      fontFamily: "Rubik, sans-serif",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 800,
      fontFamily: "Rubik, sans-serif",
    },
    "& .MuiDataGrid-row": {
      fontFamily: "Rubik, sans-serif",
      cursor: "pointer",
      transition: "background 0.25s ease, transform 0.15s ease",
      minHeight: "58px !important",
      "&:hover": {
        backgroundColor: "rgba(154,81,136,0.06)",
      },
    },
    "& .MuiDataGrid-cell": {
      fontSize: 13.5,
      borderColor: "#f5f0f3",
      display: "flex",
      alignItems: "center",
      outline: "none !important",
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: "#faf8fa",
      borderTop: "1px solid #f0ecef",
      fontFamily: "Rubik, sans-serif",
    },
    "& .MuiDataGrid-overlay": {
      fontFamily: "Rubik, sans-serif",
      color: "#7a3e6b",
      fontWeight: 700,
    },
  },
  loaderOverlay: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  stateBox: {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 24,
    textAlign: "center" as const,
  },
  stateTitle: {
    color: "#7a3e6b",
    fontFamily: "Rubik, sans-serif",
    fontWeight: 800,
    fontSize: "1.05rem",
  },
  stateText: {
    color: "#746974",
    fontFamily: "Rubik, sans-serif",
    fontSize: "0.92rem",
  },
  "@media (max-width: 900px)": {
    header: {
      flexDirection: "column" as const,
      alignItems: "stretch",
    },
    createButton: {
      alignSelf: "flex-start",
    },
    toolbarCard: {
      flexDirection: "column" as const,
      alignItems: "stretch",
    },
    resultCount: {
      textAlign: "right" as const,
    },
    dataGridBox: {
      height: "calc(100vh - 310px)",
    },
    contentLayout: {
      flexDirection: "column" as const,
    },
  },
});
