// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#9a5188", // Your main brand color
      dark: "#7a3e6b", // Darker for hover
      contrastText: "#fff",
    },
    secondary: {
      main: "#dc87b8", // Accent color
      contrastText: "#fff",
    },
    background: {
      default: "#f9f9f9",
      paper: "#fff",
    },
    text: {
      primary: "#333",
      secondary: "#7a3e6b",
    },
  },
  typography: {
    fontFamily: "Rubik, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontSize: 16 },
    body2: { fontSize: 14 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#7a3e6b",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          bgcolor: "#f3f3f3",
          color: "#7a3e6b",
        },
      },
    },
  },
});
