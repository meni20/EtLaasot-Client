import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  container: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#F7F7F8",
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
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
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
    color: "#1F1F1F",
    textAlign: "center" as const,
    fontFamily: "Rubik, sans-serif",
    animation: "fadeInUp 0.5s 0.3s ease-out both",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center" as const,
    marginBottom: 10,
    fontFamily: "Rubik, sans-serif",
    animation: "fadeInUp 0.5s 0.4s ease-out both",
  },

  input: {
    animation: "fadeInUp 0.5s 0.5s ease-out both",
    "& .MuiOutlinedInput-root": {
      borderRadius: 14,
      backgroundColor: "#FFFFFF",
      fontFamily: "Rubik, sans-serif",
      transition: "all 0.3s ease",

      "& fieldset": {
        borderColor: "transparent",
      },

      "&:hover fieldset": {
        borderColor: "#D8C4E3",
      },

      "&.Mui-focused": {
        boxShadow: "0 0 0 3px rgba(123, 63, 152, 0.12)",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#7B3F98",
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
    background: "#7B3F98",
    boxShadow: "0 4px 12px rgba(123, 63, 152, 0.22)",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    animation: "fadeInUp 0.5s 0.6s ease-out both",

    "&:hover": {
      background: "#6D3588",
      boxShadow: "0 6px 16px rgba(123, 63, 152, 0.26)",
      transform: "translateY(-2px)",
    },
    "&:active": {
      transform: "translateY(0) scale(0.98)",
    },
  },
});
