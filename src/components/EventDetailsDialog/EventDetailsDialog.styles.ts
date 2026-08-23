import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  dialogPaper: {
    borderRadius: "var(--radius-xl, 22px)",
    overflow: "hidden",
    minWidth: 380,
    maxWidth: 440,
    boxShadow: "var(--shadow-xl, 0 24px 64px rgba(16,24,40,0.15))",
    border: "1px solid var(--color-border-subtle, #e9ebef)",
    animation: "scaleIn 220ms var(--ease-out, ease-out)",
    "@media (max-width: 520px)": {
      minWidth: "calc(100vw - 32px)",
      maxWidth: "calc(100vw - 32px)",
      margin: 16,
    },
  },
  header: {
    position: "relative" as const,
    background:
      "linear-gradient(180deg, var(--color-surface, #fff) 0%, var(--color-canvas-warm, #faf9fb) 100%)",
    color: "var(--color-text, #1d1d1f)",
    padding: "20px 60px 18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid var(--color-border-subtle, #e9ebef)",
  },
  title: {
    color: "var(--color-text, #1d1d1f)",
    fontWeight: 800,
    fontSize: 18,
    lineHeight: 1.3,
    textAlign: "center" as const,
    overflowWrap: "anywhere" as const,
  },
  typeChip: {
    minHeight: 30,
    borderRadius: "var(--radius-sm, 10px)",
    fontWeight: 800,
    fontSize: 13,
    background: "var(--color-brand-soft)",
    color: "var(--color-brand)",
    border: "1px solid rgba(var(--color-brand-rgb), 0.18)",
  },
  closeButton: {
    position: "absolute" as const,
    left: 10,
    top: 10,
    width: 44,
    height: 44,
    color: "var(--color-text-secondary, #51565c)",
    backgroundColor: "var(--color-surface-muted, #f0f2f4)",
    transition:
      "transform var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease), color var(--transition-fast, 140ms ease)",
    "&:hover": {
      color: "var(--color-text, #1d1d1f)",
      backgroundColor: "var(--color-border-subtle, #e9ebef)",
    },
    "&:active": {
      transform: "scale(0.94)",
    },
  },
  content: {
    direction: "rtl" as const,
    padding: "24px",
    backgroundColor: "var(--color-canvas-warm, #faf9fb)",
  },
  section: {
    backgroundColor: "var(--color-surface, #fff)",
    borderRadius: "var(--radius-md, 14px)",
    padding: "14px 18px",
    boxShadow: "var(--shadow-xs, 0 1px 2px rgba(16,24,40,0.05))",
    border: "1px solid var(--color-border-subtle, #e9ebef)",
    transition: "border-color var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease)",
    animation: "fadeInUp 180ms var(--ease-out, ease-out) both",
    "&:hover": {
      borderColor: "var(--color-border, #dadde3)",
      boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16,24,40,0.07))",
    },
  },
  label: {
    fontWeight: 700,
    marginBottom: 4,
    color: "var(--color-text-muted, #6e737a)",
    fontSize: 13,
  },
  valuePrimary: {
    color: "var(--color-primary-dark)",
    fontWeight: 800,
    overflowWrap: "anywhere" as const,
  },
  valueSecondary: {
    color: "var(--color-text, #1d1d1f)",
    fontWeight: 600,
    lineHeight: 1.55,
    overflowWrap: "anywhere" as const,
  },
  "@media (prefers-reduced-motion: reduce)": {
    dialogPaper: {
      animation: "fadeIn 1ms linear",
    },
  },
});
