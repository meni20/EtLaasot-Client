import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  container: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(160deg, #f8f4f9 0%, #ede3ea 40%, #e0d0dc 100%)",
    padding: 16,
    animation: "fadeIn 0.5s ease-out",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    display: "flex",
    flexDirection: "column" as const,
    gap: 20,
    padding: "40px 32px",
    boxShadow: "0 20px 60px rgba(154, 81, 136, 0.15)",
    animation: "scaleIn 0.6s cubic-bezier(0.4,0,0.2,1)",
  },

  logo: {
    textAlign: "center" as const,
    fontSize: 48,
    marginBottom: 4,
    animation: "fadeInDown 0.6s 0.2s ease-out both",
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#333",
    textAlign: "center" as const,
    fontFamily: "Rubik, sans-serif",
    animation: "fadeInUp 0.5s 0.3s ease-out both",
  },

  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center" as const,
    marginBottom: 10,
    fontFamily: "Rubik, sans-serif",
    animation: "fadeInUp 0.5s 0.4s ease-out both",
  },

  input: {
    animation: "fadeInUp 0.5s 0.5s ease-out both",
    "& .MuiOutlinedInput-root": {
      borderRadius: 14,
      backgroundColor: "#f8f5f7",
      fontFamily: "Rubik, sans-serif",
      transition: "all 0.3s ease",

      "& fieldset": {
        borderColor: "transparent",
      },

      "&:hover fieldset": {
        borderColor: "#dcc8d8",
      },

      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(154, 81, 136, 0.12)",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#9a5188",
        borderWidth: 2,
      },
    },
  },

  button: {
    borderRadius: 14,
    height: 52,
    fontWeight: 700,
    fontSize: 16,
    textTransform: "none" as const,
    fontFamily: "Rubik, sans-serif",
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    boxShadow: "0 8px 24px rgba(154, 81, 136, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    animation: "fadeInUp 0.5s 0.6s ease-out both",

    "&:hover": {
      background: "linear-gradient(135deg, #7a3e6b 0%, #5a2d51 100%)",
      boxShadow: "0 12px 32px rgba(154, 81, 136, 0.4)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0) scale(0.98)",
    },
  },
});
