import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    root: {
        position: "fixed" as const,
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
        insetInline: 16,
        zIndex: 1240,
        minHeight: 68,
        height: "auto",
        backgroundColor: "rgba(255, 255, 255, 0.78)",
        border: "1px solid rgba(255, 255, 255, 0.72)",
        boxShadow: "0 14px 34px rgba(45, 35, 43, 0.16)",
        borderRadius: 24,
        padding: "7px 8px",
        backdropFilter: "blur(22px) saturate(180%)",
        WebkitBackdropFilter: "blur(22px) saturate(180%)",
        maxWidth: 520,
        margin: "0 auto",
        direction: "rtl",
        "& .MuiBottomNavigationAction-label": {
            fontFamily: "inherit",
            fontSize: "10px !important",
            fontWeight: 600,
            letterSpacing: 0,
            transition: "color var(--transition-fast, 140ms ease)",
            "&.Mui-selected": {
                fontSize: "11px !important",
                fontWeight: 700,
            },
        },
        "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            minHeight: 54,
            borderRadius: 18,
            padding: "6px 2px",
            color: "#9CA3AF",
            transition: "background-color 160ms ease, color 160ms ease, transform 120ms ease",
            "&.Mui-selected": {
                color: "var(--color-primary)",
                backgroundColor: "var(--color-primary-selected)",
                "& svg": {
                    transform: "translateY(-1px)",
                },
            },
            "&:focus-visible": {
                outline: "2px solid rgba(var(--color-primary-rgb), 0.42)",
                outlineOffset: 2,
            },
            "&:active": {
                transform: "scale(0.96)",
            },
            "& svg": {
                fontSize: 24,
                transition: "transform 160ms ease",
            },
        },
        "@media (max-width: 390px)": {
            insetInline: 10,
            borderRadius: 22,
            paddingInline: 6,
            "& .MuiBottomNavigationAction-label": {
                fontSize: "9.5px !important",
            },
        },
        "@media (min-width: 768px)": {
            maxWidth: 560,
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
        },
        "@media (prefers-reduced-motion: reduce)": {
            "& .MuiBottomNavigationAction-root": {
                transition: "background-color 120ms ease, color 120ms ease",
                "&:active": {
                    transform: "none",
                },
                "&.Mui-selected svg": {
                    transform: "none",
                },
                "& svg": {
                    transition: "none",
                },
            },
            "& .MuiBottomNavigationAction-label": {
                transition: "color 120ms ease",
            },
        },
        "@media (prefers-reduced-transparency: reduce)": {
            backgroundColor: "#fff",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
        },
    },
});
