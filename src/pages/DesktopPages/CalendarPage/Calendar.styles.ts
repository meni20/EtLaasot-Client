import { makeStyles } from "@mui/styles";

export const useCalendarStyles = makeStyles({
    root: {
        padding: "88px 24px 24px",
        direction: "rtl",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        animation: "fadeIn 0.4s ease-out",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        animation: "fadeInDown 0.5s ease-out",
    },
    pageTitle: {
        fontFamily: "Rubik, sans-serif",
        fontWeight: 700,
        color: "#333",
        fontSize: "1.5rem",
    },
    eventsButton: {
        color: "#7a3e6b",
        borderColor: "#d8c4d2",
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: "9px 18px",
        fontWeight: 700,
        fontFamily: "Rubik, sans-serif",
        textTransform: "none" as const,
        "& .MuiButton-startIcon": {
            marginLeft: 6,
            marginRight: 0,
        },
        "&:hover": {
            borderColor: "#9a5188",
            backgroundColor: "#f8f0f6",
        },
    },
    calendarWrapper: {
        background: "#fff",
        borderRadius: 20,
        padding: "20px 24px 24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: "1px solid #f0ecef",
        animation: "fadeInUp 0.6s ease-out",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
            boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
        },

        /* FullCalendar overrides */
        "& .fc": {
            fontFamily: "Rubik, sans-serif",
            color: "#333",
        },
        "& .fc-toolbar": {
            marginBottom: "16px !important",
            flexWrap: "wrap",
            gap: 8,
        },
        "& .fc-toolbar-title": {
            fontWeight: 700,
            fontSize: "1.35rem",
            color: "#9a5188",
        },
        "& .fc-button-group": {
            gap: 4,
        },
        "& .fc-button-primary": {
            background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
            border: "none",
            borderRadius: "10px !important",
            fontFamily: "Rubik, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            padding: "6px 14px",
            transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 2px 8px rgba(154,81,136,0.2)",
            "&:hover": {
                background: "linear-gradient(135deg, #7a3e6b 0%, #5c2d52 100%)",
                boxShadow: "0 4px 14px rgba(154,81,136,0.35)",
                transform: "translateY(-1px)",
            },
            "&:active": {
                transform: "translateY(0) scale(0.97)",
            },
            "&:focus": {
                boxShadow: "0 0 0 3px rgba(154,81,136,0.25)",
            },
            "&:disabled": {
                opacity: 0.5,
            },
        },
        "& .fc-button-primary:not(:disabled).fc-button-active": {
            background: "linear-gradient(135deg, #7a3e6b 0%, #5c2d52 100%)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.15)",
        },
        "& .fc-today-button": {
            borderRadius: "10px !important",
        },
        "& .fc-scrollgrid": {
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #f0ecef !important",
        },
        "& .fc-col-header-cell": {
            backgroundColor: "#f8f4f9",
            fontWeight: 700,
            fontSize: 13,
            color: "#7a3e6b",
            padding: "10px 0",
            borderColor: "#f0ecef",
        },
        "& .fc-daygrid-day": {
            transition: "background 0.2s ease",
            "&:hover": {
                backgroundColor: "rgba(154,81,136,0.03)",
            },
        },
        "& .fc-daygrid-day-number": {
            fontWeight: 600,
            color: "#7a3e6b",
            fontSize: 13,
            padding: "6px 10px",
        },
        "& .fc-daygrid-day.fc-day-today": {
            backgroundColor: "rgba(154,81,136,0.06) !important",
        },
        "& .fc-daygrid-day.fc-day-today .fc-daygrid-day-number": {
            background: "linear-gradient(135deg, #9a5188 0%, #7a3e6b 100%)",
            color: "#fff",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        "& .fc-daygrid-event": {
            borderRadius: "8px !important",
            padding: "3px 8px !important",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            border: "none !important",
            "&:hover": {
                transform: "scale(1.03)",
                boxShadow: "0 3px 10px rgba(154,81,136,0.25)",
            },
        },
        "& .fc-daygrid-more-link": {
            fontWeight: 700,
            color: "#9a5188",
            fontSize: 12,
            "&:hover": {
                color: "#7a3e6b",
            },
        },
        "& .fc-daygrid-body td, & .fc-daygrid-body th, & .fc-scrollgrid td, & .fc-scrollgrid th":
        {
            borderColor: "#f0ecef",
        },
        "& .fc-popover": {
            borderRadius: 14,
            border: "1px solid #f0ecef",
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
            overflow: "hidden",
        },
        "& .fc-popover-header": {
            backgroundColor: "#f8f4f9",
            color: "#7a3e6b",
            fontWeight: 700,
            fontFamily: "Rubik, sans-serif",
        },
    },
    loadingBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 400,
        animation: "pulse 1.5s infinite ease-in-out",
    },
    emptyState: {
        textAlign: "center",
        padding: "60px 20px",
        color: "#999",
        fontFamily: "Rubik, sans-serif",
        fontSize: 15,
    },
});
