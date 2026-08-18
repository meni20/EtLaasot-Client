import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  container: {
    width: "100%",
    maxWidth: "100dvw",
    minHeight: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflowX: "clip",
    direction: "rtl",
    background:
      "linear-gradient(180deg, var(--color-canvas-warm, #faf9fb) 0%, var(--color-canvas, #f5f6f8) 100%)",
    padding:
      "calc(env(safe-area-inset-top, 0px) + 20px) 18px calc(env(safe-area-inset-bottom, 0px) + 20px)",
    animation: "fadeIn 220ms var(--ease-out, ease-out)",
    fontFamily:
      '"Noto Sans Hebrew", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    "@media (prefers-reduced-motion: reduce)": {
      animation: "fadeIn 1ms linear",
    },
  },

  card: {
    width: "calc(100vw - 72px) !important",
    maxWidth: "420px !important",
    minWidth: 0,
    backgroundColor: "var(--color-surface-elevated, rgba(255, 255, 255, 0.82))",
    border: "1px solid rgba(255, 255, 255, 0.72)",
    borderRadius: "var(--radius-sheet, 26px)",
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
    padding: "42px clamp(22px, 7vw, 32px) 36px",
    boxShadow: "var(--shadow-lg, 0 24px 64px rgba(16, 24, 40, 0.15))",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    animation: "scaleIn 240ms var(--ease-out, ease-out)",
    "@media (prefers-reduced-motion: reduce)": {
      animation: "fadeIn 1ms linear",
    },
    "@media (prefers-reduced-transparency: reduce)": {
      backgroundColor: "var(--color-surface, #fff)",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
      borderColor: "var(--color-border, #dadde3)",
    },
  },

  logo: {
    width: "clamp(96px, 28vw, 124px)",
    height: "auto",
    alignSelf: "center",
    display: "block",
    marginBottom: 0,
    objectFit: "contain" as const,
    animation: "fadeInDown 260ms var(--ease-out, ease-out) both",
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },

  subtitle: {
    fontSize: 15,
    color: "var(--color-text-secondary, #51565c)",
    textAlign: "center" as const,
    marginBottom: 8,
    lineHeight: 1.55,
    fontWeight: 600,
    fontFamily: "inherit",
    animation: "fadeInUp 220ms var(--ease-out, ease-out) both",
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },

  input: {
    minWidth: 0,
    animation: "fadeInUp 220ms var(--ease-out, ease-out) both",
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
    },
    "& .MuiOutlinedInput-root": {
      minWidth: 0,
      minHeight: 52,
      borderRadius: "var(--radius-md, 14px)",
      backgroundColor: "var(--color-surface, #fff)",
      fontFamily: "inherit",
      transition:
        "box-shadow var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease), border-color var(--transition-fast, 140ms ease)",

      "& fieldset": {
        borderColor: "var(--color-border-subtle, #e9ebef)",
      },

      "&:hover fieldset": {
        borderColor: "var(--color-border, #dadde3)",
      },

      "&.Mui-focused": {
        boxShadow: "var(--shadow-focus, 0 0 0 3px rgba(47, 111, 97, 0.20))",
      },

      "&.Mui-focused fieldset": {
        borderColor: "var(--color-primary, #2f6f61)",
        borderWidth: 1.5,
      },
    },
    "& .MuiFormHelperText-root": {
      marginInline: 0,
      fontWeight: 600,
    },
  },

  button: {
    borderRadius: "var(--radius-md, 14px)",
    minHeight: 52,
    marginTop: 4,
    fontWeight: 800,
    fontSize: 16,
    textTransform: "none" as const,
    fontFamily: "inherit",
    background: "var(--color-primary, #2f6f61)",
    boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
    transition:
      "transform var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease)",
    animation: "fadeInUp 220ms var(--ease-out, ease-out) both",
    "@media (prefers-reduced-motion: reduce)": {
      animation: "none",
      transition: "background-color 1ms linear, box-shadow 1ms linear",
      "&:hover": {
        transform: "none",
      },
      "&:active": {
        transform: "none",
      },
    },

    "&:hover": {
      background: "var(--color-primary-dark, #285e52)",
      boxShadow: "var(--shadow-md, 0 12px 34px rgba(16, 24, 40, 0.1))",
    },
    "&:active": {
      transform: "scale(0.97)",
    },
  },
});
