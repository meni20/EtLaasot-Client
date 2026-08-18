import { makeStyles } from "@mui/styles";

export const useHomeStyles = makeStyles({
    root: {
        padding: "88px 24px 24px",
        direction: "rtl",
        minHeight: "100dvh",
        backgroundColor: "#f9f9f9",
        animation: "fadeIn var(--transition-normal, 180ms ease-out)",
    },
    pageTitle: {
        fontFamily: "inherit",
        fontWeight: 700,
        color: "#333",
        fontSize: "1.5rem",
        marginBottom: 24,
        animation: "fadeInUp var(--transition-normal, 180ms ease-out)",
    },
    chartCard: {
        background: "#fff",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: "1px solid #f0ecef",
        transition: "transform var(--transition-normal, 180ms ease-out), box-shadow var(--transition-normal, 180ms ease-out)",
        animation: "fadeInUp var(--transition-normal, 180ms ease-out)",
        "@media (hover: hover) and (pointer: fine)": {
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 36px rgba(154, 81, 136, 0.12)",
            },
        },
    },
    chartTitle: {
        fontFamily: "inherit",
        fontWeight: 600,
        color: "#333",
        marginBottom: 16,
        fontSize: "1.1rem",
    },
    emptyState: {
        textAlign: "center",
        color: "#999",
        padding: "80px 0",
        fontSize: 16,
        fontFamily: "inherit",
        animation: "fadeIn var(--transition-normal, 180ms ease-out)",
    },
    "@media (prefers-reduced-motion: reduce)": {
        root: {
            animation: "fadeIn 1ms linear",
        },
        pageTitle: {
            animation: "none",
        },
        chartCard: {
            animation: "none",
            transition: "box-shadow 1ms linear",
            "&:hover": {
                transform: "none",
            },
        },
        emptyState: {
            animation: "fadeIn 1ms linear",
        },
    },
});
