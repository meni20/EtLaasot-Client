import { makeStyles } from "@mui/styles";

const surface =
  "linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.78))";

export const useDashboardStyles = makeStyles({
  root: {
    minHeight: "100dvh",
    direction: "rtl",
    padding: "88px 24px 28px",
    background:
      "linear-gradient(180deg, var(--color-canvas-warm) 0%, var(--color-canvas) 48%)",
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
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 12,
  },
  summaryCard: {
    minWidth: 0,
    minHeight: 118,
    width: "100%",
    display: "grid !important",
    gridTemplateColumns: "48px minmax(0, 1fr)",
    gridTemplateRows: "1fr auto",
    alignItems: "center",
    justifyItems: "start",
    gap: "4px 12px",
    padding: "18px",
    borderRadius: "var(--radius-md) !important",
    border: "1px solid var(--color-border-subtle)",
    background: surface,
    boxShadow: "var(--shadow-sm)",
    textAlign: "right" as const,
    cursor: "pointer",
    transition:
      "transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast), background-color var(--transition-fast)",
    "&:hover": {
      borderColor: "rgba(var(--color-primary-rgb), 0.28)",
      boxShadow: "var(--shadow-md)",
    },
    "&:active": {
      transform: "scale(0.99)",
    },
    "&:focus-visible": {
      outline: "none",
      boxShadow: "var(--shadow-sm), 0 0 0 3px rgba(var(--color-primary-rgb), 0.22)",
    },
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover": {
        transform: "translateY(-1px)",
      },
    },
  },
  summaryCardAttention: {
    borderInlineStart: "4px solid var(--color-warning)",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 247, 232, 0.7))",
  },
  summaryIcon: {
    gridRow: "1 / span 2",
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius-sm)",
    color: "var(--color-primary)",
    backgroundColor: "var(--color-primary-soft)",
    fontSize: "1.45rem",
  },
  summaryValue: {
    color: "var(--color-text)",
    fontFamily: "inherit",
    fontSize: "1.75rem",
    fontWeight: 700,
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  },
  summaryLabel: {
    color: "var(--color-text-secondary)",
    fontFamily: "inherit",
    fontSize: "0.86rem",
    fontWeight: 600,
    lineHeight: 1.35,
  },
  chartCard: {
    maxWidth: 1480,
    margin: "0 auto",
    padding: "18px 18px 14px",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border-subtle)",
    background: "var(--color-surface)",
    boxShadow: "var(--shadow-sm)",
  },
  upcomingSection: {
    maxWidth: 1480,
    margin: "0 auto 18px",
    padding: "18px",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border-subtle)",
    background: "var(--color-surface)",
    boxShadow: "var(--shadow-sm)",
  },
  carouselHeader: {
    minHeight: 44,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  carouselControls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  carouselButton: {
    width: "44px !important",
    height: "44px !important",
    color: "var(--color-primary) !important",
    backgroundColor: "var(--color-primary-soft) !important",
    border: "1px solid rgba(var(--color-primary-rgb), 0.18) !important",
    transition:
      "transform var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast)",
    "&:hover": {
      color: "var(--color-surface) !important",
      backgroundColor: "var(--color-primary) !important",
    },
    "&:active": {
      transform: "scale(0.94)",
    },
    "&.Mui-disabled": {
      color: "var(--color-text-muted) !important",
      backgroundColor: "var(--color-surface-muted) !important",
      borderColor: "var(--color-border-subtle) !important",
      opacity: 0.72,
    },
  },
  eventsCarouselViewport: {
    overflow: "hidden",
  },
  eventsCarouselTrack: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    alignItems: "stretch",
  },
  carouselCard: {
    minWidth: 0,
  },
  chartTitle: {
    margin: "0 0 12px !important",
    color: "var(--color-text)",
    fontFamily: "inherit !important",
    fontSize: "1rem !important",
    fontWeight: "700 !important",
    lineHeight: "1.35 !important",
  },
  chartFallback: {
    minHeight: 160,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyPanel: {
    minHeight: 136,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: "var(--radius-md)",
    border: "1px dashed var(--color-border)",
    backgroundColor: "var(--color-surface-muted)",
    color: "var(--color-text-secondary)",
    fontFamily: "inherit",
    fontSize: "0.92rem",
    fontWeight: 600,
    textAlign: "center" as const,
  },
  stateCard: {
    width: "min(100%, 420px)",
    minHeight: 180,
    margin: "96px auto 0",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border-subtle)",
    background: "var(--color-surface)",
    boxShadow: "var(--shadow-sm)",
    textAlign: "center" as const,
  },
  stateText: {
    color: "var(--color-text-secondary)",
    fontFamily: "inherit !important",
    fontSize: "0.96rem !important",
    fontWeight: "600 !important",
    lineHeight: "1.5 !important",
  },
  "@media (max-width: 1024px)": {
    root: {
      padding: "76px 16px 22px",
    },
    summaryGrid: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    eventsCarouselViewport: {
      overflowX: "auto" as const,
      paddingBottom: 4,
      scrollbarWidth: "thin" as const,
    },
    eventsCarouselTrack: {
      gridTemplateColumns: "repeat(3, minmax(260px, 1fr))",
    },
  },
  "@media (max-width: 600px)": {
    root: {
      padding: "72px 12px 18px",
    },
    title: {
      fontSize: "1.32rem !important",
    },
    summaryGrid: {
      gridTemplateColumns: "1fr",
      gap: 10,
    },
    summaryCard: {
      minHeight: 104,
      padding: "16px",
    },
    upcomingSection: {
      padding: 14,
    },
    chartCard: {
      padding: "16px 14px 12px",
    },
    eventsCarouselTrack: {
      gridTemplateColumns: "repeat(3, minmax(245px, 1fr))",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    summaryCard: {
      transform: "none !important",
    },
    carouselButton: {
      transform: "none !important",
    },
  },
});
