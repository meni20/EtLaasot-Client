import { makeStyles } from "@mui/styles";
import {
  COLLAPSED_DRAWER_WIDTH,
  DRAWER_WIDTH,
} from "./SideMenu.interface";

export const useSideMenuStyles = makeStyles({
  drawerPaper: {
    width: DRAWER_WIDTH,
    maxWidth: "min(250px, calc(100vw - 16px))",
    borderRadius: "0 0 0 20px",
    background: "rgba(251, 248, 251, 0.82)",
    backdropFilter: "blur(24px) saturate(170%)",
    WebkitBackdropFilter: "blur(24px) saturate(170%)",
    boxShadow: "-18px 0 36px rgba(45, 35, 43, 0.16)",
    direction: "rtl" as const,
    overflow: "hidden",
    borderInlineEnd: "1px solid rgba(var(--color-primary-rgb), 0.14)",
    right: "0 !important",
    left: "auto !important",
    transformOrigin: "right center",
    transition:
      "box-shadow var(--transition-normal, 180ms ease), background-color var(--transition-normal, 180ms ease)",
    "@media (min-width: 1024px)": {
      top: "calc(env(safe-area-inset-top, 0px) + var(--shell-top-inset, 68px)) !important",
      bottom: "0 !important",
      height: "auto !important",
      borderRadius: "0 0 0 18px",
      boxShadow: "-10px 0 28px rgba(45, 35, 43, 0.12)",
    },
  },
  collapsedDrawerPaper: {
    width: `${COLLAPSED_DRAWER_WIDTH}px !important`,
  },
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
    padding: "18px 12px calc(env(safe-area-inset-bottom, 0px) + 16px)",
    overflowY: "auto" as const,
    overscrollBehavior: "contain" as const,
  },
  collapsedList: {
    padding: "16px 8px calc(env(safe-area-inset-bottom, 0px) + 16px)",
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
    transition:
      "background-color var(--transition-normal, 180ms ease), color var(--transition-normal, 180ms ease), transform var(--transition-fast, 140ms ease)",
    "&:focus-visible": {
      outline: "2px solid rgba(var(--color-primary-rgb), 0.42)",
      outlineOffset: 2,
    },
    "&:active": {
      transform: "scale(0.98)",
    },
    "&.Mui-selected": {
      backgroundColor: "var(--color-primary-selected)",
      color: "var(--color-primary-dark)",
    },
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover": {
        backgroundColor: "var(--color-primary-soft)",
        color: "var(--color-primary-dark)",
        transform: "translateX(-2px)",
        "& .MuiListItemIcon-root": {
          color: "var(--color-primary)",
        },
      },
      "&.Mui-selected:hover": {
        backgroundColor: "var(--color-primary-selected)",
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
    "&:active": {
      transform: "scale(0.96)",
    },
  },
  activeListItem: {
    boxShadow: "inset -4px 0 0 var(--color-brand)",
    fontWeight: 800,
  },
  listItemText: {
    margin: 0,
    textAlign: "right" as const,
    "& .MuiListItemText-primary": {
      fontFamily: "inherit",
      fontWeight: 700,
      fontSize: "0.95rem",
      letterSpacing: 0,
    },
  },
  collapsedListItemText: {
    width: 0,
    opacity: 0,
    overflow: "hidden",
    margin: "0 !important",
    pointerEvents: "none" as const,
    transition: "opacity var(--transition-fast, 140ms ease)",
  },
  listItemIcon: {
    minWidth: 40,
    color: "var(--color-primary)",
    transition: "color var(--transition-fast, 140ms ease)",
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
  "@media (max-width: 767px)": {
    drawerPaper: {
      width: "min(86vw, 320px)",
      maxWidth: "calc(100vw - 16px)",
      borderRadius: "0 0 0 22px",
    },
    listItemButton: {
      minHeight: 56,
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    drawerPaper: {
      transition: "none",
    },
    list: {
      transition: "none",
    },
    listItemButton: {
      transition: "background-color 120ms ease, color 120ms ease",
      "&:hover": {
        transform: "none",
      },
      "&:active": {
        transform: "none",
      },
    },
    collapsedListItemText: {
      transition: "none",
    },
    listItemIcon: {
      transition: "none",
    },
  },
  "@media (prefers-reduced-transparency: reduce)": {
    drawerPaper: {
      background: "#fbf8fb",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  },
});
