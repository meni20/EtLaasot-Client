import { makeStyles } from "@mui/styles";

export const useVolunteerDetailsStyles = makeStyles({
  panel: {
    flex: "0 0 clamp(320px, 30vw, 420px)",
    minWidth: 0,
    maxHeight: "calc(100vh - 250px)",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    fontFamily: "Rubik, sans-serif",
    direction: "rtl",
    backgroundColor: "#fff",
    border: "1px solid #f0ecef",
    animation: "fadeInUp 0.25s ease-out",
  },
  header: {
    padding: "20px",
    backgroundColor: "#fff",
    color: "#2f2930",
    borderBottom: "1px solid #f0e8ee",
  },
  closeIconButton: {
    color: "#7a3e6b",
    backgroundColor: "#fbf7fa",
    border: "1px solid #ead8e5",
    "&:hover": {
      backgroundColor: "#9a5188",
      color: "#fff",
    },
  },
  avatar: {
    width: 52,
    height: 52,
    backgroundColor: "#f2e6ee",
    color: "#7a3e6b",
    fontWeight: 900,
    fontSize: 18,
    fontFamily: "Rubik, sans-serif",
  },
  nameText: {
    fontWeight: 900,
    fontFamily: "Rubik, sans-serif",
    color: "#2f2930",
  },
  headerMeta: {
    marginTop: 4,
  },
  subText: {
    fontSize: 13,
    color: "#6c626b",
    fontFamily: "Rubik, sans-serif",
  },
  statusChip: {
    height: 22,
    backgroundColor: "#eef8f0",
    color: "#2e7d32",
    border: "1px solid #d7eedb",
    fontFamily: "Rubik, sans-serif",
    fontWeight: 800,
    fontSize: 12,
  },
  content: {
    padding: "16px",
    backgroundColor: "#faf8fa",
    maxHeight: "calc(100vh - 340px)",
    overflowY: "auto",
    "& .MuiDivider-root": {
      margin: "8px 0",
    },
  },
  section: {
    backgroundColor: "#fff",
    border: "1px solid #f0ecef",
    borderRadius: 14,
    padding: "12px 14px",
    marginBottom: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  sectionTitle: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 800,
    color: "#7a3e6b",
    fontSize: "0.9rem",
    marginBottom: 6,
  },
  rowIcon: {
    color: "#7a3e6b",
  },
  actionsRow: {
    marginTop: 4,
  },
  buttonContained: {
    borderRadius: 12,
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    fontWeight: 600,
    fontFamily: "Rubik, sans-serif",
    "&:hover": {
      background: "linear-gradient(135deg, #7a3e6b 0%, #9a5188 100%)",
    },
    "& .MuiButton-startIcon": {
      marginLeft: 6,
      marginRight: 0,
    },
  },
  buttonOutlined: {
    borderRadius: 12,
    borderColor: "#9a5188",
    color: "#7a3e6b",
    fontWeight: 600,
    fontFamily: "Rubik, sans-serif",
    "&:hover": {
      backgroundColor: "rgba(154,81,136,0.08)",
      borderColor: "#7a3e6b",
    },
    "& .MuiButton-startIcon": {
      marginLeft: 6,
      marginRight: 0,
    },
  },
  closeButton: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    border: "1px solid #ead8e5",
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    color: "#5f5660",
    "&:hover": {
      backgroundColor: "#f7f1f5",
    },
  },
  "@media (max-width: 900px)": {
    panel: {
      flex: "0 0 auto",
      width: "100%",
      maxHeight: "none",
    },
  },
});
