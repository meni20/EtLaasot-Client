import { makeStyles } from "@mui/styles";

export const useNavbarStyles = makeStyles({
  appBar: {
    background: "linear-gradient(135deg, #844173 0%, #5c2950 100%)",
    boxShadow: "0 4px 20px rgba(154, 81, 136, 0.25)",
    color: "#fff",
    zIndex: 1200,
    animation: "fadeInDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  toolbar: {
    position: "relative" as const,
    justifyContent: "space-between",
    paddingLeft: 24,
    paddingRight: 24,
    minHeight: 64,
  },
  title: {
    flexGrow: 1,
    textAlign: "center" as const,
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    letterSpacing: "-0.02em", // צמצום רווחים קל למראה מודרני (כמו במותגי הייטק)
    fontSize: "1.8rem",
    paddingRight: "8%",
    textShadow: "0 2px 4px rgba(0,0,0,0.15)", // צל עדין לטקסט כדי להקפיץ אותו
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
    backgroundColor: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    borderRadius: 10,
    padding: "4px 12px",
    marginRight: 12,
    lineHeight: 1.3,
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
    },
    "&:focus-visible": {
      outline: "2px solid rgba(255,255,255,0.85)",
      outlineOffset: 3,
      backgroundColor: "rgba(255,255,255,0.22)",
    },
  },
  userName: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 700,
    fontSize: "0.9rem",
    color: "#fff",
    lineHeight: 1.4,
  },
  userTz: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: 400,
    fontSize: "0.72rem",
    color: "rgba(255, 255, 255, 0.65)", // ניגודיות טובה ונעימה יותר לעין
    marginTop: 1,
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 1,
  },
  menuIconBox: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)", // בסיס עדין לכפתור התפריט
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  },
  homeButton: {
    width: 38,
    height: 38,
    color: "#fff",
    borderRadius: 10,
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)",
      transform: "scale(1.08)",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  },
  profileDialogTitle: {
    position: "relative" as const,
    padding: "18px 24px 10px !important",
    fontFamily: "Rubik, sans-serif !important",
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
    fontFamily: "Rubik, sans-serif",
    fontWeight: 800,
    fontSize: "1.1rem",
    flexShrink: 0,
  },
  profileName: {
    fontFamily: "Rubik, sans-serif",
    fontWeight: "800 !important" as const,
    color: "#2f2930",
    fontSize: "1.08rem",
  },
  profileMeta: {
    marginTop: "2px !important",
    fontFamily: "Rubik, sans-serif",
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
    fontFamily: "Rubik, sans-serif",
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
    fontFamily: "Rubik, sans-serif !important",
    fontWeight: "700 !important" as const,
  },
  "@media (max-width: 640px)": {
    toolbar: {
      paddingLeft: 12,
      paddingRight: 12,
    },
    navbarLogoSlot: {
      maxWidth: "min(220px, 34vw)",
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
  },
});
