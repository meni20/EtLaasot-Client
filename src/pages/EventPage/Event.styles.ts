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
    paddingLeft: 24,
  },
  createButton: {
    borderRadius: 12,
    boxShadow: "0px 2px 9px rgba(209, 209, 226, 0.13)",
    fontWeight: 600,
    fontSize: 16,
    fontFamily: "Rubik",
    paddingLeft: 20,
    paddingRight: 28,
    paddingTop: 12,
    paddingBottom: 12,
    textTransform: "none",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0px 4px 12px rgba(183, 183, 198, 0.25)",
      backgroundColor: "#9a62a2",
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
