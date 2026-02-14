import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  dialogPaper: {
    borderRadius: 16,
    overflow: "hidden",
    minWidth: 360,
    maxWidth: 420,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  header: {
    position: "relative",
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 18,
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
  content: {
    direction: "rtl",
    padding: "20px 24px",
    backgroundColor: "#f8f4f9",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "12px 16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  label: {
    fontFamily: "Rubik",
    fontWeight: 600,
    marginRight: 6,
  },
  valuePrimary: {
    color: "#9a5188",
    fontWeight: 500,
  },
  valueSecondary: {
    color: "#7a3e6b",
    fontWeight: 500,
  },
});
