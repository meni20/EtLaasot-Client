import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    root: {
        direction: "rtl",
        padding:
            "calc(env(safe-area-inset-top, 0px) + 18px) clamp(16px, 4vw, 28px) calc(var(--shell-bottom-inset, 0px) + env(safe-area-inset-bottom, 0px) + 24px)",
        maxWidth: 680,
        margin: "0 auto",
        minHeight: "100dvh",
        background:
            "linear-gradient(180deg, var(--color-canvas-warm, #faf9fb) 0%, var(--color-canvas, #f5f6f8) 100%)",
        animation: "fadeIn 220ms var(--ease-out, ease-out)",
        fontFamily:
            '"Noto Sans Hebrew", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        "@media (prefers-reduced-motion: reduce)": {
            animation: "fadeIn 1ms linear",
        },
    },
    header: {
        fontWeight: 800,
        fontSize: "clamp(24px, 5vw, 32px)",
        marginBottom: 4,
        color: "var(--color-text, #1d1d1f)",
        fontFamily: "inherit",
        lineHeight: 1.18,
        animation: "fadeInDown 220ms var(--ease-out, ease-out)",
        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
        },
    },
    subtitle: {
        fontSize: 15,
        color: "var(--color-text-secondary, #51565c)",
        marginBottom: 24,
        fontWeight: 600,
        lineHeight: 1.45,
        fontFamily: "inherit",
        animation: "fadeInDown 240ms var(--ease-out, ease-out) both",
        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
        },
    },
    attendeeRow: {
        minHeight: 56,
        borderRadius: "var(--radius-lg, 18px)",
        padding: "14px 16px",
        backgroundColor: "var(--color-surface-elevated, rgba(255, 255, 255, 0.82))",
        border: "1px solid rgba(255, 255, 255, 0.72)",
        boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        marginBottom: 10,
        transition:
            "transform var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease), border-color var(--transition-fast, 140ms ease)",
        animation: "fadeInUp 220ms var(--ease-out, ease-out) both",
        "&:focus-visible": {
            outline: "none",
            boxShadow: "var(--shadow-focus, 0 0 0 3px rgba(var(--color-primary-rgb), 0.20))",
        },
        "&:active": { transform: "scale(0.98)" },
        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            transition: "background-color 1ms linear, box-shadow 1ms linear",
            "&:active": {
                transform: "none",
            },
        },
        "@media (prefers-reduced-transparency: reduce)": {
            backgroundColor: "var(--color-surface, #fff)",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            borderColor: "var(--color-border, #dadde3)",
        },
    },
    attendeeName: {
        fontWeight: 750,
        fontSize: 15,
        color: "var(--color-text, #1d1d1f)",
        fontFamily: "inherit",
        lineHeight: 1.35,
    },
    checkedIn: {
        backgroundColor: "var(--color-success-soft)",
        boxShadow: "0 8px 22px rgba(var(--color-success-rgb), 0.12)",
        borderColor: "rgba(var(--color-success-rgb), 0.22)",
        borderRight: "4px solid var(--color-success)",
    },
    saveButton: {
        borderRadius: "var(--radius-md, 14px)",
        minHeight: 52,
        fontWeight: 800,
        fontSize: 15,
        textTransform: "none" as const,
        marginTop: 24,
        fontFamily: "inherit",
        boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
        transition:
            "transform var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease)",
        animation: "fadeInUp 240ms var(--ease-out, ease-out) both",
        "&:hover": {
            boxShadow: "var(--shadow-md, 0 12px 34px rgba(16, 24, 40, 0.1))",
        },
        "&:active": { transform: "scale(0.98)" },
        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            transition: "background-color 1ms linear, box-shadow 1ms linear",
            "&:active": {
                transform: "none",
            },
        },
    },
    notesField: {
        "& .MuiOutlinedInput-root": {
            borderRadius: 14,
            transition: "box-shadow var(--transition-fast, 140ms ease)",
            "&.Mui-focused": {
                boxShadow: "var(--shadow-focus, 0 0 0 3px rgba(var(--color-primary-rgb), 0.20))",
            },
        },
    },
    loading: {
        textAlign: "center" as const,
        marginTop: 60,
        color: "var(--color-text-muted, #6e737a)",
    },
    backButton: {
        minHeight: 44,
        marginBottom: 12,
        textTransform: "none" as const,
        fontWeight: 750,
        fontFamily: "inherit",
        color: "var(--color-primary)",
        borderRadius: "var(--radius-md, 14px)",
        transition:
            "transform var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease)",
        "&:hover": { backgroundColor: "var(--color-primary-soft)" },
        "&:active": { transform: "scale(0.98)" },
        "@media (prefers-reduced-motion: reduce)": {
            transition: "background-color 1ms linear",
            "&:active": {
                transform: "none",
            },
        },
    },
});
