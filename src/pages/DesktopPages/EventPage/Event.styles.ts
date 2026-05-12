import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: "88px 24px 24px",
    direction: "rtl",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    animation: "fadeIn 0.4s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    animation: "fadeInDown 0.5s ease-out",
  },
  pageTitle: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    color: "#333",
    fontSize: "1.5rem",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-start",
  },
  createButton: {
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    fontWeight: 600,
    fontFamily: "Rubik, sans-serif",
    borderRadius: 14,
    padding: "10px 24px",
    boxShadow: "0 4px 16px rgba(154, 81, 136, 0.25)",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    "&:hover": {
      background: "linear-gradient(135deg, #7a3e6b 0%, #5a2d51 100%)",
      boxShadow: "0 8px 28px rgba(154, 81, 136, 0.4)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0) scale(0.98)",
    },
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sectionTitle: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    color: "#444",
    fontSize: "1.2rem",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  emptyState: {
    textAlign: "center",
    color: "#999",
    padding: "60px 0",
    fontSize: 16,
    fontFamily: "Rubik, sans-serif",
    animation: "fadeIn 0.8s ease-out",
  },
});
