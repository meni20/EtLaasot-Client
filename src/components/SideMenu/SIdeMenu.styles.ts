import { makeStyles } from "@mui/styles";

export const useSideMenuStyles = makeStyles({
  drawerPaper: {
    width: 240,
    borderRadius: "0 12px 12px 0",
    background: "#f8f4f9",
    boxShadow: "4px 0 12px rgba(0,0,0,0.1)",
  },
  header: {
    padding: "16px 24px",
    fontWeight: 700,
    fontFamily: "Rubik, sans-serif",
    background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
    color: "#fff",
    borderRadius: "0 12px 0 0",
  },
  listItemButton: {
    borderRadius: 8,
    margin: "4px 8px",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #9a5188 10%, #7a3e6b 90%)",
      color: "#fff",
      "& .MuiListItemIcon-root": {
        color: "#fff",
      },
    },
  },
  listItemText: {
    fontWeight: 500,
  },
  listItemIcon: {
    minWidth: 40,
    color: "#7a3e6b",
    transition: "all 0.2s ease",
  },
});
