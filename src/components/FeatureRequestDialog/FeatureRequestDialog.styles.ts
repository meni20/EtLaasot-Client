import { makeStyles } from "@mui/styles";

export const useFeatureRequestDialogStyles = makeStyles({
  paper: {
    direction: "rtl" as const,
    borderRadius: "var(--radius-xl, 22px) !important",
    border: "1px solid var(--color-border-subtle)",
    backgroundColor: "var(--color-surface)",
    overflow: "hidden",
  },
  title: {
    position: "relative" as const,
    padding: "20px 24px 12px 64px !important",
    textAlign: "right" as const,
    color: "var(--color-brand-ink)",
    fontFamily: "inherit !important",
    fontSize: "1.15rem !important",
    fontWeight: "800 !important" as const,
  },
  close: {
    position: "absolute" as const,
    left: "10px !important",
    top: "10px !important",
    width: "44px !important",
    height: "44px !important",
    color: "var(--color-primary) !important",
  },
  content: {
    padding: "10px 24px 8px !important",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "18px",
    paddingTop: "4px",
  },
  actions: {
    padding: "12px 24px 22px !important",
    gap: "8px",
  },
  actionButton: {
    minWidth: "92px !important",
    minHeight: "42px !important",
  },
});
