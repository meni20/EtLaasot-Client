import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    direction: "rtl",
    padding: "88px 16px 90px",
    maxWidth: 520,
    margin: "0 auto",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontWeight: 700,
    fontSize: 22,
    marginBottom: 8,
    color: "#333",
    fontFamily: "Rubik, sans-serif",
  },
  subheader: {
    color: "#777",
    fontSize: 13,
    marginBottom: 16,
    fontFamily: "Rubik, sans-serif",
  },
  summaryCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "#fff",
    border: "1px solid #eee3eb",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  summaryValue: {
    fontWeight: 800,
    fontSize: 28,
    color: "#9a5188",
    fontFamily: "Rubik, sans-serif",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    fontFamily: "Rubik, sans-serif",
  },
  sectionCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#fff",
    border: "1px solid #eee3eb",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    fontFamily: "Rubik, sans-serif",
  },
  fieldHint: {
    color: "#777",
    fontSize: 12,
    marginTop: 8,
    fontFamily: "Rubik, sans-serif",
  },
  detailLabel: {
    color: "#777",
    fontSize: 12,
    fontFamily: "Rubik, sans-serif",
  },
  detailValue: {
    color: "#222",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "Rubik, sans-serif",
  },
  actionButton: {
    marginTop: "12px !important",
    borderRadius: "8px !important",
    textTransform: "none !important" as const,
    fontWeight: "700 !important" as const,
    fontFamily: "Rubik, sans-serif !important",
  },
  historyItem: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #f1edf0",
    backgroundColor: "#fcfbfc",
  },
  historyMeta: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Rubik, sans-serif",
  },
  empty: {
    color: "#999",
    fontSize: 13,
    textAlign: "center" as const,
    padding: "12px 0",
    fontFamily: "Rubik, sans-serif",
  },
});

