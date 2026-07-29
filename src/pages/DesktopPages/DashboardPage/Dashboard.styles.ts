import { makeStyles } from "@mui/styles";

export const useDashboardStyles = makeStyles({
    root: {
        padding: "76px 20px 20px",
        direction: "rtl",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        animation: "fadeIn 0.4s ease-out",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
        animation: "fadeInDown 0.5s ease-out",
    },
    title: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: 700,
        color: "#333",
        fontSize: "1.7rem",
    },
    summaryGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 12,
        marginBottom: 16,
    },
    summaryCard: {
        background: "#fff",
        borderRadius: 14,
        padding: "14px 16px",
        textAlign: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #f0ecef",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        animation: "fadeInUp 0.5s ease-out both",
        cursor: "pointer",
        "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 8px 22px rgba(154, 81, 136, 0.14)",
            borderColor: "rgba(154, 81, 136, 0.2)",
        },
    },
    summaryIcon: {
        fontSize: "1.55rem",
        marginBottom: 2,
        transition: "transform 0.3s ease",
        "$summaryCard:hover &": {
            transform: "scale(1.15)",
        },
    },
    summaryValue: {
        fontSize: "1.45rem",
        fontWeight: 700,
        color: "#9a5188",
        fontFamily: "Rubik, sans-serif",
        transition: "color 0.2s ease",
    },
    summaryLabel: {
        fontSize: "0.78rem",
        color: "#666",
        fontFamily: "Rubik, sans-serif",
    },
    chartsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        marginBottom: 32,
    },
    chartCard: {
        background: "#fff",
        borderRadius: 14,
        padding: "14px 16px 10px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #f0ecef",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease",
        animation: "fadeInUp 0.6s ease-out both",
        "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 8px 28px rgba(154, 81, 136, 0.1)",
        },
    },
    upcomingSection: {
        background: "#fff",
        borderRadius: 14,
        padding: "14px 16px 16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #f0ecef",
        marginBottom: 16,
        animation: "fadeInUp 0.55s ease-out both",
    },
    carouselHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
    },
    carouselControls: {
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    carouselButton: {
        width: 30,
        height: 30,
        color: "#7a3e6b",
        backgroundColor: "#fbf7fa",
        border: "1px solid #ead8e5",
        "&:hover": {
            color: "#fff",
            backgroundColor: "#9a5188",
            borderColor: "#9a5188",
        },
        "&.Mui-disabled": {
            color: "#c9b8c5",
            backgroundColor: "#f8f4f7",
            borderColor: "#f0e8ee",
        },
    },
    eventsCarouselViewport: {
        overflow: "hidden",
    },
    eventsCarouselTrack: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 12,
        alignItems: "stretch",
    },
    carouselCard: {
        minWidth: 0,
    },
    chartTitle: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: 600,
        color: "#333",
        marginBottom: 8,
        fontSize: "0.95rem",
    },
    "@media (max-width: 900px)": {
        root: {
            padding: "72px 12px 16px",
            overflowX: "hidden",
        },
        header: {
            alignItems: "flex-start",
            flexDirection: "column" as const,
            gap: 8,
        },
        title: {
            fontSize: "1.35rem",
        },
        summaryGrid: {
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 10,
        },
        chartsGrid: {
            gridTemplateColumns: "1fr",
            gap: 14,
        },
        eventsCarouselViewport: {
            overflowX: "auto" as const,
            paddingBottom: 4,
        },
        eventsCarouselTrack: {
            gridTemplateColumns: "repeat(3, minmax(240px, 1fr))",
        },
    },
});
