import { makeStyles } from "@mui/styles";

export const useNavbarStyles = makeStyles({
  appBar: {
    background: "linear-gradient(135deg, #844173 0%, #5c2950 100%)",
    boxShadow: "0 4px 20px rgba(154, 81, 136, 0.25)",
    color: "#fff",
    zIndex: 1200,
    animation: "fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  toolbar: {
    justifyContent: "space-between",
    paddingLeft: 24,
    paddingRight: 24,
    minHeight: 64,
  },
  title: {
    flexGrow: 1,
    textAlign: "center" as const,
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    letterSpacing: "-0.02em", // צמצום רווחים קל למראה מודרני (כמו במותגי הייטק)
    fontSize: "1.8rem",
    paddingRight: "8%",
    textShadow: "0 2px 4px rgba(0,0,0,0.15)", // צל עדין לטקסט כדי להקפיץ אותו
  },
  userInfo: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    backgroundColor: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    borderRadius: 10,
    padding: "4px 12px",
    marginRight: 12,
    lineHeight: 1.3,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
    },
  },
  userName: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    fontSize: "0.9rem",
    color: "#fff",
    lineHeight: 1.4,
  },
  userTz: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 400,
    fontSize: "0.72rem",
    color: "rgba(255, 255, 255, 0.65)", // ניגודיות טובה ונעימה יותר לעין
    marginTop: 1,
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  menuIconBox: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)", // בסיס עדין לכפתור התפריט
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  },
  homeButton: {
    width: 38,
    height: 38,
    color: "#fff",
    borderRadius: 10,
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
      transform: "scale(1.08)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  },
});
