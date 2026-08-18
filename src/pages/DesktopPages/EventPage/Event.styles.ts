import makeStyles from "@mui/styles/makeStyles";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
    padding: "calc(var(--shell-top-inset, 68px) + 24px) 24px 32px",
    direction: "rtl",
    minHeight: "100dvh",
    background:
      "linear-gradient(180deg, var(--color-canvas-warm, #faf9fb) 0%, var(--color-canvas, #f5f6f8) 100%)",
    animation: "fadeIn 180ms var(--ease-out, ease-out)",
    "@media (min-width: 1024px)": {
      paddingInline: 32,
    },
    "@media (max-width: 760px)": {
      padding:
        "calc(var(--shell-top-inset, 60px) + 12px) 12px calc(var(--shell-bottom-inset, 0px) + 20px)",
      gap: 20,
      overflowX: "hidden",
    },
    },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    maxWidth: 1480,
    width: "100%",
    margin: "0 auto 2px",
  },
  pageTitle: {
    fontWeight: 800,
    color: "var(--color-text, #1d1d1f)",
    fontSize: "clamp(1.55rem, 2.2vw, 2.1rem)",
    lineHeight: 1.12,
    letterSpacing: "-0.01em",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-start",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap" as const,
  },
  calendarButton: {
    minHeight: 44,
    color: "var(--color-brand, #6f4e7c)",
    borderColor: "var(--color-border, #dadde3)",
    fontWeight: 700,
    borderRadius: "var(--radius-md, 14px)",
    padding: "9px 18px",
    textTransform: "none" as const,
    backgroundColor: "var(--color-surface-elevated, rgba(255,255,255,0.82))",
    backdropFilter: "blur(18px) saturate(160%)",
    transition:
      "transform var(--transition-fast, 140ms ease), border-color var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease)",
    "& .MuiButton-startIcon": {
      marginLeft: 6,
      marginRight: 0,
    },
    "&:hover": {
      borderColor: "var(--color-brand, #6f4e7c)",
      backgroundColor: "var(--color-brand-soft, #f4eef6)",
      boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16,24,40,0.07))",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  },
  createButton: {
    minHeight: 44,
    background: "var(--color-primary, #2f6f61)",
    color: "#fff",
    fontWeight: 800,
    borderRadius: "var(--radius-md, 14px)",
    padding: "10px 24px",
    boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16,24,40,0.07))",
    transition:
      "transform var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease)",
    "&:hover": {
      background: "var(--color-primary-dark, #285e52)",
      boxShadow: "var(--shadow-md, 0 12px 34px rgba(16,24,40,0.1))",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "scale(0.97)",
    },
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    maxWidth: 1480,
    width: "100%",
    margin: "0 auto",
  },
  sectionTitle: {
    fontWeight: 800,
    color: "var(--color-text, #1d1d1f)",
    fontSize: "1.08rem",
    lineHeight: 1.35,
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
    gap: 20,
    alignItems: "stretch",
  },
  emptyState: {
    textAlign: "center",
    color: "var(--color-text-muted, #6e737a)",
    padding: "48px 20px",
    fontSize: 16,
    backgroundColor: "var(--color-surface-elevated, rgba(255,255,255,0.82))",
    border: "1px solid var(--color-border-subtle, #e9ebef)",
    borderRadius: "var(--radius-lg, 18px)",
  },
  "@media (max-width: 760px)": {
    header: {
      alignItems: "stretch",
      flexDirection: "column" as const,
      gap: 12,
    },
    pageTitle: {
      fontSize: "1.45rem",
    },
    headerActions: {
      width: "100%",
      alignItems: "stretch",
      flexDirection: "column" as const,
    },
    calendarButton: {
      width: "100%",
      minHeight: 44,
      justifyContent: "center",
    },
    createButton: {
      width: "100%",
      minHeight: 44,
    },
    cardsContainer: {
      gridTemplateColumns: "1fr",
      gap: 14,
    },
  },
  "@media (prefers-reduced-transparency: reduce)": {
    calendarButton: {
      backgroundColor: "var(--color-surface, #fff)",
      backdropFilter: "none",
    },
  },
});
