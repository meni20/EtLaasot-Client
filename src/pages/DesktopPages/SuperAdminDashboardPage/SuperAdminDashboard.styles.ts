import { makeStyles } from "@mui/styles";

export const useSuperAdminDashboardStyles = makeStyles({
  root: {
    minHeight: "100dvh",
    padding: "88px 24px 28px",
    direction: "rtl" as const,
    background:
      "linear-gradient(180deg, var(--color-canvas-warm) 0%, var(--color-canvas) 52%)",
  },
  header: {
    maxWidth: 1480,
    margin: "0 auto 18px",
  },
  title: {
    margin: "0 !important",
    color: "var(--color-text)",
    fontFamily: "inherit !important",
    fontSize: "1.55rem !important",
    fontWeight: "700 !important",
    lineHeight: "1.22 !important",
  },
  subtitle: {
    marginTop: "6px !important",
    color: "var(--color-text-secondary)",
    fontFamily: "inherit !important",
    fontSize: "0.92rem !important",
    lineHeight: "1.5 !important",
  },
  summaryGrid: {
    maxWidth: 1480,
    margin: "0 auto 18px",
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    gap: 12,
  },
  summaryCard: {
    minWidth: 0,
    minHeight: 132,
    padding: "16px 14px",
    borderRadius: "var(--radius-md)",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.78))",
    border: "1px solid var(--color-border-subtle)",
    boxShadow: "var(--shadow-sm)",
    textAlign: "right" as const,
    transition:
      "transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast)",
    "&:hover": {
      borderColor: "rgba(47, 111, 97, 0.24)",
      boxShadow: "var(--shadow-md)",
    },
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover": {
        transform: "translateY(-1px)",
      },
    },
  },
  summaryIcon: {
    width: 44,
    height: 44,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius-sm)",
    color: "var(--color-primary)",
    backgroundColor: "var(--color-primary-soft)",
    "& svg": {
      fontSize: 22,
    },
  },
  summaryValue: {
    color: "var(--color-text)",
    fontFamily: "inherit !important",
    fontSize: "1.65rem !important",
    fontWeight: "700 !important",
    lineHeight: "1 !important",
    fontVariantNumeric: "tabular-nums",
  },
  summaryLabel: {
    marginTop: "6px !important",
    color: "var(--color-text-secondary)",
    fontFamily: "inherit !important",
    fontSize: "0.8rem !important",
    fontWeight: "600 !important",
    lineHeight: "1.42 !important",
  },
  tableSection: {
    maxWidth: 1480,
    margin: "0 auto",
    overflow: "hidden",
    borderRadius: "var(--radius-lg) !important",
    border: "1px solid var(--color-border-subtle)",
    background: "var(--color-surface) !important",
    boxShadow: "var(--shadow-sm) !important",
  },
  tableHeader: {
    minHeight: 58,
    display: "flex",
    alignItems: "center",
    padding: "16px 18px 12px",
    borderBottom: "1px solid var(--color-border-subtle)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(250,249,251,0.78))",
  },
  sectionTitle: {
    color: "var(--color-text)",
    fontFamily: "inherit !important",
    fontSize: "1rem !important",
    fontWeight: "700 !important",
    lineHeight: "1.35 !important",
  },
  tableContainer: {
    maxWidth: "100%",
    overflowX: "auto" as const,
  },
  table: {
    minWidth: 760,
  },
  tableRow: {
    transition: "background-color var(--transition-fast)",
    "&:hover": {
      backgroundColor: "var(--color-primary-soft) !important",
    },
  },
  headingCell: {
    color: "var(--color-text-secondary) !important",
    backgroundColor: "var(--color-surface-muted) !important",
    borderBottomColor: "var(--color-border-subtle) !important",
    fontFamily: "inherit !important",
    fontSize: "0.78rem !important",
    fontWeight: "700 !important",
    lineHeight: "1.4 !important",
    textAlign: "right" as const,
    whiteSpace: "nowrap" as const,
  },
  bodyCell: {
    minHeight: 48,
    color: "var(--color-text) !important",
    borderBottomColor: "var(--color-border-subtle) !important",
    fontFamily: "inherit !important",
    fontSize: "0.86rem !important",
    fontWeight: "600 !important",
    lineHeight: "1.5 !important",
    textAlign: "right" as const,
    fontVariantNumeric: "tabular-nums",
  },
  branchButton: {
    minHeight: "44px !important",
    padding: "8px 10px !important",
    borderRadius: "var(--radius-sm) !important",
    color: "var(--color-primary) !important",
    fontFamily: "inherit !important",
    fontWeight: "700 !important",
    textAlign: "right" as const,
    transition:
      "transform var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast)",
    "&:hover": {
      backgroundColor: "rgba(47, 111, 97, 0.1)",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
    "&:focus-visible": {
      outline: "none",
      boxShadow: "0 0 0 3px rgba(47, 111, 97, 0.22)",
    },
  },
  branchButtonIcon: {
    marginRight: 6,
    fontSize: "18px !important",
  },
  state: {
    width: "min(100%, 460px)",
    minHeight: 220,
    margin: "96px auto 0",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
    color: "var(--color-text-secondary)",
    textAlign: "center" as const,
    fontFamily: "inherit",
    fontWeight: 600,
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border-subtle)",
    background: "var(--color-surface)",
    boxShadow: "var(--shadow-sm)",
  },
  retryButton: {
    minHeight: "44px !important",
    color: "var(--color-primary) !important",
    borderColor: "var(--color-border) !important",
    fontFamily: "inherit !important",
    fontWeight: "700 !important",
    "&:hover": {
      borderColor: "var(--color-primary) !important",
      backgroundColor: "var(--color-primary-soft) !important",
    },
  },
  "@media (max-width: 1200px)": {
    summaryGrid: {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
  },
  "@media (max-width: 768px)": {
    root: {
      padding: "76px 12px 20px",
      overflowX: "hidden",
    },
    title: {
      fontSize: "1.35rem !important",
    },
    summaryGrid: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 10,
    },
    summaryCard: {
      minHeight: 122,
      padding: "14px 12px",
    },
    tableHeader: {
      paddingInline: 14,
    },
  },
  "@media (max-width: 420px)": {
    summaryGrid: {
      gridTemplateColumns: "1fr",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    summaryCard: {
      transform: "none !important",
    },
    branchButton: {
      transform: "none !important",
    },
  },
});
