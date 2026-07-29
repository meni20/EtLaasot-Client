import { makeStyles } from "@mui/styles";
import {
  COLLAPSED_DRAWER_WIDTH,
  DRAWER_WIDTH,
} from "./SideMenu.interface";

export const useSideMenuStyles = makeStyles({
  drawerPaper: {
    width: DRAWER_WIDTH,
    maxWidth: "min(250px, calc(100vw - 20px))",
    borderRadius: "0 0 0 18px",
    background: "#fbf8fb",
    boxShadow: "-8px 0 24px rgba(45,35,43,0.12)",
    direction: "rtl" as const,
    overflow: "hidden",
    borderLeft: "1px solid rgba(122,62,107,0.12)",
    right: "0 !important",
    left: "auto !important",
    transformOrigin: "right center",
    transition:
      "width 240ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 240ms ease",
    "@media (min-width: 900px)": {
      top: 64,
      height: "calc(100% - 64px)",
      borderRadius: "0 0 0 16px",
    },
  },
  collapsedDrawerPaper: {
    width: `${COLLAPSED_DRAWER_WIDTH}px !important`,
  },
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
    padding: "18px 12px 16px",
    overflowY: "auto" as const,
    transition: "padding 240ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  collapsedList: {
    padding: "16px 8px",
    alignItems: "center",
  },
  listItemButton: {
    borderRadius: 12,
    margin: 0,
    minHeight: 52,
    padding: "11px 14px",
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
  collapsedListItemButton: {
    width: 48,
    height: 48,
    minHeight: "48px !important",
    padding: "0 !important",
    justifyContent: "center",
    borderRadius: "14px !important",
    "&:hover": {
      transform: "none",
    },
  },
  activeListItem: {
    boxShadow: "inset -4px 0 0 #9a5188",
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
  collapsedListItemText: {
    width: 0,
    opacity: 0,
    overflow: "hidden",
    margin: "0 !important",
    pointerEvents: "none" as const,
    transition: "opacity 120ms ease, width 180ms ease",
  },
  listItemIcon: {
    minWidth: 40,
    color: "#7a3e6b",
    transition: "color 0.2s ease",
    justifyContent: "center",
    "& svg": {
      fontSize: "1.25rem",
    },
  },
  collapsedListItemIcon: {
    minWidth: "0 !important",
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
