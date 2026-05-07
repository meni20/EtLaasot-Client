import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  dialogPaper: {
    borderRadius: 22,
    overflow: "hidden",
    minWidth: 380,
    maxWidth: 440,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    fontFamily: "Rubik, sans-serif",
    animation: "scaleIn 0.35s cubic-bezier(0.4,0,0.2,1)",
  },
  header: {
    position: "relative" as const,
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    padding: "18px 24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 18,
    fontFamily: "Rubik, sans-serif",
  },
  closeButton: {
    position: "absolute" as const,
    left: 8,
    top: 8,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.15)",
    transition: "all 0.25s ease",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.3)",
      transform: "rotate(90deg)",
    },
  },
  content: {
    direction: "rtl" as const,
    padding: "24px",
    backgroundColor: "#faf8f9",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "14px 18px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    border: "1px solid #f0ecef",
    transition: "all 0.3s ease",
    animation: "fadeInUp 0.4s ease-out both",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(154,81,136,0.1)",
    },
  },
  label: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 600,
    marginRight: 6,
    color: "#888",
    fontSize: 13,
  },
  valuePrimary: {
    color: "#9a5188",
    fontWeight: 600,
    fontFamily: "Rubik, sans-serif",
  },
  valueSecondary: {
    color: "#333",
    fontWeight: 500,
    fontFamily: "Rubik, sans-serif",
  },
});
