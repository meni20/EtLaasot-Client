import { makeStyles } from "@mui/styles";

export const useVolunteerPageStyles = makeStyles({
  container: {
    height: "85%",
    width: "90%",
    position: "absolute",
    top: "12%",
    left: "5%",
  },
  createButton: {
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    fontWeight: 600,
    "&:hover": {
      background: "linear-gradient(135deg, #7a3e6b 0%, #9a5188 100%)",
    },
  },
  dataGridBox: {
    height: "90%",
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#9a5188",
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "rgba(154,81,136,0.1)",
    },
    "& .MuiDataGrid-cell": {
      fontSize: 13,
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: "#f5f5f5",
    },
  },
  loaderOverlay: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
