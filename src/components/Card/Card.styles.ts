import { makeStyles } from "@mui/styles";

export const useCardStyles = makeStyles({
  cardContainer: {
    display: "inline-block",
    verticalAlign: "top",
    margin: "16px",
    width: 280,
  },
  card: {
    minWidth: 250,
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
    direction: "rtl",
    transition: "transform 0.25s, box-shadow 0.25s",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
    },
  },
  eventName: {
    fontWeight: 600,
    marginBottom: 8,
    fontFamily: "Rubik, sans-serif",
  },
  eventDate: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#7a3e6b",
    fontSize: 14,
    marginBottom: 12,
    fontFamily: "Rubik, sans-serif",
  },
  eventAddress: {
    color: "#333",
    fontSize: 15,
    fontFamily: "Rubik, sans-serif",
  },
  showButton: {
    borderRadius: 12,
    fontWeight: 600,
    textTransform: "none",
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(135deg, #7a3e6b 0%, #9a5188 100%)",
    },
  },
  addIconBox: {
    marginLeft: "auto",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: "#7a3e6b",
    "&:hover": {
      color: "#9a5188",
    },
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-between",
  },
});
