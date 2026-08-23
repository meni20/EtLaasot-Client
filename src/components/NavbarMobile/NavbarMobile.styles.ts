import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  appBar: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.88)",
    backdropFilter: "blur(22px) saturate(180%)",
    WebkitBackdropFilter: "blur(22px) saturate(180%)",
    boxShadow: "0 12px 30px rgba(45, 35, 43, 0.16)",
    borderBottom: "1px solid var(--color-border-subtle)",
    borderRadius: "0 0 18px 18px",
    color: "var(--color-brand-ink)",
    paddingTop: "env(safe-area-inset-top, 0px)",
    animation: "fadeInDown var(--transition-slow, 240ms cubic-bezier(0.32, 0.72, 0, 1))",
  },
  toolbar: {
    minHeight: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "inherit",
    fontWeight: 700,
    letterSpacing: 0,
  },
  "@media (max-width: 390px)": {
    toolbar: {
      minHeight: 58,
    },
    title: {
      fontSize: "1.15rem !important",
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    appBar: {
      animation: "none",
    },
  },
  "@media (prefers-reduced-transparency: reduce)": {
    appBar: {
      background: "#fff",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  },
});
