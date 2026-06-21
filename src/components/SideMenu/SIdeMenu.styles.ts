import { makeStyles } from "@mui/styles";

export const useSideMenuStyles = makeStyles({
  drawerPaper: {
    width: 280,
    borderRadius: "0 0 0 18px",
    background: "#fbf8fb",
    boxShadow: "-8px 0 28px rgba(45,35,43,0.16)",
    direction: "rtl" as const,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "18px 18px 16px",
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
  },
  headerTitle: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "800 !important" as const,
    lineHeight: "1.2 !important" as const,
  },
  headerSubtitle: {
    marginTop: 2,
    fontFamily: "Rubik, sans-serif",
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.78)",
  },
  logoutButton: {
    flexShrink: 0,
    width: "auto",
    borderRadius: 10,
    padding: "6px 10px",
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.14)",
    textAlign: "center" as const,
    "& .MuiListItemText-primary": {
      fontFamily: "Rubik, sans-serif",
      fontSize: "0.82rem",
      fontWeight: 700,
    },
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.22)",
    },
  },
  list: {
    padding: "12px 10px",
  },
  listItemButton: {
    borderRadius: 12,
    margin: "3px 0",
    minHeight: 46,
    padding: "9px 12px",
    color: "#342b33",
    justifyContent: "flex-start",
    textAlign: "right" as const,
    transition: "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease",
    "&:hover": {
      backgroundColor: "#f3e8f0",
      color: "#6d3860",
      transform: "translateX(-2px)",
      "& .MuiListItemIcon-root": {
        color: "#7a3e6b",
      },
    },
    "&.Mui-selected": {
      backgroundColor: "#f3e8f0",
      color: "#6d3860",
      "&:hover": {
        backgroundColor: "#edddec",
      },
    },
  },
  activeListItem: {
    borderRight: "4px solid #9a5188",
    fontWeight: 800,
  },
  listItemText: {
    margin: 0,
    textAlign: "right" as const,
    "& .MuiListItemText-primary": {
      fontFamily: "Rubik, sans-serif",
      fontWeight: 700,
      fontSize: "0.95rem",
    },
  },
  listItemIcon: {
    minWidth: 34,
    color: "#7a3e6b",
    transition: "color 0.2s ease",
    justifyContent: "center",
  },
});
