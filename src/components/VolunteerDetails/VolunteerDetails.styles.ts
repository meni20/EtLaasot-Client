import { makeStyles } from "@mui/styles";

export const useVolunteerDetailsStyles = makeStyles({
  paper: {
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
    fontFamily: "Rubik, sans-serif",
  },
  header: {
    padding: "18px 20px",
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
  },
  avatar: {
    backgroundColor: "#fff",
    color: "#7a3e6b",
    fontWeight: 900,
    fontFamily: "Rubik, sans-serif",
  },
  nameText: {
    fontWeight: 900,
    fontFamily: "Rubik, sans-serif",
    color: "#fff",
  },
  subText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },
  content: {
    padding: "16px",
    "& .MuiDivider-root": {
      margin: "8px 0",
    },
  },
  rowIcon: {
    color: "#7a3e6b",
  },
  buttonContained: {
    borderRadius: 12,
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    fontWeight: 600,
    "&:hover": {
      background: "linear-gradient(135deg, #7a3e6b 0%, #9a5188 100%)",
    },
  },
  buttonOutlined: {
    borderRadius: 12,
    borderColor: "#9a5188",
    color: "#7a3e6b",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "rgba(154,81,136,0.08)",
      borderColor: "#7a3e6b",
    },
  },
  closeButton: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    "&:hover": {
      backgroundColor: "#e0d7e8",
    },
  },
});
