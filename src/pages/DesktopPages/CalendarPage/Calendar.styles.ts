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
        gap: 16,
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
    headerActions: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 10,
        flexWrap: "wrap" as const,
    },
    hiddenFileInput: {
        display: "none",
    },
    removeBackgroundButton: {
        width: 42,
        height: 42,
        color: "#b3261e",
        border: "1px solid #f0c9c6",
        backgroundColor: "#fff",
        "&:hover": {
            backgroundColor: "#fff3f1",
            borderColor: "#dd8f89",
        },
    },
    backgroundAlert: {
        marginBottom: 16,
        borderRadius: 12,
        fontFamily: "Rubik, sans-serif",
    },
    backgroundLoading: {
        position: "absolute" as const,
        top: 14,
        left: 18,
        zIndex: 2,
        fontSize: 12,
        fontWeight: 700,
        color: "#8a7f89",
        fontFamily: "Rubik, sans-serif",
    },
    calendarWrapper: {
        position: "relative" as const,
        background: "#fff",
        borderRadius: 20,
        padding: "20px 24px 24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        border: "1px solid #f0ecef",
        animation: "fadeInUp 0.6s ease-out",
        transition: "box-shadow 0.3s ease",
        overflow: "hidden",
        "&:hover": {
            boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
        },

        /* FullCalendar overrides */
        "& .fc": {
            position: "relative" as const,
            zIndex: 1,
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
            padding: "6px 10px 4px",
        },
        "& .fc-daygrid-day.fc-day-today": {
            backgroundColor: "rgba(154,81,136,0.06) !important",
        },
        "& .fc-daygrid-day.fc-day-today .fc-daygrid-day-number": {
            background: "transparent",
            color: "inherit",
            borderRadius: 0,
            width: "auto",
            height: "auto",
            display: "block",
        },
        "& .fc-daygrid-day.fc-day-today $gregorianDate": {
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
    calendarWrapperWithBackground: {
        "&::before": {
            content: '""',
            position: "absolute" as const,
            inset: 0,
            backgroundImage: "var(--calendar-background-image)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.38,
            pointerEvents: "none" as const,
            zIndex: 0,
        },
        "&::after": {
            content: '""',
            position: "absolute" as const,
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.68)",
            pointerEvents: "none" as const,
            zIndex: 0,
        },
        "& .fc-view-harness, & .fc-view, & .fc-scrollgrid, & .fc-scrollgrid table, & .fc-daygrid-body, & .fc-daygrid-body table":
        {
            backgroundColor: "transparent !important",
        },
        "& .fc-scrollgrid-section, & .fc-scrollgrid td, & .fc-scrollgrid th": {
            backgroundColor: "transparent !important",
        },
        "& .fc-daygrid-day, & .fc-daygrid-day-frame": {
            backgroundColor: "rgba(255, 255, 255, 0.12) !important",
        },
        "& .fc-daygrid-day:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.28) !important",
        },
        "& .fc-col-header-cell": {
            backgroundColor: "rgba(255, 255, 255, 0.82) !important",
            backdropFilter: "blur(2px)",
        },
        "& .fc-daygrid-day.fc-day-today": {
            backgroundColor: "rgba(154,81,136,0.18) !important",
        },
        "& .fc-event, & .fc-daygrid-event": {
            backgroundColor: "#9a5188 !important",
            borderColor: "#7a3e6b !important",
            opacity: "1 !important",
            color: "#fff !important",
        },
        "& .fc-event-main, & .fc-event-title, & .fc-event-time": {
            opacity: "1 !important",
            color: "#fff !important",
            textShadow: "0 1px 1px rgba(45, 35, 43, 0.28)",
        },
    },
    dayNumberContent: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start",
        gap: 2,
        lineHeight: 1.1,
        direction: "rtl",
    },
    gregorianDate: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 20,
        minHeight: 20,
        fontFamily: "Rubik, sans-serif",
        fontSize: "13px !important",
        fontWeight: "700 !important" as const,
        color: "#7a3e6b",
    },
    hebrewDate: {
        display: "block",
        maxWidth: 86,
        color: "#8a7f89",
        fontFamily: "Rubik, sans-serif",
        fontSize: "10.5px !important",
        fontWeight: "600 !important" as const,
        lineHeight: "1.15 !important" as const,
        whiteSpace: "nowrap" as const,
        overflow: "hidden",
        textOverflow: "ellipsis",
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
    "@media (max-width: 760px)": {
        root: {
            padding: "72px 10px 16px",
            overflowX: "hidden",
        },
        header: {
            alignItems: "flex-start",
            flexDirection: "column" as const,
        },
        headerActions: {
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "stretch",
        },
        eventsButton: {
            flex: "1 1 100%",
            minHeight: 44,
            justifyContent: "center",
        },
        hebrewDate: {
            display: "none",
        },
        calendarWrapper: {
            padding: "16px 12px 18px",
            overflowX: "auto" as const,
            WebkitOverflowScrolling: "touch",
            "& .fc": {
                minWidth: 620,
            },
            "& .fc-toolbar": {
                alignItems: "stretch",
                flexDirection: "column" as const,
            },
            "& .fc-toolbar-title": {
                fontSize: "1.12rem",
                textAlign: "center" as const,
            },
            "& .fc-button-primary": {
                minHeight: 38,
                padding: "6px 10px",
            },
        },
    },
});
