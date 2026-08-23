import { makeStyles } from "@mui/styles";
import { alpha, type Theme } from "@mui/material/styles";
import { theme } from "../../../theme/them";

type MentorAssignmentClassKey =
  | "root"
  | "header"
  | "title"
  | "card"
  | "sectionHeader"
  | "sectionTitle"
  | "assignmentCount"
  | "mentorRow"
  | "mentorIdentity"
  | "mentorAvatar"
  | "mentorName"
  | "traineesChips"
  | "chip"
  | "overloadChip"
  | "removeButton"
  | "loadStatus"
  | "loadStatusWarning"
  | "unassignedCard"
  | "statusIcon"
  | "unassignedText"
  | "addButton"
  | "emptyState"
  | "dialogContent"
  | "dialogActions"
  | "selectField";

export const useMentorAssignmentStyles = makeStyles<
  Theme,
  {},
  MentorAssignmentClassKey
>({
  root: {
    padding: "88px 24px 24px",
    direction: "rtl",
    minHeight: "100dvh",
    background:
      "linear-gradient(180deg, var(--app-canvas, #F5F6F8) 0%, rgba(255,255,255,0.94) 100%)",
    color: theme.palette.text.primary,
    animation: "fadeIn 180ms var(--ease-out, ease-out)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    maxWidth: 1180,
    margin: "0 auto 16px",
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: 750,
    color: theme.palette.text.primary,
    fontSize: "1.55rem",
    lineHeight: 1.18,
    letterSpacing: 0,
  },
  card: {
    maxWidth: 1180,
    margin: "0 auto 24px",
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    borderRadius: 16,
    padding: 18,
    boxShadow: theme.shadows[2],
    border: `1px solid ${alpha(theme.palette.divider, 0.82)}`,
    backdropFilter: "blur(18px) saturate(1.25)",
    WebkitBackdropFilter: "blur(18px) saturate(1.25)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: 750,
    color: theme.palette.text.primary,
    fontSize: "1.04rem",
    lineHeight: 1.35,
  },
  assignmentCount: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.secondary,
    fontWeight: 700,
    fontSize: "0.86rem",
    whiteSpace: "nowrap" as const,
  },
  mentorRow: {
    display: "grid",
    gridTemplateColumns: "minmax(170px, 220px) minmax(240px, 1fr) auto",
    alignItems: "center",
    gap: 14,
    padding: "14px 4px",
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: "background-color 140ms ease",
    borderRadius: 12,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.045),
    },
    "&:last-child": {
      borderBottom: "none",
    },
  },
  mentorIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  mentorAvatar: {
    width: "36px !important",
    height: "36px !important",
    flex: "0 0 36px",
    backgroundColor: `${theme.palette.primary.light} !important`,
    color: `${theme.palette.primary.dark} !important`,
    fontFamily: `${theme.typography.fontFamily} !important`,
    fontWeight: "800 !important" as const,
    fontSize: "0.92rem !important",
  },
  mentorName: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: 750,
    color: theme.palette.text.primary,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  traineesChips: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
    minWidth: 0,
  },
  chip: {
    minHeight: 36,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    borderRadius: 999,
    padding: "4px 8px 4px 14px",
    border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
    fontSize: "0.86rem",
    fontWeight: 700,
    fontFamily: theme.typography.fontFamily,
    transition: "background-color 140ms ease, border-color 140ms ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.13),
      borderColor: alpha(theme.palette.primary.main, 0.32),
    },
  },
  overloadChip: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
    borderColor: alpha(theme.palette.warning.main, 0.24),
    "&:hover": {
      backgroundColor: alpha(theme.palette.warning.main, 0.16),
      borderColor: alpha(theme.palette.warning.main, 0.38),
    },
  },
  removeButton: {
    minWidth: "32px !important",
    minHeight: "32px !important",
    width: "32px !important",
    height: "32px !important",
    color: `${theme.palette.text.secondary} !important`,
    borderRadius: "999px !important",
    padding: "0 !important",
    "&:hover": {
      color: `${theme.palette.error.main} !important`,
      backgroundColor: `${theme.palette.error.light} !important`,
    },
    "&:focus-visible": {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.22)} !important`,
    },
  },
  loadStatus: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    justifyContent: "flex-end",
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 700,
    fontSize: "0.86rem",
    whiteSpace: "nowrap" as const,
    "& .MuiSvgIcon-root": {
      color: theme.palette.success.main,
    },
  },
  loadStatusWarning: {
    color: theme.palette.warning.dark,
    "& .MuiSvgIcon-root": {
      color: `${theme.palette.warning.main} !important`,
    },
  },
  unassignedCard: {
    maxWidth: 1180,
    margin: "0 auto 14px",
    backgroundColor: theme.palette.warning.light,
    borderRadius: 14,
    padding: "13px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    color: theme.palette.warning.dark,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.28)}`,
    boxShadow: theme.shadows[1],
  },
  statusIcon: {
    flex: "0 0 auto",
    marginTop: 1,
    color: `${theme.palette.warning.main} !important`,
  },
  unassignedText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: "0.92rem",
    lineHeight: 1.55,
    fontWeight: 650,
  },
  addButton: {
    minHeight: "44px !important",
    borderRadius: "12px !important",
    padding: "0 18px !important",
    backgroundColor: `${theme.palette.primary.main} !important`,
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
  emptyState: {
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 650,
    padding: "34px 8px 22px",
    textAlign: "center" as const,
  },
  dialogContent: {
    paddingTop: "8px !important",
  },
  dialogActions: {
    direction: "rtl",
    padding: "16px 24px 22px !important",
    gap: "8px !important",
  },
  selectField: {
    marginBottom: "16px !important",
    width: "100%",
  },
  "@media (max-width: 1024px)": {
    mentorRow: {
      gridTemplateColumns: "minmax(160px, 200px) minmax(220px, 1fr)",
    },
    loadStatus: {
      gridColumn: "2",
      justifyContent: "flex-start",
    },
  },
  "@media (max-width: 760px)": {
    root: {
      padding: "72px 12px 16px",
      overflowX: "hidden",
    },
    header: {
      alignItems: "stretch",
      flexDirection: "column" as const,
      gap: 12,
      marginBottom: 12,
    },
    addButton: {
      width: "100%",
    },
    card: {
      padding: 12,
      borderRadius: 14,
    },
    sectionHeader: {
      alignItems: "flex-start",
      flexDirection: "column" as const,
      gap: 4,
    },
    mentorRow: {
      gridTemplateColumns: "1fr",
      alignItems: "flex-start",
      gap: 10,
      padding: "14px 2px",
    },
    loadStatus: {
      gridColumn: "auto",
      justifyContent: "flex-start",
    },
    mentorName: {
      whiteSpace: "normal" as const,
    },
  },
  "@media (max-width: 420px)": {
    title: {
      fontSize: "1.35rem",
    },
    unassignedCard: {
      padding: 12,
    },
    chip: {
      width: "100%",
      justifyContent: "space-between",
      borderRadius: 12,
      paddingInline: 12,
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    root: {
      animation: "fadeIn 1ms linear",
    },
    addButton: {
      transition: "background-color 1ms linear !important",
      "&:hover, &:active": {
        transform: "none",
      },
    },
    mentorRow: {
      transition: "background-color 1ms linear",
    },
    chip: {
      transition: "background-color 1ms linear",
    },
  },
  "@media (prefers-reduced-transparency: reduce)": {
    card: {
      backgroundColor: theme.palette.background.paper,
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  },
} as any);
