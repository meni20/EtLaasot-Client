// src/theme/theme.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#9a5188",
      dark: "#7a3e6b",
      light: "#dc87b8",
      contrastText: "#fff",
    },
    secondary: {
      main: "#dc87b8",
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
  shape: {
    borderRadius: 14,
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: "rtl",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none" as const,
          fontWeight: 600,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
          boxShadow: "0 4px 16px rgba(154, 81, 136, 0.25)",
          "&:hover": {
            background: "linear-gradient(135deg, #7a3e6b 0%, #5a2d51 100%)",
            boxShadow: "0 6px 24px rgba(154, 81, 136, 0.35)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        outlinedPrimary: {
          borderColor: "#9a5188",
          "&:hover": {
            backgroundColor: "rgba(154, 81, 136, 0.06)",
            borderColor: "#7a3e6b",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.18)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 32px rgba(154, 81, 136, 0.15)",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "#f3e8f0",
          color: "#7a3e6b",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 14,
            transition: "box-shadow 0.2s ease",
            "&.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(154, 81, 136, 0.12)",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});
