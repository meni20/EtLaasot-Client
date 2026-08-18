import { alpha, createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { appFontFamily, designTokens } from "./tokens";

const { color, motion, radius, shadow } = designTokens;

export const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: { main: color.primary, dark: color.primaryHover, light: color.primarySoft, contrastText: "#FFFFFF" },
    secondary: { main: color.brand, dark: color.brandHover, light: color.brandSoft, contrastText: "#FFFFFF" },
    background: { default: color.canvas, paper: color.surface },
    text: { primary: color.text, secondary: color.textSecondary },
    divider: color.borderSubtle,
    error: { main: color.danger, light: color.dangerSoft },
    warning: { main: color.warning, light: color.warningSoft },
    info: { main: color.info, light: color.infoSoft },
    success: { main: color.success, light: color.successSoft },
  },
  shape: { borderRadius: radius.control },
  spacing: 4,
  typography: {
    fontFamily: appFontFamily,
    h1: { fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.12 },
    h2: { fontWeight: 700, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", lineHeight: 1.18 },
    h3: { fontWeight: 700, fontSize: "clamp(1.5rem, 2.4vw, 1.85rem)", lineHeight: 1.22 },
    h4: { fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.25 },
    h5: { fontWeight: 650, fontSize: "1.25rem", lineHeight: 1.3 },
    h6: { fontWeight: 650, fontSize: "1.05rem", lineHeight: 1.35 },
    subtitle1: { fontWeight: 600, lineHeight: 1.45 },
    subtitle2: { fontWeight: 600, lineHeight: 1.45 },
    body1: { fontSize: "1rem", lineHeight: 1.55 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    button: { fontWeight: 650, letterSpacing: 0 },
    caption: { lineHeight: 1.45, color: color.textMuted },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { direction: "rtl", backgroundColor: color.canvas },
        body: { direction: "rtl", backgroundColor: color.canvas, color: color.text },
        "::selection": { backgroundColor: color.primarySoft, color: color.primaryPressed },
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
      styleOverrides: { root: { touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: radius.control,
          paddingInline: 18,
          textTransform: "none",
          fontWeight: 650,
          transition: `transform ${motion.fast} ${motion.easeOut}, background-color ${motion.fast} ease, border-color ${motion.fast} ease, box-shadow ${motion.fast} ease`,
          "&:active": { transform: "scale(0.97)" },
          "&:focus-visible": { outline: "none", boxShadow: shadow.focus },
        },
        containedPrimary: {
          backgroundColor: color.primary,
          boxShadow: shadow.xs,
          "&:hover": { backgroundColor: color.primaryHover, boxShadow: shadow.sm },
          "&:active": { backgroundColor: color.primaryPressed, transform: "scale(0.97)" },
        },
        outlinedPrimary: {
          borderColor: color.border,
          color: color.primary,
          "&:hover": { borderColor: color.primary, backgroundColor: color.primarySoft },
        },
        textPrimary: { "&:hover": { backgroundColor: color.primarySoft } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,
          borderRadius: radius.control,
          transition: `transform ${motion.fast} ${motion.easeOut}, background-color ${motion.fast} ease, color ${motion.fast} ease`,
          "&:active": { transform: "scale(0.94)" },
          "&:focus-visible": { outline: "none", boxShadow: shadow.focus },
        },
      },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: radius.panel } } },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: radius.panel,
          border: `1px solid ${color.borderSubtle}`,
          boxShadow: shadow.sm,
          backgroundImage: "none",
        },
      },
    },
    MuiDialog: {
      defaultProps: { transitionDuration: { enter: 240, exit: 180 } },
      styleOverrides: {
        paper: {
          borderRadius: radius.dialog,
          border: `1px solid ${alpha(color.border, 0.72)}`,
          boxShadow: shadow.lg,
          backgroundImage: "none",
          maxHeight: "min(88dvh, 920px)",
        },
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: 700, padding: "22px 24px 12px" } } },
    MuiDialogContent: { styleOverrides: { root: { paddingInline: 24 } } },
    MuiDialogActions: { styleOverrides: { root: { padding: "16px 24px 22px", gap: 8 } } },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: color.scrim,
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: radius.control,
          backgroundColor: color.surface,
          transition: `box-shadow ${motion.fast} ease, background-color ${motion.fast} ease`,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: color.border },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: color.textMuted },
          "&.Mui-focused": { boxShadow: shadow.focus },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: 1.5 },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { color: color.textSecondary } } },
    MuiFormHelperText: { styleOverrides: { root: { marginInline: 0, lineHeight: 1.45 } } },
    MuiChip: { styleOverrides: { root: { minHeight: 30, borderRadius: radius.pill, fontWeight: 600 } } },
    MuiTooltip: {
      defaultProps: { arrow: true, enterDelay: 500, enterNextDelay: 0 },
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          backgroundColor: "rgba(29, 29, 31, 0.94)",
          fontSize: "0.78rem",
          fontWeight: 550,
          padding: "7px 10px",
        },
        arrow: { color: "rgba(29, 29, 31, 0.94)" },
      },
    },
    MuiAlert: { styleOverrides: { root: { borderRadius: radius.panel, alignItems: "center" } } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: color.borderSubtle, paddingBlock: 12 },
        head: { color: color.textSecondary, fontWeight: 700, backgroundColor: color.surfaceMuted },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          color: color.text,
          "& .MuiDataGrid-columnHeaders": { backgroundColor: color.surfaceMuted },
          "& .MuiDataGrid-columnHeader": { color: color.textSecondary, fontWeight: 700 },
          "& .MuiDataGrid-row": { borderBottom: `1px solid ${color.borderSubtle}` },
          "& .MuiDataGrid-row:hover": { backgroundColor: color.primarySoft },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": { outline: "none" },
          "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within": {
            outline: `2px solid ${alpha(color.primary, 0.44)}`,
            outlineOffset: -2,
          },
        },
      },
    },
    MuiSkeleton: { styleOverrides: { root: { borderRadius: radius.control, backgroundColor: color.surfaceMuted } } },
  },
});
