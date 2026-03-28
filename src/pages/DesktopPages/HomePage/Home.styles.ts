import { makeStyles } from "@mui/styles";

export const useHomeStyles = makeStyles({
    root: {
        padding: "88px 24px 24px",
        direction: "rtl",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        animation: "fadeIn 0.4s ease-out",
    },
    pageTitle: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: 700,
        color: "#333",
        fontSize: "1.5rem",
        marginBottom: 24,
        animation: "fadeInUp 0.5s ease-out",
    },
    chartCard: {
        background: "#fff",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: "1px solid #f0ecef",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        animation: "fadeInUp 0.6s ease-out",
        "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 36px rgba(154, 81, 136, 0.12)",
        },
    },
    chartTitle: {
        fontFamily: "Rubik, sans-serif",
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
        fontFamily: "Rubik, sans-serif",
        animation: "fadeIn 0.8s ease-out",
    },
});