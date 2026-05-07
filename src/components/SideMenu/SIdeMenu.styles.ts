import { makeStyles } from "@mui/styles";

export const useSideMenuStyles = makeStyles({
  drawerPaper: {
    width: 260,
    borderRadius: "16px 0 0 16px",
    background: "#faf8fb",
    boxShadow: "-4px 0 24px rgba(0,0,0,0.14)",
    direction: "rtl" as const,
    animation: "slideInRight 0.35s cubic-bezier(0.4,0,0.2,1)",
  },
  header: {
    padding: "20px 24px",
    fontWeight: 700,
    fontFamily: "Rubik, sans-serif",
    fontSize: "1.15rem",
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
  },
  listItemButton: {
    borderRadius: 10,
    margin: "4px 8px",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    "&:hover": {
      background: "linear-gradient(135deg, #9a5188 10%, #7a3e6b 90%)",
      color: "#fff",
      transform: "translateX(-4px)",
      boxShadow: "0 4px 12px rgba(154,81,136,0.2)",
      "& .MuiListItemIcon-root": {
        color: "#fff",
      },
    },
    "&:active": { transform: "scale(0.98)" },
  },
  listItemText: {
    fontWeight: 500,
  },
  listItemIcon: {
    minWidth: 40,
    color: "#7a3e6b",
    transition: "all 0.3s ease",
  },
});
