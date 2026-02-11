import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  appBar: {
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    borderRadius: "0 0 16px 16px",
    color: "#fff",
  },
  toolbar: {
    width: "100%",
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    justifyContent: "center",
  },
});
