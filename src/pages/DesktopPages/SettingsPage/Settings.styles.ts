import { makeStyles } from "@mui/styles";

export const useSettingsStyles = makeStyles({
  root: {
    minHeight: "100dvh",
    direction: "rtl" as const,
    padding: "92px 24px 40px",
    background:
      "linear-gradient(180deg, var(--color-canvas-warm) 0%, var(--color-canvas) 48%)",
  },
  container: {
    width: "min(100%, 760px)",
    margin: "0 auto",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    margin: "0 !important",
    color: "var(--color-text)",
    fontFamily: "inherit !important",
    fontSize: "1.65rem !important",
    fontWeight: "700 !important" as const,
    lineHeight: "1.25 !important",
  },
  subtitle: {
    marginTop: "6px !important",
    color: "var(--color-text-secondary)",
    fontFamily: "inherit !important",
    fontSize: "0.92rem !important",
    lineHeight: "1.55 !important",
  },
  sections: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 20,
  },
  sectionTitle: {
    margin: "0 4px 5px !important",
    color: "var(--color-text-secondary)",
    fontFamily: "inherit !important",
    fontSize: "0.84rem !important",
    fontWeight: "700 !important" as const,
  },
  sectionCard: {
    padding: 6,
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border-subtle)",
    backgroundColor: "var(--color-surface)",
    boxShadow: "var(--shadow-sm)",
    overflow: "hidden",
    "& > *:not(:last-child)": {
      borderBottom: "1px solid var(--color-border-subtle)",
    },
  },
  logoutSection: {
    marginTop: 12,
    paddingTop: 20,
    borderTop: "1px solid var(--color-border)",
  },
  logoutCard: {
    padding: 6,
    borderRadius: "var(--radius-lg)",
    border: "1px solid rgba(180, 35, 24, 0.2)",
    backgroundColor: "var(--color-surface)",
    boxShadow: "var(--shadow-sm)",
  },
  aboutDialogPaper: {
    direction: "rtl" as const,
    borderRadius: "var(--radius-xl, 22px) !important",
    border: "1px solid var(--color-border-subtle)",
  },
  aboutTitle: {
    position: "relative" as const,
    padding: "20px 24px 12px !important",
    fontFamily: "inherit !important",
    fontWeight: "800 !important" as const,
    color: "var(--color-brand-ink)",
  },
  aboutClose: {
    position: "absolute" as const,
    left: "10px !important",
    top: "10px !important",
    width: "44px !important",
    height: "44px !important",
    color: "var(--color-primary) !important",
  },
  aboutContent: {
    padding: "4px 24px 24px !important",
    color: "var(--color-text-secondary)",
    fontFamily: "inherit !important",
    lineHeight: "1.6 !important",
  },
  aboutVersion: {
    marginTop: "8px !important",
    color: "var(--color-text-muted)",
    fontFamily: "inherit !important",
    fontSize: "0.84rem !important",
    fontWeight: "600 !important" as const,
    fontVariantNumeric: "tabular-nums" as const,
  },
  "@media (max-width: 767px)": {
    root: { padding: "82px 16px 28px" },
    header: { marginBottom: 18 },
  },
});
