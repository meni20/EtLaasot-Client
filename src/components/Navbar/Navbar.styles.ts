import { makeStyles } from "@mui/styles";

export const useNavbarStyles = makeStyles({
  appBar: {
    background: "rgba(92, 41, 80, 0.84)",
    backdropFilter: "blur(22px) saturate(180%)",
    WebkitBackdropFilter: "blur(22px) saturate(180%)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: "0 12px 32px rgba(45, 35, 43, 0.16)",
    color: "#fff",
    zIndex: 1250,
    paddingTop: "env(safe-area-inset-top, 0px)",
    animation: "fadeInDown var(--transition-slow, 240ms cubic-bezier(0.32, 0.72, 0, 1))",
    overflowX: "clip" as const,
  },
  toolbar: {
    position: "relative" as const,
    justifyContent: "space-between",
    paddingInline: "24px !important",
    minHeight: 64,
  },
  title: {
    flexGrow: 1,
    textAlign: "center" as const,
    fontFamily: "inherit",
    fontWeight: 700,
    letterSpacing: 0,
    fontSize: "1.8rem",
    paddingInlineEnd: "8%",
    textShadow: "0 2px 4px rgba(0,0,0,0.15)",
  },
  navbarLogoSlot: {
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "min(320px, 42vw)",
    pointerEvents: "none" as const,
  },
  navbarLogo: {
    display: "block",
    maxHeight: 54,
    maxWidth: "100%",
    width: "auto",
    height: "auto",
    objectFit: "contain" as const,
    transform: "scale(1.18)",
    transformOrigin: "center",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    backgroundColor: "rgba(255,255,255,0.14)",
    backdropFilter: "blur(10px) saturate(150%)",
    WebkitBackdropFilter: "blur(10px) saturate(150%)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 12,
    padding: "6px 12px",
    marginInlineEnd: 12,
    minHeight: 44,
    lineHeight: 1.3,
    cursor: "pointer",
    transition:
      "background-color 180ms ease, border-color 180ms ease, transform 120ms ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    "&:focus-visible": {
      outline: "2px solid rgba(255,255,255,0.85)",
      outlineOffset: 3,
      backgroundColor: "rgba(255,255,255,0.22)",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  },
  userName: {
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: "0.9rem",
    color: "#fff",
    lineHeight: 1.4,
  },
  userTz: {
    fontFamily: "inherit",
    fontWeight: 400,
    fontSize: "0.72rem",
    color: "rgba(255, 255, 255, 0.74)",
    marginTop: 1,
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 1,
  },
  menuIconBox: {
    width: "44px !important",
    height: "44px !important",
    borderRadius: "12px !important",
    backgroundColor: "rgba(255, 255, 255, 0.10) !important",
    transition:
      "background-color 180ms ease, transform 120ms ease !important",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.18) !important",
    },
    "&:active": {
      transform: "scale(0.96)",
    },
    "&:focus-visible": {
      outline: "2px solid rgba(255,255,255,0.85)",
      outlineOffset: 3,
    },
  },
  homeButton: {
    width: 44,
    height: 44,
    color: "#fff",
    borderRadius: "12px !important",
    transition:
      "background-color 180ms ease, transform 120ms ease !important",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  },
  profileDialogTitle: {
    position: "relative" as const,
    padding: "18px 24px 10px !important",
    fontFamily: "inherit !important",
    fontWeight: "800 !important" as const,
    color: "#2f2930",
  },
  profileDialogClose: {
    position: "absolute" as const,
    left: "12px !important",
    top: "12px !important",
    color: "#6b6068 !important",
  },
  profileLoading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
  },
  profileHero: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "8px 0 4px",
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2e6ee",
    color: "#7a3e6b",
    fontFamily: "inherit",
    fontWeight: 800,
    fontSize: "1.1rem",
    flexShrink: 0,
  },
  profileName: {
    fontFamily: "inherit",
    fontWeight: "800 !important" as const,
    color: "#2f2930",
    fontSize: "1.08rem",
  },
  profileMeta: {
    marginTop: "2px !important",
    fontFamily: "inherit",
    color: "#7a6d75",
    fontSize: "0.86rem !important",
  },
  profileActions: {
    justifyContent: "space-between !important",
    alignItems: "center !important",
    gap: "12px !important",
    padding: "12px 24px 20px !important",
  },
  profileBranchAction: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  },
  profileBranchLabel: {
    fontFamily: "inherit",
    fontWeight: "700 !important" as const,
    color: "#6b6068",
    fontSize: "0.84rem !important",
    whiteSpace: "nowrap" as const,
  },
  profileAccountActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  profileActionButton: {
    borderRadius: "10px !important",
    fontFamily: "inherit !important",
    fontWeight: "700 !important" as const,
  },
  "@media (max-width: 640px)": {
    toolbar: {
      minHeight: 58,
      paddingInline: "8px !important",
    },
    navbarLogoSlot: {
      maxWidth: "min(160px, 30vw)",
    },
    navbarLogo: {
      maxHeight: 38,
      transform: "none",
    },
    profileActions: {
      flexDirection: "column-reverse" as const,
      alignItems: "stretch !important",
    },
    profileBranchAction: {
      justifyContent: "space-between",
    },
    profileAccountActions: {
      justifyContent: "space-between",
    },
    userInfo: {
      maxWidth: 116,
      padding: "4px 8px",
      marginInlineEnd: 6,
      minHeight: 40,
    },
    userName: {
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    },
    userTz: {
      display: "none",
    },
    navActions: {
      gap: 4,
    },
    homeButton: {
      width: 40,
      height: 40,
    },
    menuIconBox: {
      width: "40px !important",
      height: "40px !important",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    appBar: {
      animation: "none",
    },
    userInfo: {
      transition: "background-color 120ms ease, border-color 120ms ease",
    },
    menuIconBox: {
      transition: "background-color 120ms ease !important",
      "&:active": {
        transform: "none",
      },
    },
    homeButton: {
      transition: "background-color 120ms ease !important",
      "&:active": {
        transform: "none",
      },
    },
  },
  "@media (prefers-reduced-transparency: reduce)": {
    appBar: {
      background: "#5c2950",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
    userInfo: {
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  },
});
