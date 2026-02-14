import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  dialogPaper: {
    width: 360,
    borderRadius: 16,
    overflow: "hidden",
    fontFamily: "Rubik, sans-serif",
  },
  dialogTitle: {
    fontWeight: 700,
    textAlign: "center",
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    padding: "12px 0",
  },
  dialogContent: {
    maxHeight: 320,
    paddingTop: 0,
    overflowY: "auto",
  },
  listItem: {
    px: 2,
    py: 1,
    borderRadius: 12,
    marginBottom: 6,
    transition: "background 0.2s",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(154, 81, 136, 0.08)",
    },
  },
  attendeeName: {
    display: "flex",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 500,
    textAlign: "right",
  },
  avatar: {
    display: "flex",
    justifyContent: "flex-end",
    width: 36,
    height: 36,
    bgcolor: "#f3f3f3",
    color: "#7a3e6b",
  },
});
