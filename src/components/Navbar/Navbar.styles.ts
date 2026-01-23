import { makeStyles } from "@mui/styles";

export const useNavbarStyles = makeStyles({
  appBar: {
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    color: "#fff",
    zIndex: 1200,
  },
  toolbar: {
    justifyContent: "space-between",
    paddingLeft: 24,
    paddingRight: 24,
    minHeight: 64,
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    letterSpacing: 0.5,
    fontSize: "2rem",
    paddingRight: "10%",
  },
  menuIconBox: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 8,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
      transform: "scale(1.1)",
    },
  },
});
