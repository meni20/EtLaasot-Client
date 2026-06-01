import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    root: {
        position: "fixed" as const,
        bottom: 12,
        left: 16,
        right: 16,
        zIndex: 1200,
        backgroundColor: "#fff",
        borderTop: "none",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.10)",
        borderRadius: 24,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backdropFilter: "blur(12px)",
        maxWidth: 488,
        margin: "0 auto",
        "& .MuiBottomNavigationAction-label": {
            fontFamily: "Rubik, sans-serif",
            fontSize: "10px !important",
            fontWeight: 600,
            transition: "color 0.18s ease",
            "&.Mui-selected": {
                fontSize: "11px !important",
                fontWeight: 700,
            },
        },
        "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            padding: "8px 0",
            color: "#9CA3AF",
            transition: "color 0.18s ease, transform 0.18s ease",
            "&.Mui-selected": {
                color: "#7B3F98",
            },
            "&:active": {
                transform: "scale(0.96)",
            },
        },
    },
});
