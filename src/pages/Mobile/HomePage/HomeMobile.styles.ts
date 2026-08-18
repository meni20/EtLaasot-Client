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
        "@media (min-width: 700px)": {
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 28px)",
        },
        "@media (prefers-reduced-motion: reduce)": {
            animation: "fadeIn 1ms linear",
        },
    },
    greeting: {
        fontWeight: 800,
        fontSize: "clamp(24px, 5vw, 32px)",
        marginBottom: 6,
        color: "var(--color-text, #1d1d1f)",
        fontFamily: "inherit",
        lineHeight: 1.18,
        animation: "fadeInUp 220ms var(--ease-out, ease-out)",
        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
        },
    },
    subtitle: {
        color: "var(--color-text-secondary, #51565c)",
        fontSize: 15,
        fontWeight: 600,
        lineHeight: 1.45,
        fontFamily: "inherit",
        animation: "fadeInUp 240ms var(--ease-out, ease-out)",
        "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
        },
    },
    headerRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 24,
    },
    profileButton: {
        minWidth: 52,
        minHeight: 52,
        padding: 4,
        borderRadius: "var(--radius-lg, 18px)",
        backgroundColor: "var(--color-surface-elevated, rgba(255, 255, 255, 0.82))",
        border: "1px solid rgba(255, 255, 255, 0.72)",
        boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
        backdropFilter: "blur(18px) saturate(180%)",
        WebkitBackdropFilter: "blur(18px) saturate(180%)",
        transition:
            "transform var(--transition-fast, 140ms ease), box-shadow var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease)",
        "&:hover": {
            backgroundColor: "var(--color-surface, #fff)",
            boxShadow: "var(--shadow-md, 0 12px 34px rgba(16, 24, 40, 0.1))",
        },
        "&:active": {
            transform: "scale(0.96)",
        },
        "@media (prefers-reduced-motion: reduce)": {
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
    profileAvatar: {
        width: 44,
        height: 44,
        backgroundColor: "var(--color-primary-soft, #eaf4f1)",
        color: "var(--color-primary, #2f6f61)",
        fontWeight: 800,
        fontFamily: "inherit",
    },
    eventCarousel: {
        marginBottom: 22,
    },
    eventCarouselRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        "@media (min-width: 700px)": {
            gap: 12,
        },
    },
    eventCarouselCard: {
        minWidth: 0,
        flex: 1,
    },
    eventCarouselArrow: {
        width: 44,
        height: 44,
        flexShrink: 0,
        color: "var(--color-primary, #2f6f61)",
        backgroundColor: "var(--color-surface-elevated, rgba(255, 255, 255, 0.82))",
        border: "1px solid var(--color-border-subtle, #e9ebef)",
        boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
        transition:
            "transform var(--transition-fast, 140ms ease), background-color var(--transition-fast, 140ms ease)",
        "&:hover": {
            backgroundColor: "var(--color-primary-soft, #eaf4f1)",
        },
        "&.Mui-disabled": {
            color: "var(--color-border, #dadde3)",
            backgroundColor: "var(--color-surface, #fff)",
            boxShadow: "none",
        },
        "@media (prefers-reduced-motion: reduce)": {
            transition: "background-color 1ms linear",
        },
    },
    eventCarouselIndicator: {
        textAlign: "center" as const,
        marginTop: 8,
        fontSize: 12,
        fontWeight: 700,
        color: "var(--color-text-muted, #6e737a)",
        fontFamily: "inherit",
    },
    eventItem: {
        borderRadius: "var(--radius-sheet, 26px)",
        padding: 20,
        marginBottom: 14,
        backgroundColor: "var(--color-surface-elevated, rgba(255, 255, 255, 0.82))",
        border: "1px solid rgba(255, 255, 255, 0.72)",
        boxShadow: "var(--shadow-sm, 0 3px 12px rgba(16, 24, 40, 0.07))",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        transition:
            "transform var(--transition-normal, 180ms ease), box-shadow var(--transition-normal, 180ms ease), border-color var(--transition-normal, 180ms ease)",
        animation: "fadeInUp 240ms var(--ease-out, ease-out) both",
        "&:active": {
            transform: "scale(0.99)",
        },
        "@media (min-width: 700px)": {
            padding: 24,
        },
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
    eventItemName: {
        fontWeight: 800,
        fontSize: 16,
        color: "var(--color-text, #1d1d1f)",
        fontFamily: "inherit",
        lineHeight: 1.35,
    },
    eventItemDate: {
        fontSize: 13,
        color: "var(--color-text-secondary, #51565c)",
        marginTop: 4,
        fontFamily: "inherit",
        lineHeight: 1.45,
    },
    typeChip: {
        fontSize: 12,
        minHeight: 30,
        borderRadius: 999,
        backgroundColor: "var(--color-warning-soft, #fff7e8)",
        color: "var(--color-warning, #a8610a)",
        fontWeight: 800,
        transition: "background-color var(--transition-fast, 140ms ease)",
    },
});
