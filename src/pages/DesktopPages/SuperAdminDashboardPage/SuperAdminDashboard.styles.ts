import { makeStyles } from "@mui/styles";

export const useSuperAdminDashboardStyles = makeStyles({
  root: {
    minHeight: "100vh",
    padding: "84px 24px 28px",
    direction: "rtl" as const,
    backgroundColor: "#f9f9f9",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: "#302a2f",
    fontFamily: "Rubik, sans-serif !important",
    fontSize: "1.7rem !important",
    fontWeight: "800 !important",
  },
  subtitle: {
    marginTop: "4px !important",
    color: "#6b6068",
    fontFamily: "Rubik, sans-serif !important",
    fontSize: "0.9rem !important",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(130px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    minWidth: 0,
    padding: "16px 14px",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    border: "1px solid #f0e8ee",
    boxShadow: "0 2px 12px rgba(45, 35, 43, 0.06)",
    textAlign: "center" as const,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    margin: "0 auto 7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    color: "#7a3e6b",
    backgroundColor: "#f5edf3",
    "& svg": {
      fontSize: 22,
    },
  },
  summaryValue: {
    color: "#9a5188",
    fontFamily: "Rubik, sans-serif !important",
    fontSize: "1.55rem !important",
    fontWeight: "800 !important",
    fontVariantNumeric: "tabular-nums",
  },
  summaryLabel: {
    marginTop: "2px !important",
    color: "#665e64",
    fontFamily: "Rubik, sans-serif !important",
    fontSize: "0.78rem !important",
    fontWeight: "600 !important",
    lineHeight: "1.4 !important",
  },
  tableSection: {
    overflow: "hidden",
    borderRadius: "8px !important",
    border: "1px solid #eee5eb",
    boxShadow: "0 3px 14px rgba(45, 35, 43, 0.06) !important",
  },
  tableHeader: {
    padding: "16px 18px 12px",
    borderBottom: "1px solid #eee5eb",
  },
  sectionTitle: {
    color: "#302a2f",
    fontFamily: "Rubik, sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "800 !important",
  },
  tableContainer: {
    maxWidth: "100%",
    overflowX: "auto" as const,
  },
  table: {
    minWidth: 760,
  },
  headingCell: {
    color: "#5f555d !important",
    backgroundColor: "#fbf8fa",
    borderBottomColor: "#e9dfe6 !important",
    fontFamily: "Rubik, sans-serif !important",
    fontSize: "0.78rem !important",
    fontWeight: "800 !important",
    textAlign: "right" as const,
    whiteSpace: "nowrap" as const,
  },
  bodyCell: {
    color: "#3c353a !important",
    borderBottomColor: "#f1eaef !important",
    fontFamily: "Rubik, sans-serif !important",
    fontSize: "0.86rem !important",
    fontWeight: "600 !important",
    textAlign: "right" as const,
    fontVariantNumeric: "tabular-nums",
  },
  branchButton: {
    minHeight: 40,
    padding: "6px 8px !important",
    borderRadius: "8px !important",
    color: "#713b64 !important",
    fontFamily: "Rubik, sans-serif !important",
    fontWeight: "800 !important",
    textAlign: "right" as const,
    "&:hover": {
      backgroundColor: "#f6eef4",
    },
  },
  branchButtonIcon: {
    marginRight: 6,
    fontSize: "18px !important",
  },
  state: {
    minHeight: 360,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    color: "#6b6068",
    textAlign: "center" as const,
    fontFamily: "Rubik, sans-serif",
  },
  retryButton: {
    minHeight: 42,
    color: "#713b64 !important",
    borderColor: "#cfaec5 !important",
    fontFamily: "Rubik, sans-serif !important",
    fontWeight: "700 !important",
  },
  "@media (max-width: 1200px)": {
    summaryGrid: {
      gridTemplateColumns: "repeat(3, minmax(140px, 1fr))",
    },
  },
  "@media (max-width: 700px)": {
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
      padding: "14px 10px",
    },
  },
});
