import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    direction: "rtl",
    padding: "calc(env(safe-area-inset-top, 0px) + 20px) 16px 90px",
    maxWidth: 520,
    margin: "0 auto",
    minHeight: "100vh",
    backgroundColor: "#F7F7F8",
  },
  header: {
    fontWeight: 700,
    fontSize: 22,
    marginBottom: 8,
    color: "#1F1F1F",
    fontFamily: "Rubik, sans-serif",
  },
  subheader: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 16,
    fontFamily: "Rubik, sans-serif",
  },
  sectionCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: 16,
    color: "#1F1F1F",
    marginBottom: 12,
    fontFamily: "Rubik, sans-serif",
  },
  fieldHint: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 8,
    fontFamily: "Rubik, sans-serif",
  },
  detailLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontFamily: "Rubik, sans-serif",
  },
  detailValue: {
    color: "#1F1F1F",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Rubik, sans-serif",
  },
  actionButton: {
    marginTop: "12px !important",
    borderRadius: "14px !important",
    textTransform: "none !important" as const,
    fontWeight: "700 !important" as const,
    fontFamily: "Rubik, sans-serif !important",
  },
  historyItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
  },
  historyMeta: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Rubik, sans-serif",
  },
  empty: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center" as const,
    padding: "12px 0",
    fontFamily: "Rubik, sans-serif",
  },
});

