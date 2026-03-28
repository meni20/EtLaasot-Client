import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    root: {
        position: "fixed" as const,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        backgroundColor: "#fff",
        borderTop: "none",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
        borderRadius: "22px 22px 0 0",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backdropFilter: "blur(12px)",
        animation: "fadeInUp 0.4s ease-out",
        "& .MuiBottomNavigationAction-label": {
            fontFamily: "Rubik, sans-serif",
            fontSize: "10px !important",
            fontWeight: 500,
            transition: "all 0.25s ease",
            "&.Mui-selected": {
                fontSize: "11px !important",
                fontWeight: 700,
            },
        },
        "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            padding: "8px 0",
            color: "#bbb",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            "&.Mui-selected": {
                color: "#9a5188",
                transform: "translateY(-2px)",
            },
            "&:active": {
                transform: "scale(0.9)",
            },
        },
    },
});
