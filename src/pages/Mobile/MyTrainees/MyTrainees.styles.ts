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
        marginBottom: 16,
        color: "var(--color-text, #1d1d1f)",
        fontFamily: "inherit",
        lineHeight: 1.18,
        animation: "fadeInDown 220ms var(--ease-out, ease-out)",
        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
        },
    },
    traineeCard: {
        borderRadius: "var(--radius-lg, 18px)",
        padding: 18,
        backgroundColor: "var(--color-surface-elevated, rgba(255, 255, 255, 0.82))",
        border: "1px solid rgba(255, 255, 255, 0.72)",
        boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        marginBottom: 12,
        transition:
            "transform var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease)",
        animation: "fadeInUp 220ms var(--ease-out, ease-out) both",
        "&:active": { transform: "scale(0.98)" },
        "&:hover": {
            boxShadow: "var(--shadow-md, 0 12px 34px rgba(16, 24, 40, 0.1))",
        },
        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            transition: "box-shadow 1ms linear",
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
    traineeName: {
        fontWeight: 800,
        fontSize: 15,
        color: "var(--color-text, #1d1d1f)",
        fontFamily: "inherit",
    },
    traineeInfo: {
        fontSize: 12,
        color: "var(--color-text-muted, #6e737a)",
        marginTop: 2,
        fontFamily: "inherit",
    },
    avatar: {
        width: 44,
        height: 44,
        backgroundColor: "var(--color-primary-soft)",
        color: "var(--color-primary)",
        fontWeight: 800,
        fontSize: 16,
        fontFamily: "inherit",
        transition: "transform var(--transition-fast, 140ms ease)",
    },
    actionButton: {
        minWidth: 44,
        width: 44,
        height: 44,
        borderRadius: "var(--radius-md, 14px)",
        padding: 0,
        backgroundColor: "var(--color-primary-soft)",
        transition:
            "transform var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease)",
        "&:hover": {
            backgroundColor: "var(--color-surface-muted, #f0f2f4)",
        },
        "&:active": { transform: "scale(0.95)" },
        "@media (prefers-reduced-motion: reduce)": {
            transition: "background-color 1ms linear",
            "&:active": {
                transform: "none",
            },
        },
    },
    empty: {
        textAlign: "center" as const,
        color: "var(--color-text-muted, #6e737a)",
        marginTop: 60,
        fontSize: 15,
        fontFamily: "inherit",
        animation: "fadeIn 220ms var(--ease-out, ease-out)",
        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
        },
    },
});
