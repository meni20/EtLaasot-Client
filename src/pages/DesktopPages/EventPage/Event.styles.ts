import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    paddingTop: 24,
    position: "fixed",
    top: "10%",
  },
  buttonContainer: {
    paddingLeft: "3%",
  },
  createButton: {
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    fontWeight: 600,
    borderRadius: 12,
    padding: "8px 16px",
    "&:hover": {
      background: "linear-gradient(135deg, #7a3e6b 0%, #9a5188 100%)",
    },
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 24,
    paddingLeft: 24,
    flexWrap: "wrap",
  },
});
