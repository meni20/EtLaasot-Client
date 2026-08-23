import { makeStyles } from "@mui/styles";
import { alpha, type Theme } from "@mui/material/styles";
import { theme } from "../../../theme/them";

type VolunteerPageClassKey =
  | "container"
  | "header"
  | "pageTitle"
  | "pageSubtitle"
  | "createButton"
  | "toolbarCard"
  | "searchField"
  | "archiveModeButton"
  | "resultCount"
  | "contentLayout"
  | "dataGridBox"
  | "stateBox"
  | "stateTitle"
  | "stateText";

export const useVolunteerPageStyles = makeStyles<
  Theme,
  {},
  VolunteerPageClassKey
>({
  container: {
    "--people-surface": theme.palette.background.paper,
    "--people-muted": theme.palette.background.default,
    "--people-text": theme.palette.text.primary,
    "--people-secondary": theme.palette.text.secondary,
    "--people-primary": theme.palette.primary.main,
    padding: "88px 24px 24px",
    direction: "rtl",
    minHeight: "100dvh",
    background:
      "linear-gradient(180deg, var(--people-muted) 0%, rgba(255,255,255,0.92) 100%)",
    color: "var(--people-text)",
    animation: "fadeIn 180ms var(--ease-out, ease-out)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    maxWidth: 1480,
    margin: "0 auto 16px",
  },
  pageTitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: 750,
    color: "var(--people-text)",
    fontSize: "1.55rem",
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  pageSubtitle: {
    fontFamily: theme.typography.fontFamily,
    color: "var(--people-secondary)",
    fontSize: "0.94rem",
    lineHeight: 1.55,
    marginTop: 5,
  },
  createButton: {
    minHeight: "44px !important",
    borderRadius: "12px !important",
    padding: "0 18px !important",
    backgroundColor: "var(--people-primary) !important",
    color: `${theme.palette.primary.contrastText} !important`,
    fontFamily: `${theme.typography.fontFamily} !important`,
    fontWeight: "700 !important" as const,
    boxShadow: `${theme.shadows[1]} !important`,
    transition:
      "transform 140ms var(--ease-out, ease-out), background-color 140ms ease, box-shadow 140ms ease !important",
    "&:hover": {
      backgroundColor: `${theme.palette.primary.dark} !important`,
      boxShadow: `${theme.shadows[3]} !important`,
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "scale(0.97)",
    },
    "&:focus-visible": {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.22)} !important`,
    },
    "& .MuiButton-startIcon": {
      marginLeft: 6,
      marginRight: 0,
    },
  },
  toolbarCard: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 1fr) auto auto",
    alignItems: "center",
    gap: 12,
    maxWidth: 1480,
    margin: "0 auto 14px",
    backgroundColor: alpha(theme.palette.background.paper, 0.84),
    backdropFilter: "blur(18px) saturate(1.35)",
    WebkitBackdropFilter: "blur(18px) saturate(1.35)",
    borderRadius: 16,
    padding: 12,
    boxShadow: theme.shadows[1],
    border: `1px solid ${alpha(theme.palette.divider, 0.82)}`,
  },
  searchField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      minHeight: 44,
      borderRadius: 12,
      backgroundColor: theme.palette.background.paper,
      fontFamily: theme.typography.fontFamily,
      transition:
        "box-shadow 140ms ease, border-color 140ms ease, background-color 140ms ease",
    },
    "& input": {
      textAlign: "right" as const,
      fontFamily: theme.typography.fontFamily,
      paddingBlock: 10.5,
    },
    "& .MuiInputAdornment-root": {
      color: "var(--people-primary)",
    },
  },
  archiveModeButton: {
    flexShrink: 0,
    minHeight: "44px !important",
    borderRadius: "12px !important",
    borderColor: `${theme.palette.divider} !important`,
    color: `${theme.palette.text.primary} !important`,
    backgroundColor: `${alpha(theme.palette.background.paper, 0.72)} !important`,
    fontFamily: `${theme.typography.fontFamily} !important`,
    fontWeight: "700 !important" as const,
    padding: "0 16px !important",
    "&:hover": {
      backgroundColor: `${theme.palette.primary.light} !important`,
      borderColor: `${theme.palette.primary.main} !important`,
    },
    "&:focus-visible": {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.22)} !important`,
    },
    "& .MuiButton-startIcon": {
      marginLeft: 6,
      marginRight: 0,
    },
  },
  resultCount: {
    flexShrink: 0,
    color: "var(--people-secondary)",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 700,
    fontSize: "0.86rem",
    minHeight: 44,
    display: "inline-flex",
    alignItems: "center",
    paddingInline: 6,
    whiteSpace: "nowrap" as const,
  },
  contentLayout: {
    display: "flex",
    alignItems: "stretch",
    gap: 16,
    minWidth: 0,
    maxWidth: 1480,
    margin: "0 auto",
  },
  dataGridBox: {
    flex: 1,
    minWidth: 0,
    height: "calc(100dvh - 246px)",
    minHeight: 430,
    backgroundColor: "var(--people-surface)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: theme.shadows[2],
    border: `1px solid ${alpha(theme.palette.divider, 0.82)}`,
    transition: "box-shadow 180ms ease, border-color 180ms ease",
    "&:hover": {
      boxShadow: theme.shadows[3],
    },
    "& .MuiDataGrid-root": {
      border: 0,
      fontFamily: theme.typography.fontFamily,
      color: "var(--people-text)",
      direction: "rtl",
    },
    "& .MuiDataGrid-main": {
      overflow: "auto",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: alpha(theme.palette.background.default, 0.9),
      color: "var(--people-secondary)",
      borderBottom: `1px solid ${theme.palette.divider}`,
      minHeight: "48px !important",
    },
    "& .MuiDataGrid-columnHeader": {
      minHeight: "48px !important",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 750,
      fontFamily: theme.typography.fontFamily,
    },
    "& .MuiDataGrid-row": {
      cursor: "pointer",
      minHeight: "60px !important",
      transition:
        "background-color 140ms ease, box-shadow 140ms ease, transform 140ms var(--ease-out, ease-out)",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.055),
      },
      "&.Mui-selected, &.Mui-selected:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.09),
      },
    },
    "& .MuiDataGrid-cell": {
      minHeight: "60px !important",
      fontSize: 13.5,
      borderColor: theme.palette.divider,
      display: "flex",
      alignItems: "center",
      outline: "none",
    },
    "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within":
      {
        outline: `2px solid ${alpha(theme.palette.primary.main, 0.42)}`,
        outlineOffset: -2,
      },
    "& .MuiDataGrid-footerContainer": {
      minHeight: 48,
      backgroundColor: alpha(theme.palette.background.default, 0.72),
      borderTop: `1px solid ${theme.palette.divider}`,
      fontFamily: theme.typography.fontFamily,
    },
    "& .MuiDataGrid-overlay": {
      fontFamily: theme.typography.fontFamily,
      color: "var(--people-secondary)",
      fontWeight: 700,
    },
  },
  stateBox: {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 24,
    textAlign: "center" as const,
  },
  stateTitle: {
    color: "var(--people-text)",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 750,
    fontSize: "1.05rem",
  },
  stateText: {
    color: "var(--people-secondary)",
    fontFamily: theme.typography.fontFamily,
    fontSize: "0.92rem",
  },
  "@media (max-width: 900px)": {
    container: {
      padding: "72px 12px 16px",
      overflowX: "hidden",
    },
    header: {
      flexDirection: "column" as const,
      alignItems: "stretch",
      marginBottom: 12,
    },
    createButton: {
      alignSelf: "stretch",
    },
    toolbarCard: {
      gridTemplateColumns: "1fr",
      alignItems: "stretch",
      gap: 10,
    },
    resultCount: {
      justifyContent: "flex-start",
      minHeight: 28,
      paddingInline: 2,
    },
    archiveModeButton: {
      width: "100%",
    },
    dataGridBox: {
      height: "calc(100dvh - 326px)",
      minHeight: 360,
      overflowX: "auto" as const,
      "& .MuiDataGrid-root": {
        minWidth: 860,
      },
    },
    contentLayout: {
      flexDirection: "column" as const,
    },
  },
  "@media (max-width: 480px)": {
    pageTitle: {
      fontSize: "1.35rem",
    },
    toolbarCard: {
      borderRadius: 14,
      padding: 10,
    },
    dataGridBox: {
      height: "calc(100dvh - 348px)",
      minHeight: 340,
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    container: {
      animation: "fadeIn 1ms linear",
    },
    createButton: {
      transition: "background-color 1ms linear !important",
      "&:hover, &:active": {
        transform: "none",
      },
    },
    dataGridBox: {
      transition: "none",
      "& .MuiDataGrid-row": {
        transition: "background-color 1ms linear",
      },
    },
  },
  "@media (prefers-reduced-transparency: reduce)": {
    toolbarCard: {
      backgroundColor: theme.palette.background.paper,
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  },
} as any);
