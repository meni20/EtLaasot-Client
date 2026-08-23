import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    direction: "rtl",
    padding:
      "calc(env(safe-area-inset-top, 0px) + 18px) clamp(16px, 4vw, 28px) calc(var(--shell-bottom-inset, 0px) + env(safe-area-inset-bottom, 0px) + 24px)",
    maxWidth: 680,
    margin: "0 auto",
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    background:
      "linear-gradient(180deg, var(--color-canvas-warm, #faf9fb) 0%, var(--color-canvas, #f5f6f8) 100%)",
    fontFamily:
      '"Noto Sans Hebrew", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    animation: "fadeIn 220ms var(--ease-out, ease-out)",
    "@media (prefers-reduced-motion: reduce)": {
      animation: "fadeIn 1ms linear",
    },
  },
  header: {
    fontWeight: 800,
    fontSize: "clamp(24px, 5vw, 32px)",
    marginBottom: 8,
    color: "var(--color-text, #1d1d1f)",
    fontFamily: "inherit",
    lineHeight: 1.18,
  },
  subheader: {
    color: "var(--color-text-secondary, #51565c)",
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.55,
    marginBottom: 20,
    fontFamily: "inherit",
  },
  sectionCard: {
    width: "100%",
    borderRadius: "var(--radius-sheet, 26px)",
    padding: "clamp(22px, 6vw, 32px)",
    marginBottom: 14,
    backgroundColor: "var(--color-surface-elevated, rgba(255, 255, 255, 0.82))",
    border: "1px solid rgba(255, 255, 255, 0.72)",
    boxShadow: "var(--shadow-lg, 0 24px 64px rgba(16, 24, 40, 0.15))",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    animation: "scaleIn 240ms var(--ease-out, ease-out)",
    "@media (prefers-reduced-motion: reduce)": {
      animation: "fadeIn 1ms linear",
    },
    "@media (prefers-reduced-transparency: reduce)": {
      backgroundColor: "var(--color-surface, #fff)",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
      borderColor: "var(--color-border, #dadde3)",
    },
  },
  sectionTitle: {
    fontWeight: 800,
    fontSize: 16,
    color: "var(--color-text, #1d1d1f)",
    marginBottom: 12,
    fontFamily: "inherit",
  },
  fieldHint: {
    color: "var(--color-text-muted, #6e737a)",
    fontSize: 12,
    marginTop: 8,
    fontFamily: "inherit",
  },
  detailLabel: {
    color: "var(--color-text-muted, #6e737a)",
    fontSize: 12,
    fontFamily: "inherit",
  },
  detailValue: {
    color: "var(--color-text, #1d1d1f)",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "inherit",
  },
  actionButton: {
    marginTop: "12px !important",
    minHeight: "52px !important",
    borderRadius: "var(--radius-md, 14px) !important",
    textTransform: "none !important" as const,
    fontWeight: "800 !important" as const,
    fontFamily: "inherit !important",
    transition:
      "transform var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease) !important",
    "&:active": { transform: "scale(0.97)" },
    "@media (prefers-reduced-motion: reduce)": {
      transition: "background-color 1ms linear, box-shadow 1ms linear !important",
      "&:active": { transform: "none" },
    },
  },
  historyItem: {
    padding: 12,
    borderRadius: "var(--radius-md, 14px)",
    backgroundColor: "var(--color-surface, #fff)",
    boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
  },
  historyMeta: {
    color: "var(--color-text-muted, #6e737a)",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "inherit",
  },
  empty: {
    color: "var(--color-text-muted, #6e737a)",
    fontSize: 13,
    textAlign: "center" as const,
    padding: "12px 0",
    fontFamily: "inherit",
  },
});

