import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  appBar: {
    width: "100%",
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    boxShadow: "0 4px 20px rgba(154, 81, 136, 0.25)",
    borderRadius: "0 0 18px 18px",
    color: "#fff",
    animation: "fadeInDown 0.4s ease-out",
  },
  toolbar: {
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    letterSpacing: 0.5,
  },
});
